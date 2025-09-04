// src/components/.../addOrder.jsx
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useCreateOrderMutation } from "../../../redux/features/orders/ordersApi"; // assumes RTK Query slice is set up
import Swal from "sweetalert2";

/* =============================================================================
   📦 AddOrder (Admin)
   - Minimal admin form to create an order via RTK Query mutation
   - Uses react-hook-form for simple form state + validation
   - SweetAlert2 feedback on success/error
   - NOTE: This form sends a flat payload exactly as-is. If your backend
     expects a nested address object or detailed products array, adapt the
     transform on submit (but we’re NOT changing behavior here).
============================================================================= */
const AddOrder = () => {
  const { register, handleSubmit, reset } = useForm();

  // RTK Query mutation hook (assumed present)
  const [createOrder] = useCreateOrderMutation();

  /* ---------------------------------------------------------------------------
     Submit handler
     - Sends form data straight to the API (no shape mutations)
     - Shows basic success/error toasts
  --------------------------------------------------------------------------- */
  const onSubmit = async (data) => {
    try {
      await createOrder(data).unwrap();
      Swal.fire("Success!", "Order added successfully!", "success");
      reset();
    } catch (error) {
      Swal.fire("Error!", "Failed to add order.", "error");
    }
  };

  /* ---------------------------------------------------------------------------
     Render
  --------------------------------------------------------------------------- */
  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md text-gray-800">
      <h2 className="text-2xl font-bold text-center text-[#A67C52] mb-4">
        Add New Order
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Customer Name */}
        <input
          {...register("name")}
          className="w-full p-2 border rounded"
          placeholder="Customer Name"
          required
          autoComplete="name"
        />

        {/* Customer Email */}
        <input
          {...register("email")}
          type="email"
          className="w-full p-2 border rounded"
          placeholder="Customer Email"
          required
          autoComplete="email"
        />

        {/* Address (flat string, as per current component contract) */}
        <textarea
          {...register("address")}
          className="w-full p-2 border rounded"
          placeholder="Customer Address"
          required
          rows={3}
        />

        {/* Phone */}
        <input
          {...register("phone")}
          type="number"
          className="w-full p-2 border rounded"
          placeholder="Phone Number"
          required
          inputMode="numeric"
        />

        {/* Product IDs (comma separated) */}
        <input
          {...register("productIds")}
          type="text"
          className="w-full p-2 border rounded"
          placeholder="Product IDs (comma separated)"
          required
        />

        {/* Total Price */}
        <input
          {...register("totalPrice")}
          type="number"
          className="w-full p-2 border rounded"
          placeholder="Total Price"
          required
          step="0.01"
          min="0"
        />

        {/* Payment Status */}
        <select
          {...register("isPaid")}
          className="w-full p-2 border rounded"
          required
        >
          <option value="">Select Payment Status</option>
          <option value={true}>Paid</option>
          <option value={false}>Not Paid</option>
        </select>

        {/* Delivery Status */}
        <select
          {...register("isDelivered")}
          className="w-full p-2 border rounded"
          required
        >
          <option value="">Select Delivery Status</option>
          <option value={true}>Delivered</option>
          <option value={false}>Not Delivered</option>
        </select>

        {/* Completion Percentage */}
        <input
          {...register("completionPercentage")}
          type="number"
          min="0"
          max="100"
          className="w-full p-2 border rounded"
          placeholder="Completion Percentage"
          required
        />

        {/* Submit */}
        <button
          type="submit"
          className="w-full py-2 bg-[#A67C52] text-white rounded-md hover:bg-[#8a5d3b] transition"
        >
          Add Order
        </button>
      </form>
    </div>
  );
};

export default AddOrder;
