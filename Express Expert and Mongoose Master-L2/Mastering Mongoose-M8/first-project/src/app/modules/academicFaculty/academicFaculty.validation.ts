import { z } from 'zod';

//must maintain body structure as declared in validation
const createAcademicFacultyValidatoinSchema = z.object({
  body: z.object({
    name: z.string({
      invalid_type_error: 'Academic Faculty must be string',
    }),
  }),
});
const updateAcademicFacultyValidatoinSchema = z.object({
  body: z.object({
    name: z.string({
      invalid_type_error: 'Academic Faculty must be string',
    }),
  }),
});

export const AcademicFacultyValidations = {
  createAcademicFacultyValidatoinSchema,
  updateAcademicFacultyValidatoinSchema,
};
