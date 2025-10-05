import prisma from '../../config/database.ts';
import { comparePassword } from '../../utils/hash.ts';
import { generateToken } from '../../utils/jwt.ts';
import { createError } from '../../middleware/errorHandler.ts';

export const loginUser = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw createError(401, 'Invalid email or password');
  }

  const isPasswordValid = await comparePassword(password, user.password);

  if (!isPasswordValid) {
    throw createError(401, 'Invalid email or password');
  }

  const token = generateToken({
    id: user.id,
    email: user.email,
    role: user.role,
  });

  return {
    token,
    user: {
      id: user.id,
      employeeId: user.employeeId,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
    },
  };
};

export const getUserProfile = async (userId: string) => {
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
