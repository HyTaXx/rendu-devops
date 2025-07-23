import { useState, useEffect, useCallback } from "react";
import type { ApiResponse } from "@/types/api";
import { ApiErrorException } from "@/lib/http-client";

// Generic hook for API calls
export function useApi<T>(apiCall: () => Promise<ApiResponse<T>>) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiCall();
      setData(response.data);
    } catch (err) {
      if (err instanceof ApiErrorException) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  }, [apiCall]);

  useEffect(() => {
    execute();
  }, [execute]);

  const refetch = useCallback(() => {
    execute();
  }, [execute]);

  return { data, loading, error, refetch };
}

// Hook for manual API calls (like form submissions)
export function useApiMutation<T, P = unknown>() {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = useCallback(
    async (apiCall: (params: P) => Promise<ApiResponse<T>>, params: P) => {
      try {
        setLoading(true);
        setError(null);
        const response = await apiCall(params);
        setData(response.data);
        return response.data;
      } catch (err) {
        if (err instanceof ApiErrorException) {
          setError(err.message);
        } else {
          setError("An unexpected error occurred");
        }
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return { data, loading, error, mutate, reset };
}
