import { prisma } from '../../utils/prisma';
import type { CreateProductInput, UpdateProductInput } from './product.schema';

export interface Product {
  id: string;
  title: string;
  description: string;
  imageUrl: string | null;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductListResponse {
  products: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export async function createProduct(
  productData: CreateProductInput,
  ownerId: string
): Promise<Product> {
  // First verify that the user exists
  const userExists = await prisma.user.findUnique({
    where: { id: ownerId },
    select: { id: true }
  });

  if (!userExists) {
    throw new Error(`User with ID ${ownerId} does not exist`);
  }

  const createData: any = {
    title: productData.title,
    description: productData.description,
    ownerId,
  };

  // Only add imageUrl if it's provided
  if (productData.imageUrl !== undefined) {
    createData.imageUrl = productData.imageUrl;
  }

  const newProduct = await prisma.product.create({
    data: createData,
  });

  return newProduct;
}

export async function findProducts(
  page: number = 1,
  limit: number = 10
): Promise<ProductListResponse> {
  const skip = (page - 1) * limit;

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      skip,
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
    }),
    prisma.product.count(),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    products,
    total,
    page,
    limit,
    totalPages,
  };
}

export async function findProductById(id: string): Promise<Product | null> {
  const product = await prisma.product.findUnique({
    where: { id },
  });

  return product;
}

export async function updateProduct(
  id: string,
  productData: UpdateProductInput,
  ownerId: string
): Promise<Product | null> {
  // First check if the product exists and belongs to the user
  const existingProduct = await prisma.product.findFirst({
    where: {
      id,
      ownerId,
    },
  });

  if (!existingProduct) {
    return null;
  }

  const updatedProduct = await prisma.product.update({
    where: { id },
    data: {
      ...(productData.title !== undefined && { title: productData.title }),
      ...(productData.description !== undefined && { description: productData.description }),
      ...(productData.imageUrl !== undefined && { imageUrl: productData.imageUrl }),
    },
  });

  return updatedProduct;
}

export async function deleteProduct(
  id: string,
  ownerId: string
): Promise<boolean> {
  try {
    // First check if the product exists and belongs to the user
    const existingProduct = await prisma.product.findFirst({
      where: {
        id,
        ownerId,
      },
    });

    if (!existingProduct) {
      return false;
    }

    // Delete the product (reviews will be deleted due to cascade)
    await prisma.product.delete({
      where: { id },
    });

    return true;
  } catch (error) {
    console.error('Error deleting product:', error);
    return false;
  }
}
