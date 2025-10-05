import { type Response, type NextFunction } from 'express';
import { type AuthRequest } from '../../middleware/auth.ts';
import prisma from '../../config/database.ts';
import {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  activateEvent,
  deleteEvent,
} from './events.service.ts';

export const getEvents = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    console.log('getEvents - User:', req.user?.id, 'Role:', req.user?.role);
    const events = await getAllEvents(req.user?.id, req.user?.role);
    console.log('getEvents - Found events:', events.length);

    res.json({
      success: true,
      data: events,
    });
  } catch (error) {
    next(error);
  }
};

export const getEvent = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const event = await getEventById(id);

    res.json({
      success: true,
      data: event,
    });
  } catch (error) {
    next(error);
  }
};

export const createNewEvent = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, description, startDate, endDate, config, totalBudget } = req.body;

    if (!name || !startDate || !endDate || !config || !totalBudget) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields',
      });
    }

    const event = await createEvent({
      name,
      description,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      config,
      totalBudget,
    });

    res.status(201).json({
      success: true,
      data: event,
    });
  } catch (error) {
    next(error);
  }
};

export const updateExistingEvent = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { name, description, startDate, endDate, config, status } = req.body;

    if (status) {
      const event = await prisma.event.update({
        where: { id },
        data: { status },
        include: {
          config: true,
          budget: true,
        },
      });

      return res.json({
        success: true,
        data: event,
      });
    }

    const event = await updateEvent(id, {
      name,
      description,
      ...(startDate && { startDate: new Date(startDate) }),
      ...(endDate && { endDate: new Date(endDate) }),
      config,
    });

    res.json({
      success: true,
      data: event,
    });
  } catch (error) {
    next(error);
  }
};

export const activateEventController = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const event = await activateEvent(id);

    res.json({
      success: true,
      data: event,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteEventController = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const result = await deleteEvent(id);

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
