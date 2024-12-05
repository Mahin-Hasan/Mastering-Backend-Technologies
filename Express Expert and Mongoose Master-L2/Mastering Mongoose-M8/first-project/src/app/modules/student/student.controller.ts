import { NextFunction, Request, RequestHandler, Response } from 'express';
import { StudentServices } from './student.service';
// import Joi from 'joi';
// import studentValidationSchema from './student.joy.validation';
// import { z } from 'zod';
// import studentValidatoinSchemaZod from './student.validation'; // prev zod
import sendResponse from '../../utils/sendResponse';
// @ts-ignore
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import { studentValidatoins } from './student.validation';

//controller func for POST

/* NOTE: refactoriong code we will create this in user Controller
const createStudent = async (req: Request, res: Response) => {
  // as we are handling async operation so it is better to use a try catch block
  try {
    //creating a schema validation using ZOD
    const studentValidationSchema = z;
    // const student = req.body.student; // bz json file send as -> given in below

    //can also be written using destructuring and name aliasing
    const { student: studentData } = req.body;
    //data validation using zod
    const zodParsedData = studentValidatoinSchemaZod.parse(studentData);
    const result = await StudentServices.createStudentIntoDB(zodParsedData);

    //validating using JOI
    // const { error, value } = studentValidationSchema.validate(studentData); //validate warning will go if zod import is commented

    //will call service func to send this data
    // const result = await StudentServices.createStudentIntoDB(studentData); // aliased name is passed using regular system
    // const result = await StudentServices.createStudentIntoDB(value); //make sure to send validated data for joy

    //send response
    // console.log({value},{error});
    //below commented error sending operation is for joy validation
    // if (error) {
    //   res.status(500).json({
    //     success: false,
    //     message: 'Something went wrong',
    //     error: error.details, // can be written as only error as we are using es6
    //   });
    // }

    // there are other method but we will follow this structure for sending data
    res.status(200).json({
      success: true,
      message: 'Student is created sucessfully',
      data: result,
    });
  } catch (err: any) {
    // if we want to see error in response
    res.status(500).json({
      success: false,
      message: err.message || 'Something went wrong', // as used custom instance for checking user exist or not
      error: err,
    });
  }
};
*/
//creating catchAsync using higher order function
// const catchAsync = (fn: RequestHandler) => {
//   return (req: Request, res: Response, next: NextFunction) => {
//     Promise.resolve(fn(req, res, next)).catch((err) => next(err)); // while resolving promise if any error encounter arrives then we will throw it to the global error handler
//   };
// };

//controller funch for GET all student
const getAllStudents = catchAsync(async (req, res) => {
  const result = await StudentServices.getAllStudentsFromDB();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Students are retrived sucessfully',
    data: result,
  });
});

//controller for get single student
const getSingleStudent = catchAsync(async (req, res) => {
  //getting single student from stored id not mongoDb id
  //   const studentId = req.params.studentId //can be written as this remember studentId name should be same route file
  const { studentId } = req.params;
  const result = await StudentServices.getSingleStudentFromDB(studentId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Single student retrived sucessfully',
    data: result,
  });
});
//controller for deleting student
const deleteStudent: RequestHandler = catchAsync(async (req, res) => {
  const { studentId } = req.params;
  const result = await StudentServices.deleteStudentFromDB(studentId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Student is deleted sucessfully',
    data: result,
  });
});

//trying controller for update
//commenting update controller and fix error
/*
const updateStudent: RequestHandler = catchAsync(async (req, res) => {
  const { studentId } = req.params; // Extract student ID from route params
  const updateData = req.body; // Assume the updated fields are in the request body

  // Validate the updateData using Zod (optional)

  const parsedUpdateData = studentValidatoinSchemaZod // prevz zod
    .partial()
    .parse(updateData);

  // const parsedUpdateData = studentValidatoins.createStudentValidatoinSchemaZod
  //   .partial()
  //   .parse(updateData);

  // Call the service method to update the student
  const result = await StudentServices.updateStudentInDB(
    studentId,
    parsedUpdateData,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Student updated successfully',
    data: result,
  });
});
*/
export const StudentControllers = {
  // createStudent,
  getAllStudents,
  getSingleStudent,
  deleteStudent,
  // updateStudent,
};
//will be accessed from route

/*
// sent data as post JSON
{
  "student": {
    "id": "S12345",
    "name": {
      "firstName": "John",
      "middleName": "Michael",
      "lastName": "Doe"
    },
    "gender": "male",
    "dateOfBirth": "2000-05-15",
    "email": "john.doe@example.com",
    "contactNo": "1234567890",
    "emergencyContactNo": "0987654321",
    "bloodGroup": "O+",
    "presentAddress": "123 Main Street, Cityville",
    "permanentAddress": "456 Elm Street, Townsville",
    "guardian": {
      "fatherName": "Robert Doe",
      "fatherOccupation": "Engineer",
      "fatherContactNo": "1122334455",
      "motherName": "Mary Doe",
      "motherOccupation": "Teacher",
      "motherContactNo": "2233445566"
    },
    "localGuardian": {
      "name": "David Smith",
      "occupation": "Doctor",
      "contactNo": "3344556677",
      "address": "789 Oak Street, Suburbia"
    },
    "profileImg": "https://example.com/images/john_doe.jpg",
    "isActive": "active"
  }
}

// without catchAsync
const getSingleStudent: RequestHandler = async (req, res, next) => {
  try {
    //getting single student from stored id not mongoDb id
    //   const studentId = req.params.studentId //can be written as this remember studentId name shoulbe be same route file
    const { studentId } = req.params;
    const result = await StudentServices.getSingleStudentFromDB(studentId);
    // res.status(200).json({
    //   success: true,
    //   message: 'Single student retrived sucessfully',
    //   data: result,
    // });
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Single student retrived sucessfully',
      data: result,
    });
  } catch (err) {
    // res.status(500).json({
    //   success: false,
    //   message: err.message || 'Something went wrong',
    //   error: err,
    // });
    next(err);
  }
};
*/
