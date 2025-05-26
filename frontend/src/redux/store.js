// src/redux/store.js
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import cartReducer from './features/cart/cartSlice';
import productEventsReducer from './features/products/productEventsSlice';
import productsApi from './features/products/productsApi';
import ordersApi from './features/orders/ordersApi';

import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';
import {
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';

// 🛒 Only persist cart
const cartPersistConfig = {
  key: 'cart',
  storage,
};

const rootReducer = combineReducers({
  cart: persistReducer(cartPersistConfig, cartReducer),
  productEvents: productEventsReducer,
  [productsApi.reducerPath]: productsApi.reducer,
  [ordersApi.reducerPath]: ordersApi.reducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(productsApi.middleware, ordersApi.middleware),
});

export const persistor = persistStore(store);
