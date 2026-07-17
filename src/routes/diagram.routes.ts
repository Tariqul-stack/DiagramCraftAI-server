import { Router } from 'express';
import { z } from 'zod';
import protect from '../middleware/auth.middleware';
import validate from '../middleware/validate.middleware';
import {
  getAllDiagrams,
  getMyDiagrams,
  getDiagramById,
  createDiagram,
  updateDiagram,
  deleteDiagram,
  toggleLike,
} from '../controllers/diagram.controller';

const router = Router();

// Validation schema
const createDiagramSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().optional(),
  mermaidCode: z.string().min(10, 'Mermaid code must be at least 10 characters'),
  prompt: z.string().optional(),
  diagramType: z.enum(['flowchart', 'sequence', 'erd', 'class', 'mindmap', 'gantt']),
  category: z.enum(['business', 'tech', 'education', 'personal']).optional(),
  tags: z.array(z.string()).optional(),
  visibility: z.enum(['public', 'private']).optional().default('public'),
});

// Routes
router.get('/', getAllDiagrams);
router.get('/user/my', protect, getMyDiagrams);   // must be before /:id
router.get('/:id', getDiagramById);
router.post('/', protect, validate(createDiagramSchema), createDiagram);
router.put('/:id', protect, updateDiagram);
router.delete('/:id', protect, deleteDiagram);
router.post('/:id/like', protect, toggleLike);

export default router;
