import { Request, Response, NextFunction } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { Product } from '../models/productModel';
import { AppError } from '../utils/appError';
import mongoose from 'mongoose';

//- **GET /products** – Get all products

const getAllProducts = catchAsync(async (_req, res, next) => {
  const products = await Product.find();
  return res.status(200).json({
    status: 'success',
    length: products.length,
    data: {
      products,
    },
  });
});

//- **GET /products/{id}** – Get a single product
const getOneProduct = catchAsync(async (req: Request, res, next) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new AppError('Invalid product ID', 400));
  }

  const product = await Product.findById(id);
  if (!product) {
    return next(new AppError('No product with this id', 404));
  }

  return res.status(200).json({
    status: 'success',
    data: {
      product,
    },
  });
});
export { getAllProducts, getOneProduct };
