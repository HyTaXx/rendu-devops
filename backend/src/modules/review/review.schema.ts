import { buildJsonSchemas } from 'fastify-zod';
import * as z from 'zod';

const reviewCore = {
  text: z
    .string({
      required_error: 'Review text is required',
      invalid_type_error: 'Review text must be a string',
    })
    .min(1, 'Review text must be at least 1 character long')
    .max(1000, 'Review text must be at most 1000 characters long'),
  rating: z
    .number({
      required_error: 'Rating is required',
      invalid_type_error: 'Rating must be a number',
    })
    .int('Rating must be an integer')
    .min(1, 'Rating must be at least 1')
    .max(5, 'Rating must be at most 5'),
};

const createReviewSchema = z.object({
  ...reviewCore,
});

const reviewResponseSchema = z.object({
  id: z.string(),
  text: z.string(),
  rating: z.number(),
  userId: z.string(),
  productId: z.string(),
  author: z.object({
    firstname: z.string(),
    lastname: z.string(),
  }).optional(),
  createdAt: z.string(),
});

const reviewListResponseSchema = z.object({
  reviews: z.array(reviewResponseSchema),
  total: z.number(),
  page: z.number(),
  limit: z.number(),
  totalPages: z.number(),
});

const reviewParamsSchema = z.object({
  id: z.string().min(1, 'Review ID is required'),
});

const productParamsSchema = z.object({
  id: z.string().min(1, 'Product ID is required'),
});

const deleteReviewParamsSchema = z.object({
  product_id: z.string().min(1, 'Product ID is required'),
  review_id: z.string().min(1, 'Review ID is required'),
});

const reviewQuerySchema = z.object({
  page: z.string().optional().default('1'),
  limit: z.string().optional().default('10'),
});

export type CreateReviewInput = z.infer<typeof createReviewSchema>;
export type ReviewParamsInput = z.infer<typeof reviewParamsSchema>;
export type ProductParamsInput = z.infer<typeof productParamsSchema>;
export type DeleteReviewParamsInput = z.infer<typeof deleteReviewParamsSchema>;
export type ReviewQueryInput = z.infer<typeof reviewQuerySchema>;

export const { schemas: reviewSchemas, $ref } = buildJsonSchemas(
  {
    createReviewSchema,
    reviewResponseSchema,
    reviewListResponseSchema,
    reviewParamsSchema,
    productParamsSchema,
    deleteReviewParamsSchema,
    reviewQuerySchema,
  },
  { $id: 'reviewSchemas' }
);
