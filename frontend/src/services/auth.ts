import { httpClient } from "@/lib/http-client";
import type {
  LoginData,
  RegisterData,
  AuthResponse,
  RegisterResponse,
  User,
} from "@/types/auth";

interface JWTPayload {
  id: string;
  email: string;
  firstname: string;
  lastname: string;
  iat: number;
  exp: number;
}

export class AuthService {
  private static readonly TOKEN_KEY = "authToken";
  private static readonly USER_KEY = "authUser";

  // Register a new user
  static async register(data: RegisterData): Promise<RegisterResponse> {
    // The backend returns the user data directly
    const response = await httpClient.post<RegisterResponse>(
      "/auth/register",
      data
    );
    return response as unknown as RegisterResponse;
  }

  // Login user
  static async login(data: LoginData): Promise<AuthResponse> {
    // The backend returns { accessToken: string } directly
    const response = await httpClient.post<AuthResponse>("/auth/login", data);
    const authData = response as unknown as AuthResponse;

    // Store the token
    if (authData.accessToken) {
      this.setToken(authData.accessToken);

      // Decode and store user info from JWT
      const userInfo = this.decodeToken(authData.accessToken);
      if (userInfo) {
        this.setUser({
          id: userInfo.id,
          email: userInfo.email,
          firstname: userInfo.firstname,
          lastname: userInfo.lastname,
        });
      }
    }

    return authData;
  }

  // Logout user
  static logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }

  // Get stored token
  static getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  // Set token
  static setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  // Get stored user
  static getUser(): User | null {
    const userStr = localStorage.getItem(this.USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  }

  // Set user
  static setUser(user: User): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  // Check if user is authenticated
  static isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;

    // Check if token is expired
    try {
      const payload = this.decodeToken(token);
      if (!payload) return false;

      const currentTime = Date.now() / 1000;
      return payload.exp > currentTime;
    } catch {
      return false;
    }
  }

  // Decode JWT token (simple base64 decode for payload)
  private static decodeToken(token: string): JWTPayload | null {
    try {
      const parts = token.split(".");
      if (parts.length !== 3) return null;

      const payload = parts[1];
      const decoded = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
      return JSON.parse(decoded);
    } catch {
      return null;
    }
  }
}
