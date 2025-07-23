export interface Product {
  id: string;
  title: string;
  description: string;
  imageUrl: string | null;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
  owner?: {
    id: string;
    firstname: string;
    lastname: string;
    email: string;
  };
}

export interface ProductListResponse {
  products: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CreateProductData {
  title: string;
  description: string;
  imageUrl?: string | null;
}

export interface UpdateProductData {
  title?: string;
  description?: string;
  imageUrl?: string | null;
}

export interface ProductQueryParams {
  page?: number;
  limit?: number;
}
