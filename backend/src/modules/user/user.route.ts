import type { FastifyInstance } from 'fastify';
import { $ref } from './user.schema';
import { getLoggedUserHandler } from './user.controller';

async function userRoutes(fastify: FastifyInstance) {
  // Get logged user - GET /api/users/me (protected route)
  fastify.get(
    '/me',
    {
      onRequest: [fastify.authenticate],
      schema: {
        response: {
          200: $ref('loggedUserSchema'),
        },
      },
    },
    getLoggedUserHandler
  );
}

export default userRoutes;