import { Router } from 'express';
import {
  getQuestions,
  createNewQuestion,
  addQuestionToEventController,
  removeQuestionFromEventController,
} from './questions.controller.ts';
import { authenticate, authorize } from '../../middleware/auth.ts';

const router = Router();

router.get('/', authenticate, authorize('HR_MANAGER', 'ADMIN'), getQuestions);
router.post('/', authenticate, authorize('HR_MANAGER', 'ADMIN'), createNewQuestion);
router.post('/events/:eventId/questions', authenticate, authorize('HR_MANAGER', 'ADMIN'), addQuestionToEventController);
router.delete('/events/:eventId/questions/:questionId', authenticate, authorize('HR_MANAGER', 'ADMIN'), removeQuestionFromEventController);

export default router;
