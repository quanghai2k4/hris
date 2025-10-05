import prisma from '../../config/database.ts';
import { createError } from '../../middleware/errorHandler.ts';

interface QuestionData {
  id: string;
  content: string;
  type: string;
  answers: Array<{
    id: string;
    content: string;
    orderIndex: number;
  }>;
}

const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const startQuiz = async (userId: string, eventId: string) => {
  const event = await prisma.event.findUnique({
    where: { id: eventId },
    include: {
      config: true,
      questions: {
        include: {
          question: {
            include: {
              answers: true,
            },
          },
        },
      },
    },
  });

  if (!event) {
    throw createError(404, 'Event not found');
  }

  if (event.status !== 'ACTIVE') {
    throw createError(400, 'Event is not active');
  }

  const now = new Date();
  if (now < event.startDate || now > event.endDate) {
    throw createError(400, 'Event is not currently running');
  }

  const existingSession = await prisma.quizSession.findFirst({
    where: {
      userId,
      eventId,
      status: 'IN_PROGRESS',
    },
  });

  if (existingSession) {
    throw createError(400, 'You already have an active quiz session for this event');
  }

  const existingResult = await prisma.quizResult.findFirst({
    where: {
      userId,
      eventId,
    },
  });

  if (existingResult) {
    throw createError(400, 'You have already completed this quiz');
  }

  if (!event.config) {
    throw createError(500, 'Event configuration not found');
  }

  let questions = event.questions.map((eq) => eq.question);

  if (event.config.shuffleQuestions) {
    questions = shuffleArray(questions);
  }

  questions = questions.slice(0, event.config.questionCount);

  const questionsData: QuestionData[] = questions.map((q) => {
    let answers = q.answers.map((a) => ({
      id: a.id,
      content: a.content,
      orderIndex: a.orderIndex,
    }));

    if (event.config?.shuffleAnswers) {
      answers = shuffleArray(answers);
    }

    return {
      id: q.id,
      content: q.content,
      type: q.type,
      answers,
    };
  });

  const session = await prisma.quizSession.create({
    data: {
      userId,
      eventId,
      status: 'IN_PROGRESS',
      questionsData: JSON.stringify(questionsData),
    },
  });

  return {
    sessionId: session.id,
    questions: questionsData,
    startedAt: session.startedAt,
  };
};

export const submitAnswer = async (
  sessionId: string,
  userId: string,
  questionId: string,
  answerId: string
) => {
  const session = await prisma.quizSession.findUnique({
    where: { id: sessionId },
  });

  if (!session) {
    throw createError(404, 'Quiz session not found');
  }

  if (session.userId !== userId) {
    throw createError(403, 'This is not your quiz session');
  }

  if (session.status !== 'IN_PROGRESS') {
    throw createError(400, 'Quiz session is no longer active');
  }

  const answer = await prisma.answer.findUnique({
    where: { id: answerId },
    include: { question: true },
  });

  if (!answer) {
    throw createError(404, 'Answer not found');
  }

  if (answer.questionId !== questionId) {
    throw createError(400, 'Answer does not belong to this question');
  }

  const existingAnswer = await prisma.sessionAnswer.findUnique({
    where: {
      sessionId_questionId: {
        sessionId,
        questionId,
      },
    },
  });

  if (existingAnswer) {
    await prisma.sessionAnswer.update({
      where: { id: existingAnswer.id },
      data: { answerId },
    });
  } else {
    await prisma.sessionAnswer.create({
      data: {
        sessionId,
        questionId,
        answerId,
      },
    });
  }

  return { message: 'Answer submitted successfully' };
};

export const submitQuiz = async (sessionId: string, userId: string) => {
  const session = await prisma.quizSession.findUnique({
    where: { id: sessionId },
    include: {
      event: {
        include: {
          config: true,
        },
      },
      answers: {
        include: {
          answer: true,
        },
      },
    },
  });

  if (!session) {
    throw createError(404, 'Quiz session not found');
  }

  if (session.userId !== userId) {
    throw createError(403, 'This is not your quiz session');
  }

  if (session.status !== 'IN_PROGRESS') {
    throw createError(400, 'Quiz session is already submitted');
  }

  const questionsData: QuestionData[] = JSON.parse(session.questionsData);
  const totalQuestions = questionsData.length;

  const correctAnswers = session.answers.filter((sa) => sa.answer.isCorrect).length;

  const score = (correctAnswers / totalQuestions) * 100;

  const minScore = session.event.config?.minScore || 70;
  const passedThreshold = score >= minScore;

  await prisma.quizSession.update({
    where: { id: sessionId },
    data: {
      status: 'SUBMITTED',
      submittedAt: new Date(),
    },
  });

  const result = await prisma.quizResult.create({
    data: {
      sessionId,
      userId,
      eventId: session.eventId,
      totalQuestions,
      correctAnswers,
      score,
      passedThreshold,
    },
  });

  let spinCode = null;

  if (passedThreshold) {
    const code = generateSpinCode();

    spinCode = await prisma.spinCode.create({
      data: {
        code,
        userId,
        eventId: session.eventId,
        quizResultId: result.id,
        status: 'AVAILABLE',
      },
    });
  }

  return {
    result: {
      totalQuestions,
      correctAnswers,
      score,
      passedThreshold,
    },
    spinCode: spinCode ? spinCode.code : null,
  };
};

const generateSpinCode = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

export const getUserQuizResults = async (userId: string) => {
  const results = await prisma.quizResult.findMany({
    where: { userId },
    include: {
      event: true,
      spinCode: true,
    },
    orderBy: {
      completedAt: 'desc',
    },
  });

  return results.map((result) => ({
    id: result.id,
    eventId: result.eventId,
    eventName: result.event.name,
    score: Number(result.score),
    totalQuestions: result.totalQuestions,
    correctAnswers: result.correctAnswers,
    isPassed: result.passedThreshold,
    spinCode: result.spinCode?.code || null,
    completedAt: result.completedAt,
  }));
};
