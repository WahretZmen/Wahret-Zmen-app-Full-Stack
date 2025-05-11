import { createSlice } from "@reduxjs/toolkit";

const productSlice = createSlice({
  name: "product",
  initialState: {
    products: [],
    shouldRefetch: false, // 👈 flag to trigger refetch
  },
  reducers: {
    setProducts: (state, action) => {
      state.products = action.payload;
    },
    triggerRefetch: (state) => {
      state.shouldRefetch = true;
    },
    resetRefetch: (state) => {
      state.shouldRefetch = false;
    },
  },
});

export const { setProducts, triggerRefetch, resetRefetch } = productSlice.actions;
export default productSlice.reducer;
