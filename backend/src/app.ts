import fCookies from '@fastify/cookie';
import fCors from '@fastify/cors';
import fjwt from '@fastify/jwt';
import type { FastifyReply, FastifyRequest } from 'fastify';
import Fastify from 'fastify';

import type { UserPayload } from '../global';

import authRoutes from './modules/auth/auth.route';
import { authSchemas } from './modules/auth/auth.schema';
import userRoutes from './modules/user/user.route';
import { userSchemas } from './modules/user/user.schema';
import productRoutes from './modules/product/product.route';
import { productSchemas } from './modules/product/product.schema';
import { reviewSchemas } from './modules/review/review.schema';
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

fastify.register(fCookies, {
  secret: process.env.COOKIE_SECRET || 'your-cookie-secret',
  hook: 'preHandler',
});

fastify.addHook('preHandler', (req, res, next) => {
  req.jwt = fastify.jwt;
  return next();
});

fastify.decorate(
  'authenticate',
  async (request: FastifyRequest, reply: FastifyReply) => {
    // Debug logging
    console.log('Auth headers:', request.headers.authorization);
    
    // Check for Bearer token in Authorization header
    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('No Bearer token found in authorization header');
      return reply.status(401).send({
        message: 'Unauthorized - Bearer token required',
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    console.log('Extracted token:', token.substring(0, 20) + '...');

    try {
      const decoded = fastify.jwt.verify(token) as UserPayload;
      request.user = decoded;
      console.log('Token decoded successfully for user:', decoded.email);
    } catch (error) {
      console.log('Token verification failed:', error);
      return reply.status(401).send({
        message: 'Unauthorized - Invalid token',
      });
    }
  }
);

async function main() {
  // Register auth schemas
  for (const schema of Object.values(authSchemas)) {
    fastify.addSchema(schema);
  }

  // Register user schemas
  for (const schema of Object.values(userSchemas)) {
    fastify.addSchema(schema);
  }

  // Register product schemas
  for (const schema of Object.values(productSchemas)) {
    fastify.addSchema(schema);
  }

  // Register review schemas
  for (const schema of Object.values(reviewSchemas)) {
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
  fastify.register(authRoutes, { prefix: '/api/auth' });
  fastify.register(userRoutes, { prefix: '/api/users' });
  fastify.register(productRoutes, { prefix: '/api/products' });

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
