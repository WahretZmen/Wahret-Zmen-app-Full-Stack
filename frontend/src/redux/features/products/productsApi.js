// src/redux/features/products/productsApi.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import getBaseUrl from "../../../utils/baseURL";

// Normalize colors to always have `images[]`
// and keep a backward-compatible `image` equal to images[0]
const normalizeColors = (colors, coverImage) =>
  (colors || []).map((c) => {
    const images = Array.isArray(c.images) && c.images.length
      ? c.images
      : (c.image ? [c.image] : []);
    return {
      ...c,
      images,
      image: images[0] || c.image || coverImage || "", // compat for UIs that expect `.image`
    };
  });

const baseQuery = fetchBaseQuery({
  baseUrl: `${getBaseUrl().replace(/\/$/, "")}/api/products`,
  prepareHeaders: (headers) => {
    const token = localStorage.getItem("token");
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const productsApi = createApi({
  reducerPath: "productsApi",
  baseQuery,
  tagTypes: ["Products"],

  endpoints: (builder) => ({
    // ✅ Get all products
    getAllProducts: builder.query({
      query: () => "/",
      transformResponse: (response) =>
        response.map((product) => ({
          ...product,
          colors: normalizeColors(product.colors, product.coverImage),
        })),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({ type: "Products", id: _id })),
              { type: "Products", id: "LIST" },
            ]
          : [{ type: "Products", id: "LIST" }],
    }),

    // ✅ Get a single product by ID
    getProductById: builder.query({
      query: (id) => `/${id}`,
      transformResponse: (product) => ({
        ...product,
        colors: normalizeColors(product.colors, product.coverImage),
      }),
      providesTags: (result, error, id) => [{ type: "Products", id }],
    }),

    // ✅ Search products
    searchProducts: builder.query({
      query: (searchTerm) => `/search?query=${encodeURIComponent(searchTerm)}`,
      providesTags: [{ type: "Products", id: "LIST" }],
    }),

    // ✅ Add a new product (supports multiple images per color)
    addProduct: builder.mutation({
      query: (newProduct) => ({
        url: "/create-product",
        method: "POST",
        body: {
          ...newProduct,
          coverImage: newProduct.coverImage,
          colors: (newProduct.colors || []).map((c) => ({
            colorName: c.colorName, // EN; backend translates to FR/AR
            images: Array.isArray(c.images) ? c.images : (c.image ? [c.image] : []),
            stock: Number(c.stock) || 0,
          })),
        },
        headers: { "Content-Type": "application/json" },
      }),
      invalidatesTags: [{ type: "Products", id: "LIST" }],
    }),

    // ✅ Update a product (supports multiple images per color)
    updateProduct: builder.mutation({
      query: ({ id, ...rest }) => ({
        url: `/edit/${id}`,
        method: "PUT",
        body: {
          ...rest,
          coverImage: rest.coverImage,
          colors: (rest.colors || []).map((c) => ({
            colorName: c.colorName, // EN; backend translates to FR/AR
            images: Array.isArray(c.images) ? c.images : (c.image ? [c.image] : []),
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

    // ✅ Delete a product
    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Products", id },
        { type: "Products", id: "LIST" },
      ],
    }),

    // ✅ Update product price by percentage
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
