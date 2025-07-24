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
  createdAt: string;
}

export interface ReviewListResponse {
  reviews: Review[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CreateReviewData {
  text: string;
  rating: number;
}

export interface ReviewQueryParams {
  page?: number;
  limit?: number;
}
