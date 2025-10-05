import express, { type Application, type Request, type Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRouter from './modules/auth/auth.routes.ts';
import eventsRouter from './modules/events/events.routes.ts';
import questionsRouter from './modules/questions/questions.routes.ts';
import quizRouter from './modules/quiz/quiz.routes.ts';
import spinRouter from './modules/spin/spin.routes.ts';
import reportsRouter from './modules/reports/reports.routes.ts';
import usersRouter from './modules/users/users.routes.ts';
import { errorHandler } from './middleware/errorHandler.ts';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRouter);
app.use('/api/events', eventsRouter);
app.use('/api/questions', questionsRouter);
app.use('/api/quiz', quizRouter);
app.use('/api/spin', spinRouter);
app.use('/api/reports', reportsRouter);
app.use('/api/users', usersRouter);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
