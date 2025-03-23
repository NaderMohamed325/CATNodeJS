import { NextFunction, Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { User } from '../models/userModel';
import { AppError } from '../utils/appError';
import bcrypt from 'bcrypt';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { zodSchemaValidate } from '../utils/validation';
import { Product, productZodSchema } from '../models/productModel';

const getAllUsers = catchAsync(async (_req: Request, res: Response, _next: NextFunction) => {
  const users = await User.find({ role: 'user' }).select(['-role', '-password']);
  return res.status(200).json({
    status: 'success',
    length: users.length,
    data: {
      users,
    },
  });
});

const adminLogin = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.token;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECURE as string) as JwtPayload;
      if (decoded.role === 'admin') {
        return next(new AppError('You are already logged in', 400));
      }
      return next(new AppError('Invalid or expired token', 401));
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

  if (admin.role !== 'admin') {
    return next(new AppError('Access denied', 403));
  }

  const newToken = jwt.sign({ id: admin._id, role: 'admin' }, process.env.JWT_SECURE as string, {
    expiresIn: '1h',
  });

  res.cookie('token', newToken, {
    httpOnly: true,
    secure: false,
    sameSite: 'strict',
    maxAge: 60 * 60 * 1000,
  });

  res.status(200).json({
    status: 'success',
    message: 'Admin logged in successfully',
  });
});

const adminDeleteUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const userID = req.params.id;
  if (!userID) {
    return next(new AppError('Missing user ID', 400));
  }

  const userToDelete = await User.findById(userID);
  if (!userToDelete) {
    return next(new AppError('User not found', 404));
  }

  if (userToDelete.role !== 'user') {
    return next(new AppError('You can only delete users with the **user** role', 404));
  }

  await User.findByIdAndDelete(userID);

  return res.status(200).json({
    status: 'success',
    message: `User ${userID} has been deleted successfully`,
  });
});

const adminCreateProduct = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  /*
  title: string;
  description: string;
  category: Category;
  price: number;
*/
  const { title, description, category, price } = req.body;
  if (!title || !description || !category || !price) {
    return next(new AppError('Please Fill the product form', 400));
  }
  let product = { title, description, category, price };
  const schemaVlidation = zodSchemaValidate(product, productZodSchema, res);

  const Exist = await Product.findOne({title});
  if (Exist) {
    return next(new AppError('Product name must be unique', 404));
  }
  const newProduct = await Product.create(schemaVlidation);
  return res.status(201).json({
    status: 'success',
    message: `The product has been created with id --> ${newProduct._id} `,
  });
});

export { getAllUsers, adminLogin, adminDeleteUser, adminCreateProduct };
