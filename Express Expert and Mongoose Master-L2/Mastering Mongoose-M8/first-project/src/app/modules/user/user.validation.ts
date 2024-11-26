import { z } from 'zod';

const userValidatoinSchema = z.object({
  id: z.string(),
  password: z.string().max(20, 'Password can not be more than 20 character'),
  needsPasswordChange: z.boolean().optional().default(true),
  role: z.enum(['admin', 'student', 'faculty']),
  status: z.enum(['in-progress', 'blocked']).default('in-progress'),
  isDeleted: z.boolean().optional().default(false),
});

export const UserValidation = {
  userValidatoinSchema,
};
