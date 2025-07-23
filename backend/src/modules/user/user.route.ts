import type { FastifyInstance } from 'fastify';
import { $ref } from './user.schema';
import { getLoggedUserHandler, updateUserHandler, getUserCountHandler } from './user.controller';

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

  // Update logged user - PUT /api/users/me (protected route)
  fastify.put(
    '/me',
    {
      onRequest: [fastify.authenticate],
      schema: {
        body: $ref('updateUserSchema'),
        response: {
          200: $ref('loggedUserSchema'),
        },
      },
    },
    updateUserHandler
  );

  // Get user count - GET /api/users/count (public route)
  fastify.get(
    '/count',
    {
      schema: {
        response: {
          200: $ref('userCountResponseSchema'),
        },
      },
    },
    getUserCountHandler
  );
}

export default userRoutes;