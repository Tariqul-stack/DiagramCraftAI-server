import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { OAuth2Client } from 'google-auth-library';
import asyncHandler from '../utils/asyncHandler';
import { successResponse, errorResponse } from '../utils/apiResponse';
import User from '../models/User.model';
import { env } from '../config/env';

const googleClient = new OAuth2Client(env.GOOGLE_CLIENT_ID);

const generateToken = (userId: string): string => {
  return jwt.sign({ id: userId }, env.JWT_SECRET, { expiresIn: '7d' });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const register = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return errorResponse(res, 400, 'Email already exists');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  const token = generateToken(String(user._id));

  return successResponse(res, 201, 'Account created successfully', { user, token });
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    return errorResponse(res, 401, 'Invalid credentials');
  }

  const isMatch = await bcrypt.compare(password, user.password ?? '');
  if (!isMatch) {
    return errorResponse(res, 401, 'Invalid credentials');
  }

  const token = generateToken(String(user._id));

  // Remove password from response
  user.password = undefined;

  return successResponse(res, 200, 'Login successful', { user, token });
});

// @desc    Get current logged-in user
// @route   GET /api/auth/me
// @access  Private
export const getMe = asyncHandler(async (req: Request, res: Response) => {
  return successResponse(res, 200, 'User fetched', { user: req.user });
});

// @desc    Google OAuth login
// @route   POST /api/auth/google
// @access  Public
export const googleLogin = asyncHandler(async (req: Request, res: Response) => {
  const { credential } = req.body;

  if (!credential) {
    return errorResponse(res, 400, 'Google credential is required');
  }

  // Verify Google token
  const ticket = await googleClient.verifyIdToken({
    idToken: credential,
    audience: env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();
  if (!payload) {
    return errorResponse(res, 401, 'Invalid Google token');
  }

  const { email, name, sub: googleId } = payload;

  if (!email || !name) {
    return errorResponse(res, 400, 'Could not get user info from Google');
  }

  // Check if user exists
  let user = await User.findOne({ email });

  if (!user) {
    // Create new user
    user = await User.create({
      name,
      email,
      provider: 'google',
      password: undefined,
    });
  }

  const token = generateToken(String(user._id));

  return successResponse(res, 200, 'Google login successful', { user, token });
});
