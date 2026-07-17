import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import User from '../models/User.model';
import AppError from '../utils/AppError';
import asyncHandler from '../utils/asyncHandler';

interface JwtPayload {
  id: string;
}

const protect = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(new AppError('Not authorized, no token', 401));
    }

    const token = authHeader.split(' ')[1];

    const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;

    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return next(new AppError('User not found', 401));
    }

    req.user = user;
    next();
  }
);

export default protect;
