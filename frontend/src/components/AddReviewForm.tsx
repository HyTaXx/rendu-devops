import React, { useState } from "react";
import { reviewService } from "@/services/review";
import type { Review } from "@/types/review";
import StarRating from "./StarRating";
import { Button } from "@/components/ui/button";

interface AddReviewFormProps {
  productId: string;
  onReviewAdded: (review: Review) => void;
  onCancel: () => void;
}

const AddReviewForm: React.FC<AddReviewFormProps> = ({
  productId,
  onReviewAdded,
  onCancel,
}) => {
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!text.trim()) {
      setError("Veuillez entrer un commentaire");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const newReview = await reviewService.createReview(productId, {
        rating,
        text: text.trim(),
      });
      onReviewAdded(newReview);
    } catch (error) {
      console.error("Error creating review:", error);
      setError("Erreur lors de la création du commentaire");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
      <h4 className="font-medium mb-4">Ajouter votre commentaire</h4>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Note
          </label>
          <StarRating
            rating={rating}
            onRatingChange={setRating}
            interactive={true}
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Commentaire
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={4}
            placeholder="Partagez votre avis sur ce produit..."
            disabled={loading}
            required
            maxLength={1000}
          />
          <div className="text-xs text-gray-500 mt-1">
            {text.length}/1000 caractères
          </div>
        </div>

        <div className="flex space-x-2">
          <Button type="submit" disabled={loading || !text.trim()}>
            {loading ? "Envoi en cours..." : "Publier le commentaire"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={loading}
          >
            Annuler
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddReviewForm;
