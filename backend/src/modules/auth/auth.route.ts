import type { FastifyInstance } from 'fastify';
import { $ref } from './auth.schema';
import {
  registerHandler,
  loginHandler,
} from './auth.controller';

async function authRoutes(fastify: FastifyInstance) {
  // Register route - POST /api/auth/register
  fastify.post(
    '/register',
    {
      schema: {
        body: $ref('registerSchema'),
        response: {
          201: $ref('registerResponseSchema'),
        },
      },
    },
    registerHandler
  );

  // Login route - POST /api/auth/login
  fastify.post(
    '/login',
    {
      schema: {
        body: $ref('loginSchema'),
        response: {
          200: $ref('loginResponseSchema'),
        },
      },
    },
    loginHandler
  );
}

export default authRoutes;
