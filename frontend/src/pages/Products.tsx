import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface Product {
  id: number;
  title: string;
  description: string;
  image: string;
}

// Mock data pour les produits
const mockProducts: Product[] = [
  {
    id: 1,
    title: "Smartphone Pro Max",
    description:
      "Le dernier smartphone avec caméra avancée et performance exceptionnelle",
    image:
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop",
  },
  {
    id: 2,
    title: "Ordinateur Portable Gaming",
    description: "Ordinateur portable haute performance pour les gamers",
    image:
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop",
  },
  {
    id: 3,
    title: "Casque Audio Sans Fil",
    description: "Casque audio premium avec réduction de bruit active",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop",
  },
  {
    id: 4,
    title: "Montre Connectée Sport",
    description: "Montre intelligente avec suivi fitness et GPS intégré",
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop",
  },
  {
    id: 5,
    title: "Appareil Photo Reflex",
    description: "Appareil photo professionnel avec objectif 24-70mm",
    image:
      "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&h=300&fit=crop",
  },
  {
    id: 6,
    title: "Tablette Pro 12 pouces",
    description: "Tablette professionnelle avec stylet et clavier détachable",
    image:
      "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=300&fit=crop",
  },
];

function Products() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Nos Produits</h1>
        <p className="text-gray-600">
          Découvrez notre sélection de produits high-tech
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockProducts.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow flex flex-col h-full"
          >
            <img
              src={product.image}
              alt={product.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4 flex flex-col flex-grow">
              <h3 className="text-lg font-semibold mb-2">{product.title}</h3>
              <p className="text-gray-600 text-sm mb-3 line-clamp-2 flex-grow">
                {product.description}
              </p>
              <div className="flex justify-end mt-auto">
                <Button asChild size="sm">
                  <Link to={`/products/${product.id}`}>Voir détails</Link>
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Products;
