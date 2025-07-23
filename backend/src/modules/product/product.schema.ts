import { buildJsonSchemas } from 'fastify-zod';
import * as z from 'zod';

const productCore = {
  title: z
    .string({
      required_error: 'Title is required',
      invalid_type_error: 'Title must be a string',
    })
    .min(1, 'Title must be at least 1 character long')
    .max(255, 'Title must be at most 255 characters long'),
  description: z
    .string({
      required_error: 'Description is required',
      invalid_type_error: 'Description must be a string',
    })
    .min(1, 'Description must be at least 1 character long'),
  imageUrl: z
    .string()
    .url('Invalid URL format')
    .optional()
    .nullable(),
};

const createProductSchema = z.object({
  ...productCore,
});

const updateProductSchema = z.object({
  title: productCore.title.optional(),
  description: productCore.description.optional(),
  imageUrl: productCore.imageUrl,
});

const productResponseSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  imageUrl: z.string().nullable(),
  ownerId: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

const productListResponseSchema = z.object({
  products: z.array(productResponseSchema),
  total: z.number(),
  page: z.number(),
  limit: z.number(),
  totalPages: z.number(),
});

const productParamsSchema = z.object({
  id: z.string().min(1, 'Product ID is required'),
});

const productQuerySchema = z.object({
  page: z.string().optional().default('1'),
  limit: z.string().optional().default('10'),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type ProductParamsInput = z.infer<typeof productParamsSchema>;
export type ProductQueryInput = z.infer<typeof productQuerySchema>;

export const { schemas: productSchemas, $ref } = buildJsonSchemas(
  {
    createProductSchema,
    updateProductSchema,
    productResponseSchema,
    productListResponseSchema,
    productParamsSchema,
    productQuerySchema,
  },
  { $id: 'productSchemas' }
);
