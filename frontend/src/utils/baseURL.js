// src/utils/baseUrl.js

/**
 * Returns the correct backend base URL depending on environment.
 * - Development → local server
 * - Production  → deployed backend (from .env if set, otherwise fallback)
 */
const getBaseUrl = () => {
  const local = "http://localhost:5000";

  // Prefer environment variable if provided
  const deployed =
    import.meta.env.VITE_BACKEND_URL ||
    "https://wahret-zmen-app-backend-five.vercel.app";

  if (import.meta.env.MODE === "development") {
    return local;
  }

  return deployed;
};

export default getBaseUrl;
