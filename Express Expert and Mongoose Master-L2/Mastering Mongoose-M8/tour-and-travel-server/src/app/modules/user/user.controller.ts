// handling req and res

import { Request, Response } from 'express';
import User from './user.model';

const createUser = async (req: Request, res: Response) => {
  try {
    const userData = req.body;
    const result = await User.create(userData);

    res.json({
      message: 'User created successfully',
      data: result,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Something went wrong',
      error: err,
    });
  }
};

const getUser = async (req: Request, res: Response) => {
  const userData = req.body;
  const result = await User.create(userData);

  res.json({
    message: 'User created successfully',
    data: result,
  });
};

export const userController = {
  createUser,
  getUser,
};
