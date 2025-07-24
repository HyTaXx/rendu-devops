import { Link } from "react-router-dom";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { useProducts } from "@/hooks/useProducts";
import { useAuth } from "@/hooks/useAuth";

function Products() {
  const { user } = useAuth();

  const params = useMemo(
    () => ({
      page: 1,
      limit: 10,
    }),
    []
  );

  const { products, loading, error, pagination } = useProducts(params);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <p className="text-lg">Chargement des produits...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <p className="text-lg text-red-600 mb-4">
              Erreur lors du chargement des produits
            </p>
            <p className="text-sm text-gray-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Nos Produits</h1>
        <p className="text-gray-600">
          Découvrez notre sélection de produits
          {pagination &&
            ` (${pagination.total} produit${pagination.total > 1 ? "s" : ""})`}
        </p>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg text-gray-600">
            Aucun produit disponible pour le moment.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow flex flex-col h-full"
            >
              {product.imageUrl ? (
                <img
                  src={product.imageUrl}
                  alt={product.title}
                  className="w-full h-48 object-cover"
                />
              ) : (
                <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500">Pas d'image</span>
                </div>
              )}
              <div className="p-4 flex flex-col flex-grow">
                <h3 className="text-lg font-semibold mb-2">{product.title}</h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2 flex-grow">
                  {product.description}
                </p>
                {product.owner && (
                  <p className="text-xs text-gray-500 mb-3">
                    Par {product.owner.firstname} {product.owner.lastname}
                    {user && user.id === product.ownerId && " (Vous)"}
                  </p>
                )}
                <div className="flex justify-end mt-auto">
                  <Button asChild size="sm">
                    <Link to={`/product/${product.id}`}>Voir détails</Link>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {pagination && pagination.totalPages > 1 && (
        <div className="mt-8 flex justify-center">
          <p className="text-sm text-gray-600">
            Page {pagination.page} sur {pagination.totalPages}
          </p>
        </div>
      )}
    </div>
  );
}

export default Products;
