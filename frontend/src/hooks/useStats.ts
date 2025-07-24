import { useState, useEffect } from "react";
import { userService } from "@/services/api";
import { productService } from "@/services/product";

interface Stats {
  totalUsers: number;
  totalProducts: number;
}

export function useStats() {
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalProducts: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch user count and product list (to get total count) in parallel
        const [userCountResponse, productsResponse] = await Promise.all([
          userService.getUserCount(),
          productService.getProducts({ page: 1, limit: 1 }) // Just get 1 item to get total count
        ]);

        setStats({
          totalUsers: userCountResponse.count,
          totalProducts: productsResponse.total,
        });
      } catch (err) {
        console.error("Error fetching statistics:", err);
        setError(
          err instanceof Error ? err.message : "Une erreur est survenue lors du chargement des statistiques"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return { stats, loading, error };
}
