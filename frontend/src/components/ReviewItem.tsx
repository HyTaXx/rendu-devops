import React, { useState } from "react";
import type { Review } from "@/types/review";
import { reviewService } from "@/services/review";
import StarRating from "./StarRating";
import { Button } from "@/components/ui/button";

interface ReviewItemProps {
  review: Review;
  currentUserId?: string;
  productId: string;
  onReviewDeleted: (reviewId: string) => void;
}

const ReviewItem: React.FC<ReviewItemProps> = ({
  review,
  currentUserId,
  productId,
  onReviewDeleted,
}) => {
  const [loading, setLoading] = useState(false);

  const canDelete = currentUserId === review.userId;

  const handleDelete = async () => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce commentaire ?"))
      return;

    try {
      setLoading(true);
      await reviewService.deleteReview(productId, review.id);
      onReviewDeleted(review.id);
    } catch (error) {
      console.error("Error deleting review:", error);
      alert("Erreur lors de la suppression du commentaire");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center space-x-2">
          <span className="font-medium text-gray-900">
            {review.author
              ? `${review.author.firstname} ${review.author.lastname}`
              : "Utilisateur anonyme"}
          </span>
          <span className="text-gray-500 text-sm">
            {new Date(review.createdAt).toLocaleDateString("fr-FR")}
          </span>
        </div>
        {canDelete && (
          <Button
            variant="destructive"
            size="sm"
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? "Suppression..." : "Supprimer"}
          </Button>
        )}
      </div>

      <div className="mb-2">
        <StarRating rating={review.rating} interactive={false} size="sm" />
      </div>

      <div>
        <p className="text-gray-700 whitespace-pre-wrap">{review.text}</p>
      </div>
    </div>
  );
};

export default ReviewItem;
