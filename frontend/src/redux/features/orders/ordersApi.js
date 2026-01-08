// src/redux/features/orders/ordersApi.js
// -----------------------------------------------------------------------------
// Purpose: RTK Query API slice for Orders (CRUD + notifications).
// Features:
//   - Auth header via localStorage token
//   - Base URL derived from getBaseUrl() and normalized (no trailing slash)
//   - Tag-based invalidation for granular cache updates
// Notes:
//   - No functional changes; only comments and organization added.
// -----------------------------------------------------------------------------

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import getBaseUrl from "../../../utils/baseURL";

// -----------------------------------------------------------------------------
// API Slice
// -----------------------------------------------------------------------------
const ordersApi = createApi({
  reducerPath: "ordersApi",

  // ---------------------------------------------------------------------------
  // Base Query
  // ---------------------------------------------------------------------------
  baseQuery: fetchBaseQuery({
    baseUrl: `${getBaseUrl().replace(/\/$/, "")}/api/orders`,
    credentials: "include",
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  }),

  // Cache Tags
  tagTypes: ["Orders"],

  // ---------------------------------------------------------------------------
  // Endpoints
  // ---------------------------------------------------------------------------
  endpoints: (builder) => ({
    // -------------------------------------------------------------------------
    // ✅ Create a new order
    // - Checkout builds the correct shape; body sent as-is
    // - Invalidates LIST to refetch collection
    // -------------------------------------------------------------------------
    createOrder: builder.mutation({
      query: (newOrder) => ({
        url: "/",
        method: "POST",
        body: newOrder,
      }),
      invalidatesTags: [{ type: "Orders", id: "LIST" }],
    }),

    // -------------------------------------------------------------------------
    // ✅ Get orders by customer email
    // - Normalizes each order’s product lines for UI robustness
    // - Provides tags per order + LIST
    // -------------------------------------------------------------------------
    getOrderByEmail: builder.query({
      query: (email) => `/email/${encodeURIComponent(email)}`,
      transformResponse: (orders) =>
        (orders || []).map((o) => ({
          ...o,
          products: (o.products || []).map((line) => ({
            ...line,
            // keep populated product object from backend so UI can read title/translations/coverImage
            productId: line.productId || null,
            // ensure color object is always well-formed for UI
            color:
              line.color?.colorName?.en
                ? line.color
                : {
                    colorName: { en: "Original", fr: "Original", ar: "أصلي" },
                    image:
                      line.productId?.coverImage || "/assets/default-image.png",
                  },
          })),
        })),
      providesTags: (result) =>
        result?.length
          ? [
              ...result.map((o) => ({ type: "Orders", id: o._id })),
              { type: "Orders", id: "LIST" },
            ]
          : [{ type: "Orders", id: "LIST" }],
    }),

    // -------------------------------------------------------------------------
    // ✅ Get all orders (admin)
    // - Provides LIST tag for collection-level caching
    // -------------------------------------------------------------------------
    getAllOrders: builder.query({
      query: () => "/",
      providesTags: [{ type: "Orders", id: "LIST" }],
    }),

    // -------------------------------------------------------------------------
    // ✅ Get a single order by ID
    // - Provides tag by order ID for precise invalidation
    // -------------------------------------------------------------------------
    getOrderById: builder.query({
      query: (id) => `/${id}`,
      providesTags: (result, error, id) => [{ type: "Orders", id }],
    }),

    // -------------------------------------------------------------------------
    // ✅ Update an order
    // - Supports payment/delivery status and productProgress updates
    // - Invalidates that order + LIST to refresh detail and collection
    // -------------------------------------------------------------------------
    updateOrder: builder.mutation({
      query: ({ orderId, productProgress, isPaid, isDelivered }) => ({
        url: `/${orderId}`,
        method: "PATCH",
        body: { isPaid, isDelivered, productProgress },
      }),
      invalidatesTags: (result, error, { orderId }) => [
        { type: "Orders", id: orderId },
        { type: "Orders", id: "LIST" },
      ],
    }),

    // -------------------------------------------------------------------------
    // ✅ Delete an order (expects raw id string)
    // - Invalidates that order + LIST
    // -------------------------------------------------------------------------
    deleteOrder: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Orders", id },
        { type: "Orders", id: "LIST" },
      ],
    }),

    // -------------------------------------------------------------------------
    // ✅ Remove a single product line from an order
    // - POST to /remove-line with orderId/productKey/quantityToRemove
    // - Invalidates that order + LIST
    // -------------------------------------------------------------------------
    removeProductFromOrder: builder.mutation({
      query: ({ orderId, productKey, quantityToRemove }) => ({
        url: `/remove-line`,
        method: "POST",
        body: { orderId, productKey, quantityToRemove },
      }),
      invalidatesTags: (result, error, { orderId }) => [
        { type: "Orders", id: orderId },
        { type: "Orders", id: "LIST" },
      ],
    }),

    // -------------------------------------------------------------------------
    // (Optional) Send order notification to customer
    // - Triggers backend email on progress changes (e.g., 60% / 100%)
    // -------------------------------------------------------------------------
    sendOrderNotification: builder.mutation({
      query: ({ orderId, email, productKey, progress, articleIndex }) => ({
        url: `/notify`,
        method: "POST",
        body: { orderId, email, productKey, progress, articleIndex },
      }),
    }),
  }),
});

// -----------------------------------------------------------------------------
// Hooks
// -----------------------------------------------------------------------------
export const {
  useCreateOrderMutation,
  useGetAllOrdersQuery,
  useGetOrderByIdQuery,
  useGetOrderByEmailQuery,
  useUpdateOrderMutation,
  useDeleteOrderMutation,
  useRemoveProductFromOrderMutation,
  useSendOrderNotificationMutation,
} = ordersApi;

// -----------------------------------------------------------------------------
// Export
// -----------------------------------------------------------------------------
export default ordersApi;
