import type { FastifyReply, FastifyRequest } from 'fastify';
import { findUserById } from './user.service';

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
