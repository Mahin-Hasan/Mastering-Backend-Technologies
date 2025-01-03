import AppError from '../../errors/AppError';
import { OfferedCourse } from '../offeredCourse/offeredCourse.model';
import { TEnrolledCourse } from './enrolledCourse.interface';
//@ts-ignore
import httpStatus from 'http-status';
import EnrolledCourse from './enrolledCourse.model';
import { Student } from '../student/student.model';
const createEnrolledCourseIntoDB = async (
  userId: string, // here userId is our custom generated student id
  payload: TEnrolledCourse,
) => {
  /*
step-1: Check if the offered courses is exist
step-2: student can only enroll if the max capacity is not zero
step-3: Check if the student is already enrolled
step-4: Create an enrolled course
*/

  //1
  const { offeredCourse } = payload;
  const isOfferedCourseExists = await OfferedCourse.findById(offeredCourse);

  if (!isOfferedCourseExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Offered Course not found');
  }
  //2
  if (isOfferedCourseExists.maxCapacity <= 0) {
    throw new AppError(httpStatus.BAD_GATEWAY, 'This section capacity is full');
  }

  //3
  const student = await Student.findOne({ id: userId }).select('id'); // using select cz we only need the id

  if (!student) {
    throw new AppError(httpStatus.NOT_FOUND, 'Student not found');
  }

  const isStudentAlreadyEnrolled = await EnrolledCourse.findOne({
    semesterRegistration: isOfferedCourseExists?.semesterRegistration,
    offeredCourse, // canbe writted directly as key and value is same
    student: student.id,
  });
  if (isStudentAlreadyEnrolled) {
    throw new AppError(httpStatus.CONFLICT, 'Studnet is already enrolled');
  }

  //3
};

export const EnrolledCourseService = {
  createEnrolledCourseIntoDB,
};
