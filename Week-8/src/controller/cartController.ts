import { Request, Response, NextFunction } from 'express';
import { catchAsync } from '../utils/catchAsync';
import jwt from 'jsonwebtoken';
import { Cart } from '../models/cartModel';
import { Product } from '../models/productModel';
import { AppError } from '../utils/appError';

// **GET /cart** – Get user cart
const getUserCart = catchAsync(async (req: Request, res: Response) => {
  const token = req.cookies.token;
  const user_id = (jwt.verify(token as string, process.env.JWT_SECURE as string) as jwt.JwtPayload)
    .id;

  const userCart = await Cart.findOne({ user: user_id });

  res.status(200).json({
    status: 'success',
    data: { userCart },
  });
});

// **POST /cart** – Add an item to cart
const cartAddItem = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { item_id, quantity } = req.body;

  const token = req.cookies.token;
  const user_id = (jwt.verify(token as string, process.env.JWT_SECURE as string) as jwt.JwtPayload)
    .id;

  const itemProduct = await Product.findById(item_id);
  if (!itemProduct) return next(new AppError('Product not found', 404));

  if (quantity <= 0) return next(new AppError('Quantity must be greater than 0', 400));

  let userCart = await Cart.findOne({ user: user_id });

  if (!userCart) {
    userCart = await Cart.create({ user: user_id, items: [], cart_price: 0 });
  }

  const existingItemIndex = userCart.items.findIndex((item) => item.product.toString() === item_id);

  if (existingItemIndex !== -1) {
    userCart.items[existingItemIndex].quantity += quantity;
    userCart.items[existingItemIndex].price = itemProduct.price;
  } else {
    userCart.items.push({ product: item_id, quantity, price: itemProduct.price });
  }

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

// **PUT /cart/{id}** – Update cart item quantity
const cartUpdateQuantity = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { quantity } = req.body;
  const item_id = req.params.id;
  const token = req.cookies.token;
  const user_id = (jwt.verify(token as string, process.env.JWT_SECURE as string) as jwt.JwtPayload)
    .id;

  if (quantity <= 0) return next(new AppError('Quantity must be greater than 0', 400));

  const userCart = await Cart.findOne({ user: user_id });
  if (!userCart) return next(new AppError('Cart not found', 404));

  const existingItemIndex = userCart.items.findIndex((item) => item.product.toString() === item_id);

  if (existingItemIndex === -1) return next(new AppError('Item not found in cart', 404));

  userCart.items[existingItemIndex].quantity = quantity;

  userCart.cart_price = userCart.items.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  await userCart.save();

  res.status(200).json({
    status: 'success',
    message: 'Item quantity updated',
    data: userCart,
  });
});

// **DELETE /cart/{id}** – Remove an item from cart
const cartDeleteItem = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const item_id = req.params.id;
  const token = req.cookies.token;
  const user_id = (jwt.verify(token as string, process.env.JWT_SECURE as string) as jwt.JwtPayload)
    .id;

  const userCart = await Cart.findOne({ user: user_id });
  if (!userCart) return next(new AppError('Cart not found', 404));

  const existingItemIndex = userCart.items.findIndex((item) => item.product.toString() === item_id);

  if (existingItemIndex === -1) return next(new AppError('Item not found in cart', 404));

  userCart.items.splice(existingItemIndex, 1);

  userCart.cart_price = userCart.items.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  await userCart.save();

  res.status(200).json({
    status: 'success',
    message: 'Item removed from cart',
    data: userCart,
  });
});

// **DELETE /cart/clear** – Clear all items from cart
const cartClear = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.token;
  const user_id = (jwt.verify(token as string, process.env.JWT_SECURE as string) as jwt.JwtPayload)
    .id;

  const userCart = await Cart.findOne({ user: user_id });

  if (!userCart) {
    return next(new AppError('Cart not found', 404));
  }

  if (userCart.items.length === 0) {
    return res.status(200).json({
      status: 'success',
      message: 'Cart is already empty',
      data: userCart,
    });
  }

  // Clear all items from the cart
  userCart.items = [];
  userCart.cart_price = 0;

  await userCart.save();

  res.status(200).json({
    status: 'success',
    message: 'Cart has been cleared',
    data: userCart,
  });
});

export { getUserCart, cartAddItem, cartUpdateQuantity, cartDeleteItem, cartClear };
