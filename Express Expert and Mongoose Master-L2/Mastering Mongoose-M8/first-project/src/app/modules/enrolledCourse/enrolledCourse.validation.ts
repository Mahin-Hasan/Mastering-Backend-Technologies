import { z } from 'zod';

const createEnrolledCourseValidationZodSchema = z.object({
  body: z.object({
    offeredCourse: z.string(), // from frontend only one data will come which is an id
  }),
});

const updateEnrolledCourseMarksValidationZodSchema = z.object({
  body: z.object({
    semesterRegistration: z.string(),
    offeredCourse: z.string(),
    student: z.string(),
    courseMarks: z.object({
      classTest1: z.number().optional(),
      midTerm: z.number().optional(),
      classTest2: z.number().optional(),
      finalTerm: z.number().optional(),
      // classTest1: z
      //   .number()
      //   .min(0, { message: 'classTest1 must be at least 0' })
      //   .max(10, { message: 'classTest1 cannot exceed 10' })
      //   .default(0),
      // midTerm: z
      //   .number()
      //   .min(0, { message: 'midTerm must be at least 0' })
      //   .max(30, { message: 'midTerm cannot exceed 30' })
      //   .default(0),
      // classTest2: z
      //   .number()
      //   .min(0, { message: 'classTest2 must be at least 0' })
      //   .max(10, { message: 'classTest2 cannot exceed 10' })
      //   .default(0),
      // finalTerm: z
      //   .number()
      //   .min(0, { message: 'finalTerm must be at least 0' })
      //   .max(50, { message: 'finalTerm cannot exceed 50' })
      //   .default(0),
    }),
  }),
});
export const EnrolledCourseValidations = {
  createEnrolledCourseValidationZodSchema,
  updateEnrolledCourseMarksValidationZodSchema,
};
