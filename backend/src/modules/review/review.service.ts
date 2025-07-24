import { prisma } from '../../utils/prisma';
import type { CreateReviewInput } from './review.schema';

export interface Review {
  id: string;
  text: string;
  rating: number;
  userId: string;
  productId: string;
  author?: {
    firstname: string;
    lastname: string;
  };
  product?: {
    id: string;
    title: string;
    description: string;
    imageUrl: string | null;
    ownerId: string;
  };
  createdAt: Date;
}

export interface ReviewListResponse {
  reviews: Review[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export async function createReview(
  reviewData: CreateReviewInput,
  userId: string,
  productId: string
): Promise<Review> {
  // First verify that the user exists
  const userExists = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true }
  });

  if (!userExists) {
    throw new Error(`User with ID ${userId} does not exist`);
  }

  // Verify that the product exists and get owner info
  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: { id: true, ownerId: true }
  });

  if (!product) {
    throw new Error(`Product with ID ${productId} does not exist`);
  }

  // Check if user is trying to review their own product
  if (product.ownerId === userId) {
    throw new Error('Cannot review your own product');
  }

  const newReview = await prisma.review.create({
    data: {
      text: reviewData.text,
      rating: reviewData.rating,
      userId,
      productId,
    },
    include: {
      user: {
        select: {
          firstname: true,
          lastname: true,
        },
      },
      product: {
        select: {
          id: true,
          title: true,
          description: true,
          imageUrl: true,
          ownerId: true,
        },
      },
    },
  });

  // Transform the response to match our interface
  return {
    id: newReview.id,
    text: newReview.text,
    rating: newReview.rating,
    userId: newReview.userId,
    productId: newReview.productId,
    author: newReview.user,
    product: newReview.product,
    createdAt: newReview.createdAt,
  };
}

export async function findReviewsByProductId(
  productId: string,
  page: number = 1,
  limit: number = 10
): Promise<ReviewListResponse> {
  const skip = (page - 1) * limit;

  const [reviews, total] = await Promise.all([
    prisma.review.findMany({
      where: { productId },
      skip,
      take: limit,
      include: {
        user: {
          select: {
            firstname: true,
            lastname: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    }),
    prisma.review.count({
      where: { productId },
    }),
  ]);

  const totalPages = Math.ceil(total / limit);

  // Transform the response to match our interface
  const transformedReviews = reviews.map((review: any) => ({
    id: review.id,
    text: review.text,
    rating: review.rating,
    userId: review.userId,
    productId: review.productId,
    author: review.user,
    createdAt: review.createdAt,
  }));

  return {
    reviews: transformedReviews,
    total,
    page,
    limit,
    totalPages,
  };
}

export async function findReviewsByUserId(
  userId: string,
  page: number = 1,
  limit: number = 10
): Promise<ReviewListResponse> {
  const skip = (page - 1) * limit;

  const [reviews, total] = await Promise.all([
    prisma.review.findMany({
      where: { userId },
      skip,
      take: limit,
      include: {
        product: {
          select: {
            id: true,
            title: true,
            description: true,
            imageUrl: true,
            ownerId: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    }),
    prisma.review.count({
      where: { userId },
    }),
  ]);

  const totalPages = Math.ceil(total / limit);

  // Transform the response to match our interface
  const transformedReviews = reviews.map((review: any) => ({
    id: review.id,
    text: review.text,
    rating: review.rating,
    userId: review.userId,
    productId: review.productId,
    product: review.product,
    createdAt: review.createdAt,
  }));

  return {
    reviews: transformedReviews,
    total,
    page,
    limit,
    totalPages,
  };
}

export async function deleteReview(
  reviewId: string,
  userId: string
): Promise<boolean> {
  try {
    // First check if the review exists and belongs to the user
    const existingReview = await prisma.review.findFirst({
      where: {
        id: reviewId,
        userId,
      },
    });

    if (!existingReview) {
      return false;
    }

    // Delete the review
    await prisma.review.delete({
      where: { id: reviewId },
    });

    return true;
  } catch (error) {
    console.error('Error deleting review:', error);
    return false;
  }
}
