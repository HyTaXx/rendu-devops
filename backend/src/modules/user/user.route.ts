import type { FastifyInstance } from 'fastify';
import { $ref } from './user.schema';
import { $ref as $refReview } from '../review/review.schema';
import { getLoggedUserHandler, updateUserHandler, getUserCountHandler } from './user.controller';
import { getUserReviewsHandler } from '../review/review.controller';

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

  // Get user's reviews - GET /api/users/reviews (protected route)
  fastify.get(
    '/reviews',
    {
      onRequest: [fastify.authenticate],
      schema: {
        querystring: $refReview('reviewQuerySchema'),
        response: {
          200: $refReview('reviewListResponseSchema'),
        },
      },
    },
    getUserReviewsHandler
  );
}

export default userRoutes;