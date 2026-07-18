import { Router } from 'express';
import { z } from 'zod';
import validate from '../middleware/validate.middleware';
import { submitContact } from '../controllers/contact.controller';

const router = Router();

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email format'),
  subject: z.string().min(3, 'Subject must be at least 3 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

router.post('/', validate(contactSchema), submitContact);

export default router;
