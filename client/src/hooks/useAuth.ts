
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { queryClient } from "@/lib/queryClient";

export function useAuth() {
  // Check for token in URL (from Google OAuth redirect)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    if (token) {
      localStorage.setItem("auth_token", token);
      window.history.replaceState({}, document.title, "/");
      // Immediately fetch user data after OAuth login
      queryClient.fetchQuery({
        queryKey: ["/api/auth/user"],
        queryFn: async () => {
          const response = await fetch("/api/auth/user", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (!response.ok) {
            localStorage.removeItem("auth_token");
            throw new Error("Failed to fetch user");
          }
          return response.json();
        },
      });
    }
  }, []);

  // Check if token exists before making the query
  const hasToken = typeof window !== 'undefined' && !!localStorage.getItem("auth_token");

  const { data: user, isLoading } = useQuery({
    queryKey: ["/api/auth/user"],
    retry: false,
    enabled: hasToken, // Only run query if token exists
    staleTime: 0, // Always refetch to ensure fresh data after login
    queryFn: async () => {
      const token = localStorage.getItem("auth_token");
      if (!token) {
        throw new Error("No token");
      }

      const response = await fetch("/api/auth/user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        localStorage.removeItem("auth_token");
        throw new Error("Unauthorized");
      }

      return response.json();
    },
  });

  return {
    user,
    isLoading: hasToken && isLoading, // Only show loading if we have a token and are actually loading
    isAuthenticated: !!user,
  };
}
