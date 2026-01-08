// src/redux/features/products/productEventsSlice.js
// -----------------------------------------------------------------------------
// Purpose : Redux slice to coordinate product list refresh events across the app.
//           Components can dispatch triggerRefetch → refresh product list,
//           then resetRefetch once complete.
// -----------------------------------------------------------------------------
//
// Notes:
// - This slice is intentionally tiny: a single boolean flag `shouldRefetch`.
// - It avoids coupling to any API logic; consumers decide what "refetch" means.
// - Keep actions names stable (triggerRefetch / resetRefetch) as other
//   components may already depend on them.
//
// Example usage:
//   const dispatch = useDispatch();
//   const shouldRefetch = useSelector((s) => s.productEvents.shouldRefetch);
//
//   useEffect(() => {
//     if (shouldRefetch) {
//       dispatch(productsApi.endpoints.getAllProducts.initiate())
//         .finally(() => dispatch(productEventsActions.resetRefetch()));
//     }
//   }, [shouldRefetch, dispatch]);
//
// -----------------------------------------------------------------------------

import { createSlice } from "@reduxjs/toolkit";

// -----------------------------------------------------------------------------
// Slice definition
// -----------------------------------------------------------------------------
const productEventsSlice = createSlice({
  name: "productEvents",

  // Single-flag state: when `true`, interested views should refetch products.
  initialState: { shouldRefetch: false },

  reducers: {
    /**
     * Set the refetch flag to true.
     * Views/selectors can watch this and kick off a products refetch.
     */
    triggerRefetch: (state) => {
      state.shouldRefetch = true;
    },

    /**
     * Reset the refetch flag to false after the refetch logic has run.
     * Call this once your component has handled the refresh.
     */
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
