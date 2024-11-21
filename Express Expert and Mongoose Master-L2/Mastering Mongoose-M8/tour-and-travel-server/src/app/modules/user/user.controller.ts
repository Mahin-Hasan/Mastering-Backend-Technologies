// handling req and res

import { Request, Response } from 'express';
import { userService } from './user.service';

const createUser = async (req: Request, res: Response) => {
  try {
    const userData = req.body;

    const result = await userService.createUser(userData);

    res.json({
      success: true,
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
  try {
    const result = await userService.getUser();
    res.json({
      success: true,
      message: 'User retrived successfully',
      result,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Something went wrong',
      error: err,
    });
  }
};
const getSingleUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const result = await userService.getSingleUser(userId);
    res.send({
      success: true,
      message: 'User retrived successfully',
      result,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Something went wrong',
      error: err,
    });
  }
};
const updateUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const body = req.body;
    const result = await userService.updateUser(userId, body);
    res.send({
      success: true,
      message: 'User updated successfully',
      result,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Something went wrong',
      error: err,
    });
  }
};
const deleteUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    await userService.deleteUser(userId);
    res.send({
      success: true,
      message: 'User updated successfully',
      result: {},
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Something went wrong',
      error: err,
    });
  }
};

export const userController = {
  createUser,
  getUser,
  getSingleUser,
  updateUser,
  deleteUser,
};
