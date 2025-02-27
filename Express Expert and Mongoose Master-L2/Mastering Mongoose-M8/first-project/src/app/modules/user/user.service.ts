import mongoose from 'mongoose';
import config from '../../config';
import { AcademicSemester } from '../academicSemester/academicSemester.model';
import { TStudent } from '../student/student.interface';
import { Student } from '../student/student.model';
import { TUser } from './user.interface';
import { User } from './user.model';
import {
  generateAdminId,
  generateFacultyId,
  generateStudentId,
} from './user.utils';
import AppError from '../../errors/AppError';
//@ts-ignore
import httpStatus from 'http-status';
import { Faculty } from '../faculty/faculty.model';
import { AcademicDepartment } from '../academicDepartment/academicDepartment.model';
import { TFaculty } from '../faculty/faculty.interface';
import { TAdmin } from '../admin/admin.interface';
import { Admin } from '../admin/admin.model';
import { verifyToken } from '../auth/auth.utils';
import { sendImageToCloudinary } from '../../utils/sendImageToCloudinary';

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
const createStudentIntoDB = async (
  file: any,
  password: string,
  payload: TStudent,
) => {
  //create a user object
  const userData: Partial<TUser> = {};

  userData.password = password || (config.default_password as string);

  //set student role
  userData.role = 'student';
  //set student email to user collection
  userData.email = payload.email;

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

  // find department
  const academicDepartment = await AcademicDepartment.findById(
    payload.academicDepartment,
  );

  if (!academicDepartment) {
    throw new AppError(400, 'Aademic department not found');
  }

  payload.academicFaculty = academicDepartment.academicFaculty; // no need extra validation as we are getting data from payload | payload er moddhe notun field add koro

  //transaction and rollback
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    // userData.id = '2030100001';
    userData.id = await generateStudentId(admissionSemester);

    //generate a custom image id as per user name
    //making image upload optional using if block
    if (file) {
      const imageName = `${userData.id}${payload?.name?.firstName}`; //ie customid and user name will be image name
      const path = file.path;
      //Calling cloudinary for storing image
      const profileImg = (await sendImageToCloudinary(imageName, path)) as {
        secure_url: string;
      }; // unknown error can be solved using record string unknown see module 21-3
      const { secure_url } = profileImg;
      payload.profileImg = secure_url; //referencing user _id to student.User
    }

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
  } catch (err: any) {
    await session.abortTransaction(); // in case error encounter then the session will rollback
    await session.endSession(); // ending session
    throw new Error(err);
  }
};

//create faculty
const createFacultyIntoDB = async (
  file: any,
  password: string,
  payload: TFaculty,
) => {
  // create a user object
  const userData: Partial<TUser> = {};

  //if password is not given , use deafult password
  userData.password = password || (config.default_password as string);

  //set role as faculty
  userData.role = 'faculty';
  //set faculty email to user collection
  userData.email = payload.email;
  // find academic department info
  const academicDepartment = await AcademicDepartment.findById(
    payload.academicDepartment,
  );

  if (!academicDepartment) {
    throw new AppError(400, 'Academic department not found');
  }
  //embedding academic faculty to db
  payload.academicFaculty = academicDepartment.academicFaculty;
  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    //set  generated id
    userData.id = await generateFacultyId();
    if (file) {
      const imageName = `${userData.id}${payload?.name?.firstName}`; //ie customid and user name will be image name
      const path = file.path;
      //Calling cloudinary for storing image
      const profileImg = (await sendImageToCloudinary(imageName, path)) as {
        secure_url: string;
      }; // unknown error can be solved using record string unknown see module 21-3
      const { secure_url } = profileImg;
      payload.profileImg = secure_url; //referencing user _id to student.User
    }
    // create a user (transaction-1)
    const newUser = await User.create([userData], { session }); // array

    //create a faculty
    if (!newUser.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create user');
    }
    // set id , _id as user
    payload.id = newUser[0].id;
    payload.user = newUser[0]._id; //reference _id

    // create a faculty (transaction-2)

    const newFaculty = await Faculty.create([payload], { session });

    if (!newFaculty.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create faculty');
    }

    await session.commitTransaction();
    await session.endSession();

    return newFaculty;
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err);
  }
};
//create Admin
const createAdminIntoDB = async (
  file: any,
  password: string,
  payload: TAdmin,
) => {
  //create a user object
  const userData: Partial<TUser> = {};

  // if password is not given , use default password
  userData.password = password || (config.default_password as string);

  //set role as admin
  userData.role = 'admin';
  //set admin email to user collection
  userData.email = payload.email;

  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    //set generated id
    userData.id = await generateAdminId();
    if (file) {
      const imageName = `${userData.id}${payload?.name?.firstName}`; //ie customid and user name will be image name
      const path = file.path;
      //Calling cloudinary for storing image
      const profileImg = (await sendImageToCloudinary(imageName, path)) as {
        secure_url: string;
      }; // unknown error can be solved using record string unknown see module 21-3
      const { secure_url } = profileImg;
      payload.profileImg = secure_url; //referencing user _id to student.User
    }
    //create a user | transaction-1
    const newUser = await User.create([userData], { session });

    //create a admin
    if (!newUser.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create Admin');
    }
    // set id, _id as user
    payload.id = newUser[0].id;
    payload.user = newUser[0]._id; // reference id of user

    //create a admin | transaction-2

    const newAdmin = await Admin.create([payload], { session });

    if (!newAdmin.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create Admin');
    }
    await session.commitTransaction();
    await session.endSession();

    return newAdmin;
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err);
  }
};

const getMe = async (userId: string, role: string) => {
  // const decoded = verifyToken(token, config.jwt_access_secret as string); // this verify token util func is decalred in auth.util.ts
  // const { userId, role } = decoded;

  // console.log('getMe', userId, role); //getMe 2030010005 student | after hitting get me route with student token | ie jar token tar id and role dibe

  let result = null;
  if (role === 'student') {
    result = await Student.findOne({ id: userId }).populate('user'); // findOne bz custom id
  }
  if (role === 'admin') {
    result = await Admin.findOne({ id: userId }).populate('user');
  }

  if (role === 'faculty') {
    result = await Faculty.findOne({ id: userId }).populate('user');
  }

  return result;
};

const changeStatus = async (id: string, payload: { status: string }) => {
  const result = await User.findByIdAndUpdate(id, payload, {
    new: true,
  });
  return result;
};
export const UserServices = {
  createStudentIntoDB,
  createFacultyIntoDB,
  createAdminIntoDB,
  getMe,
  changeStatus,
};
