import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

// Mock data pour les statistiques
const mockStats = {
  totalUsers: 1247,
  totalProducts: 856,
};

function Home() {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="max-w-4xl w-full">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-8">
            {isAuthenticated
              ? `Bienvenue ${user?.firstname}!`
              : "Bienvenue sur notre plateforme !"}
          </h1>

          {/* Statistiques */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-md border">
              <h3 className="text-2xl font-semibold text-blue-600 mb-2">
                {mockStats.totalUsers}
              </h3>
              <p className="text-gray-600">Utilisateurs actifs</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md border">
              <h3 className="text-2xl font-semibold text-green-600 mb-2">
                {mockStats.totalProducts}
              </h3>
              <p className="text-gray-600">Produits disponibles</p>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-4">
            <p className="text-lg text-gray-600 mb-6">
              Découvrez notre collection de produits exceptionnels
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg">
                <Link to="/products">Voir les produits</Link>
              </Button>

              {isAuthenticated ? (
                <Button variant="outline" asChild size="lg">
                  <Link to="/dashboard">Mon Dashboard</Link>
                </Button>
              ) : (
                <p className="text-sm text-gray-500 flex items-center">
                  Connectez-vous pour accéder à plus de fonctionnalités
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          <div className="text-center">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Rapide</h3>
            <p className="text-gray-600">
              Navigation fluide et chargement optimisé
            </p>
          </div>

          <div className="text-center">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Fiable</h3>
            <p className="text-gray-600">Plateforme sécurisée et stable</p>
          </div>

          <div className="text-center">
            <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Intuitif</h3>
            <p className="text-gray-600">
              Interface utilisateur simple et élégante
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
