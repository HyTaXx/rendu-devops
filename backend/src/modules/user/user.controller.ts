import type { FastifyReply, FastifyRequest } from 'fastify';
import { findUserById, updateUser, getUserCount } from './user.service';
import type { UpdateUserInput } from './user.schema';

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

export async function updateUserHandler(
  request: FastifyRequest<{
    Body: UpdateUserInput;
  }>,
  reply: FastifyReply
) {
  try {
    const userId = request.user.id;
    const body = request.body;

    const updatedUser = await updateUser(userId, body);

    if (!updatedUser) {
      return reply.status(404).send({
        message: 'User not found',
      });
    }

    reply.send(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    reply.status(500).send({
      message: 'Internal Server Error',
    });
  }
}

export async function getUserCountHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const count = await getUserCount();

    reply.send({
      count,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error getting user count:', error);
    reply.status(500).send({
      message: 'Internal Server Error',
    });
  }
}
