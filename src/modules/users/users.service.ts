import prisma from '../../config/database.ts';
import { hashPassword } from '../../utils/hash.ts';
import { createError } from '../../middleware/errorHandler.ts';
import type { Role } from '@prisma/client';

export const getAllUsers = async () => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      employeeId: true,
      fullName: true,
      email: true,
      role: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return users;
};

export const getUserById = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      employeeId: true,
      fullName: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });

  if (!user) {
    throw createError(404, 'User not found');
  }

  return user;
};

export const createUser = async (data: {
  employeeId: string;
  fullName: string;
  email: string;
  password: string;
  role: Role;
}) => {
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [
        { email: data.email },
        { employeeId: data.employeeId },
      ],
    },
  });

  if (existingUser) {
    if (existingUser.email === data.email) {
      throw createError(400, 'Email already exists');
    }
    if (existingUser.employeeId === data.employeeId) {
      throw createError(400, 'Employee ID already exists');
    }
  }

  const hashedPassword = await hashPassword(data.password);

  const user = await prisma.user.create({
    data: {
      employeeId: data.employeeId,
      fullName: data.fullName,
      email: data.email,
      password: hashedPassword,
      role: data.role,
    },
    select: {
      id: true,
      employeeId: true,
      fullName: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });

  return user;
};

export const updateUser = async (
  userId: string,
  data: {
    employeeId?: string;
    fullName?: string;
    email?: string;
    password?: string;
    role?: Role;
  }
) => {
  const existingUser = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!existingUser) {
    throw createError(404, 'User not found');
  }

  if (data.email && data.email !== existingUser.email) {
    const emailExists = await prisma.user.findUnique({
      where: { email: data.email },
    });
    if (emailExists) {
      throw createError(400, 'Email already exists');
    }
  }

  if (data.employeeId && data.employeeId !== existingUser.employeeId) {
    const employeeIdExists = await prisma.user.findUnique({
      where: { employeeId: data.employeeId },
    });
    if (employeeIdExists) {
      throw createError(400, 'Employee ID already exists');
    }
  }

  const updateData: any = {};
  if (data.employeeId) updateData.employeeId = data.employeeId;
  if (data.fullName) updateData.fullName = data.fullName;
  if (data.email) updateData.email = data.email;
  if (data.role) updateData.role = data.role;
  if (data.password) {
    updateData.password = await hashPassword(data.password);
  }

  const user = await prisma.user.update({
    where: { id: userId },
    data: updateData,
    select: {
      id: true,
      employeeId: true,
      fullName: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });

  return user;
};

export const deleteUser = async (userId: string) => {
  const existingUser = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!existingUser) {
    throw createError(404, 'User not found');
  }

  await prisma.user.delete({
    where: { id: userId },
  });

  return { message: 'User deleted successfully' };
};
