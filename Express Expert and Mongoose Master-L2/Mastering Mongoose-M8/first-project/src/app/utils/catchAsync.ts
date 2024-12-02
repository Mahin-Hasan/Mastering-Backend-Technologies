import { NextFunction, Request, RequestHandler, Response } from 'express';

const catchAsync = (fn: RequestHandler) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch((err) => next(err)); // while resolving promise if any error encounter arrives then we will throw it to the global error handler
  };
};

export default catchAsync;
