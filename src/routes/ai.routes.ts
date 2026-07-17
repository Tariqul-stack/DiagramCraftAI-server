import { Router } from 'express';
import { z } from 'zod';
import protect from '../middleware/auth.middleware';
import validate from '../middleware/validate.middleware';
import { generate, regenerate, chat } from '../controllers/ai.controller';

const router = Router();

// Validation schemas
const generateSchema = z.object({
  diagramType: z.enum(['flowchart', 'sequence', 'erd', 'class', 'mindmap', 'gantt']),
  prompt: z.string().min(5, 'Prompt must be at least 5 characters'),
});

const chatSchema = z.object({
  diagramCode: z.string().optional(),
  history: z
    .array(
      z.object({
        role: z.enum(['user', 'assistant']),
        content: z.string(),
      })
    )
    .optional(),
  message: z.string().min(1, 'Message is required'),
});

// Routes
router.post('/generate', protect, validate(generateSchema), generate);
router.post('/regenerate', protect, validate(generateSchema), regenerate);
router.post('/chat', protect, validate(chatSchema), chat);

export default router;
