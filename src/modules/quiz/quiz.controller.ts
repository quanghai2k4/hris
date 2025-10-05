import { type Response, type NextFunction } from 'express';
import { type AuthRequest } from '../../middleware/auth.ts';
import { startQuiz, submitAnswer, submitQuiz, getUserQuizResults } from './quiz.service.ts';

export const startQuizController = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    const { eventId } = req.body;

    if (!eventId) {
      return res.status(400).json({
        success: false,
        message: 'eventId is required',
      });
    }

    const result = await startQuiz(req.user.id, eventId);

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const submitAnswerController = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    const { sessionId, questionId, answerId } = req.body;

    if (!sessionId || !questionId || !answerId) {
      return res.status(400).json({
        success: false,
        message: 'sessionId, questionId, and answerId are required',
      });
    }

    const result = await submitAnswer(sessionId, req.user.id, questionId, answerId);

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const submitQuizController = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    const { sessionId } = req.body;

    if (!sessionId) {
      return res.status(400).json({
        success: false,
        message: 'sessionId is required',
      });
    }

    const result = await submitQuiz(sessionId, req.user.id);

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getUserQuizResultsController = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    const results = await getUserQuizResults(req.user.id);

    res.json({
      success: true,
      data: results,
    });
  } catch (error) {
    next(error);
  }
};
