import React, { useState, useEffect, useCallback } from "react";
import type { Review, ReviewListResponse } from "@/types/review";
import { reviewService } from "@/services/review";
import { useAuth } from "@/hooks/useAuth";
import ReviewItem from "./ReviewItem";
import AddReviewForm from "./AddReviewForm";
import { Button } from "@/components/ui/button";

interface ReviewListProps {
  productId: string;
  productOwnerId: string;
}

const ReviewList: React.FC<ReviewListProps> = ({
  productId,
  productOwnerId,
}) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0,
  });
  const { user } = useAuth();

  const loadReviews = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data: ReviewListResponse = await reviewService.getProductReviews(
        productId,
        pagination.page
      );

      // Vérifier que data existe et a la structure attendue
      if (data && data.reviews) {
        setReviews(data.reviews);
        setPagination({
          page: data.page,
          totalPages: data.totalPages,
          total: data.total,
        });
      } else {
        setReviews([]);
        setPagination({
          page: 1,
          totalPages: 1,
          total: 0,
        });
      }
    } catch (err) {
      setError("Erreur lors du chargement des commentaires");
      console.error("Error loading reviews:", err);
      setReviews([]);
      setPagination({
        page: 1,
        totalPages: 1,
        total: 0,
      });
    } finally {
      setLoading(false);
    }
  }, [productId, pagination.page]);

  useEffect(() => {
    loadReviews();
  }, [loadReviews]);

  const handleReviewAdded = (newReview: Review) => {
    setReviews((prev) => [newReview, ...prev]);
    setPagination((prev) => ({ ...prev, total: prev.total + 1 }));
    setShowAddForm(false);
  };

  const handleReviewDeleted = (reviewId: string) => {
    setReviews((prev) => prev.filter((review) => review.id !== reviewId));
    setPagination((prev) => ({ ...prev, total: prev.total - 1 }));
  };

  const handlePageChange = (newPage: number) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  const canAddReview = user && user.id !== productOwnerId;
  const userHasReviewed =
    user && user.id && reviews.some((review) => review.userId === user.id);

  if (loading && pagination.page === 1) {
    return (
      <div className="text-center py-4">Chargement des commentaires...</div>
    );
  }

  return (
    <div className="mt-8 pt-6 border-t">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">
          Commentaires ({pagination.total})
        </h2>
        {canAddReview && !userHasReviewed && (
          <Button
            onClick={() => setShowAddForm(!showAddForm)}
            variant={showAddForm ? "outline" : "default"}
          >
            {showAddForm ? "Annuler" : "Ajouter un commentaire"}
          </Button>
        )}
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {showAddForm && (
        <div className="mb-6">
          <AddReviewForm
            productId={productId}
            onReviewAdded={handleReviewAdded}
            onCancel={() => setShowAddForm(false)}
          />
        </div>
      )}

      {!canAddReview && user && user.id === productOwnerId && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 text-blue-800 rounded">
          <p className="text-sm">
            Vous ne pouvez pas commenter votre propre produit.
          </p>
        </div>
      )}

      {!user && (
        <div className="mb-6 p-4 bg-gray-50 border border-gray-200 text-gray-700 rounded">
          <p className="text-sm">
            Connectez-vous pour pouvoir commenter ce produit.
          </p>
        </div>
      )}

      {userHasReviewed && canAddReview && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-800 rounded">
          <p className="text-sm">Vous avez déjà commenté ce produit.</p>
        </div>
      )}

      {reviews.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">Aucun commentaire pour le moment.</p>
          {canAddReview && !userHasReviewed && (
            <p className="text-sm text-gray-400 mt-2">
              Soyez le premier à commenter ce produit !
            </p>
          )}
        </div>
      ) : (
        <>
          <div className="space-y-4 mb-6">
            {reviews.map((review) => (
              <ReviewItem
                key={review.id}
                review={review}
                currentUserId={user?.id}
                productId={productId}
                onReviewDeleted={handleReviewDeleted}
              />
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
        </>
      )}
    </div>
  );
};

export default ReviewList;
