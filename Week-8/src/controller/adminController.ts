import { NextFunction, Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { User } from '../models/userModel';

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

export { getAllUsers };
