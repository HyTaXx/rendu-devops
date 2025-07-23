import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface Product {
  id: number;
  title: string;
  description: string;
  image: string;
}

interface Comment {
  id: number;
  author: string;
  rating: number;
  comment: string;
  date: string;
}

// Mock data pour les produits avec plus de détails
const mockProducts: Product[] = [
  {
    id: 1,
    title: "Smartphone Pro Max",
    description:
      "Le dernier smartphone avec caméra avancée et performance exceptionnelle. Doté d'un écran OLED de 6.7 pouces, d'un processeur dernière génération et d'un système de caméra triple avec zoom optique 3x. Parfait pour la photographie professionnelle et les performances gaming.",
    image:
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&h=400&fit=crop",
  },
  {
    id: 2,
    title: "Ordinateur Portable Gaming",
    description:
      "Ordinateur portable haute performance conçu spécialement pour les gamers exigeants. Équipé d'un processeur Intel i7, d'une carte graphique RTX 4060 et d'un écran 15.6 pouces 144Hz pour une expérience de jeu fluide et immersive.",
    image:
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&h=400&fit=crop",
  },
  {
    id: 3,
    title: "Casque Audio Sans Fil",
    description:
      "Casque audio premium avec réduction de bruit active de dernière génération. Offre une qualité sonore exceptionnelle avec des basses profondes et des aigus cristallins. Autonomie de 30 heures et charge rapide.",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=400&fit=crop",
  },
  {
    id: 4,
    title: "Montre Connectée Sport",
    description:
      "Montre intelligente conçue pour les sportifs avec suivi fitness avancé, GPS intégré et résistance à l'eau. Surveillez votre santé 24h/24 avec plus de 100 modes sportifs disponibles.",
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=400&fit=crop",
  },
  {
    id: 5,
    title: "Appareil Photo Reflex",
    description:
      "Appareil photo reflex professionnel avec capteur plein format 24MP et objectif 24-70mm inclus. Idéal pour la photographie professionnelle avec une qualité d'image exceptionnelle et des performances en basse lumière remarquables.",
    image:
      "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=600&h=400&fit=crop",
  },
  {
    id: 6,
    title: "Tablette Pro 12 pouces",
    description:
      "Tablette professionnelle haute performance avec écran Liquid Retina 12.9 pouces, puce M2 et compatibilité avec le stylet et clavier détachable. Parfaite pour le travail créatif et la productivité.",
    image:
      "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&h=400&fit=crop",
  },
];

// Mock data pour les commentaires
const mockComments: { [key: number]: Comment[] } = {
  1: [
    {
      id: 1,
      author: "Marie L.",
      rating: 5,
      comment:
        "Excellent smartphone ! La qualité photo est vraiment impressionnante, surtout en mode nuit.",
      date: "2024-12-15",
    },
    {
      id: 2,
      author: "Thomas K.",
      rating: 4,
      comment:
        "Très bon téléphone, performance au top. Seul bémol : la batterie pourrait durer un peu plus longtemps.",
      date: "2024-12-10",
    },
    {
      id: 3,
      author: "Sophie M.",
      rating: 5,
      comment:
        "Je recommande vivement ! Design élégant et interface très fluide.",
      date: "2024-12-05",
    },
  ],
  2: [
    {
      id: 1,
      author: "Julien R.",
      rating: 5,
      comment:
        "Parfait pour le gaming ! Tous mes jeux tournent en ultra sans problème.",
      date: "2024-12-12",
    },
    {
      id: 2,
      author: "Alex D.",
      rating: 4,
      comment:
        "Très bonnes performances, mais un peu bruyant sous forte charge.",
      date: "2024-12-08",
    },
  ],
  3: [
    {
      id: 1,
      author: "Emma B.",
      rating: 5,
      comment:
        "Son exceptionnel ! La réduction de bruit fonctionne parfaitement.",
      date: "2024-12-14",
    },
    {
      id: 2,
      author: "Nicolas P.",
      rating: 5,
      comment:
        "Confortable même après plusieurs heures d'utilisation. Excellent achat !",
      date: "2024-12-09",
    },
  ],
};

function Product() {
  const { id } = useParams<{ id: string }>();
  const productId = id ? parseInt(id) : 0;
  const product = mockProducts.find((p) => p.id === productId);
  const comments = mockComments[productId] || [];

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Produit introuvable</h1>
        <p className="text-gray-600 mb-4">
          Le produit que vous recherchez n'existe pas.
        </p>
        <Button asChild>
          <Link to="/products">Retour aux produits</Link>
        </Button>
      </div>
    );
  }

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
      {/* Breadcrumb */}
      <nav className="mb-6">
        <Link to="/products" className="text-blue-600 hover:underline">
          Produits
        </Link>
        <span className="mx-2 text-gray-500">/</span>
        <span className="text-gray-700">{product.title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Image du produit */}
        <div>
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-96 object-cover rounded-lg shadow-md"
          />
        </div>

        {/* Informations du produit */}
        <div>
          <h1 className="text-3xl font-bold mb-4">{product.title}</h1>

          <p className="text-gray-600 mb-6 leading-relaxed">
            {product.description}
          </p>
        </div>
      </div>

      {/* Section commentaires */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Commentaires clients</h2>

        {comments.length > 0 ? (
          <div className="space-y-6">
            {comments.map((comment) => (
              <div
                key={comment.id}
                className="bg-white p-6 rounded-lg shadow-sm border"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="font-semibold">{comment.author}</span>
                    {renderStars(comment.rating)}
                  </div>
                  <span className="text-gray-500 text-sm">{comment.date}</span>
                </div>
                <p className="text-gray-700">{comment.comment}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>Aucun commentaire pour ce produit pour le moment.</p>
            <p className="text-sm">Soyez le premier à laisser un avis !</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Product;
