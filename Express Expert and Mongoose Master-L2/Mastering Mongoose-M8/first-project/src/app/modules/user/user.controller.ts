//all account creation functionality will happen is User controller

import { NextFunction, Request, RequestHandler, Response } from 'express';
import { UserServices } from './user.service';
import sendResponse from '../../utils/sendResponse';
// @ts-ignore
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import AppError from '../../errors/AppError';

// const createStudent = async (
//   req: Request,
//   res: Response,
//   next: NextFunction,
// ) => {
//   try {
//     const { password, student: studentData } = req.body;
//     //data validation using zod
//     //   const zodParsedData = studentValidatoinSchemaZod.parse(studentData);
//     const result = await UserServices.createStudentIntoDB(
//       password,
//       studentData,
//     );

//     // res.status(200).json({
//     //   success: true,
//     //   message: 'Student is created sucessfully',
//     //   data: result,
//     // });
//     sendResponse(res, {
//       statusCode: httpStatus.OK,
//       success: true,
//       message: 'Student is created sucessfully',
//       data: result,
//     });
//   } catch (err) {
//     next(err);
//   }
// };
// using req handler
const createStudent: RequestHandler = catchAsync(async (req, res) => {
  const { password, student: studentData } = req.body;
  //data validation using zod
  //   const zodParsedData = studentValidatoinSchemaZod.parse(studentData);
  const result = await UserServices.createStudentIntoDB(password, studentData);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Student is created sucessfully',
    data: result,
  });
});

const createFaculty = catchAsync(async (req, res) => {
  const { password, faculty: facultyData } = req.body;

  const result = await UserServices.createFacultyIntoDB(password, facultyData);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Faculty is created succesfully',
    data: result,
  });
});

const createAdmin = catchAsync(async (req, res) => {
  const { password, admin: adminData } = req.body;
  const result = await UserServices.createAdminIntoDB(password, adminData);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Admin is created succesfully',
    data: result,
  });
});

const getMe = catchAsync(async (req, res) => {
  const token = req.headers.authorization;

  if (!token) {
    throw new AppError(httpStatus.NOT_FOUND, 'Token not found !');
  }

  // const { userId, role } = req.user;

  const result = await UserServices.getMe(token);
  // const result = await UserServices.getMe(userId, role);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User is retrieved succesfully',
    data: result,
  });
});


export const UserControllers = {
  createStudent,
  createFaculty,
  createAdmin,
  getMe
};
