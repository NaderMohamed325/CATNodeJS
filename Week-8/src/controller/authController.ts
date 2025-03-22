import { User, userZodSchema } from '../models/userModel';
import { catchAsync } from '../utils/catchAsync';
import { Request, Response, NextFunction } from 'express';
import { zodSchemaValidate } from '../utils/validation';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { AppError } from '../utils/appError';

const registerUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { username, email, password } = req.body;
  const userData = { username, email, password };

  if (!username || !email || !password) {
    return next(new AppError('Please fill the form', 400));
  }

  const validation = zodSchemaValidate(userData, userZodSchema, res);
  if (!validation) return;

  if ((await User.find({ email })).length > 0) {
    return next(new AppError('This email is in use', 400));
  }

  const newUser = await User.create(userData);

  res.status(201).json({
    status: 'success',
    data: {
      user: newUser,
    },
  });
});

const loginUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('Please fill the login form', 400));
  }

  const user = await User.findOne({ email });
  if (!user) {
    return next(new AppError('User not found. Please create an account.', 400));
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  if (!isPasswordCorrect) {
    return next(new AppError('Incorrect password', 401));
  }

  const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECURE as string, {
    expiresIn: '1h',
  });

  res.cookie('token', token, {
    httpOnly: true,
    secure: false,
    sameSite: 'strict',
    maxAge: 60 * 60 * 1000,
  });

  return res.status(200).json({
    status: 'success',
    token,
    message: 'Login successful',
  });
});

const logoutUser = catchAsync(async (_req: Request, res: Response, _next: NextFunction) => {
  res.cookie('token', '', {
    httpOnly: true,
    secure: false,
    sameSite: 'strict',
    expires: new Date(0),
  });

  return res.status(200).json({
    status: 'success',
    message: 'Logged out successfully',
  });
});

export { registerUser, loginUser, logoutUser };
