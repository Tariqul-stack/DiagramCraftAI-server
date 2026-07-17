import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from './config/env';
import authRouter from './routes/auth.routes';
import diagramRouter from './routes/diagram.routes';

const app = express();

// Middleware
app.use(cors({ origin: env.CLIENT_URL }));
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

// Routes
app.use('/api/auth', authRouter);
app.use('/api/diagrams', diagramRouter);

export default app;
