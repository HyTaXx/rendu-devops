import { useState, useEffect, useCallback } from "react";
import { reviewService } from "@/services/review";
import type { Review, ReviewQueryParams } from "@/types/review";

// Hook pour récupérer les commentaires d'un produit
export function useProductReviews(
  productId: string,
  params?: ReviewQueryParams
) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<{
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  } | null>(null);

  const fetchReviews = useCallback(async () => {
    if (!productId) return;

    try {
      setLoading(true);
      setError(null);
      const response = await reviewService.getProductReviews(
        productId,
        params?.page,
        params?.limit
      );
      setReviews(response.reviews);
      setPagination({
        total: response.total,
        page: response.page,
        limit: response.limit,
        totalPages: response.totalPages,
      });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Erreur lors du chargement des commentaires"
      );
      console.error("Error fetching reviews:", err);
    } finally {
      setLoading(false);
    }
  }, [productId, params?.page, params?.limit]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  // Helper pour ajouter un nouveau commentaire
  const addReview = useCallback((newReview: Review) => {
    setReviews((prev) => [newReview, ...prev]);
    setPagination((prev) => (prev ? { ...prev, total: prev.total + 1 } : null));
  }, []);

  // Helper pour supprimer un commentaire
  const removeReview = useCallback((reviewId: string) => {
    setReviews((prev) => prev.filter((review) => review.id !== reviewId));
    setPagination((prev) => (prev ? { ...prev, total: prev.total - 1 } : null));
  }, []);

  return {
    reviews,
    loading,
    error,
    pagination,
    refetch: fetchReviews,
    addReview,
    removeReview,
  };
}

// Hook pour récupérer les commentaires d'un utilisateur
export function useUserReviews(params?: ReviewQueryParams) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<{
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  } | null>(null);

  const fetchReviews = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await reviewService.getUserReviews(
        params?.page,
        params?.limit
      );
      setReviews(response.reviews);
      setPagination({
        total: response.total,
        page: response.page,
        limit: response.limit,
        totalPages: response.totalPages,
      });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Erreur lors du chargement de vos commentaires"
      );
      console.error("Error fetching user reviews:", err);
    } finally {
      setLoading(false);
    }
  }, [params?.page, params?.limit]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  return {
    reviews,
    loading,
    error,
    pagination,
    refetch: fetchReviews,
  };
}
