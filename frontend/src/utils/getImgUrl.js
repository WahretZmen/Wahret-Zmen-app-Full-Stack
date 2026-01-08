// src/utils/getImgUrl.js
import getBaseUrl from "./baseURL";

/* ----------------------------------------------------------
   Pre-resolve every asset under /src/assets via Vite.
   - import.meta.glob will eagerly map all matching files
   - If not available (non-Vite env), fall back gracefully.
---------------------------------------------------------- */
let ASSET_MAP = {};
try {
  ASSET_MAP = import.meta.glob("/src/assets/**/*", {
    eager: true,
    as: "url",
  });
} catch (_) {
  // no-op: safe fallback for non-Vite environments
}

/* ----------------------------------------------------------
   Constants & helpers
---------------------------------------------------------- */
const PLACEHOLDER = "/default-image.jpg"; // fallback placeholder

// If input is an array, return the first non-empty element
const firstTruthy = (v) => (Array.isArray(v) ? v.find(Boolean) : v);

/* ----------------------------------------------------------
   getImgUrl
   - Handles:
     • File/Blob objects (local previews)
     • External URLs (http, https, data:, blob:)
     • Backend-uploaded images (/uploads/**)
     • Assets from /src/assets/** via Vite glob
     • Static public/ assets (/... paths)
   - Adds graceful fallbacks if resolution fails
---------------------------------------------------------- */
function getImgUrl(name) {
  const input = firstTruthy(name);
  if (!input) return PLACEHOLDER;

  // --- Case 1: File or Blob objects (local previews) ---
  if (typeof input === "object" && (input instanceof File || input instanceof Blob)) {
    return URL.createObjectURL(input);
  }

  // --- Case 2: Strings ---
  if (typeof input === "string") {
    const s = input.trim();

    // External URLs or already valid blob/data URIs
    if (/^(https?:)?\/\//i.test(s) || s.startsWith("data:") || s.startsWith("blob:")) {
      return s;
    }

    // Uploaded images from backend (/uploads/**)
    if (s.startsWith("/uploads/") || s.startsWith("uploads/")) {
      return `${getBaseUrl()}${s.startsWith("/") ? s : `/${s}`}`;
    }

    // Try to resolve assets bundled under /src/assets/**
    if (ASSET_MAP[s]) return ASSET_MAP[s];

    const tryKeys = [
      s.startsWith("/src/") ? s : `/src/${s.replace(/^\//, "")}`,
      s.includes("/assets/")
        ? `/src/${s.replace(/^\//, "")}`
        : `/src/assets/${s.replace(/^\//, "")}`,
    ];
    for (const k of tryKeys) {
      if (ASSET_MAP[k]) return ASSET_MAP[k];
    }

    // Last resort: search by filename
    const file = s.split("/").pop();
    const found = Object.keys(ASSET_MAP).find((k) => k.endsWith("/" + file));
    if (found) return ASSET_MAP[found];

    // Public static assets (/path in public folder)
    if (s.startsWith("/")) return s;
    return `/${s}`;
  }

  // --- Case 3: Fallback ---
  return PLACEHOLDER;
}

/* ----------------------------------------------------------
   Exports
---------------------------------------------------------- */
export { getImgUrl };
export default getImgUrl;
