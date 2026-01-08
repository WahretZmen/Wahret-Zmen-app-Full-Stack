import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
import { useGetOrderByIdQuery, useUpdateOrderMutation } from "../../../redux/features/orders/ordersApi"; // Import the hook correctly
import Swal from "sweetalert2";
import Loading from "../../../components/Loading";  // A loading component

const UpdateOrder = () => {
  const { id } = useParams();  // Get the order ID from URL
  const navigate = useNavigate();

  // Fetch the order by ID using the query hook
  const { data: orderData, isLoading, isError } = useGetOrderByIdQuery(id);
  const [updateOrder] = useUpdateOrderMutation();  // Mutation hook for updating the order

  // Use form hook to manage the form
  const { register, handleSubmit, setValue } = useForm();

  useEffect(() => {
    if (orderData) {
      // Pre-populate the form with the existing order data
      setValue("name", orderData.name);
      setValue("email", orderData.email);
      setValue("address", orderData.address);
      setValue("phone", orderData.phone);
      setValue("productIds", orderData.productIds.join(", "));
      setValue("totalPrice", orderData.totalPrice);
      setValue("isPaid", orderData.isPaid);
      setValue("isDelivered", orderData.isDelivered);
      setValue("completionPercentage", orderData.completionPercentage);
    }
  }, [orderData, setValue]);

  // Handle form submission to update the order
  const onSubmit = async (data) => {
    const updatedOrderData = {
      ...data,
      productIds: data.productIds.split(", "),  // Convert product IDs back into an array
    };

    try {
      await updateOrder({ orderId: id, ...updatedOrderData }).unwrap();
      Swal.fire("Success", "Order updated successfully!", "success");
      navigate("/dashboard/manage-orders");  // Redirect to orders list
    } catch (error) {
      Swal.fire("Error", "Failed to update order. Please try again.", "error");
    }
  };

  if (isLoading) return <Loading />;
  if (isError) return <div className="text-center text-red-500">Error fetching order data.</div>;

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md text-gray-800">
      <h2 className="text-2xl font-bold text-center text-[#A67C52] mb-4">Update Order</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input
          {...register("name")}
          className="w-full p-2 border rounded"
          placeholder="Customer Name"
          required
        />
        <input
          {...register("email")}
          type="email"
          className="w-full p-2 border rounded"
          placeholder="Customer Email"
          required
        />
        <textarea
          {...register("address")}
          className="w-full p-2 border rounded"
          placeholder="Customer Address"
          required
        />
        <input
          {...register("phone")}
          type="number"
          className="w-full p-2 border rounded"
          placeholder="Phone Number"
          required
        />
        <input
          {...register("productIds")}
          type="text"
          className="w-full p-2 border rounded"
          placeholder="Product IDs (comma separated)"
          required
        />
        <input
          {...register("totalPrice")}
          type="number"
          className="w-full p-2 border rounded"
          placeholder="Total Price"
          required
        />
        <select {...register("isPaid")} className="w-full p-2 border rounded" required>
          <option value="">Select Payment Status</option>
          <option value={true}>Paid</option>
          <option value={false}>Not Paid</option>
        </select>
        <select {...register("isDelivered")} className="w-full p-2 border rounded" required>
          <option value="">Select Delivery Status</option>
          <option value={true}>Delivered</option>
          <option value={false}>Not Delivered</option>
        </select>
        <input
          {...register("completionPercentage")}
          type="number"
          min="0"
          max="100"
          className="w-full p-2 border rounded"
          placeholder="Completion Percentage"
          required
        />

        <button
          type="submit"
          className="w-full py-2 bg-[#A67C52] text-white rounded-md hover:bg-[#8a5d3b] transition"
        >
          Update Order
        </button>
      </form>
    </div>
  );
};

export default UpdateOrder;
