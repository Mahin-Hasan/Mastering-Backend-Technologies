//all account creation functionality will happen is User controller

import { NextFunction, Request, RequestHandler, Response } from 'express';
import { UserServices } from './user.service';
import sendResponse from '../../utils/sendResponse';
// @ts-ignore
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';

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

export const UserControllers = {
  createStudent,
};
