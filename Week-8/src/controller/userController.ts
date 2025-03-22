import { User } from '../models/userModel';
import { catchAsync } from '../utils/catchAsync';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from '../utils/appError';

const getUserProfile = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return next(new AppError('No token provided', 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECURE as string) as jwt.JwtPayload;

    if (decoded && decoded.email) {
      const user = await User.findOne({ email: decoded.email });
      if (!user) {
        return next(new AppError('User not found', 404));
      }
      return res.status(200).json({ user });
    } else {
      return next(new AppError('Invalid token', 400));
    }
  } catch (_) {
    return next(new AppError('Invalid token', 400));
  }
});

const updateUserProfile = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return next(new AppError('No token provided', 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECURE as string) as jwt.JwtPayload;

    if (decoded && decoded.email) {
      const { email, username, password } = req.body;
      if (!username || !email || !password) {
        return next(new AppError('Please fill in all fields', 400));
      }

      const user = await User.findOneAndUpdate(
        { email: decoded.email },
        { email, username, password },
        { new: true, runValidators: true } // Returns updated user
      );

      if (!user) {
        return next(new AppError('User not found', 404));
      }

      const newToken = jwt.sign(
        { id: user._id, email: user.email },
        process.env.JWT_SECURE as string,
        { expiresIn: '1h' }
      );

      res.cookie('token', newToken, {
        httpOnly: true,
        secure: false,
        sameSite: 'strict',
        maxAge: 60 * 60 * 1000,
      });

      return res.status(200).json({
        status: 'success',
        token: newToken,
        user,
      });
    } else {
      return next(new AppError('Invalid token', 400));
    }
  } catch (_) {
    return next(new AppError('Invalid token', 400));
  }
});

export { getUserProfile, updateUserProfile };
