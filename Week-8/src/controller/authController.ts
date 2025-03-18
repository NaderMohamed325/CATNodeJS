import { User, userZodSchema } from '../models/userModel';
import { catchAsync } from '../utils/catchAsync';
import { Request, Response, NextFunction } from 'express';
import { zodSchemaValidate } from '../utils/validation';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
const registerUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  /*
  username: string;
  email: string;
  password: string;
*/
  const { username, email, password } = req.body;
  const userData = { username, email, password };
  if (!username || !email || !password) {
    return res.status(400).json({
      status: 'fail',
      message: 'Please fill the form',
    });
  }
  const validation = zodSchemaValidate(userData, userZodSchema, res);
  if (!validation) return;

  if ((await User.find({ email })).length > 0) {
    return res.status(400).json({
      status: 'fail',
      message: 'This email is in use',
    });
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
    return res.status(400).json({
      status: 'fail',
      message: 'Please fill the login form',
    });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({
      status: 'fail',
      message: 'User not found. Please create an account.',
    });
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  if (!isPasswordCorrect) {
    return res.status(401).json({
      status: 'fail',
      message: 'Incorrect password',
    });
  }

  const token = jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECURE || 'My super secure key',
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
    message: 'Login successful',
  });
});

const logoutUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  //  Clear the cookie by setting an empty value & expiration
  res.cookie('token', '', {
    httpOnly: true,
    secure: false,
    sameSite: 'strict',
    expires: new Date(0), // Expire immediately
  });

  return res.status(200).json({
    status: 'success',
    message: 'Logged out successfully',
  });
});
export { registerUser, loginUser, logoutUser };
