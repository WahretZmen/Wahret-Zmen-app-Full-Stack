// src/redux/store.js
// -----------------------------------------------------------------------------
// Purpose: Configure Redux store with RTK, RTK Query APIs, and redux-persist.
// Features:
//   - Persists only the cart slice (via redux-persist).
//   - Integrates productsApi and ordersApi reducers + middleware.
//   - Ignores redux-persist non-serializable action checks in middleware.
// Notes:
//   - No functional changes; comments & organization only.
// -----------------------------------------------------------------------------

import { configureStore, combineReducers } from '@reduxjs/toolkit';

// Local reducers
import cartReducer from './features/cart/cartSlice';
import productEventsReducer from './features/products/productEventsSlice';

// RTK Query APIs
import productsApi from './features/products/productsApi';
import ordersApi from './features/orders/ordersApi';

// Persistence
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

// -----------------------------------------------------------------------------
// Persist Configs
// -----------------------------------------------------------------------------
// 🛒 Only persist cart (keep other slices ephemeral)
const cartPersistConfig = {
  key: 'cart',
  storage,
};

// -----------------------------------------------------------------------------
// Root Reducer
// -----------------------------------------------------------------------------
// - Wrap cart with persistReducer
// - Mount RTK Query reducers under their respective reducerPath keys
const rootReducer = combineReducers({
  cart: persistReducer(cartPersistConfig, cartReducer),
  productEvents: productEventsReducer,
  [productsApi.reducerPath]: productsApi.reducer,
  [ordersApi.reducerPath]: ordersApi.reducer,
});

// -----------------------------------------------------------------------------
// Store
// -----------------------------------------------------------------------------
// - Configure middleware to include RTK Query middlewares
// - Relax serializable checks for redux-persist internal actions
export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore redux-persist action types that carry non-serializable payloads
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(productsApi.middleware, ordersApi.middleware),
});

// -----------------------------------------------------------------------------
// Persistor
// -----------------------------------------------------------------------------
// - Bootstraps persistence (rehydration handled by PersistGate in UI layer)
export const persistor = persistStore(store);
