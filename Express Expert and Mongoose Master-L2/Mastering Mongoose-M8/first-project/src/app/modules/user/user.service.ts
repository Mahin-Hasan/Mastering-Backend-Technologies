import config from '../../config';
import { TStudent } from '../student/student.interface';
import { Student } from '../student/student.model';
import { TUser } from './user.interface';
import { User } from './user.model';

const createStudentIntoDB = async (password: string, studentData: TStudent) => {
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

  //set generated id manually
  userData.id = '2030100001';
  //create a user
  const newUser = await User.create(userData);

  //create a student
  if (Object.keys(newUser).length) {
    //obj.keys makes result as array and thus lenghth property can be used
    studentData.id = newUser.id; //embedding Id
    studentData.user = newUser._id; //referencing user _id to student.User

    const newStudent = await Student.create(studentData);
    return newStudent;
  }
};

export const UserServices = {
  createStudentIntoDB,
};
