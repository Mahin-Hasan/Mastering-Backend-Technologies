import { z } from 'zod';

const userValidatoinSchema = z.object({
  //   id: z.string(), auto generate
  password: z
    .string({
      invalid_type_error: 'Password must be string',
    })
    .max(20, { message: 'Password can not be more than 20 character' })
    .optional(),
});

export const UserValidation = {
  userValidatoinSchema,
};
