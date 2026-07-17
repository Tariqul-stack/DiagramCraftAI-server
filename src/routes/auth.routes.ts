import { Router } from 'express';
import { z } from 'zod';
import validate from '../middleware/validate.middleware';
import protect from '../middleware/auth.middleware';
import { register, login, getMe } from '../controllers/auth.controller';

const router = Router();

// Validation schemas
const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

// Routes
router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.get('/me', protect, getMe);

export default router;
