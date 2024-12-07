import { z } from 'zod';

const AcademicFacultyValidatoinSchema = z.object({
  //   id: z.string(), auto generate
  name: z
    .string({
      invalid_type_error: 'Academic Faculty must be string',
    })
});

export const UserValidation = {
  AcademicFacultyValidatoinSchema,
};
