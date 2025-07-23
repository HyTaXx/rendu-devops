import type { FastifyReply, FastifyRequest } from 'fastify';
import type { RegisterInput, LoginInput } from './auth.schema';
import { registerUser, authenticateUser } from './auth.service';
import { ZodError } from 'zod';

// Helper function to format validation errors
function formatValidationErrors(error: ZodError): string[] {
  return error.errors.map(err => {
    if (err.path.length > 0) {
      const field = err.path.join('.');
      return `${field}: ${err.message}`;
    }
    return err.message;
  });
}

export async function registerHandler(
  request: FastifyRequest<{
    Body: RegisterInput;
  }>,
  reply: FastifyReply
): Promise<void> {
  const body = request.body;

  try {
    const user = await registerUser(body);
    reply.status(201).send(user);
  } catch (error) {
    console.error('Error registering user:', error);
    
    // Handle Zod validation errors
    if (error instanceof ZodError) {
      const validationErrors = formatValidationErrors(error);
      return reply.status(400).send({
        message: 'Validation failed',
        errors: validationErrors,
      });
    }
    
    if (error instanceof Error) {
      if (error.message === 'User with this email already exists') {
        return reply.status(409).send({
          message: error.message,
        });
      }
      
      if (error.message.startsWith('Password validation failed:')) {
        return reply.status(400).send({
          message: 'Password does not meet security requirements',
          details: error.message.replace('Password validation failed: ', '').split(', '),
        });
      }
    }

    reply.status(500).send({
      message: 'Internal Server Error',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

export async function loginHandler(
  request: FastifyRequest<{
    Body: LoginInput;
  }>,
  reply: FastifyReply
) {
  const body = request.body;

  try {
    const user = await authenticateUser(body.email, body.password);

    if (!user) {
      return reply.status(401).send({
        message: 'Invalid email or password',
      });
    }

    // Create JWT token
    const token = request.jwt.sign({
      id: user.id,
      email: user.email,
      firstname: user.firstname,
      lastname: user.lastname,
    });

    reply.status(200).send({
      accessToken: token,
    });
  } catch (error) {
    console.error('Error during login:', error);
    reply.status(500).send({
      message: 'Internal Server Error',
    });
  }
}
