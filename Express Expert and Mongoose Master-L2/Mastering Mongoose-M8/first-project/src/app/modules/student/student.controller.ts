import { Request, Response } from 'express';
import { StudentServices } from './student.service';
import Joi from 'joi';
import studentValidationSchema from './student.validation';

//controller func for POST
const createStudent = async (req: Request, res: Response) => {
  // as we are handling async operation so it is better to use a try catch block
  try {
    // const student = req.body.student; // bz json file send as -> given in below

    //can also be written using destructuring and name aliasing
    const { student: studentData } = req.body;
    //validating using JOI
    const { error } = studentValidationSchema.validate(studentData);

    //will call service func to send this data
    const result = await StudentServices.createStudentIntoDB(studentData); // aliased name is passed
    //send response
    // console.log({value},{error});
    if (error) {
      res.status(500).json({
        success: false,
        message: 'Something went wrong',
        error: error.details, // can be written as only error as we are using es6
      });
    }

    // there are other method but we will follow this structure for sending data
    res.status(200).json({
      success: true,
      message: 'Student is created sucessfully',
      data: result,
    });
  } catch (err) {
    // if we want to see error in response
    res.status(500).json({
      success: false,
      message: 'Something went wrong',
      error: err,
    });
  }
};
//controller funch for GET all student
const getAllStudents = async (req: Request, res: Response) => {
  try {
    const result = await StudentServices.getAllStudentsFromDB();
    res.status(200).json({
      success: true,
      message: 'Students are retrived sucessfully',
      data: result,
    });
  } catch (error) {
    console.log(error);
  }
};
//controller for get single student
const getSingleStudent = async (req: Request, res: Response) => {
  try {
    //getting single student from stored id not mongoDb id
    //   const studentId = req.params.studentId //can be written as this remember studentId name shoulbe be same route file
    const { studentId } = req.params;
    const result = await StudentServices.getSingleStudentFromDB(studentId);
    res.status(200).json({
      success: true,
      message: 'Single student retrived sucessfully',
      data: result,
    });
  } catch (error) {
    console.log(error);
  }
};

export const StudentControllers = {
  createStudent,
  getAllStudents,
  getSingleStudent,
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
*/
