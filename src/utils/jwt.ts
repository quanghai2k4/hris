import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = '7d';

export const generateToken = (payload: { id: string; email: string; role: string }): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

export const verifyToken = (token: string): { id: string; email: string; role: string } => {
  return jwt.verify(token, JWT_SECRET) as { id: string; email: string; role: string };
};
