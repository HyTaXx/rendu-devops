import { httpClient } from "@/lib/http-client";
import { API_CONFIG } from "@/config/api";
import type {
  User,
  Post,
  CreateUserRequest,
  LoginRequest,
  AuthResponse,
  ApiResponse,
  PaginatedResponse,
} from "@/types/api";

// User API service
export const userService = {
  // Get all users
  getUsers: (): Promise<ApiResponse<User[]>> => {
    return httpClient.get<User[]>(API_CONFIG.ENDPOINTS.users);
  },

  // Get user by ID
  getUserById: (id: string): Promise<ApiResponse<User>> => {
    return httpClient.get<User>(`${API_CONFIG.ENDPOINTS.users}/${id}`);
  },

  // Create new user
  createUser: (data: CreateUserRequest): Promise<ApiResponse<User>> => {
    return httpClient.post<User>(API_CONFIG.ENDPOINTS.users, data);
  },

  // Update user
  updateUser: (id: string, data: Partial<User>): Promise<ApiResponse<User>> => {
    return httpClient.put<User>(`${API_CONFIG.ENDPOINTS.users}/${id}`, data);
  },

  // Delete user
  deleteUser: (id: string): Promise<ApiResponse<void>> => {
    return httpClient.delete<void>(`${API_CONFIG.ENDPOINTS.users}/${id}`);
  },

  // Get user count
  getUserCount: (): Promise<{ count: number; timestamp: string }> => {
    return httpClient.get<{ count: number; timestamp: string }>(`${API_CONFIG.ENDPOINTS.users}/count`) as unknown as Promise<{ count: number; timestamp: string }>;
  },
};

// Post API service
export const postService = {
  // Get all posts with pagination
  getPosts: (
    page = 1,
    limit = 10
  ): Promise<ApiResponse<PaginatedResponse<Post>>> => {
    return httpClient.get<PaginatedResponse<Post>>(
      `${API_CONFIG.ENDPOINTS.posts}?page=${page}&limit=${limit}`
    );
  },

  // Get post by ID
  getPostById: (id: string): Promise<ApiResponse<Post>> => {
    return httpClient.get<Post>(`${API_CONFIG.ENDPOINTS.posts}/${id}`);
  },

  // Create new post
  createPost: (
    data: Omit<Post, "id" | "createdAt" | "updatedAt">
  ): Promise<ApiResponse<Post>> => {
    return httpClient.post<Post>(API_CONFIG.ENDPOINTS.posts, data);
  },

  // Update post
  updatePost: (id: string, data: Partial<Post>): Promise<ApiResponse<Post>> => {
    return httpClient.put<Post>(`${API_CONFIG.ENDPOINTS.posts}/${id}`, data);
  },

  // Delete post
  deletePost: (id: string): Promise<ApiResponse<void>> => {
    return httpClient.delete<void>(`${API_CONFIG.ENDPOINTS.posts}/${id}`);
  },
};

// Auth API service
export const authService = {
  // Login
  login: (data: LoginRequest): Promise<ApiResponse<AuthResponse>> => {
    return httpClient.post<AuthResponse>(
      `${API_CONFIG.ENDPOINTS.auth}/login`,
      data
    );
  },

  // Register
  register: (data: CreateUserRequest): Promise<ApiResponse<AuthResponse>> => {
    return httpClient.post<AuthResponse>(
      `${API_CONFIG.ENDPOINTS.auth}/register`,
      data
    );
  },

  // Logout
  logout: (): Promise<ApiResponse<void>> => {
    return httpClient.post<void>(`${API_CONFIG.ENDPOINTS.auth}/logout`);
  },

  // Refresh token
  refreshToken: (refreshToken: string): Promise<ApiResponse<AuthResponse>> => {
    return httpClient.post<AuthResponse>(
      `${API_CONFIG.ENDPOINTS.auth}/refresh`,
      { refreshToken }
    );
  },

  // Get current user profile
  getProfile: (): Promise<ApiResponse<User>> => {
    return httpClient.get<User>(`${API_CONFIG.ENDPOINTS.auth}/profile`);
  },
};
