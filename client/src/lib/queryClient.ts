import { QueryClient } from "@tanstack/react-query";

async function fetchWithErrorHandling(url: string, options?: RequestInit) {
  const token = localStorage.getItem("auth_token");
  const headers = {
    ...options?.headers,
    ...(token && { Authorization: `Bearer ${token}` }),
  };

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: "include",
  });

  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem("auth_token");
    }
    if (response.status >= 500) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }
    if (response.headers.get("content-type")?.includes("application/json")) {
      const errorData = await response.json();
      const errorMessage = errorData.message || response.statusText;
      throw new Error(`${response.status}: ${errorMessage}`);
    } else {
      throw new Error(`${response.status}: ${response.statusText}`);
    }
  }
  if (response.headers.get("content-type")?.includes("application/json")) {
    return await response.json();
  }
  return await response.text();
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: async ({ queryKey }) => {
        const url = queryKey[0] as string;
        return fetchWithErrorHandling(url);
      },
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});