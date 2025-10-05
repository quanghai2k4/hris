import type { Request, Response } from 'express';
import { createError } from '../../middleware/errorHandler.ts';
import * as usersService from './users.service.ts';

export const getAllUsers = async (_req: Request, res: Response) => {
  const users = await usersService.getAllUsers();
  res.json({ success: true, data: users });
};

export const getUserById = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) throw createError(400, 'User ID is required');
  const user = await usersService.getUserById(id);
  res.json({ success: true, data: user });
};

export const createUser = async (req: Request, res: Response) => {
  const { employeeId, fullName, email, password, role } = req.body;

  if (!employeeId || !fullName || !email || !password || !role) {
    throw createError(400, 'All fields are required');
  }

  const user = await usersService.createUser({
    employeeId,
    fullName,
    email,
    password,
    role,
  });

  res.status(201).json({ success: true, data: user });
};

export const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) throw createError(400, 'User ID is required');
  const { employeeId, fullName, email, password, role } = req.body;

  const user = await usersService.updateUser(id, {
    employeeId,
    fullName,
    email,
    password,
    role,
  });

  res.json({ success: true, data: user });
};

export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) throw createError(400, 'User ID is required');
  const result = await usersService.deleteUser(id);
  res.json({ success: true, message: result.message });
};
