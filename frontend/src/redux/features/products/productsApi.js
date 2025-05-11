import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import getBaseUrl from "../../../utils/baseURL";

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
          colors: product.colors?.length
            ? product.colors
            : [{ colorName: "Default", image: product.coverImage }],
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
        colors: product.colors?.length
          ? product.colors
          : [{ colorName: "Default", image: product.coverImage }],
      }),
      providesTags: (result, error, id) => [{ type: "Products", id }],
    }),

    // ✅ Search products
    searchProducts: builder.query({
      query: (searchTerm) => `/search?query=${searchTerm}`,
      providesTags: [{ type: "Products", id: "LIST" }],
    }),

    // ✅ Add a new product
    addProduct: builder.mutation({
      query: (newProduct) => ({
        url: "/create-product",
        method: "POST",
        body: {
          ...newProduct,
          colors: newProduct.colors?.length
            ? newProduct.colors
            : [{ colorName: "Default", image: newProduct.coverImage }],
        },
        headers: { "Content-Type": "application/json" },
      }),
      invalidatesTags: [{ type: "Products", id: "LIST" }],
    }),

    // ✅ Update a product
    updateProduct: builder.mutation({
      query: ({ id, ...rest }) => ({
        url: `/edit/${id}`,
        method: "PUT",
        body: {
          ...rest,
          colors: rest.colors?.length
            ? rest.colors
            : [{ colorName: "Default", image: rest.coverImage }],
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
