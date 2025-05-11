// src/redux/features/products/productEventsSlice.js
import { createSlice } from "@reduxjs/toolkit";

const productEventsSlice = createSlice({
  name: "productEvents",
  initialState: { shouldRefetch: false },
  reducers: {
    triggerRefetch: (state) => {
      state.shouldRefetch = true;
    },
    resetRefetch: (state) => {
      state.shouldRefetch = false;
    },
  },
});

export const productEventsActions = productEventsSlice.actions;
export default productEventsSlice.reducer;
