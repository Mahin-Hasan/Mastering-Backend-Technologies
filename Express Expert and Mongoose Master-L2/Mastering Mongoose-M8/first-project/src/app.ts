// const express = require("express");
import express, { Application, NextFunction, Request, Response } from 'express';
import cors from 'cors';
import { StudentRoute } from './app/modules/student/student.route';
import { UserRoutes } from './app/modules/user/user.route';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import notFound from './app/middlewares/notFound';
import router from './app/routes';
import cookieParser from 'cookie-parser';

const app: Application = express();
// const port = 3000;

//parsers
app.use(express.json());
app.use(cookieParser());
app.use(cors({origin:['http://localhost:5173']}));

// Note: api calls studentroute->controller->service->database query
//applicatoin routes
// app.use('/api/v1/students', StudentRoute);
// app.use('/api/v1/users', UserRoutes);

// Refactoring routes
app.use('/api/v1', router);

//creating a route to test unhandled promise error
const test = async (req: Request, res: Response) => {
  Promise.reject();// intentionally creating error | will trigger unhandled rejection
};

app.get('/test', test); // gives error UnhandledPromiseRejection
app.get('/', (req: Request, res: Response) => {
  res.send('Hello Developer');
});
// const getAController = (req: Request, res: Response) => {
//   res.send('Hello Developer');
// }

// app.get('/', getAController); // will work same
// console.log(process.cwd());

//Declaring Global error handler
app.use(globalErrorHandler);
//Not Found -> if we want to give json error respose instead of HTML pattern
// @ts-ignore -> for overload function error
app.use(notFound);
export default app;
