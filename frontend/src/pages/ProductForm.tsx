import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { productService } from "@/services/product";
import { useAuth } from "@/hooks/useAuth";
import type { CreateProductData, UpdateProductData } from "@/types/product";

function ProductForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [formData, setFormData] = useState<Omit<CreateProductData, 'imageUrl'>>({
    title: "",
    description: "",
  });
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

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
      });
      // No file prefill for edit
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

    if (!isEdit && !file) {
      setError("L'image du produit est obligatoire");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const form = new FormData();
      form.append("title", formData.title.trim());
      form.append("description", formData.description.trim());
      if (file) form.append("image", file);

      if (isEdit && id) {
        await productService.updateProduct(id, form);
      } else {
        await productService.createProduct(form);
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
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

      <form onSubmit={handleSubmit} className="space-y-6" encType="multipart/form-data">
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
            htmlFor="image"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Image du produit {isEdit ? "(laisser vide pour ne pas changer)" : "*"}
          </label>
          <input
            type="file"
            id="image"
            name="image"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="text-sm text-gray-500 mt-1">
            {isEdit ? "Vous pouvez laisser vide pour garder l'image actuelle." : "Ajoutez une image pour illustrer votre produit (obligatoire)"}
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
