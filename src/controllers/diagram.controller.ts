import { Request, Response } from 'express';
import asyncHandler from '../utils/asyncHandler';
import { successResponse, errorResponse } from '../utils/apiResponse';
import Diagram from '../models/Diagram.model';
import AppError from '../utils/AppError';

// @desc    Get all public diagrams (with search, filter, sort, pagination)
// @route   GET /api/diagrams
// @access  Public
export const getAllDiagrams = asyncHandler(async (req: Request, res: Response) => {
  const {
    search,
    diagramType,
    category,
    sort,
    page = '1',
    limit = '12',
  } = req.query as Record<string, string>;

  const currentPage = Math.max(1, parseInt(page, 10));
  const pageLimit = Math.max(1, parseInt(limit, 10));
  const skip = (currentPage - 1) * pageLimit;

  // Build filter
  const filter: Record<string, unknown> = { visibility: 'public' };
  if (search) filter.title = { $regex: search, $options: 'i' };
  if (diagramType) filter.diagramType = diagramType;
  if (category) filter.category = category;

  // Build sort
  let sortOption: Record<string, 1 | -1> = { createdAt: -1 };
  if (sort === 'oldest') sortOption = { createdAt: 1 };
  else if (sort === 'popular') sortOption = { likeCount: -1 };

  const [diagrams, totalCount] = await Promise.all([
    Diagram.find(filter)
      .sort(sortOption)
      .skip(skip)
      .limit(pageLimit)
      .populate('author', 'name avatar'),
    Diagram.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(totalCount / pageLimit);

  return successResponse(res, 200, 'Diagrams fetched', {
    diagrams,
    totalCount,
    currentPage,
    totalPages,
  });
});

// @desc    Get single diagram by ID
// @route   GET /api/diagrams/:id
// @access  Public
export const getDiagramById = asyncHandler(async (req: Request, res: Response) => {
  const diagram = await Diagram.findById(req.params.id).populate('author', 'name avatar');

  if (!diagram) {
    return errorResponse(res, 404, 'Diagram not found');
  }

  diagram.viewCount += 1;
  await diagram.save();

  return successResponse(res, 200, 'Diagram fetched', { diagram });
});

// @desc    Create a new diagram
// @route   POST /api/diagrams
// @access  Private
export const createDiagram = asyncHandler(async (req: Request, res: Response) => {
  const { title, description, mermaidCode, prompt, diagramType, category, tags, visibility } =
    req.body;

  const diagram = await Diagram.create({
    title,
    description,
    mermaidCode,
    prompt,
    diagramType,
    category,
    tags,
    visibility,
    author: req.user!._id,
  });

  return successResponse(res, 201, 'Diagram created successfully', { diagram });
});

// @desc    Update a diagram
// @route   PUT /api/diagrams/:id
// @access  Private
export const updateDiagram = asyncHandler(async (req: Request, res: Response) => {
  const diagram = await Diagram.findById(req.params.id);

  if (!diagram) {
    return errorResponse(res, 404, 'Diagram not found');
  }

  if (String(diagram.author) !== String(req.user!._id)) {
    return errorResponse(res, 403, 'Not authorized');
  }

  const { title, description, mermaidCode, prompt, diagramType, category, tags, visibility } =
    req.body;

  if (title !== undefined) diagram.title = title;
  if (description !== undefined) diagram.description = description;
  if (mermaidCode !== undefined) diagram.mermaidCode = mermaidCode;
  if (prompt !== undefined) diagram.prompt = prompt;
  if (diagramType !== undefined) diagram.diagramType = diagramType;
  if (category !== undefined) diagram.category = category;
  if (tags !== undefined) diagram.tags = tags;
  if (visibility !== undefined) diagram.visibility = visibility;

  const updated = await diagram.save();

  return successResponse(res, 200, 'Diagram updated successfully', { diagram: updated });
});

// @desc    Delete a diagram
// @route   DELETE /api/diagrams/:id
// @access  Private
export const deleteDiagram = asyncHandler(async (req: Request, res: Response) => {
  const diagram = await Diagram.findById(req.params.id);

  if (!diagram) {
    return errorResponse(res, 404, 'Diagram not found');
  }

  if (String(diagram.author) !== String(req.user!._id)) {
    return errorResponse(res, 403, 'Not authorized');
  }

  await diagram.deleteOne();

  return successResponse(res, 200, 'Diagram deleted successfully', null);
});

// @desc    Get all diagrams for the logged-in user
// @route   GET /api/diagrams/my
// @access  Private
export const getMyDiagrams = asyncHandler(async (req: Request, res: Response) => {
  const diagrams = await Diagram.find({ author: req.user!._id }).sort({ createdAt: -1 });

  return successResponse(res, 200, 'My diagrams fetched', { diagrams });
});

// @desc    Toggle like on a diagram
// @route   PATCH /api/diagrams/:id/like
// @access  Private
export const toggleLike = asyncHandler(async (req: Request, res: Response) => {
  const diagram = await Diagram.findById(req.params.id);

  if (!diagram) {
    return errorResponse(res, 404, 'Diagram not found');
  }

  diagram.likeCount += 1;
  await diagram.save();

  return successResponse(res, 200, 'Like toggled', { likeCount: diagram.likeCount });
});
