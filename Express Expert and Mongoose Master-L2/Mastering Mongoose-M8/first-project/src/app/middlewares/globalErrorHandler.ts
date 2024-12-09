//without error pattern
/*
import { NextFunction, Request, Response } from 'express';

const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Something went wrong!';
  //remove return to solve error
  res.status(statusCode).json({
    success: false,
    message,
    error: err,
  });
};

export default globalErrorHandler;
*/

//pattern for consistant error handling message

/*
success
message
errorSources:[
  path:''.
  message:''  
]
stack
*/
import { ErrorRequestHandler, NextFunction, Request, Response } from 'express';
import { ZodError, ZodIssue } from 'zod';
import { TErrorSource } from '../interface/error';
import config from '../config';

const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  //setting default values
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Something went wrong!';

  let errorSources: TErrorSource = [
    {
      path: '',
      message: 'Something went wrong!',
    },
  ];

  const handleZodError = (err: ZodError) => {
    //err.issues.map bz it is an array of object
    const errorSources: TErrorSource = err.issues.map((issue: ZodIssue) => {
      return {
        path: issue?.path[issue.path.length - 1], //geting last index
        message: issue?.message,
      };
    });

    const statusCode = 400;

    return {
      statusCode,
      message: 'Validation Error',
      errorSources,
    };
  };

  //fixing zod error structure to our desired format and overriding if the error is zod error

  if (err instanceof ZodError) {
    //zodError is a sub class || using instanceof we are checking is ZodError is a sub class or not || after detecting we will send it to handleZodError function
    const simplifiedError = handleZodError(err);
    statusCode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
    errorSources = simplifiedError?.errorSources;

    // console.log(simplifiedError);
    /*
    {
        statusCode: 400,
        message: 'ZOD Validation Error',
        errorSources: [ { path: 'name', message: 'Department Name is required' } ]
    }
    */
  }

  //remove return to solve error || final returned error message
  res.status(statusCode).json({
    success: false,
    message,
    errorSources,
    stack: config.NODE_ENV === 'development' ? err?.stack : null, // provide stack only in development || restart server
    // error: err,// we will not send error directly now, we will send it by formatting the error
  });
};

export default globalErrorHandler;
