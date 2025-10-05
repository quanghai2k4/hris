import { Router } from 'express';
import {
  startQuizController,
  submitAnswerController,
  submitQuizController,
  getUserQuizResultsController,
} from './quiz.controller.ts';
import { authenticate } from '../../middleware/auth.ts';

const router = Router();

router.get('/results', authenticate, getUserQuizResultsController);
router.post('/start', authenticate, startQuizController);
router.post('/answer', authenticate, submitAnswerController);
router.post('/submit', authenticate, submitQuizController);

export default router;
