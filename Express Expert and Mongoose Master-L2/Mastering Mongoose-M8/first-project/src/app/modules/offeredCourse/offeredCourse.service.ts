//@ts-ignore
import httpStatus from 'http-status';
import { TOfferedCourse } from './offeredCourse.interface';
import { OfferedCourse } from './offeredCourse.model';
import { SemesterRegistration } from '../semesterRegistration/semesterRegistration.model';
import AppError from '../../errors/AppError';
import { AcademicFaculty } from '../academicFaculty/academicFaculty.model';
import { AcademicDepartment } from '../academicDepartment/academicDepartment.model';
import { Course } from '../course/course.model';
import { Faculty } from '../faculty/faculty.model';
import { hasTimeConflict } from './offeredCourse.utils';

const createOfferedCourseIntoDB = async (payload: TOfferedCourse) => {
  const {
    semesterRegistration,
    academicFaculty,
    academicDepartment,
    course,
    faculty,
    section,
    days,
    startTime,
    endTime,
  } = payload;
  // as we are not sending academicSemester from frontEnd we will need to check if the semester registration id isExist
  const isSemesterRegistrationExists =
    await SemesterRegistration.findById(semesterRegistration);
  if (!isSemesterRegistrationExists) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'Semester Registration not found !',
    );
  }
  //retriving asademicSemester from semesterRegistration as we are not send it from frontEnd
  const academicSemester = isSemesterRegistrationExists.academicSemester;
  //similarly checking academic faculty
  const isAcademicFacultyExists =
    await AcademicFaculty.findById(academicFaculty);
  if (!isAcademicFacultyExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Academic Faculty not found !');
  }
  //similarly checking academic Department
  const isAcademicDepartmentExists =
    await AcademicDepartment.findById(academicDepartment);
  if (!isAcademicDepartmentExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Academic Department not found !');
  }
  //similarly checking course
  const isCourseExists = await Course.findById(course);
  if (!isCourseExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Course not found !');
  }
  //similarly checking faculty
  const isFacultyExists = await Faculty.findById(faculty);
  if (!isFacultyExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Faculty not found !');
  }

  /*
  1. academic faculty er moddhe onek gula academin department thake | faculty of engineering -> CSE, EEE
  */
  // validation | check if created Academic faculty exist inside AcademicDepartment model || there must be a realtion between academicFaculty and AcademicDepartment
  // Check if the department belongs to the faculty

  const isDepartmentBelongToFaculty = await AcademicDepartment.findOne({
    _id: academicDepartment, // check academicDepartment matches with payload id
    academicFaculty,
  }); // matching both model id

  if (!isDepartmentBelongToFaculty) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `This ${isAcademicDepartmentExists.name} is not belong to this ${isAcademicFacultyExists.name}`,
    );
  }

  // check if the same offered course same section is in same regestered semester exists
  const isSameOfferedCourseExistsWithSameRegisteredSemesterWithSameSection =
    await OfferedCourse.findOne({
      semesterRegistration,
      course,
      section,
    });

  if (isSameOfferedCourseExistsWithSameRegisteredSemesterWithSameSection) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Offered course with same section is already exist!`,
    );
  }
  // resolving time confliction | i.e a faculty can not take same course in same time in two different section
  //step:1 get the schedules for the faculties
  const assignedSchedules = await OfferedCourse.find({
    semesterRegistration,
    faculty,
    days: { $in: days }, // frontend tekhe asha date
  }).select('days startTime endTime');
  console.log(assignedSchedules);
  /* {
    _id: new ObjectId('675dedc520e8a42554b9a738'),
    days: [Array],
    startTime: '10:00',
    endTime: '12:00'
  } */
  //step:2 check if send requested schedule conflict with previously added schedule || bz a same person can not be present in two different section in the same time
  const newSchedule = {
    days,
    startTime,
    endTime,
  };
  //check conflict running a loop
  if (hasTimeConflict(assignedSchedules, newSchedule)) {
    throw new AppError(
      httpStatus.CONFLICT,
      `This faculty is not available at that time ! choose other time or day`,
    );
  }

  // const result = await OfferedCourse.create({ ...payload, academicSemester }); // need to pass retrived academicSemester inside {}
  // return result;
  return null;
};

const getAllOfferedCoursesFromDB = async (query) => {};

const getSingleOfferedCourseFromDB = async (id: string) => {};

const updateOfferedCourseIntoDB = async (id: string, payload) => {};

const deleteOfferedCourseFromDB = async (id: string) => {};

export const OfferedCourseServices = {
  createOfferedCourseIntoDB,
  getAllOfferedCoursesFromDB,
  getSingleOfferedCourseFromDB,
  deleteOfferedCourseFromDB,
  updateOfferedCourseIntoDB,
};
