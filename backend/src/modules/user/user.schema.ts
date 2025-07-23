import { buildJsonSchemas } from 'fastify-zod';
import * as z from 'zod';

const userCore = {
  email: z
    .string({
      required_error: 'Email is required',
      invalid_type_error: 'Email must be a string',
    })
    .email('Please enter a valid email address'),
  firstname: z
    .string({
      required_error: 'First name is required',
      invalid_type_error: 'First name must be a string',
    })
    .min(1, 'First name must be at least 1 character long'),
  lastname: z
    .string({
      required_error: 'Last name is required',  
      invalid_type_error: 'Last name must be a string',
    })
    .min(1, 'Last name must be at least 1 character long'),
};

const loggedUserSchema = z.object({
  id: z.string().uuid(),
  ...userCore,
});

const updateUserSchema = z.object({
  firstname: z
    .string({
      invalid_type_error: 'First name must be a string',
    })
    .min(1, 'First name must be at least 1 character long')
    .optional(),
  lastname: z
    .string({
      invalid_type_error: 'Last name must be a string',
    })
    .min(1, 'Last name must be at least 1 character long')
    .optional(),
});

const userCountResponseSchema = z.object({
  count: z.number(),
});

export type UpdateUserInput = z.infer<typeof updateUserSchema>;

export const { schemas: userSchemas, $ref } = buildJsonSchemas(
  {
    loggedUserSchema,
    updateUserSchema,
    userCountResponseSchema,
  },
  {
    $id: 'UserSchemas',
  }
);
