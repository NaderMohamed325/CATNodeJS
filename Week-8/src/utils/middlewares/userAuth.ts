import { NextFunction, Response, Request } from 'express';
import { catchAsync } from '../catchAsync';
import jwt, { JwtPayload } from 'jsonwebtoken';

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

export { authenticate };
