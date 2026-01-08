// src/utils/baseUrl.js

/**
 * Returns the correct backend base URL depending on environment.
 * - Development → local server
 * - Production  → deployed backend (from .env if set, otherwise fallback)
 */
const getBaseUrl = () => {
  // use 127.0.0.1 to avoid some Windows DNS issues with "localhost"
  const local = "http://127.0.0.1:5000";

  // Prefer environment variable if provided (set this on Vercel)
  const deployed =
    import.meta.env.VITE_BACKEND_URL ||
    "https://wahret-zmen-app-backend-five.vercel.app";

  if (import.meta.env.MODE === "development") {
    return local;
  }
  return deployed;
};

export default getBaseUrl;
