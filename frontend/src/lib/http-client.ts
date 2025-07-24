import { API_CONFIG } from "@/config/api";
import type { ApiError, ApiResponse } from "@/types/api";

// Custom error class for API errors
export class ApiErrorException extends Error {
  status: number;
  code?: string;

  constructor(error: ApiError) {
    super(error.message);
    this.name = "ApiErrorException";
    this.status = error.status;
    this.code = error.code;
  }
}

// HTTP client with error handling
class HttpClient {
  private baseURL: string;
  private timeout: number;

  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
    this.timeout = API_CONFIG.TIMEOUT;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    isFormData: boolean = false
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;

    let headers: Record<string, string> = {};

    if (options.headers instanceof Headers) {
      options.headers.forEach((value, key) => {
        headers[key] = value;
      });
    } else if (options.headers && typeof options.headers === "object") {
      headers = { ...options.headers as Record<string, string> };
    }

    if (!isFormData) {
      headers["Content-Type"] = "application/json";
    }

    const config: RequestInit = {
      ...options,
      headers,
      signal: AbortSignal.timeout(this.timeout),
    };

    // Add authentication token if available
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new ApiErrorException({
          message: data.message || "An error occurred",
          status: response.status,
          code: data.code,
        });
      }

      return data;
    } catch (error) {
      if (error instanceof ApiErrorException) {
        throw error;
      }

      // Handle network errors, timeout, etc.
      throw new ApiErrorException({
        message: error instanceof Error ? error.message : "Network error",
        status: 0,
      });
    }
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: "GET" });
  }

  async post<T>(endpoint: string, data?: unknown, isFormData: boolean = false): Promise<ApiResponse<T>> {
    return this.request<T>(
      endpoint,
      {
        method: "POST",
        body: isFormData ? (data as FormData) : data ? JSON.stringify(data) : undefined,
      },
      isFormData
    );
  }

  async put<T>(endpoint: string, data?: unknown, isFormData: boolean = false): Promise<ApiResponse<T>> {
    return this.request<T>(
      endpoint,
      {
        method: "PUT",
        body: isFormData ? (data as FormData) : data ? JSON.stringify(data) : undefined,
      },
      isFormData
    );
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: "DELETE" });
  }

  async patch<T>(endpoint: string, data?: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
    });
  }
}

// Export singleton instance
export const httpClient = new HttpClient();
