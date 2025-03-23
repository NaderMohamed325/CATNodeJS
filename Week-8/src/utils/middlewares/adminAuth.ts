import { NextFunction, Response, Request } from 'express';
import { catchAsync } from '../catchAsync';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { AppError } from '../appError';

const adminAuth = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.token;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECURE as string) as JwtPayload;
      if (decoded.role === 'admin') {
        return next();
      }
      return next(new AppError('Invalid or expired token', 401));
    } catch (_) {
      return next(new AppError('Invalid or expired token', 401));
    }
  }

  return next(new AppError('Invalid or expired token', 401));
});

export { adminAuth };
