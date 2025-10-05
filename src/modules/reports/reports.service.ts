import prisma from '../../config/database.ts';

export const getDashboardData = async (eventId?: string) => {
  const where = eventId ? { eventId } : {};

  const totalParticipants = await prisma.quizResult.count({
    where,
  });

  const passedParticipants = await prisma.quizResult.count({
    where: {
      ...where,
      passedThreshold: true,
    },
  });

  const totalSpins = await prisma.spinResult.count({
    where,
  });

  const spinResults = await prisma.spinResult.findMany({
    where,
    select: {
      amount: true,
    },
  });

  const totalPrizeMoney = spinResults.reduce(
    (sum, result) => sum + Number(result.amount),
    0
  );

  const avgPrize = totalSpins > 0 ? totalPrizeMoney / totalSpins : 0;

  const quizResults = await prisma.quizResult.findMany({
    where,
    select: {
      score: true,
    },
  });

  const avgScore =
    totalParticipants > 0
      ? quizResults.reduce((sum, r) => sum + Number(r.score), 0) / totalParticipants
      : 0;

  const events = await prisma.event.findMany({
    ...(eventId && { where: { id: eventId } }),
    include: {
      budget: true,
      _count: {
        select: {
          quizResults: true,
          spinResults: true,
        },
      },
    },
  });

  const eventStats = events.map((e) => ({
    id: e.id,
    name: e.name,
    status: e.status,
    participants: e._count.quizResults,
    spins: e._count.spinResults,
    budget: {
      total: Number(e.budget?.totalBudget || 0),
      used: Number(e.budget?.usedBudget || 0),
      remaining: Number(e.budget?.remainingBudget || 0),
    },
  }));

  const topParticipants = await prisma.quizResult.findMany({
    where,
    include: {
      user: {
        select: {
          id: true,
          employeeId: true,
          fullName: true,
          email: true,
        },
      },
    },
    orderBy: {
      score: 'desc',
    },
    take: 10,
  });

  const recentSpins = await prisma.spinResult.findMany({
    where,
    include: {
      user: {
        select: {
          employeeId: true,
          fullName: true,
        },
      },
      event: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      spunAt: 'desc',
    },
    take: 20,
  });

  return {
    summary: {
      totalParticipants,
      passedParticipants,
      passRate: totalParticipants > 0 ? (passedParticipants / totalParticipants) * 100 : 0,
      totalSpins,
      totalPrizeMoney,
      avgPrize,
      avgScore,
    },
    events: eventStats,
    topParticipants: topParticipants.map((p) => ({
      user: p.user,
      score: Number(p.score),
      correctAnswers: p.correctAnswers,
      totalQuestions: p.totalQuestions,
      completedAt: p.completedAt,
    })),
    recentSpins: recentSpins.map((s) => ({
      user: s.user,
      event: s.event.name,
      amount: Number(s.amount),
      spunAt: s.spunAt,
    })),
  };
};

export const getEventReport = async (eventId: string) => {
  const event = await prisma.event.findUnique({
    where: { id: eventId },
    include: {
      config: true,
      budget: true,
      _count: {
        select: {
          quizResults: true,
          spinResults: true,
          questions: true,
        },
      },
    },
  });

  if (!event) {
    return null;
  }

  const participants = await prisma.quizResult.findMany({
    where: { eventId },
    include: {
      user: {
        select: {
          employeeId: true,
          fullName: true,
          email: true,
        },
      },
      spinCode: {
        include: {
          spinResult: true,
        },
      },
    },
    orderBy: {
      completedAt: 'desc',
    },
  });

  return {
    event: {
      id: event.id,
      name: event.name,
      description: event.description,
      status: event.status,
      startDate: event.startDate,
      endDate: event.endDate,
      totalQuestions: event._count.questions,
      totalParticipants: event._count.quizResults,
      totalSpins: event._count.spinResults,
      budget: {
        total: Number(event.budget?.totalBudget || 0),
        used: Number(event.budget?.usedBudget || 0),
        remaining: Number(event.budget?.remainingBudget || 0),
      },
    },
    participants: participants.map((p) => ({
      user: p.user,
      score: Number(p.score),
      correctAnswers: p.correctAnswers,
      totalQuestions: p.totalQuestions,
      passedThreshold: p.passedThreshold,
      completedAt: p.completedAt,
      spinCode: p.spinCode?.code,
      prizeAmount: p.spinCode?.spinResult ? Number(p.spinCode.spinResult.amount) : null,
    })),
  };
};
