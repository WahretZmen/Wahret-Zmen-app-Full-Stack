// src/redux/features/products/productsSlice.js
// ============================================================================
// 🧱 Products Slice (Redux Toolkit)
// ----------------------------------------------------------------------------
// Purpose:
//   • Store all fetched products in local state.
//   • Expose a `shouldRefetch` flag for cross-component synchronization.
//   • Provide simple reducers for data updates and refetch triggers.
//
// Notes:
//   • Used alongside RTK Query (productsApi.js).
//   • Clean, lightweight, and designed for reusability.
// ============================================================================

import { createSlice } from "@reduxjs/toolkit";

// ---------------------------------------------------------------------------
// Initial State
// ---------------------------------------------------------------------------
const initialState = {
  products: [],       // Cached list of products
  shouldRefetch: false, // Tells other components when data needs to refresh
};

// ---------------------------------------------------------------------------
// Slice Definition
// ---------------------------------------------------------------------------
const productSlice = createSlice({
  name: "product",
  initialState,

  reducers: {
    /**
     * Replace the products array.
     * @param {Array} action.payload - New products array.
     */
    setProducts: (state, action) => {
      state.products = action.payload;
    },

    /**
     * Trigger refetch (used by dashboard or orders when a change happens).
     */
    triggerRefetch: (state) => {
      state.shouldRefetch = true;
    },

    /**
     * Reset the refetch flag after a refresh.
     */
    resetRefetch: (state) => {
      state.shouldRefetch = false;
    },
  },
});

// ---------------------------------------------------------------------------
// Exports
// ---------------------------------------------------------------------------
export const { setProducts, triggerRefetch, resetRefetch } = productSlice.actions;
export default productSlice.reducer;
