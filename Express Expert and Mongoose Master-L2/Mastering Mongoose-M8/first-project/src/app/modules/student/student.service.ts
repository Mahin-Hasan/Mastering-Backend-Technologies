import { Student } from './student.model';
import { TStudent } from './student.interface';
import mongoose from 'mongoose';
import AppError from '../../errors/AppError';
import { User } from '../user/user.model';
// @ts-ignore
import httpStatus from 'http-status';

/*refactoring to user service
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

  / add *

  return result;
};


*/

const getAllStudentsFromDB = async () => {
  const result = await Student.find()
    .populate('admissionSemester')
    .populate({
      path: 'academicDepartment',
      populate: {
        path: 'academicFaculty',
      },
    }); // nesting bz student refer department and dept refer faculty
  return result;
};

const getSingleStudentFromDB = async (id: string) => {
  // const result = await Student.findOne({ id }); // note: StudentModel name changed to Student

  //doing the same operation using aggregate pipe line
  // const result = await Student.aggregate([{ $match: { id: id } }]);

  //doing same operation using findbyId
  const result = await Student.findOne({ id }) // not using findById bz we are using out custom generated ID
    .populate('admissionSemester')
    .populate({
      path: 'academicDepartment',
      populate: {
        path: 'academicFaculty',
      },
    });
  return result;
};
//without transaction rollback
/*
const deleteStudentFromDB = async (id: string) => {
  const result = await Student.updateOne({ id }, { isDeleted: true }); // we will call update bz it will create an incostincy in database
  return result;
};
*/
//with transaction and rollback || using isDeleted property is available both in user and student model
const deleteStudentFromDB = async (id: string) => {
  const session = await mongoose.startSession();
  //add check id exist or not validation
  try {
    session.startTransaction();
    // we will call update bz it will create an incostincy in database || we will use findOneAndUpdate bz we are trying to perform delete operation in out custom created id | we can use findById if we use mongodb generated object id
    const deletedStudent = await Student.findOneAndUpdate(
      { id },
      { isDeleted: true },
      { new: true, session }, // in create we pass in array [] in update we pass in obj
    );
    if (!deletedStudent) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete student');
    }
    const deletedUser = await User.findOneAndUpdate(
      { id },
      { isDeleted: true },
      { new: true, session }, // in create we pass in array [] in update we pass in obj
    );
    if (!deletedUser) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete user');
    }

    await session.commitTransaction(); //save changes to DB
    await session.endSession();

    return deletedStudent;
  } catch (error) {
    await session.abortTransaction(); //abort changes to DB
    await session.endSession();
  }
};

//trying update
const updateStudentIntoDB = async (id: string, payload: Partial<TStudent>) => {
  // Check if the student exists
  const existingStudent = await Student.findOne({ id });
  if (!existingStudent) {
    throw new Error('Student not found');
  }

  // Update the student data
  const updatedStudent = await Student.findOneAndUpdate(
    { id },
    payload, // if PUT is used then we have to use $set
    { new: true }, // Return the updated document and validate the update
  );

  return updatedStudent;
};

export const StudentServices = {
  // createStudentIntoDB,
  getAllStudentsFromDB,
  getSingleStudentFromDB,
  deleteStudentFromDB,
  updateStudentIntoDB,
};
