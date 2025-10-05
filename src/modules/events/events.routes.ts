import { Router } from 'express';
import {
  getEvents,
  getEvent,
  createNewEvent,
  updateExistingEvent,
  activateEventController,
  deleteEventController,
} from './events.controller.ts';
import { authenticate, authorize } from '../../middleware/auth.ts';

const router = Router();

router.get('/', authenticate, getEvents);
router.get('/:id', authenticate, getEvent);
router.post('/', authenticate, authorize('HR_MANAGER', 'ADMIN'), createNewEvent);
router.put('/:id', authenticate, authorize('HR_MANAGER', 'ADMIN'), updateExistingEvent);
router.patch('/:id', authenticate, authorize('HR_MANAGER', 'ADMIN'), updateExistingEvent);
router.post('/:id/activate', authenticate, authorize('HR_MANAGER', 'ADMIN'), activateEventController);
router.delete('/:id', authenticate, authorize('HR_MANAGER', 'ADMIN'), deleteEventController);

export default router;
