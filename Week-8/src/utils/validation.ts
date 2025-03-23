import { z } from 'zod';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { catchAsync } from './catchAsync';

const zodSchemaValidate = (data: any, schema: z.ZodSchema, res: Response) => {
  const result = schema.safeParse(data);
  if (!result.success) {
    return res.status(400).json({ error: result.error.errors.map((err) => err.message) });
  }
  return result.data;
};

const authenticate = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.token;

  if (!token) {
    res.status(401).json({
      message: 'Unauthorized , missing token',
    });
  }
  const tokenStatus = jwt.verify(token as string, process.env.JWT_SECURE as string);
  console.log(tokenStatus);
  if (!tokenStatus) {
    return res.status(401).json({
      message: 'Unauthorized, invalid token',
    });
  }
  next();
});

export { zodSchemaValidate, authenticate };
