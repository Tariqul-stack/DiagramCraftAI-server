import { Request, Response } from 'express';
import asyncHandler from '../utils/asyncHandler';
import { successResponse, errorResponse } from '../utils/apiResponse';
import Contact from '../models/Contact.model';

export const submitContact = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    return errorResponse(res, 400, 'All fields are required');
  }

  await Contact.create({
    name,
    email,
    subject,
    message,
  });

  return successResponse(res, 201, 'Message sent successfully');
});
