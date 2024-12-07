import { z } from 'zod';

//must maintain body structure as declared in validation
const createAcademicDepartmentValidatoinSchema = z.object({
  body: z.object({
    name: z.string({
      invalid_type_error: 'Academic Department must be string',
      required_error: 'Department Name is required',
    }),
    academicFaculty: z.string({
      invalid_type_error: 'Academic faculty must be string',
      required_error: 'faculty is required',
    }),
  }),
});

const updateAcademicDepartmentValidatoinSchema = z.object({
  body: z.object({
    name: z
      .string({
        invalid_type_error: 'Academic Department must be string',
        required_error: 'Department Name is required',
      })
      .optional(),
    academicFaculty: z
      .string({
        invalid_type_error: 'Academic faculty must be string',
        required_error: 'faculty is required',
      })
      .optional(),
  }),
});

export const AcademicDepartmentValidations = {
  createAcademicDepartmentValidatoinSchema,
  updateAcademicDepartmentValidatoinSchema,
};
