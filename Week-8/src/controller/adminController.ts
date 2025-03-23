import { NextFunction, Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { User } from '../models/userModel';
import { AppError } from '../utils/appError';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const getAllUsers = catchAsync(async (_req: Request, res: Response, _next: NextFunction) => {
  const Users = await User.find();
  try {
    res.status(200).json({
      status: 'success',
      length: Users.length,
      data: {
        Users,
      },
    });
  } catch (_) {
    res.status(500).json({
      status: 'fail',
      message: 'Error fetching data',
    });
  }
});

const adminLogin = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const existingToken = req.cookies.token ;
  console.log(req.cookies.token); //needed cookies parser
  if (existingToken) {
    try {
      jwt.verify(existingToken, process.env.JWT_SECURE as string);
      return next(new AppError('You are already logged in', 400));
    } catch (error) {
      return next(new AppError('Invalid or expired token', 401));
    }
  }

  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError('Please fill the admin form', 401));
  }

  const admin = await User.findOne({ email });
  if (!admin) {
    return next(new AppError('Incorrect email or password', 401));
  }

  const isPasswordCorrect = await bcrypt.compare(password, admin.password);
  if (!isPasswordCorrect) {
    return next(new AppError('Incorrect email or password', 401));
  }

  if (admin.role === 'user') {
    return next(new AppError('Incorrect email or password', 403));
  }

  const token = jwt.sign({ id: admin._id }, process.env.JWT_SECURE as string, { expiresIn: '1h' });
  res.cookie('token', token, {
    httpOnly: true,
    secure: false,
    sameSite: 'strict',
    maxAge: 60 * 60 * 1000,
  });

  res.status(200).json({
    status: 'success',
    message: 'Admin LogedIn successfully',
  });
});

export { getAllUsers, adminLogin };
