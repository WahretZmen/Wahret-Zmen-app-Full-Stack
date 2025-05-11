import getBaseUrl from "./baseURL";

function getImgUrl(name) {
  if (!name) {
    return "/default-image.jpg"; // Default placeholder
  }

  // ✅ Handle image from mobile File object (Android/iOS preview)
  if (typeof name === "object" && name instanceof File) {
    return URL.createObjectURL(name);
  }

  // ✅ External URLs (Cloudinary, S3, etc.)
  if (typeof name === "string" && (name.startsWith("http://") || name.startsWith("https://"))) {
    return name;
  }

  // ✅ Uploaded images from backend
  if (typeof name === "string" && (name.startsWith("/uploads/") || name.startsWith("uploads/"))) {
    return `${getBaseUrl()}${name.startsWith("/") ? name : `/${name}`}`;
  }

  // ✅ Local static assets (fallback)
  return `/${name}`;
}

export { getImgUrl };
