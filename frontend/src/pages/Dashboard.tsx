import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

// Mock data pour les produits créés par l'utilisateur
const mockUserProducts = [
  {
    id: 7,
    title: "Écouteurs Bluetooth Premium",
    description: "Écouteurs sans fil avec qualité audio exceptionnelle",
    image:
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400&h=300&fit=crop",
    createdAt: "2024-12-20",
  },
  {
    id: 8,
    title: "Clavier Mécanique RGB",
    description: "Clavier gaming avec switches mécaniques et éclairage RGB",
    image:
      "https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=400&h=300&fit=crop",
    createdAt: "2024-12-18",
  },
];

// Mock data pour les commentaires laissés par l'utilisateur
const mockUserComments = [
  {
    id: 1,
    productId: 1,
    productTitle: "Smartphone Pro Max",
    rating: 5,
    comment:
      "Excellent smartphone ! La qualité photo est vraiment impressionnante, surtout en mode nuit.",
    date: "2024-12-15",
  },
  {
    id: 2,
    productId: 3,
    productTitle: "Casque Audio Sans Fil",
    rating: 4,
    comment:
      "Très bon casque, son de qualité. Seul bémol : un peu lourd après plusieurs heures.",
    date: "2024-12-10",
  },
  {
    id: 3,
    productId: 5,
    productTitle: "Appareil Photo Reflex",
    rating: 5,
    comment:
      "Parfait pour la photographie professionnelle. Qualité d'image exceptionnelle !",
    date: "2024-12-08",
  },
];

function Dashboard() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    firstname: user?.firstname || "",
    lastname: user?.lastname || "",
    email: user?.email || "",
  });

  // Update form when user data changes
  useEffect(() => {
    if (user) {
      setEditForm({
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
      });
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditForm({
      ...editForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = () => {
    // Here you would typically make an API call to update user info
    // For now, we'll just close the editing mode
    setIsEditing(false);
    // TODO: Implement user update API call
  };

  const handleCancel = () => {
    setEditForm({
      firstname: user?.firstname || "",
      lastname: user?.lastname || "",
      email: user?.email || "",
    });
    setIsEditing(false);
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-4 h-4 ${
              star <= rating ? "text-yellow-400" : "text-gray-300"
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Mon Dashboard</h1>
        <Button variant="outline" asChild>
          <Link to="/">Retour à l'accueil</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Informations personnelles */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow-md border">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                Informations personnelles
              </h2>
              {!isEditing ? (
                <Button size="sm" onClick={() => setIsEditing(true)}>
                  Modifier
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleSave}>
                    Sauvegarder
                  </Button>
                  <Button size="sm" variant="outline" onClick={handleCancel}>
                    Annuler
                  </Button>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ID
                </label>
                <p className="text-gray-900">{user?.id}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={editForm.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-gray-900">{user?.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Prénom
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="firstname"
                    value={editForm.firstname}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-gray-900">{user?.firstname}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="lastname"
                    value={editForm.lastname}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-gray-900">{user?.lastname}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Membre depuis
                </label>
                <p className="text-gray-900">
                  {/* We don't have createdAt from the user, so we'll show a placeholder */}
                  Récemment
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Contenu principal */}
        <div className="lg:col-span-2 space-y-8">
          {/* Mes produits */}
          <div className="bg-white p-6 rounded-lg shadow-md border">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">
                Mes produits ({mockUserProducts.length})
              </h2>
              <Button size="sm">Ajouter un produit</Button>
            </div>

            {mockUserProducts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mockUserProducts.map((product) => (
                  <div
                    key={product.id}
                    className="border border-gray-200 rounded-lg overflow-hidden"
                  >
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-full h-32 object-cover"
                    />
                    <div className="p-4">
                      <h3 className="font-semibold mb-1">{product.title}</h3>
                      <p className="text-gray-600 text-sm mb-2">
                        {product.description}
                      </p>
                      <p className="text-xs text-gray-500">
                        Créé le{" "}
                        {new Date(product.createdAt).toLocaleDateString(
                          "fr-FR"
                        )}
                      </p>
                      <div className="flex gap-2 mt-3">
                        <Button size="sm" variant="outline">
                          Modifier
                        </Button>
                        <Button size="sm" variant="outline" asChild>
                          <Link to={`/products/${product.id}`}>Voir</Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>Vous n'avez créé aucun produit pour le moment.</p>
                <Button className="mt-4">Créer votre premier produit</Button>
              </div>
            )}
          </div>

          {/* Mes commentaires */}
          <div className="bg-white p-6 rounded-lg shadow-md border">
            <h2 className="text-xl font-semibold mb-6">
              Mes commentaires ({mockUserComments.length})
            </h2>

            {mockUserComments.length > 0 ? (
              <div className="space-y-4">
                {mockUserComments.map((comment) => (
                  <div
                    key={comment.id}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <Link
                          to={`/products/${comment.productId}`}
                          className="font-semibold text-blue-600 hover:underline"
                        >
                          {comment.productTitle}
                        </Link>
                        <div className="flex items-center gap-2 mt-1">
                          {renderStars(comment.rating)}
                          <span className="text-sm text-gray-500">
                            {comment.date}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          Modifier
                        </Button>
                        <Button size="sm" variant="outline">
                          Supprimer
                        </Button>
                      </div>
                    </div>
                    <p className="text-gray-700">{comment.comment}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>Vous n'avez laissé aucun commentaire pour le moment.</p>
                <Button variant="outline" asChild className="mt-4">
                  <Link to="/products">Découvrir les produits</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
