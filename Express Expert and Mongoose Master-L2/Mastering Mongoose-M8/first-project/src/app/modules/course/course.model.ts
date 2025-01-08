import { model, Schema } from 'mongoose';
import {
  TCourse,
  TCourseFaculty,
  TPreRequisiteCourses,
} from './course.interface';

// basic update and array update will take place in this course model
const preRequisiteCoursesSchema = new Schema<TPreRequisiteCourses>(
  {
    course: {
      type: Schema.Types.ObjectId,
      ref: 'Course', // ref with course model
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    _id: false, // must provide this or else it will create unncessary _id
  },
);

const courseSchema = new Schema<TCourse>(
  {
    title: {
      type: String,
      unique: true,
      trim: true,
      required: true,
    },
    prefix: {
      type: String,
      trim: true,
      required: true,
    },
    code: {
      type: Number,
      trim: true,
      required: true,
    },
    credits: {
      type: Number,
      trim: true,
      required: true,
    },
    preRequisiteCourses: [preRequisiteCoursesSchema], // array of sub schema || used to populate || accessed using preRequisiteCourses.course
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

export const Course = model<TCourse>('Course', courseSchema);

//Course faculty schema

const courseFacultySchema = new Schema<TCourseFaculty>({
  course: {
    type: Schema.Types.ObjectId,
    ref: 'Course', // ref with course model
    unique: true,
  },
  faculties: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Faculty',
    },
  ],
});
export const CourseFaculty = model<TCourseFaculty>(
  'CourseFaculty',
  courseFacultySchema,
);
