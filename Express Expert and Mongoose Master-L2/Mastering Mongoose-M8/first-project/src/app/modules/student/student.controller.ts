import { Request, Response } from 'express';
import { StudentServices } from './student.service';

const createStudent = async (req: Request, res: Response) => {
  // as we are handling async operation so it is better to use a try catch block
  try {
    const student = req.body;

    //will call service func to send this data
    const result = await StudentServices.createStudentIntoDB(student);
    //send response

    // there are other method but we will follow this structure for sending data
    res.status(200).json({
      success: true,
      message: 'Student is created sucessfully',
      data: result,
    });
  } catch (error) {
    console.log(error);
  }
};

export const StudentControllers = {
    createStudent
}
//will be accessed from route