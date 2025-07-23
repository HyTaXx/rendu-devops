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

const createUserSchema = z.object({
  ...userCore,
  password: z
    .string({
      required_error: 'Password is required',
      invalid_type_error: 'Password must be a string',
    })
    .min(8, 'Password must be at least 8 characters long'),
});

const createUserResponseSchema = z.object({
  id: z.string().uuid(),
  ...userCore,
});

const loginSchema = z.object({
  email: z
    .string({
      required_error: 'Email is required',
      invalid_type_error: 'Email must be a string',
    })
    .email(),
  password: z.string(),
});

const loginResponseSchema = z.object({
  accessToken: z.string(),
});

const loggedUserSchema = z.object({
  id: z.string().uuid(),
  ...userCore,
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type LoginInput = z.infer<typeof loginSchema>;

export const { schemas: userSchemas, $ref } = buildJsonSchemas(
  {
    createUserSchema,
    createUserResponseSchema,
    loginSchema,
    loginResponseSchema,
    loggedUserSchema,
  },
  {
    $id: 'UserSchemas',
  }
);
