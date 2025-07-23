import type { FastifyInstance } from 'fastify';
import { $ref } from './product.schema';
import {
  createProductHandler,
  getProductsHandler,
  getProductByIdHandler,
  updateProductHandler,
  deleteProductHandler,
} from './product.controller';

async function productRoutes(fastify: FastifyInstance) {
  // Get all products - GET /api/products (public route with pagination)
  fastify.get(
    '/',
    {
      schema: {
        querystring: $ref('productQuerySchema'),
        response: {
          200: $ref('productListResponseSchema'),
        },
      },
    },
    getProductsHandler
  );

  // Create product - POST /api/products (protected route)
  fastify.post(
    '/',
    {
      onRequest: [fastify.authenticate],
      schema: {
        body: $ref('createProductSchema'),
        response: {
          201: $ref('productResponseSchema'),
        },
      },
    },
    createProductHandler
  );

  // Get product by ID - GET /api/products/:id (public route)
  fastify.get(
    '/:id',
    {
      schema: {
        params: $ref('productParamsSchema'),
        response: {
          200: $ref('productResponseSchema'),
        },
      },
    },
    getProductByIdHandler
  );

  // Update product - PUT /api/products/:id (protected route, owner only)
  fastify.put(
    '/:id',
    {
      onRequest: [fastify.authenticate],
      schema: {
        params: $ref('productParamsSchema'),
        body: $ref('updateProductSchema'),
        response: {
          200: $ref('productResponseSchema'),
        },
      },
    },
    updateProductHandler
  );

  // Delete product - DELETE /api/products/:id (protected route, owner only)
  fastify.delete(
    '/:id',
    {
      onRequest: [fastify.authenticate],
      schema: {
        params: $ref('productParamsSchema'),
        response: {
          204: {},
        },
      },
    },
    deleteProductHandler
  );
}

export default productRoutes;
