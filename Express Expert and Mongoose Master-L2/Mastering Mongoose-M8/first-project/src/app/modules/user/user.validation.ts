import { z } from 'zod';
import { UserStatus } from './user.constant';

const userValidatoinSchema = z.object({
  //   id: z.string(), auto generate
  password: z
    .string({
      invalid_type_error: 'Password must be string',
    })
    .max(20, { message: 'Password can not be more than 20 character' })
    .optional(),
});

const changeStatusValidationSchema = z.object({
  body: z.object({
    status: z.enum([...UserStatus] as [string, ...string[]]), // spread operator to maintain the structure
  }),
});

export const UserValidation = {
  userValidatoinSchema,
  changeStatusValidationSchema
};
