type AsyncFunction = (...args: any[]) => Promise<any>;
import { Request,Response,NextFunction } from "express";
const catchAsync = (fn: AsyncFunction) => {
  return (req:Request , res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
};

export { catchAsync };
