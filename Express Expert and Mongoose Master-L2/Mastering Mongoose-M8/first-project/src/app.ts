// const express = require("express");
import express, { Application, Request, Response } from 'express';
import cors from 'cors';

const app: Application = express();
// const port = 3000;

//parsers
app.use(express.json());
app.use(cors());

// const getAController = (req: Request, res: Response) => {
//   res.send('Hello Developer');
// }

// app.get('/', getAController); // will work same
app.get('/', (req: Request, res: Response) => {
  res.send('Hello Developer');
});

// console.log(process.cwd());

export default app;
