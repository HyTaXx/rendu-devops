import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { productService } from "@/services/product";
import type { Product } from "@/types/product";
import type { User } from "@/types/auth";
import PersonalInfoForm from "@/components/PersonalInfoForm";
import UserReviewsList from "@/components/UserReviewsList";

function Dashboard() {
  const { user } = useAuth();
  const [userProducts, setUserProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<
    "overview" | "profile" | "products" | "reviews"
  >("overview");
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(user);

  useEffect(() => {
    if (user) {
      setCurrentUser(user);
      fetchUserProducts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const fetchUserProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      // Récupérer tous les produits et filtrer ceux de l'utilisateur
      const response = await productService.getProducts({ limit: 100 });
      const ownProducts = response.products.filter(
        (product) => product.ownerId === user?.id
      );
      setUserProducts(ownProducts);
    } catch (err) {
      console.error("Erreur lors du chargement des produits:", err);
      setError("Erreur lors du chargement de vos produits");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce produit ?")) {
      return;
    }

    try {
      await productService.deleteProduct(productId);
      // Mettre à jour la liste des produits
      setUserProducts((prev) => prev.filter((p) => p.id !== productId));
    } catch (err) {
      console.error("Erreur lors de la suppression:", err);
      alert("Erreur lors de la suppression du produit");
    }
  };

  const handleUserUpdated = (updatedUser: User) => {
    setCurrentUser(updatedUser);
    setIsEditingProfile(false);
  };

  if (!user) {
    return null;
  }

  const displayUser = currentUser || user;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          Bonjour, {displayUser.firstname} {displayUser.lastname}!
        </h1>
        <p className="text-gray-600">
          Gérez vos produits, vos informations personnelles et consultez vos
          activités
        </p>
      </div>

      {/* Navigation par onglets */}
      <div className="mb-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            {[
              { id: "overview", name: "Vue d'ensemble", icon: "📊" },
              { id: "profile", name: "Mon profil", icon: "👤" },
              { id: "products", name: "Mes produits", icon: "📦" },
              { id: "reviews", name: "Mes commentaires", icon: "💬" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2`}
              >
                <span>{tab.icon}</span>
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Contenu des onglets */}
      {activeTab === "overview" && (
        <div>
          {/* Vue d'ensemble */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold mb-2">Vos produits</h3>
              <p className="text-2xl font-bold text-blue-600 mb-2">
                {userProducts.length}
              </p>
              <p className="text-sm text-gray-600">
                Produit{userProducts.length > 1 ? "s" : ""} créé
                {userProducts.length > 1 ? "s" : ""}
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold mb-2">Rôle</h3>
              <p className="text-lg font-medium text-green-600 mb-2">
                Propriétaire
              </p>
              <p className="text-sm text-gray-600">
                Vous pouvez créer et modifier vos produits
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold mb-2">Actions rapides</h3>
              <div className="space-y-2">
                <Button asChild size="sm" className="w-full">
                  <Link to="/products/new">+ Ajouter un produit</Link>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => setActiveTab("profile")}
                >
                  Modifier mon profil
                </Button>
              </div>
            </div>
          </div>

          {/* Informations sur les rôles */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">
              Votre rôle: Propriétaire
            </h3>
            <p className="text-blue-800 mb-4">
              En tant que propriétaire, vous pouvez :
            </p>
            <ul className="list-disc list-inside text-blue-800 space-y-1">
              <li>Créer de nouveaux produits</li>
              <li>Modifier vos propres produits</li>
              <li>Supprimer vos propres produits</li>
              <li>Voir tous les produits disponibles</li>
              <li>Commenter les produits des autres utilisateurs</li>
            </ul>
          </div>
        </div>
      )}

      {activeTab === "profile" && (
        <div>
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">
                Informations personnelles
              </h2>
              {!isEditingProfile && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditingProfile(true)}
                >
                  Modifier
                </Button>
              )}
            </div>

            {isEditingProfile ? (
              <PersonalInfoForm
                user={displayUser}
                onUserUpdated={handleUserUpdated}
                onCancel={() => setIsEditingProfile(false)}
              />
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Prénom
                    </label>
                    <p className="text-gray-900 text-lg">
                      {displayUser.firstname}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nom
                    </label>
                    <p className="text-gray-900 text-lg">
                      {displayUser.lastname}
                    </p>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <p className="text-gray-900 text-lg">{displayUser.email}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === "products" && (
        <div>
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Mes produits</h2>
              <Button asChild size="sm">
                <Link to="/products/new">+ Ajouter</Link>
              </Button>
            </div>

            {loading ? (
              <div className="text-center py-8">
                <p>Chargement de vos produits...</p>
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <p className="text-red-600">{error}</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={fetchUserProducts}
                  className="mt-2"
                >
                  Réessayer
                </Button>
              </div>
            ) : userProducts.length === 0 ? (
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
                      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Aucun produit créé
                </h3>
                <p className="text-gray-600 mb-4">
                  Commencez par créer votre premier produit
                </p>
                <Button asChild>
                  <Link to="/products/new">Créer un produit</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {userProducts.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center space-x-4">
                      {product.imageUrl ? (
                        <img
                          src={product.imageUrl}
                          alt={product.title}
                          className="w-16 h-16 object-cover rounded"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center">
                          <span className="text-gray-500 text-xs">
                            Pas d'image
                          </span>
                        </div>
                      )}
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {product.title}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                          {product.description}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Créé le{" "}
                          {new Date(product.createdAt).toLocaleDateString(
                            "fr-FR"
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/product/${product.id}`}>Voir</Link>
                      </Button>
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/products/edit/${product.id}`}>
                          Modifier
                        </Link>
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteProduct(product.id)}
                      >
                        Supprimer
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === "reviews" && (
        <div>
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Mes commentaires</h2>
              <p className="text-gray-600">
                Retrouvez tous les commentaires que vous avez laissés sur les
                produits
              </p>
            </div>
            <UserReviewsList />
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
