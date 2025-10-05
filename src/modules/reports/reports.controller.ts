import { type Request, type Response, type NextFunction } from 'express';
import * as reportsService from './reports.service.ts';
import AppError from '../../middleware/errorHandler.ts';

export const getDashboard = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { eventId } = req.query;
    const data = await reportsService.getDashboardData(eventId as string | undefined);
    res.json(data);
  } catch (error) {
    next(error);
  }
};

export const getEventReport = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { eventId } = req.params;
    const report = await reportsService.getEventReport(eventId);
    
    if (!report) {
      throw new AppError('Event not found', 404);
    }
    
    res.json(report);
  } catch (error) {
    next(error);
  }
};
