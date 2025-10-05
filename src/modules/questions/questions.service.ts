import prisma from '../../config/database.ts';
import { createError } from '../../middleware/errorHandler.ts';

export const getAllQuestions = async () => {
  const questions = await prisma.question.findMany({
    include: {
      answers: {
        orderBy: { orderIndex: 'asc' },
      },
      _count: {
        select: {
          events: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return questions;
};

export const createQuestion = async (data: {
  content: string;
  type: 'SINGLE_CHOICE' | 'MULTIPLE_CHOICE' | 'TRUE_FALSE';
  answers: Array<{
    content: string;
    isCorrect: boolean;
  }>;
}) => {
  if (!data.answers || data.answers.length < 2) {
    throw createError(400, 'Question must have at least 2 answers');
  }

  const correctAnswers = data.answers.filter((a) => a.isCorrect);
  if (correctAnswers.length === 0) {
    throw createError(400, 'Question must have at least one correct answer');
  }

  if (data.type === 'SINGLE_CHOICE' && correctAnswers.length > 1) {
    throw createError(400, 'Single choice question can only have one correct answer');
  }

  if (data.type === 'TRUE_FALSE' && data.answers.length !== 2) {
    throw createError(400, 'True/False question must have exactly 2 answers');
  }

  const question = await prisma.question.create({
    data: {
      content: data.content,
      type: data.type,
      answers: {
        create: data.answers.map((answer, index) => ({
          content: answer.content,
          isCorrect: answer.isCorrect,
          orderIndex: index,
        })),
      },
    },
    include: {
      answers: {
        orderBy: { orderIndex: 'asc' },
      },
    },
  });

  return question;
};

export const addQuestionToEvent = async (eventId: string, questionId: string) => {
  const event = await prisma.event.findUnique({
    where: { id: eventId },
    include: { questions: true },
  });

  if (!event) {
    throw createError(404, 'Event not found');
  }

  if (event.status !== 'DRAFT') {
    throw createError(400, 'Can only add questions to draft events');
  }

  const question = await prisma.question.findUnique({
    where: { id: questionId },
  });

  if (!question) {
    throw createError(404, 'Question not found');
  }

  const exists = await prisma.eventQuestion.findFirst({
    where: {
      eventId,
      questionId,
    },
  });

  if (exists) {
    throw createError(400, 'Question already added to this event');
  }

  const eventQuestion = await prisma.eventQuestion.create({
    data: {
      eventId,
      questionId,
      orderIndex: event.questions.length,
    },
    include: {
      question: {
        include: {
          answers: true,
        },
      },
    },
  });

  return eventQuestion;
};

export const removeQuestionFromEvent = async (eventId: string, questionId: string) => {
  const event = await prisma.event.findUnique({
    where: { id: eventId },
  });

  if (!event) {
    throw createError(404, 'Event not found');
  }

  if (event.status !== 'DRAFT') {
    throw createError(400, 'Can only remove questions from draft events');
  }

  const eventQuestion = await prisma.eventQuestion.findFirst({
    where: {
      eventId,
      questionId,
    },
  });

  if (!eventQuestion) {
    throw createError(404, 'Question not found in this event');
  }

  await prisma.eventQuestion.delete({
    where: {
      id: eventQuestion.id,
    },
  });

  return { message: 'Question removed from event' };
};
