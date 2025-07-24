import { httpClient } from "@/lib/http-client";
import type { User } from "@/types/auth";

export interface UpdateUserData {
  firstname?: string;
  lastname?: string;
}

export const userService = {
  // Get current user information
  getCurrentUser: async (): Promise<User> => {
    const response = await httpClient.get("/users/me");
    return response as unknown as User;
  },

  // Update current user information
  updateCurrentUser: async (userData: UpdateUserData): Promise<User> => {
    const response = await httpClient.put("/users/me", userData);
    return response as unknown as User;
  },

  // Get user count (for stats)
  getUserCount: async (): Promise<{ count: number }> => {
    const response = await httpClient.get("/users/count");
    return response as unknown as { count: number };
  },
};
