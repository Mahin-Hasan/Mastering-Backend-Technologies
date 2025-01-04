import mongoose from 'mongoose';
import QueryBuilder from '../../builder/QueryBuilder';
import { CourseSearchableFields } from './course.constant';
import { TCourse, TCourseFaculty } from './course.interface';
import { Course, CourseFaculty } from './course.model';
import AppError from '../../errors/AppError';
//@ts-ignore
import httpStatus from 'http-status';

const createCourseIntoDB = async (payload: TCourse) => {
  const result = await Course.create(payload);
  return result;
};
const getAllCoursesFromDB = async (query: Record<string, unknown>) => {
  const courseQuery = new QueryBuilder(
    Course.find().populate('preRequisiteCourses.course'),
    query,
  )
    .search(CourseSearchableFields) //in course.constant.ts
    .filter()
    .sort()
    .paginate()
    .fields();
  const result = await courseQuery.modelQuery;
  const meta = await courseQuery.countTotal();
  return {
    meta,
    result,
  };};
const getSingleCourse = async (id: string) => {
  const result = await Course.findById(id).populate(
    'preRequisiteCourses.course',
  );
  return result;
};
const deleteCourseFromDB = async (id: string) => {
  const result = await Course.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  );
  return result;
};

const updateCourseIntoDB = async (id: string, payload: Partial<TCourse>) => {
  //update preRequisite
  const { preRequisiteCourses, ...courseRemainingData } = payload; // creating a copy so that it doesnot effect the main data

  //using transaction as multiple read write operation and performed in this update api
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    //step:1 Basic course info update

    const updatedBasicCourseInfo = await Course.findByIdAndUpdate(
      id,
      courseRemainingData,
      {
        new: true,
        runValidators: true,
        session,
      },
    );
    if (!updatedBasicCourseInfo) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to update course');
    }
    // check if there is any preRequisiteCourses | NOTE: preRequisiteCourses is an array | this update will effect multiple fields so we need to be careful

    if (preRequisiteCourses && preRequisiteCourses.length > 0) {
      // filter out the deleted fields
      const deletedPreRequisites = preRequisiteCourses
        .filter((el) => el.course && el.isDeleted)
        .map((el) => el.course); // will seperate items that has course with isDeleted property as true | i.e it seperates the courses that are needed to update
      // console.log(deletedPreRequisites); //[ { course: '675a115ddc5aa312744ef9ab', isDeleted: true } ] || without adding map
      // console.log(deletedPreRequisites); //['675a115ddc5aa312744ef9ab'] || with adding map
      const deletedPreRequisiteCourses = await Course.findByIdAndUpdate(
        id,
        {
          $pull: {
            preRequisiteCourses: { course: { $in: deletedPreRequisites } },
          },
        },
        {
          new: true,
          runValidators: true,
          session,
        },
      );
      if (!deletedPreRequisiteCourses) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Failed to update course');
      }
      // in collection if isDeleted is true then it will be deleted from array if isDeleted is false then it will be added to the array || I.e false = Add, true = remove
      //Filter out the new course fields
      const newPreRequisites = preRequisiteCourses?.filter(
        (el) => el.course && !el.isDeleted,
      );
      // console.log( newPreRequisites );// [ { course: '675a115ddc5aa312744ef9ab', isDeleted: false } ]

      const newPreRequisiteCourses = await Course.findByIdAndUpdate(
        id,
        {
          $addToSet: { preRequisiteCourses: { $each: newPreRequisites } }, // $addToSet allows us to update without creating a duplicate in the collection | $each to set every fields inside the preRequisiteCourses array
        },
        {
          new: true,
          runValidators: true,
          session,
        },
      );
      if (!newPreRequisiteCourses) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Failed to update course');
      }

      const result = await Course.findById(id).populate(
        'preRequisiteCourses.course',
      ); // retriving data of {updatedBasicCourseInfo,deletedPreRequisiteCourses,newPreRequisiteCourses}

      return result;
    }
    await session.commitTransaction();
    await session.endSession();
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to update course');
  }
};

const assignFacultiesWithCourseIntoDB = async (
  id: string,
  payload: Partial<TCourseFaculty>,
) => {
  const result = await CourseFaculty.findByIdAndUpdate(
    id,
    {
      course: id,
      $addToSet: { faculties: { $each: payload } }, //$addToSet to ensure newly created and is not dubplicate, each bz there can be multiple fields | faculties name of property where it will set
    },
    {
      upsert: true, // first time akta course er jonno akta faculty create korsi but 2nd time we will assign faculty to the already created course || I.e in same course multiple faculty can be assigned
      new: true, // get updated data
    },
  );
  return result;
};

const removeFacultiesFromCourseFromDB = async (
  id: string,
  payload: Partial<TCourseFaculty>,
) => {
  //INFO: Here payload is a passed id
  const result = await CourseFaculty.findByIdAndUpdate(
    id,
    {
      $pull: { faculties: { $in: payload } }, // pulling from faculties declared in model schema
    },
    {
      new: true, // get updated data
    },
  );
  return result;
};

export const CourseServices = {
  createCourseIntoDB,
  getAllCoursesFromDB,
  getSingleCourse,
  deleteCourseFromDB,
  updateCourseIntoDB,
  assignFacultiesWithCourseIntoDB,
  removeFacultiesFromCourseFromDB,
};
