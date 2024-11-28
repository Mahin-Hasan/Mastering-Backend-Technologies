import { Response } from 'express';

//defining type
type TResponse<T> = {
  statusCode: number;
  success: boolean;
  message?: string;
  data: T; //generic type bz we dont not whether we will get an array or obj or array of obj
};
const sendResponse = <T>(res: Response, data: TResponse<T>) => {
  res.status(data?.statusCode).json({
    success: data.success,
    message: data.message,
    data: data.data,
  });
};

export default sendResponse;
