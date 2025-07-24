import type { FastifyInstance } from 'fastify';
import { $ref } from './product.schema';
import { $ref as $refReview } from '../review/review.schema';
import {
  createProductHandler,
  getProductsHandler,
  getProductByIdHandler,
  updateProductHandler,
  deleteProductHandler,
} from './product.controller';
import {
  createReviewHandler,
  getProductReviewsHandler,
  deleteReviewHandler,
} from '../review/review.controller';

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

  // Get all reviews for a product - GET /api/products/:id/reviews (public route with pagination)
  fastify.get(
    '/:id/reviews',
    {
      schema: {
        params: $refReview('productParamsSchema'),
        querystring: $refReview('reviewQuerySchema'),
        response: {
          200: $refReview('reviewListResponseSchema'),
        },
      },
    },
    getProductReviewsHandler
  );

  // Create review for a product - POST /api/products/:id/reviews (protected route)
  fastify.post(
    '/:id/reviews',
    {
      onRequest: [fastify.authenticate],
      schema: {
        params: $refReview('productParamsSchema'),
        body: $refReview('createReviewSchema'),
        response: {
          201: $refReview('reviewResponseSchema'),
        },
      },
    },
    createReviewHandler
  );

  // Delete review - DELETE /api/products/:product_id/reviews/:review_id (protected route, author only)
  fastify.delete(
    '/:product_id/reviews/:review_id',
    {
      onRequest: [fastify.authenticate],
      schema: {
        params: $refReview('deleteReviewParamsSchema'),
        response: {
          204: {},
        },
      },
    },
    deleteReviewHandler
  );
}

export default productRoutes;
