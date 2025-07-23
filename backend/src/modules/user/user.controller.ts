import type { FastifyReply, FastifyRequest } from 'fastify';

import type { CreateUserInput, LoginInput } from './user.schema';
import { createUser, findUserByEmail, findUserById } from './user.service';

export async function registerUserHandler(
  request: FastifyRequest<{
    Body: CreateUserInput;
  }>,
  reply: FastifyReply
): Promise<void> {
  const body = request.body;

  try {
    const user = await createUser(body);
    reply.status(201).send(user);
  } catch (error) {
    console.error('Error creating user:', error);
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
    const user = await findUserByEmail(body.email);

    if (!user) {
      return reply.status(401).send({
        message: 'Invalid email or password',
      });
    }

    // Here you would verify the password
    // For now, we'll just create a token
    const token = request.jwt.sign({
      id: user.id,
      email: user.email,
      firstname: user.firstname,
      lastname: user.lastname,
    });

    reply
      .setCookie('accessToken', token, {
        domain: process.env.COOKIE_DOMAIN || 'localhost',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      })
      .status(200)
      .send({
        accessToken: token,
      });
  } catch (error) {
    console.error('Error during login:', error);
    reply.status(500).send({
      message: 'Internal Server Error',
    });
  }
}

export async function getLoggedUserHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const userId = request.user.id;
    const user = await findUserById(userId);

    if (!user) {
      return reply.status(404).send({
        message: 'User not found',
      });
    }

    reply.send(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    reply.status(500).send({
      message: 'Internal Server Error',
    });
  }
}

export async function logoutHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    reply
      .clearCookie('accessToken', {
        domain: process.env.COOKIE_DOMAIN || 'localhost',
        path: '/',
      })
      .status(200)
      .send({
        message: 'Logged out successfully',
      });
  } catch (error) {
    console.error('Error during logout:', error);
    reply.status(500).send({
      message: 'Internal Server Error',
    });
  }
}
