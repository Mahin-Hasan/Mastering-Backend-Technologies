// const express = require("express");
import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import { StudentRoute } from './app/modules/student/student.route';
import { UserRoutes } from './app/modules/user/user.route';

const app: Application = express();
// const port = 3000;

//parsers
app.use(express.json());
app.use(cors());

// Note: api calls studentroute->controller->service->database query
//applicatoin routes
app.use('/api/v1/students', StudentRoute);
app.use('/api/v1/users', UserRoutes);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello Developer');
});
// const getAController = (req: Request, res: Response) => {
//   res.send('Hello Developer');
// }

// app.get('/', getAController); // will work same
// console.log(process.cwd());

export default app;
