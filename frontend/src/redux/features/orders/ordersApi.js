import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import getBaseUrl from "../../../utils/baseURL";

const ordersApi = createApi({
  reducerPath: "ordersApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${getBaseUrl().replace(/\/$/, "")}/api/orders`,
    credentials: "include",
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Orders"],

  endpoints: (builder) => ({
    // ✅ Create a new order
    createOrder: builder.mutation({
      query: (newOrder) => ({
        url: "/",
        method: "POST",
        body: {
          ...newOrder,
          products: newOrder.products.map((product) => ({
            productId: product.productId,
            quantity: product.quantity,
            color: product.color?.colorName?.en
              ? product.color
              : {
                  colorName: {
                    en: "Original",
                    fr: "Original",
                    ar: "أصلي",
                  },
                  image:
                    product.productId?.coverImage ||
                    "/default-image.png",
                },
          })),
        },
      }),
      invalidatesTags: ["Orders"],
    }),
   
    // ✅ Get all orders (admin)
    getAllOrders: builder.query({
      query: () => "/",
      transformResponse: (response) =>
        response.map((order) => ({
          ...order,
          products: order.products.map((product) => ({
            productId: {
              _id: product.productId?._id || "N/A",
              title: product.productId?.title || "Unknown Product",
            },
            quantity: product.quantity,
            color: product.color?.colorName?.en
              ? product.color
              : {
                  colorName: {
                    en: "Original",
                    fr: "Original",
                    ar: "أصلي",
                  },
                  image:
                    product.productId?.coverImage ||
                    "/assets/default-image.png",
                },
            coverImage:
              product.productId?.coverImage || "/assets/default-image.png",
          })),
        })),
      providesTags: ["Orders"],
    }),

    // ✅ Get a single order by ID
    getOrderById: builder.query({
      query: (id) => ({
        url: `/${id}`,
      }),
      transformResponse: (order) => ({
        ...order,
        products: order.products.map((product) => ({
          productId: {
            _id: product.productId?._id || "N/A",
            title: product.productId?.title || "Unknown Product",
          },
          quantity: product.quantity,
          color: product.color?.colorName?.en
            ? product.color
            : {
                colorName: {
                  en: "Original",
                  fr: "Original",
                  ar: "أصلي",
                },
                image:
                  product.productId?.coverImage ||
                  "/assets/default-image.png",
              },
          coverImage:
            product.productId?.coverImage || "/assets/default-image.png",
        })),
      }),
      providesTags: (result, error, id) => [{ type: "Orders", id }],
    }),

    // ✅ Get orders by customer email
    getOrderByEmail: builder.query({
      query: (email) => ({
        url: `/email/${email}`,
      }),
      transformResponse: (response) =>
        response.map((order) => ({
          ...order,
          products: order.products.map((product) => ({
            productId: {
              _id: product.productId?._id || "N/A",
              title: product.productId?.title || "Unknown Product",
            },
            quantity: product.quantity,
            color: product.color?.colorName?.en
              ? product.color
              : {
                  colorName: {
                    en: "Original",
                    fr: "Original",
                    ar: "أصلي",
                  },
                  image:
                    product.productId?.coverImage ||
                    "/assets/default-image.png",
                },
            coverImage:
              product.productId?.coverImage || "/assets/default-image.png",
          })),
        })),
      providesTags: ["Orders"],
    }),

    // ✅ Update an order (payment, delivery status, progress)
    updateOrder: builder.mutation({
      query: ({ orderId, productProgress, isPaid, isDelivered }) => ({
        url: `/${orderId}`,
        method: "PATCH",
        body: {
          isPaid,
          isDelivered,
          productProgress,
        },
      }),
      invalidatesTags: ["Orders"],
    }),

    // ✅ Delete an order
    deleteOrder: builder.mutation({
      query: ({ orderId }) => ({
        url: `/${orderId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Orders"],
    }),

    removeProductFromOrder: builder.mutation({
      query: ({ orderId, productKey, quantityToRemove }) => {
        return {
          url: `/remove-product`,
          method: "PATCH",
          body: { orderId, productKey, quantityToRemove },
        };
      },
      // ✅ Invalidate both orders and products so the UI (like ProductCard and Products.jsx) updates stock
      invalidatesTags: ["Orders", { type: "Products", id: "LIST" }],
    }),

    // ✅ Send order notification to customer
    sendOrderNotification: builder.mutation({
      query: ({ orderId, email, productKey, progress }) => ({
        url: `/notify`,
        method: "POST",
        body: { orderId, email, productKey, progress },
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