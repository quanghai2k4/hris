import { Router } from 'express';
import {
  executeSpinController,
  getSpinCodes,
  getSpinHistory,
} from './spin.controller.ts';
import { authenticate } from '../../middleware/auth.ts';

const router = Router();

router.post('/execute', authenticate, executeSpinController);
router.get('/codes', authenticate, getSpinCodes);
router.get('/history', authenticate, getSpinHistory);

export default router;
