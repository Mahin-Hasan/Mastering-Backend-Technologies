import { z } from 'zod';

const createEnrolledCourseValidationZodSchema = z.object({
  body: z.object({
    offeredCourse: z.string(), // from frontend only one data will come which is an id
  }),
});

export const EnrolledCourseValidations = {
  createEnrolledCourseValidationZodSchema,
};
