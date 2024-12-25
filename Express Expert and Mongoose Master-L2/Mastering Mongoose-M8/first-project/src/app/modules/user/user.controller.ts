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
  // console.log(req.file);// to retrive uploaded item in create student form data
  // console.log(req.body);// to retrive data in create student form data | json.parse it is send as string format
  const { password, student: studentData } = req.body;
  //data validation using zod
  //   const zodParsedData = studentValidatoinSchemaZod.parse(studentData);
  const result = await UserServices.createStudentIntoDB(
    req.file,
    password,
    studentData,
  );
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
  // const token = req.headers.authorization;

  // if (!token) {
  //   throw new AppError(httpStatus.NOT_FOUND, 'Token not found !');
  // } this functionality is already done in auth.ts so for minimizing performance issue we will not verify token once again
  const { userId, role } = req.user;
  // console.log( userId, role );2030010005 student

  const result = await UserServices.getMe(userId, role);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User is retrieved succesfully',
    data: result,
  });
});

const changeStatus = catchAsync(async (req, res) => {
  const id = req.params.id;

  const result = await UserServices.changeStatus(id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Status is updated succesfully',
    data: result,
  });
});

export const UserControllers = {
  createStudent,
  createFaculty,
  createAdmin,
  getMe,
  changeStatus,
};
