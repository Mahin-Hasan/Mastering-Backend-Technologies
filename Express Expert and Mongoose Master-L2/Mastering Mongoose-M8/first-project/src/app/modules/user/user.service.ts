import config from '../../config';
import { AcademicSemester } from '../academicSemester/academicSemester.model';
import { TStudent } from '../student/student.interface';
import { Student } from '../student/student.model';
import { TUser } from './user.interface';
import { User } from './user.model';
import { generateStudentId } from './user.utils';

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
    payload.id = newUser.id; //embedding Id
    payload.user = newUser._id; //referencing user _id to student.User

    const newStudent = await Student.create(payload);
    return newStudent;
  }
};

export const UserServices = {
  createStudentIntoDB,
};
