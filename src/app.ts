import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from './config/env';
import authRouter from './routes/auth.routes';
import diagramRouter from './routes/diagram.routes';
import aiRouter from './routes/ai.routes';
import contactRouter from './routes/contact.routes';

const app = express();

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: "ok", message: "DiagramCraft AI server is running" });
});

app.use('/api/auth', authRouter);
app.use('/api/diagrams', diagramRouter);
app.use('/api/ai', aiRouter);
app.use('/api/contact', contactRouter);

export default app;
