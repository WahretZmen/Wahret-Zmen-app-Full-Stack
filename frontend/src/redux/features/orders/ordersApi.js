// src/redux/features/orders/ordersApi.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import getBaseUrl from "../../../utils/baseURL";

const ordersApi = createApi({
  reducerPath: "ordersApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${getBaseUrl().replace(/\/$/, "")}/api/orders`,
    credentials: "include",
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ["Orders"],

  endpoints: (builder) => ({
    // ✅ Create a new order (send body as-is; Checkout already builds correct shape)
    createOrder: builder.mutation({
      query: (newOrder) => ({
        url: "/",
        method: "POST",
        body: newOrder,
      }),
      invalidatesTags: [{ type: "Orders", id: "LIST" }],
    }),

    // ✅ Get orders by customer email
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

    // ✅ Get all orders (admin)
    getAllOrders: builder.query({
      query: () => "/",
      providesTags: [{ type: "Orders", id: "LIST" }],
    }),

    // ✅ Get a single order by ID
    getOrderById: builder.query({
      query: (id) => `/${id}`,
      providesTags: (result, error, id) => [{ type: "Orders", id }],
    }),

    // ✅ Update an order (payment, delivery status, or progress)
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

    // ✅ Delete an order (expects raw id string)
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

    // ✅ Remove a single product line from an order
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

    // (Optional) send order notification to customer
    sendOrderNotification: builder.mutation({
      query: ({ orderId, email, productKey, progress, articleIndex }) => ({
        url: `/notify`,
        method: "POST",
        body: { orderId, email, productKey, progress, articleIndex },
      }),
    }),
  }),
});

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

export default ordersApi;
