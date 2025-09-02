// src/utils/getImgUrl.js
import getBaseUrl from "./baseURL";

// Attempt to pre-resolve every asset under /src/assets via Vite.
// (If running in environments where import.meta.glob isn't available, we fail safely.)
let ASSET_MAP = {};
try {
  ASSET_MAP = import.meta.glob("/src/assets/**/*", {
    eager: true,
    as: "url",
  });
} catch (_) {
  // no-op
}

const PLACEHOLDER = "/default-image.jpg"; // keep your default placeholder

// Helper: if an array is passed, take the first truthy item
const firstTruthy = (v) => (Array.isArray(v) ? v.find(Boolean) : v);

/**
 * getImgUrl
 * - Keeps your existing behavior for File objects, external URLs, backend uploads,
 *   and local/public paths.
 * - Adds support for arrays (images list), data/blob URLs,
 *   and Vite-resolved /src/assets/** imports.
 */
function getImgUrl(name) {
  const input = firstTruthy(name);

  if (!input) {
    return PLACEHOLDER; // unchanged
  }

  // ✅ Handle image from mobile File object or generic Blob (preview)
  if (typeof input === "object" && (input instanceof File || input instanceof Blob)) {
    return URL.createObjectURL(input);
  }

  if (typeof input === "string") {
    const s = input.trim();

    // ✅ External or already-resolved data/blob URLs
    if (
      /^(https?:)?\/\//i.test(s) || // http(s) or protocol-relative
      s.startsWith("data:") ||
      s.startsWith("blob:")
    ) {
      return s;
    }

    // ✅ Uploaded images from backend
    if (s.startsWith("/uploads/") || s.startsWith("uploads/")) {
      return `${getBaseUrl()}${s.startsWith("/") ? s : `/${s}`}`;
    }

    // ✅ Try to resolve anything under /src/assets/** (Vite bundles these)
    // direct key
    if (ASSET_MAP[s]) return ASSET_MAP[s];

    // common variations
    const tryKeys = [
      s.startsWith("/src/") ? s : `/src/${s.replace(/^\//, "")}`,
      s.includes("/assets/")
        ? `/src/${s.replace(/^\//, "")}`
        : `/src/assets/${s.replace(/^\//, "")}`,
    ];
    for (const k of tryKeys) {
      if (ASSET_MAP[k]) return ASSET_MAP[k];
    }

    // last resort: match by filename
    const file = s.split("/").pop();
    const found = Object.keys(ASSET_MAP).find((k) => k.endsWith("/" + file));
    if (found) return ASSET_MAP[found];

    // ✅ Local static assets (public/) — keep your original fallback style
    if (s.startsWith("/")) return s; // already rooted under public
    return `/${s}`;
  }

  // Fallback
  return PLACEHOLDER;
}

export { getImgUrl };
export default getImgUrl;
