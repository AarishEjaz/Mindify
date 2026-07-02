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
  // Send/receive the httpOnly auth cookie on every request. The token is no
  // longer kept in localStorage (which is readable by any script, so a token
  // there is exposed to XSS) — the browser attaches the cookie automatically.
  withCredentials: true,
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
