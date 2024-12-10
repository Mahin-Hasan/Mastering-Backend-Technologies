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
import { ZodError } from 'zod';
import { TErrorSources } from '../interface/error';
import config from '../config';
import handleZodError from '../errors/handleZodError';
import handleValidationError from '../errors/handleValidationError';
import handleCastError from '../errors/handleCastError';
import handleDuplicateError from '../errors/handleDuplicateError';
import AppError from '../errors/AppError';

// Used for handling errors that are encountered in Express application
const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  //setting default values
  let statusCode = 500;
  let message = 'Something went wrong!';

  let errorSources: TErrorSources = [
    {
      path: '',
      message: 'Something went wrong!',
    },
  ];

  //fixing zod error structure to our desired format and overriding if the error is zod error

  if (err instanceof ZodError) {
    // detect zod error
    // console.log('This is ZOD validation error');
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
  } else if (err?.name === 'ValidationError') {
    //detect mongoose error
    // console.log('This is mongoose validation error');

    const simplifiedError = handleValidationError(err);
    statusCode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
    errorSources = simplifiedError?.errorSources;
  } else if (err?.name === 'CastError') {
    //detect cast error
    // console.log('This is cast validation error');

    const simplifiedError = handleCastError(err);
    statusCode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
    errorSources = simplifiedError?.errorSources;
  } else if (err?.code === 11000) {
    //detect mongoose duplicate error when unique declared in model
    // console.log('This is dupli validation error');

    const simplifiedError = handleDuplicateError(err);
    statusCode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
    errorSources = simplifiedError?.errorSources;
  } else if (err instanceof AppError) {
    //detect class AppError
    // console.log('This is class error ex Error | AppError');

    statusCode = err?.statusCode;
    message = err?.message;
    errorSources = [
      {
        path: '',
        message: err?.message,
      },
    ];
  } else if (err instanceof Error) {
    //detect class Error
    // console.log('This is class error ex Error | AppError');
    // will get status code from default that is set in above
    message = err?.message;
    errorSources = [
      {
        path: '',
        message: err?.message,
      },
    ];
  }

  //remove return to solve error || final returned error message
  res.status(statusCode).json({
    success: false,
    message,
    errorSources,
    err,
    stack: config.NODE_ENV === 'development' ? err?.stack : null, // provide stack only in development || restart server
    // error: err,// we will not send error directly now, we will send it by formatting the error || this is mongoose error
  });
};

export default globalErrorHandler;
