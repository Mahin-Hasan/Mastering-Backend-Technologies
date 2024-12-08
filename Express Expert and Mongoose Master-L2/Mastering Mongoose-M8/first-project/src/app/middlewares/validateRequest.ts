import { NextFunction, Request, Response } from "express";
import { AnyZodObject } from "zod";

//creating a middleware for validation -- 1st layer 
const validateRequest = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    //validation in route bz we dont want to send unnecessary data into controller
    //try catch if error occurs
    try {
      await schema.parseAsync({
        body: req.body,
      });

      next(); /// pass to controller or next middleware
    } catch (err) {
      next(err); // sending error to global error handler
    }
  };
};

export default validateRequest;
