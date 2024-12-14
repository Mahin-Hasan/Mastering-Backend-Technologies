import { z } from 'zod';
import { Days } from './offeredCourse.constant';

// start time must be smaller than end time i.e 9-11 | both startTime and endTime are inside body so we can use refine in body
const createOfferedCourseValidationSchema = z.object({
  body: z
    .object({
      semesterRegistration: z.string(),
      academicFaculty: z.string(),
      academicDepartment: z.string(),
      course: z.string(),
      faculty: z.string(),
      section: z.number(),
      maxCapacity: z.number(),
      days: z.array(z.enum([...Days] as [string, ...string[]])), // must encapsulate inside array
      startTime: z.string().refine(
        (time) => {
          // console.log(time); // will show send time
          const regex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/; // 00-09 10-19 20-23 //regex to format time
          return regex.test(time);
        },
        {
          message: 'Invalid time format , expected "HH:MM" in 24 hours format',
        },
      ), // HH: MM   00-23: 00-59 | validation format
      endTime: z.string().refine(
        (time) => {
          // console.log(time); // will show send time
          const regex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/; // 00-09 10-19 20-23 //regex to format time
          return regex.test(time);
        },
        {
          message: 'Invalid time format , expected "HH:MM" in 24 hours format',
        },
      ),
    })
    .refine(
      (body) => {
        //only comparing with
        // startTime : 10:30  => 1970-01-01T10:30
        //endTime : 12:30  =>  1970-01-01T12:30

        const start = new Date(`1970-01-01T${body.startTime}:00`);
        const end = new Date(`1970-01-01T${body.endTime}:00`);

        return end > start;
      },
      {
        message: 'Start time should be before End time !  ',
      },
    ),
});
const updateOfferedCourseValidationSchema = z.object({
  body: z.object({
    faculty: z.string().optional(),
    maxCapacity: z.number().optional(),
    days: z.array(z.enum([...Days] as [string, ...string[]])).optional(),
    startTime: z.string().optional(), // HH: MM   00-23: 00-59
    endTime: z.string().optional(),
  }),
});

export const OfferedCourseValidations = {
  createOfferedCourseValidationSchema,
  updateOfferedCourseValidationSchema,
};
