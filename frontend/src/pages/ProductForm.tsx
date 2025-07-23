import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { productService } from "@/services/product";
import { useAuth } from "@/hooks/useAuth";
import type { CreateProductData, UpdateProductData } from "@/types/product";

function ProductForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [formData, setFormData] = useState<CreateProductData>({
    title: "",
    description: "",
    imageUrl: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEdit, setIsEdit] = useState(false);

  const fetchProduct = async () => {
    if (!id) return;

    try {
      setIsLoading(true);
      const product = await productService.getProductById(id);

      // Vérifier si l'utilisateur est le propriétaire
      if (user?.id !== product.ownerId) {
        navigate("/products");
        return;
      }

      setFormData({
        title: product.title,
        description: product.description,
        imageUrl: product.imageUrl || "",
      });
    } catch (err) {
      console.error("Erreur lors du chargement du produit:", err);
      setError("Erreur lors du chargement du produit");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
      return;
    }

    if (id) {
      setIsEdit(true);
      fetchProduct();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.description.trim()) {
      setError("Le titre et la description sont obligatoires");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const productData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        imageUrl: (formData.imageUrl && formData.imageUrl.trim()) || null,
      };

      if (isEdit && id) {
        await productService.updateProduct(
          id,
          productData as UpdateProductData
        );
      } else {
        await productService.createProduct(productData);
      }

      navigate("/products");
    } catch (err) {
      console.error("Erreur lors de la sauvegarde:", err);
      setError(
        isEdit
          ? "Erreur lors de la modification du produit"
          : "Erreur lors de la création du produit"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (!isAuthenticated) {
    return null;
  }

  if (isEdit && isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <p className="text-lg">Chargement du produit...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">
          {isEdit ? "Modifier le produit" : "Ajouter un nouveau produit"}
        </h1>
        <p className="text-gray-600">
          {isEdit
            ? "Modifiez les informations de votre produit"
            : "Créez un nouveau produit en tant que propriétaire"}
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Titre du produit *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Ex: Smartphone dernière génération"
            required
          />
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Description *
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={6}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Décrivez votre produit en détail..."
            required
          />
        </div>

        <div>
          <label
            htmlFor="imageUrl"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            URL de l'image (optionnel)
          </label>
          <input
            type="url"
            id="imageUrl"
            name="imageUrl"
            value={formData.imageUrl || ""}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="https://exemple.com/image.jpg"
          />
          <p className="text-sm text-gray-500 mt-1">
            Ajoutez une URL d'image pour illustrer votre produit
          </p>
        </div>

        <div className="flex gap-4">
          <Button type="submit" disabled={isLoading} className="flex-1">
            {isLoading
              ? isEdit
                ? "Modification..."
                : "Création..."
              : isEdit
              ? "Modifier le produit"
              : "Créer le produit"}
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/products")}
            disabled={isLoading}
          >
            Annuler
          </Button>
        </div>
      </form>
    </div>
  );
}

export default ProductForm;
