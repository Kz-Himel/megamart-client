import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  const token = Cookies.get("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string; error?: { details?: unknown } }>) => {
    const message =
      error.response?.data?.message || error.message || "Something went wrong";

    if (error.response?.status === 401 && typeof window !== "undefined") {
      Cookies.remove("token");
      Cookies.remove("user");
      if (
        window.location.pathname.startsWith("/orders") ||
        window.location.pathname.startsWith("/account") ||
        window.location.pathname.startsWith("/dashboard")
      ) {
        // eslint-disable-next-line @next/next/no-location-assign-relative-destination
        window.location.href = `/login?redirect=${encodeURIComponent(
          window.location.pathname + window.location.search
        )}`;
      }
    }

    return Promise.reject(new Error(message));
  }
);

export default apiClient;