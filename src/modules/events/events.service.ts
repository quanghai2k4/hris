import prisma from '../../config/database.ts';
import { createError } from '../../middleware/errorHandler.ts';
import { type Prisma } from '@prisma/client';

export const getAllEvents = async (userId?: string, userRole?: string) => {
  const now = new Date();
  
  const where: Prisma.EventWhereInput = userRole === 'HR_MANAGER' || userRole === 'ADMIN'
    ? {}
    : { status: 'ACTIVE' };

  const events = await prisma.event.findMany({
    where,
    include: {
      config: true,
      budget: true,
      _count: {
        select: {
          quizResults: true,
          spinResults: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  if (userRole !== 'HR_MANAGER' && userRole !== 'ADMIN') {
    return events.filter(event => {
      const start = new Date(event.startDate);
      const end = new Date(event.endDate);
      return start <= now && end >= now;
    });
  }

  return events;
};

export const getEventById = async (id: string) => {
  const event = await prisma.event.findUnique({
    where: { id },
    include: {
      config: true,
      budget: true,
      questions: {
        include: {
          question: {
            include: {
              answers: true,
            },
          },
        },
        orderBy: { orderIndex: 'asc' },
      },
    },
  });

  if (!event) {
    throw createError(404, 'Event not found');
  }

  return event;
};

export const createEvent = async (data: {
  name: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  config: {
    minScore: number;
    questionCount: number;
    prizeMin: number;
    prizeMax: number;
    shuffleQuestions?: boolean;
    shuffleAnswers?: boolean;
  };
  totalBudget: number;
}) => {
  const event = await prisma.event.create({
    data: {
      name: data.name,
      description: data.description,
      startDate: data.startDate,
      endDate: data.endDate,
      status: 'DRAFT',
      config: {
        create: {
          minScore: data.config.minScore,
          questionCount: data.config.questionCount,
          prizeMin: data.config.prizeMin,
          prizeMax: data.config.prizeMax,
          shuffleQuestions: data.config.shuffleQuestions ?? false,
          shuffleAnswers: data.config.shuffleAnswers ?? false,
        },
      },
      budget: {
        create: {
          totalBudget: data.totalBudget,
          remainingBudget: data.totalBudget,
          usedBudget: 0,
        },
      },
    },
    include: {
      config: true,
      budget: true,
    },
  });

  return event;
};

export const updateEvent = async (
  id: string,
  data: {
    name?: string;
    description?: string;
    startDate?: Date;
    endDate?: Date;
    config?: {
      minScore?: number;
      questionCount?: number;
      prizeMin?: number;
      prizeMax?: number;
      shuffleQuestions?: boolean;
      shuffleAnswers?: boolean;
    };
  }
) => {
  const event = await prisma.event.findUnique({ where: { id } });

  if (!event) {
    throw createError(404, 'Event not found');
  }

  if (event.status !== 'DRAFT') {
    throw createError(400, 'Only draft events can be edited');
  }

  const updated = await prisma.event.update({
    where: { id },
    data: {
      ...(data.name && { name: data.name }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.startDate && { startDate: data.startDate }),
      ...(data.endDate && { endDate: data.endDate }),
      ...(data.config && {
        config: {
          update: data.config,
        },
      }),
    },
    include: {
      config: true,
      budget: true,
    },
  });

  return updated;
};

export const activateEvent = async (id: string) => {
  const event = await prisma.event.findUnique({
    where: { id },
    include: {
      config: true,
      questions: true,
    },
  });

  if (!event) {
    throw createError(404, 'Event not found');
  }

  if (event.status !== 'DRAFT') {
    throw createError(400, 'Event is already active or completed');
  }

  if (!event.config) {
    throw createError(400, 'Event configuration is missing');
  }

  if (event.questions.length < event.config.questionCount) {
    throw createError(
      400,
      `Event requires at least ${event.config.questionCount} questions`
    );
  }

  const activated = await prisma.event.update({
    where: { id },
    data: { status: 'ACTIVE' },
    include: {
      config: true,
      budget: true,
    },
  });

  return activated;
};

export const deleteEvent = async (id: string) => {
  const event = await prisma.event.findUnique({
    where: { id },
    include: {
      quizResults: true,
      spinResults: true,
    },
  });

  if (!event) {
    throw createError(404, 'Event not found');
  }

  if (event.status === 'ACTIVE') {
    throw createError(400, 'Cannot delete active events');
  }

  if (event.quizResults.length > 0 || event.spinResults.length > 0) {
    throw createError(400, 'Cannot delete event with existing results');
  }

  await prisma.event.delete({
    where: { id },
  });

  return { message: 'Event deleted successfully' };
};
