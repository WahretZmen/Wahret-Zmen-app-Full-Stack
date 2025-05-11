// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './features/cart/cartSlice';
import productEventsReducer from './features/products/productEventsSlice'; // ✅ Event Slice
import productsApi from './features/products/productsApi'; // ✅ API slice
import ordersApi from './features/orders/ordersApi'; // ✅ API slice

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    productEvents: productEventsReducer, // ✅ Register the product events slice
    [productsApi.reducerPath]: productsApi.reducer, // ✅ API Reducers
    [ordersApi.reducerPath]: ordersApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      productsApi.middleware,
      ordersApi.middleware
    ), // ✅ Attach API middlewares
});
