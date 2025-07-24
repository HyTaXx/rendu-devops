import { httpClient } from "@/lib/http-client";
import type {
  Review,
  ReviewListResponse,
  CreateReviewData,
} from "@/types/review";

export const reviewService = {
  // Get reviews for a specific product
  getProductReviews: async (
    productId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<ReviewListResponse> => {
    const response = await httpClient.get(
      `/products/${productId}/reviews?page=${page}&limit=${limit}`
    );
    return response as unknown as ReviewListResponse;
  },

  // Create a new review for a product
  createReview: async (
    productId: string,
    reviewData: CreateReviewData
  ): Promise<Review> => {
    const response = await httpClient.post(
      `/products/${productId}/reviews`,
      reviewData
    );
    return response as unknown as Review;
  },

  // Delete a review
  deleteReview: async (productId: string, reviewId: string): Promise<void> => {
    await httpClient.delete(`/products/${productId}/reviews/${reviewId}`);
  },

  // Get user's own reviews
  getUserReviews: async (
    page: number = 1,
    limit: number = 10
  ): Promise<ReviewListResponse> => {
    const response = await httpClient.get(
      `/users/reviews?page=${page}&limit=${limit}`
    );
    return response as unknown as ReviewListResponse;
  },
};
