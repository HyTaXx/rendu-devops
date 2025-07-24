import type { FastifyReply, FastifyRequest } from 'fastify';
import {
  createReview,
  findReviewsByProductId,
  findReviewsByUserId,
  deleteReview,
} from './review.service';
import type {
  CreateReviewInput,
  ReviewParamsInput,
  ProductParamsInput,
  DeleteReviewParamsInput,
  ReviewQueryInput,
} from './review.schema';

export async function createReviewHandler(
  request: FastifyRequest<{
    Params: ProductParamsInput;
    Body: CreateReviewInput;
  }>,
  reply: FastifyReply
) {
  try {
    const { id: productId } = request.params;
    const userId = request.user.id;
    const reviewData = request.body;

    console.log('Creating review for product:', productId, 'by user:', userId);

    const newReview = await createReview(reviewData, userId, productId);

    reply.status(201).send(newReview);
  } catch (error) {
    console.error('Error creating review:', error);
    
    // Handle user not found error
    if (error instanceof Error && error.message.includes('User with ID')) {
      return reply.status(400).send({
        message: 'Invalid user. Please ensure you are properly authenticated.',
        error: 'User not found'
      });
    }

    // Handle product not found error
    if (error instanceof Error && error.message.includes('Product with ID')) {
      return reply.status(404).send({
        message: 'Product not found.',
        error: 'Product not found'
      });
    }

    // Handle own product review error
    if (error instanceof Error && error.message.includes('Cannot review your own product')) {
      return reply.status(403).send({
        message: 'You cannot review your own product.',
        error: 'Forbidden'
      });
    }
    
    reply.status(500).send({
      message: 'Internal Server Error',
    });
  }
}

export async function getProductReviewsHandler(
  request: FastifyRequest<{
    Params: ProductParamsInput;
    Querystring: ReviewQueryInput;
  }>,
  reply: FastifyReply
) {
  try {
    const { id: productId } = request.params;
    const { page, limit } = request.query;
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);

    // Validation des paramètres
    if (pageNum < 1 || limitNum < 1 || limitNum > 100) {
      return reply.status(400).send({
        message: 'Invalid pagination parameters. Page must be >= 1 and limit must be between 1 and 100',
      });
    }

    const result = await findReviewsByProductId(productId, pageNum, limitNum);

    reply.send(result);
  } catch (error) {
    console.error('Error fetching product reviews:', error);
    reply.status(500).send({
      message: 'Internal Server Error',
    });
  }
}

export async function getUserReviewsHandler(
  request: FastifyRequest<{
    Querystring: ReviewQueryInput;
  }>,
  reply: FastifyReply
) {
  try {
    const userId = request.user.id;
    const { page, limit } = request.query;
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);

    // Validation des paramètres
    if (pageNum < 1 || limitNum < 1 || limitNum > 100) {
      return reply.status(400).send({
        message: 'Invalid pagination parameters. Page must be >= 1 and limit must be between 1 and 100',
      });
    }

    const result = await findReviewsByUserId(userId, pageNum, limitNum);

    reply.send(result);
  } catch (error) {
    console.error('Error fetching user reviews:', error);
    reply.status(500).send({
      message: 'Internal Server Error',
    });
  }
}

export async function deleteReviewHandler(
  request: FastifyRequest<{
    Params: DeleteReviewParamsInput;
  }>,
  reply: FastifyReply
) {
  try {
    const { review_id: reviewId } = request.params;
    const userId = request.user.id;

    const deleted = await deleteReview(reviewId, userId);

    if (!deleted) {
      return reply.status(404).send({
        message: 'Review not found or you are not authorized to delete this review',
      });
    }

    reply.status(204).send();
  } catch (error) {
    console.error('Error deleting review:', error);
    reply.status(500).send({
      message: 'Internal Server Error',
    });
  }
}
