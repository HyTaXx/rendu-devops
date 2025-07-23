import fCookies from '@fastify/cookie';
import fCors from '@fastify/cors';
import fjwt from '@fastify/jwt';
import type { FastifyReply, FastifyRequest } from 'fastify';
import Fastify from 'fastify';

import type { UserPayload } from '../global';

import userRoutes from './modules/user/user.route';
import { userSchemas } from './modules/user/user.schema';
const fastify = Fastify();

// Register CORS
fastify.register(fCors, {
  origin: process.env.CORS_ORIGINS?.split(',') || [
    'http://localhost:5173',
    'http://localhost:4173',
  ], // Frontend URL
  credentials: true, // Important for cookies
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
});

fastify.register(fjwt, {
  secret: process.env.JWT_SECRET || 'your-jwt-secret',
});

fastify.decorate(
  'authenticate',
  async (request: FastifyRequest, reply: FastifyReply) => {
    const token = request.cookies.accessToken;

    if (!token) {
      return reply.status(401).send({
        message: 'Unauthorized',
      });
    }

    const decoded = request.jwt.verify(token) as UserPayload;
    request.user = decoded;
  }
);

fastify.addHook('preHandler', (req, res, next) => {
  req.jwt = fastify.jwt;
  return next();
});

fastify.register(fCookies, {
  secret: process.env.COOKIE_SECRET || 'your-cookie-secret',
  hook: 'preHandler',
});

async function main() {
  // Register user schemas
  for (const schema of Object.values(userSchemas)) {
    fastify.addSchema(schema);
  }

  // Health check route
  fastify.get('/health', async (request, reply) => {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development'
    };
  });

  // Register routes
  fastify.register(userRoutes, { prefix: '/api/users' });

  // Add logging for debugging
  if (process.env.NODE_ENV !== 'production') {
    fastify.addHook('onRequest', (request, reply, done) => {
      fastify.log.debug(`Request: ${request.method} ${request.url}`);
      done();
    });
  }
  try {
    const port = parseInt(process.env.PORT || '3000', 10);
    const host = process.env.HOST || 'localhost';

    await fastify.listen({ port, host });
    if (process.env.NODE_ENV !== 'production') {
      console.log(`Server is running on http://${host}:${port}`);
      fastify.log.info(`Server is running on http://${host}:${port}`);
    }
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

main();
