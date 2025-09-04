// src/redux/features/products/productEventsSlice.js
// -----------------------------------------------------------------------------
// Purpose : Redux slice to coordinate product list refresh events across the app.
//           Components can dispatch triggerRefetch → refresh product list,
//           then resetRefetch once complete.
// -----------------------------------------------------------------------------

import { createSlice } from "@reduxjs/toolkit";

// -----------------------------------------------------------------------------
// Slice definition
// -----------------------------------------------------------------------------
const productEventsSlice = createSlice({
  name: "productEvents",
  initialState: { shouldRefetch: false },

  reducers: {
    // Flag product list should be refreshed (true)
    triggerRefetch: (state) => {
      state.shouldRefetch = true;
    },

    // Reset the flag after refresh is handled (false)
    resetRefetch: (state) => {
      state.shouldRefetch = false;
    },
  },
});

// -----------------------------------------------------------------------------
// Exports
// -----------------------------------------------------------------------------
export const productEventsActions = productEventsSlice.actions;
export default productEventsSlice.reducer;
