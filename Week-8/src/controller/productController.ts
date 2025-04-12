import { Request, Response, NextFunction } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { Product } from '../models/productModel';

//- **GET /products** – Get all products

const getAllProducts = catchAsync(async (req, res, next) => {
  const products = await Product.find();
  res.status(200).json({
    status: 'success',
    length: products.length,
    data: {
      products,
    },
  });
});

export { getAllProducts };
