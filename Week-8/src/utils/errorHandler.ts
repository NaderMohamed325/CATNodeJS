import { AppError } from './appError';

const errorHandler = (err: AppError, req: any, res: any, next: any) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  res.cookie('token', '', {
    httpOnly: true,
    secure: false,
    sameSite: 'strict',
    expires: new Date(0),
  });
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};

export { errorHandler };
