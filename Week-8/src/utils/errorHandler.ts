import { AppError } from './appError';

const errorHandler = (err: AppError, _req: any, res: any, _next: any) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // Remove token cookie only for authentication (401) and authorization (403) errors
  if (err.statusCode === 401 || err.statusCode === 403) {
    res.cookie('token', '', {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      expires: new Date(0), 
    });
  }

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};

export { errorHandler };
