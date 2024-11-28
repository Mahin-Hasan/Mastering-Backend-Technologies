//all account creation functionality will happen is User controller

import { NextFunction, Request, Response } from 'express';
import { UserServices } from './user.service';

const createStudent = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { password, student: studentData } = req.body;
    //data validation using zod
    //   const zodParsedData = studentValidatoinSchemaZod.parse(studentData);
    const result = await UserServices.createStudentIntoDB(
      password,
      studentData,
    );

    res.status(200).json({
      success: true,
      message: 'Student is created sucessfully',
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

export const UserControllers = {
  createStudent,
};
