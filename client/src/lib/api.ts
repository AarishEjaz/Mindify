import axios from "axios";

// One shared axios instance for the whole app. Every API call goes
// through here, so the base URL and the auth token are configured in a
// single place.
const api = axios.create({
  // IMPORTANT: every backend route lives under "/api" (e.g. /api/auth/login),
  // so the base URL MUST end with "/api".
  // Local dev reads NEXT_PUBLIC_API_URL from .env.local; the deployed build
  // falls back to the Render backend below.
  baseURL:
    process.env.NEXT_PUBLIC_API_URL ||
    "https://mindify-t7z8.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Key used to store the JWT in the browser's localStorage.
export const TOKEN_KEY = "psychometric_token";

// Request interceptor: before each request, attach the saved token (if
// any) as a Bearer token. We check for "window" because this code can
// also run on the server, where localStorage does not exist.
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Helper that pulls a readable message out of an axios error, so pages
// can show a friendly message instead of a raw error object.
export const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || error.message || "Request failed";
  }
  return "Something went wrong";
};

export default api;


// hello world 
