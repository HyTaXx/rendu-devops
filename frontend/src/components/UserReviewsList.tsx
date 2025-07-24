import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { reviewService } from "@/services/review";
import type { Review, ReviewListResponse } from "@/types/review";
import StarRating from "./StarRating";

const UserReviewsList: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0,
  });

  const loadUserReviews = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data: ReviewListResponse = await reviewService.getUserReviews(
        pagination.page
      );

      if (data && data.reviews) {
        setReviews(data.reviews);
        setPagination({
          page: data.page,
          totalPages: data.totalPages,
          total: data.total,
        });
      } else {
        setReviews([]);
        setPagination({ page: 1, totalPages: 1, total: 0 });
      }
    } catch (err) {
      setError("Erreur lors du chargement de vos commentaires");
      console.error("Error loading user reviews:", err);
      setReviews([]);
      setPagination({ page: 1, totalPages: 1, total: 0 });
    } finally {
      setLoading(false);
    }
  }, [pagination.page]);

  useEffect(() => {
    loadUserReviews();
  }, [loadUserReviews]);

  const handlePageChange = (newPage: number) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  if (loading && pagination.page === 1) {
    return (
      <div className="text-center py-8">
        <p>Chargement de vos commentaires...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-4">{error}</p>
        <Button variant="outline" size="sm" onClick={loadUserReviews}>
          Réessayer
        </Button>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mb-4">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Aucun commentaire
        </h3>
        <p className="text-gray-600 mb-4">
          Vous n'avez pas encore laissé de commentaire sur des produits
        </p>
        <Button asChild>
          <Link to="/products">Découvrir les produits</Link>
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="space-y-4 mb-6">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm"
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <h4 className="font-medium text-gray-900 mb-1">
                  {review.product
                    ? `Commentaire sur ${review.product.title}`
                    : "Commentaire sur un produit"}
                </h4>
                <StarRating
                  rating={review.rating}
                  interactive={false}
                  size="sm"
                />
              </div>
              <span className="text-sm text-gray-500">
                {new Date(review.createdAt).toLocaleDateString("fr-FR")}
              </span>
            </div>

            <p className="text-gray-700 mb-3 whitespace-pre-wrap">
              {review.text}
            </p>

            <div className="pt-3 border-t border-gray-100">
              <div className="flex justify-end">
                <Button variant="outline" size="sm" asChild>
                  <Link to={`/product/${review.productId}`}>
                    Voir le produit
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(pagination.page - 1)}
            disabled={pagination.page === 1 || loading}
          >
            Précédent
          </Button>
          <span className="flex items-center px-3 text-sm text-gray-600">
            Page {pagination.page} sur {pagination.totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(pagination.page + 1)}
            disabled={pagination.page === pagination.totalPages || loading}
          >
            Suivant
          </Button>
        </div>
      )}
    </div>
  );
};

export default UserReviewsList;
