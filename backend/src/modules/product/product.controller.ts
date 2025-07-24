import type { FastifyReply, FastifyRequest } from 'fastify';
import { uploadToS3 } from '../../utils/s3';
import {
  createProduct,
  findProducts,
  findProductById,
  updateProduct,
  deleteProduct,
} from './product.service';
import type { ProductQueryInput, ProductParamsInput } from './product.schema';

export async function getProductsHandler(
  request: FastifyRequest<{
    Querystring: ProductQueryInput;
  }>,
  reply: FastifyReply
) {
  try {
    const { page, limit } = request.query;
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);

    // Validation des paramètres
    if (pageNum < 1 || limitNum < 1 || limitNum > 100) {
      return reply.status(400).send({
        message: 'Invalid pagination parameters. Page must be >= 1 and limit must be between 1 and 100',
      });
    }

    const result = await findProducts(pageNum, limitNum);

    reply.send(result);
  } catch (error) {
    console.error('Error fetching products:', error);
    reply.status(500).send({
      message: 'Internal Server Error',
    });
  }
}

export async function getProductByIdHandler(
  request: FastifyRequest<{
    Params: ProductParamsInput;
  }>,
  reply: FastifyReply
) {
  try {
    const { id } = request.params;

    const product = await findProductById(id);

    if (!product) {
      return reply.status(404).send({
        message: 'Product not found',
      });
    }

    reply.send(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    reply.status(500).send({
      message: 'Internal Server Error',
    });
  }
}

export async function createProductHandler(request: any, reply: any) {
  try {
    const ownerId = request.user.id;
    let body: any = {};
    let imageUrl: string | undefined = undefined;

    if (request.isMultipart && request.isMultipart()) {
      const parts = request.parts();
      for await (const part of parts) {
        if (part.type === 'file' && part.fieldname === 'image') {
          const buffers = [];
          for await (const chunk of part.file) {
            buffers.push(chunk);
          }
          const fileBuffer = Buffer.concat(buffers);
          imageUrl = await uploadToS3(fileBuffer, part.filename, part.mimetype);
        } else if (part.type === 'field') {
          body[part.fieldname] = part.value;
        }
      }
    } else {
      body = request.body;
    }

    if (imageUrl) {
      body.imageUrl = imageUrl;
    }

    const newProduct = await createProduct(body, ownerId);
    reply.status(201).send(newProduct);
  } catch (error) {
    console.error('Error creating product:', error);
    reply.status(500).send({
      message: 'Internal Server Error',
    });
  }
}

export async function deleteProductHandler(
  request: FastifyRequest<{
    Params: ProductParamsInput;
  }>,
  reply: FastifyReply
) {
  try {
    const { id } = request.params;
    const ownerId = request.user.id;

    const deleted = await deleteProduct(id, ownerId);

    if (!deleted) {
      return reply.status(404).send({
        message: 'Product not found or you are not authorized to delete this product',
      });
    }

    reply.status(204).send();
  } catch (error) {
    console.error('Error deleting product:', error);
    reply.status(500).send({
      message: 'Internal Server Error',
    });
  }
}
