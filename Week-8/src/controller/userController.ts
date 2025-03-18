import { User } from '../models/userModel';
import { catchAsync } from '../utils/catchAsync';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const getUserProfile = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECURE as string) as jwt.JwtPayload;

    if (decoded && decoded.email) {
      const user = await User.findOne({ email: decoded.email });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      return res.status(200).json({ user });
    } else {
      return res.status(400).json({ message: 'Invalid token' });
    }
  } catch (error) {
    next(error);
  }
});

const updateUserProfile = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECURE as string) as jwt.JwtPayload;

    if (decoded && decoded.email) {
      let { email, username, password } = req.body;
      if (!username || !email || !password) {
        return res.status(400).json({
          status: 'fail',
          message: 'Please fill in all fields',
        });
      }

      const user = await User.findOneAndUpdate(
        { email: decoded.email },
        { email, username, password },
        { new: true, runValidators: true } // Returns updated user
      );

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      const token = jwt.sign(
        { id: user._id, email: user.email },
        process.env.JWT_SECURE as string,
        { expiresIn: '1h' }
      );

      res.cookie('token', token, {
        httpOnly: true,
        secure: false,
        sameSite: 'strict',
        maxAge: 60 * 60 * 1000,
      });
      return res.status(200).json({
        status: 'success',
        token,
        user,
      });
    } else {
      return res.status(400).json({ message: 'Invalid token' });
    }
  } catch (error) {
    next(error);
  }
});

export { getUserProfile, updateUserProfile };
