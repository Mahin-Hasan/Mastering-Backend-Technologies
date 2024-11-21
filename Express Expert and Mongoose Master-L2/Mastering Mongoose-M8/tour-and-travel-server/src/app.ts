import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import userRouter from './app/modules/user/user.router';
import tourRouter from './app/modules/tour/tour.router';
const app: Application = express();

//parsers
app.use(express.json());
app.use(cors());

app.use('/api/v1/user', userRouter);
app.use('/api/v1/tour', tourRouter);

app.get('/', (req: Request, res: Response) => {
  res.send({
    status: true,
    message: 'Server running 🔥',
  });
});

export default app;
