// Authentication related types
export interface User {
  id: string;
  email: string;
  firstname: string;
  lastname: string;
}

export interface RegisterData {
  email: string;
  firstname: string;
  lastname: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
}

export interface RegisterResponse {
  id: string;
  email: string;
  firstname: string;
  lastname: string;
}

export interface AuthError {
  message: string;
  errors?: string[];
  details?: string[];
}
