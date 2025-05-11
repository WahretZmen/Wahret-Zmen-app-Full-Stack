import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useCreateOrderMutation } from "../../../redux/features/orders/ordersApi";  // Assuming you have an `ordersApi` set up
import Swal from "sweetalert2";

const AddOrder = () => {
  const { register, handleSubmit, reset } = useForm();
  const [createOrder] = useCreateOrderMutation();  // Assuming the mutation hook is set up for creating orders

  // Handle form submission
  const onSubmit = async (data) => {
    try {
      await createOrder(data).unwrap();  // Send the order data to the backend
      Swal.fire("Success!", "Order added successfully!", "success");
      reset();  // Reset the form fields after submission
    } catch (error) {
      Swal.fire("Error!", "Failed to add order.", "error");
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md text-gray-800">
      <h2 className="text-2xl font-bold text-center text-[#A67C52] mb-4">Add New Order</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Customer Name */}
        <input
          {...register("name")}
          className="w-full p-2 border rounded"
          placeholder="Customer Name"
          required
        />
        {/* Customer Email */}
        <input
          {...register("email")}
          type="email"
          className="w-full p-2 border rounded"
          placeholder="Customer Email"
          required
        />
        {/* Address */}
        <textarea
          {...register("address")}
          className="w-full p-2 border rounded"
          placeholder="Customer Address"
          required
        />
        {/* Phone */}
        <input
          {...register("phone")}
          type="number"
          className="w-full p-2 border rounded"
          placeholder="Phone Number"
          required
        />
        {/* Product IDs (if you have product data to link) */}
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
        />
        {/* Payment Status */}
        <select {...register("isPaid")} className="w-full p-2 border rounded" required>
          <option value="">Select Payment Status</option>
          <option value={true}>Paid</option>
          <option value={false}>Not Paid</option>
        </select>
        {/* Delivery Status */}
        <select {...register("isDelivered")} className="w-full p-2 border rounded" required>
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

        {/* Submit Button */}
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
