import type { FastifyReply, FastifyRequest } from 'fastify';
import {
  createProduct,
  findProducts,
  findProductById,
  updateProduct,
  deleteProduct,
} from './product.service';
import type {
  CreateProductInput,
  UpdateProductInput,
  ProductParamsInput,
  ProductQueryInput,
} from './product.schema';

export async function createProductHandler(
  request: FastifyRequest<{
    Body: CreateProductInput;
  }>,
  reply: FastifyReply
) {
  try {
    const ownerId = request.user.id;
    const productData = request.body;

    console.log('Creating product with ownerId:', ownerId);
    console.log('Product data:', productData);

    const newProduct = await createProduct(productData, ownerId);

    reply.status(201).send(newProduct);
  } catch (error) {
    console.error('Error creating product:', error);
    
    // Handle user not found error
    if (error instanceof Error && error.message.includes('does not exist')) {
      return reply.status(400).send({
        message: 'Invalid user. Please ensure you are properly authenticated.',
        error: 'User not found'
      });
    }
    
    // Handle foreign key constraint violation specifically
    if (error instanceof Error && 'code' in error && error.code === 'P2003') {
      return reply.status(400).send({
        message: 'Invalid user. Please ensure you are properly authenticated.',
        error: 'Foreign key constraint violation'
      });
    }
    
    reply.status(500).send({
      message: 'Internal Server Error',
    });
  }
}

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

export async function updateProductHandler(
  request: FastifyRequest<{
    Params: ProductParamsInput;
    Body: UpdateProductInput;
  }>,
  reply: FastifyReply
) {
  try {
    const { id } = request.params;
    const ownerId = request.user.id;
    const productData = request.body;

    // Vérifier qu'au moins un champ est fourni pour la mise à jour
    if (
      productData.title === undefined && 
      productData.description === undefined && 
      productData.imageUrl === undefined
    ) {
      return reply.status(400).send({
        message: 'At least one field must be provided for update',
      });
    }

    const updatedProduct = await updateProduct(id, productData, ownerId);

    if (!updatedProduct) {
      return reply.status(404).send({
        message: 'Product not found or you are not authorized to update this product',
      });
    }

    reply.send(updatedProduct);
  } catch (error) {
    console.error('Error updating product:', error);
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
