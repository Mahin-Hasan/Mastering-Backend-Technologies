import { Student } from '../student.model';
import { TStudent } from './student.interface';

const createStudentIntoDB = async (studentData: TStudent) => {
  // const result = await StudentModel.create(student); // build in static method

  //calling out custom static || better to call before creating
  if (await Student.isUserExists(studentData.id)) {
    throw new Error('User already Exists');
  }
  const result = await Student.create(studentData); // as StudentModel changed to Student

  /*  
  const student = new Student(studentData); // create an instance

  //calling out custom instance | await must be used as we are using Query to find id
  if (await student.isUserExists(studentData.id)) {
    throw new Error('User already Exists');
  } //our created custom instance must be passed in model.ts
  const result = await student.save(); // build in instance method

  */

  return result;
};

const getAllStudentsFromDB = async () => {
  const result = await Student.find();
  return result;
};
const getSingleStudentFromDB = async (id: string) => {
  const result = await Student.findOne({ id });
  return result;
};

export const StudentServices = {
  createStudentIntoDB,
  getAllStudentsFromDB,
  getSingleStudentFromDB,
};
