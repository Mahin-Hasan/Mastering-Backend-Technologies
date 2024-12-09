import mongoose from 'mongoose';
import config from '../../config';
import { AcademicSemester } from '../academicSemester/academicSemester.model';
import { TStudent } from '../student/student.interface';
import { Student } from '../student/student.model';
import { TUser } from './user.interface';
import { User } from './user.model';
import { generateStudentId } from './user.utils';
import AppError from '../../errors/AppError';
//@ts-ignore
import httpStatus from 'http-status';

/* without transition and rollback
const createStudentIntoDB = async (password: string, payload: TStudent) => {
  //create a user object
  const userData: Partial<TUser> = {};

  //if password is not given, use default password
  //   if (!password) {
  //     user.password = config.default_password as string; // from env
  //   } else {
  //     user.password = password;
  //   }
  //if else short hand
  userData.password = password || (config.default_password as string); // password thakle password nibe naile config tekhe nibe

  //set student role
  userData.role = 'student';

  //Function to generate student Id automatically

  //find academic semester info that is stored in ref in student model but created using User model
  const admissionSemester = await AcademicSemester.findById(
    payload.admissionSemester,
  );

  //solving null error
  if (!admissionSemester) {
    throw new Error(
      `Academic semester with ID ${payload.admissionSemester} not found`,
    );
  }
  //set generated id manually
  // userData.id = '2030100001';
  userData.id = await generateStudentId(admissionSemester);
  //create a user
  const newUser = await User.create(userData); 

  //create a student
  if (Object.keys(newUser).length) {
    //obj.keys makes result as array and thus lenghth property can be used
    payload.id = newUser.id; //embedding generated Id 
    payload.user = newUser._id; //referencing user _id to student.User

    const newStudent = await Student.create(payload);
    return newStudent;
  }
};
*/

//in this create user we are writing 2 collection as the same time while creating user I.e User colleciton and student collection || we need to implement transition and rollback for smooth operation so that in database no inconsistancy do not appear || Transition and rollback follows ACID method read docs
//with transition and rollback
const createStudentIntoDB = async (password: string, payload: TStudent) => {
  //create a user object
  const userData: Partial<TUser> = {};

  userData.password = password || (config.default_password as string);

  //set student role
  userData.role = 'student';

  //Function to generate student Id automatically

  //find academic semester info that is stored in ref in student model but created using User model
  const admissionSemester = await AcademicSemester.findById(
    payload.admissionSemester,
  );

  //solving null error
  if (!admissionSemester) {
    throw new Error(
      `Academic semester with ID ${payload.admissionSemester} not found`,
    );
  }

  //transaction and rollback
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    // userData.id = '2030100001';
    userData.id = await generateStudentId(admissionSemester);
    //create a user (Transaction-1)
    const newUser = await User.create([userData], { session }); // must pass inside array || prev it newUser was Obj now it is Array

    if (!newUser.length) {
      // as newUser is object so .length will directly work
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create user');
    }

    //obj.keys makes result as array and thus lenghth property can be used
    payload.id = newUser[0].id; //embedding generated Id
    payload.user = newUser[0]._id; //referencing user _id to student.User

    //create a student (Transaction-2)

    const newStudent = await Student.create([payload], { session });
    if (!newStudent.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create Student');
    }

    //if code comes to this line it means our transection is successful
    await session.commitTransaction(); // save Transaction parmanently
    await session.endSession(); // ending session
    return newStudent;
  } catch (err) {
    await session.abortTransaction(); // in case error encounter then the session will rollback
    await session.endSession(); // ending session
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create Student'); // must throw error or else api will not give proper response
  }
};

export const UserServices = {
  createStudentIntoDB,
};
