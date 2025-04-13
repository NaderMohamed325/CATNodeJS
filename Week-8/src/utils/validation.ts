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


export { zodSchemaValidate };
