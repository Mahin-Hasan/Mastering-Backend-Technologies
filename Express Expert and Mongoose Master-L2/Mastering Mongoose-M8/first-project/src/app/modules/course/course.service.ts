import QueryBuilder from '../../builder/QueryBuilder';
import { CourseSearchableFields } from './course.constant';
import { TCourse } from './course.interface';
import { Course } from './course.model';

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
  return result;
};
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

  //step:1 Basic course info update

  const updatedBasicCourseInfo = Course.findByIdAndUpdate(
    id,
    courseRemainingData,
    { new: true, runValidators: true },
  );

  // check if there is any preRequisiteCourses | NOTE: preRequisiteCourses is an array | this update will effect multiple fields so we need to be careful

  if (preRequisiteCourses && preRequisiteCourses.length > 0) {
    // filter out the deleted fields
    const deletedPreRequisites = preRequisiteCourses
      .filter((el) => el.course && el.isDeleted)
      .map((el) => el.course); // will seperate items that has course with isDeleted property as true | i.e it seperates the courses that are needed to update
    // console.log(deletedPreRequisites); //[ { course: '675a115ddc5aa312744ef9ab', isDeleted: true } ] || without adding map
    // console.log(deletedPreRequisites); //['675a115ddc5aa312744ef9ab'] || with adding map
    const deletedPreRequisiteCourses = await Course.findByIdAndUpdate(id, {
      $pull: { preRequisiteCourses: { course: { $in: deletedPreRequisites } } },
    });
  }

  return updatedBasicCourseInfo;
  //update rest
};

export const CourseServices = {
  createCourseIntoDB,
  getAllCoursesFromDB,
  getSingleCourse,
  deleteCourseFromDB,
  updateCourseIntoDB,
};
