import { type Response, type NextFunction } from 'express';
import { type AuthRequest } from '../../middleware/auth.ts';
import { executeSpin, getUserSpinCodes, getUserSpinHistory } from './spin.service.ts';

export const executeSpinController = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    const { code } = req.body;

    if (!code) {
      return res.status(400).json({
        success: false,
        message: 'Spin code is required',
      });
    }

    const result = await executeSpin(req.user.id, code);

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getSpinCodes = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    const codes = await getUserSpinCodes(req.user.id);

    res.json({
      success: true,
      data: codes,
    });
  } catch (error) {
    next(error);
  }
};

export const getSpinHistory = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    const history = await getUserSpinHistory(req.user.id);

    res.json({
      success: true,
      data: history,
    });
  } catch (error) {
    next(error);
  }
};
