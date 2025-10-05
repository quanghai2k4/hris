import { Router } from 'express';
import { authenticate, authorize } from '../../middleware/auth.ts';
import * as usersController from './users.controller.ts';

const router = Router();

router.get('/', authenticate, authorize('HR_MANAGER', 'ADMIN'), usersController.getAllUsers);
router.get('/:id', authenticate, authorize('HR_MANAGER', 'ADMIN'), usersController.getUserById);
router.post('/', authenticate, authorize('HR_MANAGER', 'ADMIN'), usersController.createUser);
router.put('/:id', authenticate, authorize('HR_MANAGER', 'ADMIN'), usersController.updateUser);
router.delete('/:id', authenticate, authorize('HR_MANAGER', 'ADMIN'), usersController.deleteUser);

export default router;
