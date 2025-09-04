// carySlice.js
// -----------------------------------------------------------------------------
// Purpose: Redux slice for cart state (add, remove, update quantity, clear).
// Features:
//   - Normalizes colorName to multilingual shape when needed
//   - Matches items by product _id + normalized colorName
//   - Uses SweetAlert2 toasts for user feedback
// Notes:
//   - No functional changes; only organization & comments added.
// -----------------------------------------------------------------------------

import { createSlice } from "@reduxjs/toolkit";
import Swal from "sweetalert2";

// -----------------------------------------------------------------------------
// Initial State
// -----------------------------------------------------------------------------
const initialState = {
  cartItems: [],
};

// -----------------------------------------------------------------------------
// Slice
// -----------------------------------------------------------------------------
const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // -------------------------------------------------------------------------
    // addToCart
    // - Ensures color has a multilingual shape (en/fr/ar) if provided as string
    // - Matches an existing item by _id + colorName (deep-equal via JSON)
    // - Increments quantity if found; otherwise pushes a new item
    // - Shows a success toast
    // -------------------------------------------------------------------------
    addToCart: (state, action) => {
      const { _id, color, quantity, coverImage } = action.payload;

      // ✅ Normalize colorName to multilingual format if needed
      const colorName = color?.colorName;
      const normalizedColor =
        typeof colorName === "object"
          ? color
          : {
              colorName: {
                en: colorName || "Original",
                fr: colorName || "Original",
                ar: "أصلي",
              },
              image: color?.image || coverImage,
            };

      const existingItem = state.cartItems.find(
        (item) =>
          item._id === _id &&
          JSON.stringify(item.color?.colorName) === JSON.stringify(normalizedColor.colorName)
      );

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.cartItems.push({
          ...action.payload,
          quantity: quantity || 1,
          color: normalizedColor,
        });
      }

      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Product Added to the Cart",
        showConfirmButton: false,
        timer: 1500,
      });
    },

    // -------------------------------------------------------------------------
    // removeFromCart
    // - Builds a comparable multilingual colorName when given a string
    // - Filters out the matching item using _id + normalized colorName
    // - Shows an info toast
    // -------------------------------------------------------------------------
    removeFromCart: (state, action) => {
      const { _id, color } = action.payload;
      const colorName = color?.colorName;
      const matchColorName =
        typeof colorName === "object"
          ? JSON.stringify(colorName)
          : JSON.stringify({ en: colorName, fr: colorName, ar: "أصلي" });

      state.cartItems = state.cartItems.filter(
        (item) =>
          !(item._id === _id &&
            JSON.stringify(item.color?.colorName) === matchColorName)
      );

      Swal.fire({
        position: "top-end",
        icon: "info",
        title: "Product Removed from Cart",
        showConfirmButton: false,
        timer: 1500,
      });
    },

    // -------------------------------------------------------------------------
    // updateQuantity
    // - Finds the item by _id + normalized colorName
    // - Updates its quantity if present
    // -------------------------------------------------------------------------
    updateQuantity: (state, action) => {
      const { _id, color, quantity } = action.payload;
      const colorName = color?.colorName;
      const matchColorName =
        typeof colorName === "object"
          ? JSON.stringify(colorName)
          : JSON.stringify({ en: colorName, fr: colorName, ar: "أصلي" });

      const item = state.cartItems.find(
        (item) =>
          item._id === _id &&
          JSON.stringify(item.color?.colorName) === matchColorName
      );

      if (item) {
        item.quantity = quantity;
      }
    },

    // -------------------------------------------------------------------------
    // clearCart
    // - Empties the cart
    // - Shows a warning toast
    // -------------------------------------------------------------------------
    clearCart: (state) => {
      state.cartItems = [];
      Swal.fire({
        position: "top-end",
        icon: "warning",
        title: "Cart Cleared",
        showConfirmButton: false,
        timer: 1500,
      });
    },
  },
});

// -----------------------------------------------------------------------------
// Exports
// -----------------------------------------------------------------------------
export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
