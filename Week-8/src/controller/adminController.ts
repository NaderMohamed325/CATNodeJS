import { NextFunction, Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { User } from '../models/userModel';
import { AppError } from '../utils/appError';

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
  const { email, password } = req.body;
  if (!email || !password) {
    next(new AppError('Please fill the admin form', 401));
  }
});

export { getAllUsers };
