// src/redux/features/products/productsSlice.js
// -----------------------------------------------------------------------------
// Purpose: Redux slice for managing products state and refetch triggers.
// Features:
//   - Holds products array in state
//   - Provides flag `shouldRefetch` to tell components when to refresh data
//   - Simple actions for setting products and controlling refetch flag
// Notes:
//   - No functional changes; only organization & comments added.
// -----------------------------------------------------------------------------

import { createSlice } from "@reduxjs/toolkit";

// -----------------------------------------------------------------------------
// Slice
// -----------------------------------------------------------------------------
const productSlice = createSlice({
  name: "product",

  // ---------------------------------------------------------------------------
  // Initial State
  // ---------------------------------------------------------------------------
  initialState: {
    products: [],
    shouldRefetch: false, // 👈 flag to trigger refetch
  },

  // ---------------------------------------------------------------------------
  // Reducers
  // ---------------------------------------------------------------------------
  reducers: {
    // Replace products array
    setProducts: (state, action) => {
      state.products = action.payload;
    },

    // Signal that products should be refetched
    triggerRefetch: (state) => {
      state.shouldRefetch = true;
    },

    // Reset the refetch flag
    resetRefetch: (state) => {
      state.shouldRefetch = false;
    },
  },
});

// -----------------------------------------------------------------------------
// Exports
// -----------------------------------------------------------------------------
export const { setProducts, triggerRefetch, resetRefetch } = productSlice.actions;
export default productSlice.reducer;
