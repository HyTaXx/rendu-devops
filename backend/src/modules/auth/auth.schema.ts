import { buildJsonSchemas } from 'fastify-zod';
import * as z from 'zod';

const registerSchema = z.object({
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
  password: z
    .string({
      required_error: 'Password is required',
      invalid_type_error: 'Password must be a string',
    })
    .min(12, 'Password must be at least 12 characters long')
    .max(128, 'Password must not exceed 128 characters')
    .refine(
      (password) => /[a-z]/.test(password),
      'Password must contain at least one lowercase letter'
    )
    .refine(
      (password) => /[A-Z]/.test(password),
      'Password must contain at least one uppercase letter'
    )
    .refine(
      (password) => /[0-9]/.test(password),
      'Password must contain at least one number'
    )
    .refine(
      (password) => /[^a-zA-Z0-9]/.test(password),
      'Password must contain at least one special character (!@#$%^&*(),.?":{}|<>)'
    )
    .refine(
      (password) => !/(.)\1{2,}/.test(password),
      'Password must not contain more than 2 consecutive identical characters'
    )
    .refine(
      (password) => {
        // Check for common weak patterns
        const weakPatterns = [
          /123456/,
          /password/i,
          /qwerty/i,
          /admin/i,
          /letmein/i,
        ];
        return !weakPatterns.some(pattern => pattern.test(password));
      },
      'Password contains common weak patterns and is not allowed'
    ),
});

const loginSchema = z.object({
  email: z
    .string({
      required_error: 'Email is required',
      invalid_type_error: 'Email must be a string',
    })
    .email(),
  password: z.string({
    required_error: 'Password is required',
  }),
});

const registerResponseSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  firstname: z.string(),
  lastname: z.string(),
});

const loginResponseSchema = z.object({
  accessToken: z.string(),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;

export const { schemas: authSchemas, $ref } = buildJsonSchemas(
  {
    registerSchema,
    loginSchema,
    registerResponseSchema,
    loginResponseSchema,
  },
  {
    $id: 'AuthSchemas',
  }
);
