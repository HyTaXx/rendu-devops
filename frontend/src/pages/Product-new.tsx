import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useProduct } from "@/hooks/useProducts";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import { productService } from "@/services/product";

function Product() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { product, loading, error } = useProduct(id || "");
  const [isDeleting, setIsDeleting] = useState(false);

  const isOwner = user && product && user.id === product.ownerId;

  const handleDelete = async () => {
    if (!product || !isOwner) return;

    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce produit ?")) {
      try {
        setIsDeleting(true);
        await productService.deleteProduct(product.id);
        // Rediriger vers la liste des produits après suppression
        window.location.href = "/products";
      } catch (err) {
        console.error("Erreur lors de la suppression:", err);
        alert("Erreur lors de la suppression du produit");
      } finally {
        setIsDeleting(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <p className="text-lg">Chargement du produit...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <p className="text-lg text-red-600 mb-4">
              {error || "Produit non trouvé"}
            </p>
            <Button asChild>
              <Link to="/products">Retour aux produits</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="mb-6">
        <Link
          to="/products"
          className="text-blue-600 hover:text-blue-800 text-sm"
        >
          ← Retour aux produits
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="md:flex">
          {/* Image du produit */}
          <div className="md:w-1/2">
            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={product.title}
                className="w-full h-64 md:h-full object-cover"
              />
            ) : (
              <div className="w-full h-64 md:h-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500 text-lg">Pas d'image</span>
              </div>
            )}
          </div>

          {/* Détails du produit */}
          <div className="md:w-1/2 p-6">
            <div className="flex justify-between items-start mb-4">
              <h1 className="text-3xl font-bold text-gray-900">
                {product.title}
              </h1>
              {isOwner && (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      alert("Fonctionnalité de modification à implémenter")
                    }
                  >
                    Modifier
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleDelete}
                    disabled={isDeleting}
                  >
                    {isDeleting ? "Suppression..." : "Supprimer"}
                  </Button>
                </div>
              )}
            </div>

            {/* Propriétaire */}
            {product.owner && (
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Propriétaire:</span>{" "}
                  {product.owner.firstname} {product.owner.lastname}
                  {isOwner && " (Vous)"}
                </p>
                <p className="text-xs text-gray-500">{product.owner.email}</p>
              </div>
            )}

            {/* Description */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-3 text-gray-900">
                Description
              </h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {product.description}
              </p>
            </div>

            {/* Métadonnées */}
            <div className="border-t pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                <div>
                  <span className="font-medium">Créé le:</span>{" "}
                  {new Date(product.createdAt).toLocaleDateString("fr-FR")}
                </div>
                <div>
                  <span className="font-medium">Mis à jour le:</span>{" "}
                  {new Date(product.updatedAt).toLocaleDateString("fr-FR")}
                </div>
              </div>
            </div>

            {/* Section commentaires (placeholder) */}
            <div className="mt-8 pt-6 border-t">
              <h2 className="text-xl font-semibold mb-4 text-gray-900">
                Commentaires
              </h2>
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <p className="text-gray-600">
                  La section commentaires sera disponible prochainement.
                </p>
                {user && !isOwner && (
                  <p className="text-sm text-gray-500 mt-2">
                    En tant qu'utilisateur standard, vous pourrez commenter ce
                    produit.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Product;
