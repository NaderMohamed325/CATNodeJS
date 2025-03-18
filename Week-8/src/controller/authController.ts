import { User, userZodSchema } from '../models/userModel';
import { catchAsync } from '../utils/catchAsync';
import { Request, Response, NextFunction } from 'express';
import { zodSchemaValidate } from '../utils/validation';
import jwt from 'jsonwebtoken';
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
  if (user) {
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECURE || 'My super secure key',
      { expiresIn: '1h' }
    );

    return res.status(200).json({
      token: token,
      message: 'Login successful',
    });
  } else {
    return res.status(400).json({
      status: 'fail',
      message: 'Please create account before login',
    });
  }
});
export { registerUser, loginUser };
