import { httpClient } from "@/lib/http-client";
import { API_CONFIG } from "@/config/api";
import type {
  Product,
  ProductListResponse,
  ProductQueryParams,
} from "@/types/product";

export const productService = {
  // Get all products with pagination
  getProducts: async (
    params?: ProductQueryParams
  ): Promise<ProductListResponse> => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append("page", params.page.toString());
    if (params?.limit) searchParams.append("limit", params.limit.toString());

    const url = `${API_CONFIG.ENDPOINTS.products}${
      searchParams.toString() ? "?" + searchParams.toString() : ""
    }`;
    const response = await httpClient.get<ProductListResponse>(url);
    return response as unknown as ProductListResponse;
  },

  // Get product by ID
  getProductById: async (id: string): Promise<Product> => {
    const response = await httpClient.get<Product>(
      `${API_CONFIG.ENDPOINTS.products}/${id}`
    );
    return response as unknown as Product;
  },

  // Create new product (only for authenticated users)
  createProduct: async (data: FormData): Promise<Product> => {
    const response = await httpClient.post<Product>(
      API_CONFIG.ENDPOINTS.products,
      data,
      true
    );
    return response as unknown as Product;
  },

  // Update product (only for product owner)
  updateProduct: async (
    id: string,
    data: FormData
  ): Promise<Product> => {
    const response = await httpClient.put<Product>(
      `${API_CONFIG.ENDPOINTS.products}/${id}`,
      data,
      true
    );
    return response as unknown as Product;
  },

  // Delete product (only for product owner)
  deleteProduct: async (id: string): Promise<void> => {
    await httpClient.delete<void>(`${API_CONFIG.ENDPOINTS.products}/${id}`);
  },
};
