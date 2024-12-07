import { z } from 'zod';

const createAcademicFacultyValidatoinSchema = z.object({
  name: z.string({
    invalid_type_error: 'Academic Faculty must be string',
  }),
});
const updateAcademicFacultyValidatoinSchema = z.object({
  name: z.string({
    invalid_type_error: 'Academic Faculty must be string',
  }),
});

export const AcademicFacultyValidations = {
  createAcademicFacultyValidatoinSchema,
  updateAcademicFacultyValidatoinSchema,
};
