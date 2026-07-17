import { Request, Response } from 'express';
import asyncHandler from '../utils/asyncHandler';
import { successResponse, errorResponse } from '../utils/apiResponse';
import { generateDiagram, chatWithDiagram } from '../services/ai.service';

// @desc    Generate Mermaid diagram code from a prompt
// @route   POST /api/ai/generate
// @access  Private
export const generate = asyncHandler(async (req: Request, res: Response) => {
  const { diagramType, prompt } = req.body;

  if (!diagramType || !prompt) {
    return errorResponse(res, 400, 'diagramType and prompt are required');
  }

  const mermaidCode = await generateDiagram(diagramType, prompt);

  return successResponse(res, 200, 'Diagram generated', { mermaidCode });
});

// @desc    Regenerate Mermaid diagram code from a prompt
// @route   POST /api/ai/regenerate
// @access  Private
export const regenerate = asyncHandler(async (req: Request, res: Response) => {
  const { diagramType, prompt } = req.body;

  if (!diagramType || !prompt) {
    return errorResponse(res, 400, 'diagramType and prompt are required');
  }

  const mermaidCode = await generateDiagram(diagramType, prompt);

  return successResponse(res, 200, 'Diagram generated', { mermaidCode });
});

// @desc    Chat about a diagram with message history
// @route   POST /api/ai/chat
// @access  Private
export const chat = asyncHandler(async (req: Request, res: Response) => {
  const { diagramCode, history, message } = req.body;

  if (!message) {
    return errorResponse(res, 400, 'message is required');
  }

  const resolvedDiagramCode: string = diagramCode ?? '';
  const resolvedHistory: { role: 'user' | 'assistant'; content: string }[] = history ?? [];

  const reply = await chatWithDiagram(resolvedDiagramCode, resolvedHistory, message);

  return successResponse(res, 200, 'AI response', { reply });
});
