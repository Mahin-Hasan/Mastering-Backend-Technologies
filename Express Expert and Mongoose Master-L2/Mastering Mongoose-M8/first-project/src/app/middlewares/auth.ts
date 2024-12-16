//@ts-ignore
import httpStatus from 'http-status';
import { NextFunction, Request, Response } from 'express';
import catchAsync from '../utils/catchAsync';
import AppError from '../errors/AppError';

//creating a middleware for AUTH validation
const auth = () => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    //   console.log(req.headers.authorization); // this authorization is send from frontend as we don't have frontend we have to manually set headers is API DOG| NOTE: it becomes small letter
    //check if token exist
    const token = req.headers.authorization;
    if (!token) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized');
    }
    next();
  });
};

export default auth;
