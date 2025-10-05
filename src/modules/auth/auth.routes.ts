import { Router, type Request, type Response, type NextFunction } from 'express';
import { login, logout, getMe } from './auth.controller.ts';
import { authenticate } from '../../middleware/auth.ts';

const router = Router();

router.post('/login', login);
router.post('/logout', authenticate, logout);
router.get('/me', authenticate, getMe);

export default router;
