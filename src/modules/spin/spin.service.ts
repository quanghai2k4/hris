import prisma from '../../config/database.ts';
import { createError } from '../../middleware/errorHandler.ts';
import { Decimal } from '@prisma/client/runtime/library';

const generateRandomPrize = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const executeSpin = async (userId: string, code: string) => {
  const spinCode = await prisma.spinCode.findUnique({
    where: { code },
    include: {
      event: {
        include: {
          config: true,
          budget: true,
        },
      },
    },
  });

  if (!spinCode) {
    throw createError(404, 'Invalid spin code');
  }

  if (spinCode.userId !== userId) {
    throw createError(403, 'This spin code does not belong to you');
  }

  if (spinCode.status !== 'AVAILABLE') {
    throw createError(400, 'This spin code has already been used');
  }

  const event = spinCode.event;

  if (!event.config) {
    throw createError(500, 'Event configuration not found');
  }

  if (!event.budget) {
    throw createError(500, 'Event budget not found');
  }

  const prizeMin = Number(event.config.prizeMin);
  const prizeMax = Number(event.config.prizeMax);

  let amount = generateRandomPrize(prizeMin, prizeMax);

  const remainingBudget = Number(event.budget.remainingBudget);

  if (amount > remainingBudget) {
    amount = Math.floor(remainingBudget);
  }

  if (amount <= 0) {
    throw createError(400, 'Event budget has been exhausted');
  }

  const result = await prisma.$transaction(async (tx) => {
    const spinResult = await tx.spinResult.create({
      data: {
        spinCodeId: spinCode.id,
        userId,
        eventId: event.id,
        amount: new Decimal(amount),
      },
    });

    await tx.spinCode.update({
      where: { id: spinCode.id },
      data: {
        status: 'USED',
        usedAt: new Date(),
      },
    });

    const newUsedBudget = Number(event.budget!.usedBudget) + amount;
    const newRemainingBudget = Number(event.budget!.totalBudget) - newUsedBudget;

    await tx.eventBudget.update({
      where: { id: event.budget!.id },
      data: {
        usedBudget: new Decimal(newUsedBudget),
        remainingBudget: new Decimal(newRemainingBudget),
        totalSpins: event.budget!.totalSpins + 1,
        lastUpdated: new Date(),
      },
    });

    return spinResult;
  });

  return {
    amount: Number(result.amount),
    spunAt: result.spunAt,
  };
};

export const getUserSpinCodes = async (userId: string) => {
  const spinCodes = await prisma.spinCode.findMany({
    where: { userId },
    include: {
      event: {
        select: {
          id: true,
          name: true,
        },
      },
      spinResult: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  return spinCodes.map((sc) => ({
    id: sc.id,
    code: sc.code,
    status: sc.status,
    createdAt: sc.createdAt,
    usedAt: sc.usedAt,
    event: sc.event,
    result: sc.spinResult
      ? {
          amount: Number(sc.spinResult.amount),
          spunAt: sc.spinResult.spunAt,
        }
      : null,
  }));
};

export const getUserSpinHistory = async (userId: string) => {
  const results = await prisma.spinResult.findMany({
    where: { userId },
    include: {
      event: {
        select: {
          id: true,
          name: true,
        },
      },
      spinCode: {
        select: {
          code: true,
        },
      },
    },
    orderBy: { spunAt: 'desc' },
  });

  return results.map((r) => ({
    id: r.id,
    amount: Number(r.amount),
    spunAt: r.spunAt,
    code: r.spinCode.code,
    event: r.event,
  }));
};
