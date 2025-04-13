import { Request, Response, NextFunction } from 'express';
import { catchAsync } from '../utils/catchAsync';
import jwt from 'jsonwebtoken';
import { Cart, ICartItem } from '../models/cartModel';
import { Product } from '../models/productModel';
import mongoose from 'mongoose';
import { AppError } from '../utils/appError';

/*
- **DELETE /cart/{id}** – Remove an item from cart
- **DELETE /cart/clear** – Clear all items from cart
*/
//- **GET /cart** – Get user cart
const getUserCart = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.token;
  const user_id = (jwt.verify(token as string, process.env.JWT_SECURE as string) as jwt.JwtPayload)
    .id;

  const userCart = await Cart.findOne({ user: user_id });

  res.status(200).json({
    status: 'success',
    data: {
      userCart,
    },
  });
});

//- **POST /cart** – Add an item to cart
const cartAddItem = catchAsync(async (req, res, next) => {
  const { item_id, quantity } = req.body;

  const token = req.cookies.token;
  const user_id = (jwt.verify(token as string, process.env.JWT_SECURE as string) as jwt.JwtPayload)
    .id;

  const itemProduct = await Product.findById(item_id);
  if (!itemProduct) {
    return next(new AppError('Product not found', 404));
  }

  // Validate the quantity (must be greater than 0)
  if (quantity <= 0) {
    return next(new AppError("Can't add nothing", 400));
  }

  let userCart = await Cart.findOne({ user: user_id });

  // If the user doesn't have a cart, create one
  if (!userCart) {
    userCart = await Cart.create({
      user: user_id,
      items: [],
      cart_price: 0,
    });
  }

  const existingItemIndex = userCart.items.findIndex((item) => item.product.toString() === item_id);

  if (existingItemIndex !== -1) {
    // If the item exists, update the quantity
    userCart.items[existingItemIndex].quantity += quantity;
    // Optionally, update the price if needed
    userCart.items[existingItemIndex].price = itemProduct.price;
  } else {
    // If it's a new item, push it to the cart
    userCart.items.push({
      product: item_id,
      quantity,
      price: itemProduct.price,
    });
  }

  // Recalculate cart price
  userCart.cart_price = userCart.items.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  await userCart.save();

  res.status(200).json({
    status: 'success',
    message: 'Item added to cart',
    data: userCart,
  });
});

//- **PUT /cart/{id}** – Update cart item quantity
const cartUpdateQuantity = catchAsync(async (req, res, next) => {
  const { quantity } = req.body;
  const item_id = req.params.id;
  const token = req.cookies.token;
  const user_id = (jwt.verify(token as string, process.env.JWT_SECURE as string) as jwt.JwtPayload)
    .id;

  // Validate the quantity (must be greater than 0)
  if (quantity <= 0) {
    return next(new AppError("Can't add nothing", 400));
  }

  let userCart = await Cart.findOne({ user: user_id });

  // If the user doesn't have a cart, create one
  if (!userCart) {
    userCart = await Cart.create({
      user: user_id,
      items: [],
      cart_price: 0,
    });
  }

  const existingItemIndex = userCart.items.findIndex((item) => item.product.toString() === item_id);

  if (existingItemIndex !== -1) {
    // If the item exists, update the quantity
    userCart.items[existingItemIndex].quantity = quantity;
    // Optionally, update the price if needed
  } else {
    return next(new AppError("Can't edit non existing product", 400));
  }

  // Recalculate cart price
  userCart.cart_price = userCart.items.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  await userCart.save();

  res.status(200).json({
    status: 'success',
    message: 'Item has been updated',
    data: userCart,
  });
});
export { getUserCart, cartAddItem, cartUpdateQuantity };
