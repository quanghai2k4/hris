import { Router } from 'express';
import * as reportsController from './reports.controller.ts';
import { authenticate, authorize } from '../../middleware/auth.ts';

const router = Router();

router.get('/dashboard', authenticate, authorize('HR_MANAGER', 'ADMIN'), reportsController.getDashboard);
router.get('/events/:eventId', authenticate, authorize('HR_MANAGER', 'ADMIN'), reportsController.getEventReport);

export default router;
