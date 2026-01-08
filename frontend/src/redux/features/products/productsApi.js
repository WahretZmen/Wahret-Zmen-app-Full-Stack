// src/redux/features/products/productsApi.js
// -----------------------------------------------------------------------------
// RTK Query API: Products
// -----------------------------------------------------------------------------
// Responsibilities:
//  • Fetch all products / single product / search
//  • Create / Update / Delete product
//  • Update price by percentage
//  • Normalize color objects to always expose `images[]` and a fallback `image`
//  • Ensure `rating` is always a number (0–5 clamped on mutations)
// Notes:
//  • No functional changes—only organization and commentary for clarity.
// -----------------------------------------------------------------------------

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import getBaseUrl from "../../../utils/baseURL";

/* =============================================================================
   Helpers
   - normalizeColors: make sure each color has images[] and a primary image
============================================================================= */
const normalizeColors = (colors, coverImage) =>
  (colors || []).map((c) => {
    const images =
      Array.isArray(c.images) && c.images.length
        ? c.images
        : c.image
        ? [c.image]
        : [];
    return {
      ...c,
      images,
      // keep a single image field for consumers that expect it
      image: images[0] || c.image || coverImage || "",
    };
  });

/* =============================================================================
   Base Query
   - Attaches Authorization header when token exists
============================================================================= */
const baseQuery = fetchBaseQuery({
  baseUrl: `${getBaseUrl().replace(/\/$/, "")}/api/products`,
  prepareHeaders: (headers) => {
    const token = localStorage.getItem("token");
    if (token) headers.set("Authorization", `Bearer ${token}`);
    return headers;
  },
});

/* =============================================================================
   API Slice
============================================================================= */
const productsApi = createApi({
  reducerPath: "productsApi",
  baseQuery,
  tagTypes: ["Products"],

  endpoints: (builder) => ({
    /* -------------------------------------------------------------------------
       GET / — all products
       - Normalizes colors
       - Coerces rating to number for consistent UI usage
       - Provides tags for list + each entity
    ------------------------------------------------------------------------- */
    getAllProducts: builder.query({
      query: () => `/`,
      transformResponse: (response) =>
        response.map((product) => ({
          ...product,
          colors: normalizeColors(product.colors, product.coverImage),
          rating: Number(product.rating ?? 0), // ⭐ ensure number for UI
        })),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({ type: "Products", id: _id })),
              { type: "Products", id: "LIST" },
            ]
          : [{ type: "Products", id: "LIST" }],
    }),

    /* -------------------------------------------------------------------------
       GET /:id — single product by ID
       - Normalizes colors
       - Coerces rating to number
    ------------------------------------------------------------------------- */
    getProductById: builder.query({
      query: (id) => `/${id}`,
      transformResponse: (product) => ({
        ...product,
        colors: normalizeColors(product.colors, product.coverImage),
        rating: Number(product.rating ?? 0),
      }),
      providesTags: (result, error, id) => [{ type: "Products", id }],
    }),

    /* -------------------------------------------------------------------------
       GET /search?query= — search by term
    ------------------------------------------------------------------------- */
    searchProducts: builder.query({
      query: (searchTerm) => `/search?query=${encodeURIComponent(searchTerm)}`,
      providesTags: [{ type: "Products", id: "LIST" }],
    }),

    /* -------------------------------------------------------------------------
       POST /create-product — add a new product
       - Clamp rating 0..5
       - Normalize colors to images[]
    ------------------------------------------------------------------------- */
    addProduct: builder.mutation({
      query: (newProduct) => ({
        url: `/create-product`,
        method: "POST",
        body: {
          ...newProduct,
          rating: Math.max(0, Math.min(5, Number(newProduct.rating ?? 0))), // ⭐
          colors: (newProduct.colors || []).map((c) => ({
            colorName: c.colorName,
            images: Array.isArray(c.images)
              ? c.images
              : c.image
              ? [c.image]
              : [],
            stock: Number(c.stock) || 0,
          })),
        },
        headers: { "Content-Type": "application/json" },
      }),
      invalidatesTags: [{ type: "Products", id: "LIST" }],
    }),

    /* -------------------------------------------------------------------------
       PUT /edit/:id — update an existing product
       - Clamp rating 0..5
       - Normalize colors to images[]
    ------------------------------------------------------------------------- */
    updateProduct: builder.mutation({
      query: ({ id, ...rest }) => ({
        url: `/edit/${id}`,
        method: "PUT",
        body: {
          ...rest,
          rating: Math.max(0, Math.min(5, Number(rest.rating ?? 0))), // ⭐
          colors: (rest.colors || []).map((c) => ({
            colorName: c.colorName,
            images: Array.isArray(c.images)
              ? c.images
              : c.image
              ? [c.image]
              : [],
            stock: Number(c.stock) || 0,
          })),
        },
        headers: { "Content-Type": "application/json" },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Products", id },
        { type: "Products", id: "LIST" },
      ],
    }),

    /* -------------------------------------------------------------------------
       DELETE /:id — delete product by ID
    ------------------------------------------------------------------------- */
    deleteProduct: builder.mutation({
      query: (id) => ({ url: `/${id}`, method: "DELETE" }),
      invalidatesTags: (result, error, id) => [
        { type: "Products", id },
        { type: "Products", id: "LIST" },
      ],
    }),

    /* -------------------------------------------------------------------------
       PUT /update-price/:id — update price by percentage
    ------------------------------------------------------------------------- */
    updateProductPriceByPercentage: builder.mutation({
      query: ({ id, percentage }) => ({
        url: `/update-price/${id}`,
        method: "PUT",
        body: { percentage },
        headers: { "Content-Type": "application/json" },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Products", id },
        { type: "Products", id: "LIST" },
      ],
    }),
  }),
});

/* =============================================================================
   Exports
============================================================================= */
export const {
  useGetAllProductsQuery,
  useGetProductByIdQuery,
  useSearchProductsQuery,
  useAddProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useUpdateProductPriceByPercentageMutation,
} = productsApi;

export default productsApi;
