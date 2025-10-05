import { type Response, type NextFunction } from 'express';
import { type AuthRequest } from '../../middleware/auth.ts';
import {
  getAllQuestions,
  createQuestion,
  addQuestionToEvent,
  removeQuestionFromEvent,
} from './questions.service.ts';

export const getQuestions = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const questions = await getAllQuestions();

    res.json({
      success: true,
      data: questions,
    });
  } catch (error) {
    next(error);
  }
};

export const createNewQuestion = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { content, type, answers } = req.body;

    if (!content || !type || !answers) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: content, type, answers',
      });
    }

    const question = await createQuestion({ content, type, answers });

    res.status(201).json({
      success: true,
      data: question,
    });
  } catch (error) {
    next(error);
  }
};

export const addQuestionToEventController = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { eventId } = req.params;
    const { questionId } = req.body;

    if (!questionId) {
      return res.status(400).json({
        success: false,
        message: 'questionId is required',
      });
    }

    const result = await addQuestionToEvent(eventId, questionId);

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const removeQuestionFromEventController = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { eventId, questionId } = req.params;

    const result = await removeQuestionFromEvent(eventId, questionId);

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
