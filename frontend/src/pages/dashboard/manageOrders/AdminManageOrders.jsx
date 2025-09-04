// AdminManageOrders.jsx
// -------------------------------------------------------------
// Purpose: Admin table to view, edit (isPaid/isDelivered), and
//          delete orders. Uses RTK Query for data fetching and
//          mutations, SweetAlert2 for confirmations, and i18n
//          for language handling.
// NOTE: Only reorganization and comments have been added.
//       No logic, text, or UI content was modified.
// -------------------------------------------------------------

import React, { useState, useEffect, useMemo } from "react";

// 🔌 RTK Query hooks (Orders API)
import {
  useGetAllOrdersQuery,
  useUpdateOrderMutation,
  useDeleteOrderMutation,
} from "../../../redux/features/orders/ordersApi.js";

// 🧰 Utilities & libs
import Swal from "sweetalert2";
import { getImgUrl } from "../../../utils/getImgUrl";
import { useTranslation } from "react-i18next";

// 🖌️ Styles
import "../../../Styles/StylesAdminManageOrders.css";

// -------------------------------------------------------------
// Component
// -------------------------------------------------------------
const AdminManageOrders = () => {
  // -----------------------------------------------------------------
  // 1) Data fetching: get all orders (with auto-refetch options)
  // -----------------------------------------------------------------
  const {
    data: orders = [],
    isLoading,
    error,
    refetch,
  } = useGetAllOrdersQuery(undefined, {
    pollingInterval: 5000,
    refetchOnMountOrArgChange: true,
    refetchOnReconnect: true,
  });

  // -----------------------------------------------------------------
  // 2) Mutations: update & delete orders
  // -----------------------------------------------------------------
  const [updateOrder] = useUpdateOrderMutation();
  const [deleteOrder] = useDeleteOrderMutation();

  // -----------------------------------------------------------------
  // 3) Local UI state: editing row & form values
  // -----------------------------------------------------------------
  const [editingOrder, setEditingOrder] = useState(null);
  const [updatedValues, setUpdatedValues] = useState({});

  // -----------------------------------------------------------------
  // 4) i18n helpers
  // -----------------------------------------------------------------
  const { i18n } = useTranslation();
  const lang = i18n.language || "fr";

  // -----------------------------------------------------------------
  // 5) Derived data: sort orders (oldest -> newest)
  //     - Ensures first row corresponds to the earliest order
  // -----------------------------------------------------------------
  const sortedOrders = useMemo(
    () => [...orders].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)),
    [orders]
  );

  // -----------------------------------------------------------------
  // 6) Handlers
  // -----------------------------------------------------------------

  // Save current edited order (only isPaid/isDelivered)
  const handleEdit = async (orderId, order) => {
    try {
      await updateOrder({
        orderId,
        isPaid:
          updatedValues.isPaid !== undefined ? updatedValues.isPaid : order.isPaid,
        isDelivered:
          updatedValues.isDelivered !== undefined
            ? updatedValues.isDelivered
            : order.isDelivered,
      }).unwrap();

      Swal.fire("Succès", "Commande mise à jour avec succès !", "success");
      setEditingOrder(null);
      setUpdatedValues({});
      refetch();
    } catch (err) {
      Swal.fire(
        "Erreur",
        "Échec de la mise à jour de la commande. Veuillez réessayer.",
        "error"
      );
    }
  };

  // Update local form values while editing
  const handleChange = (field, value) => {
    setUpdatedValues((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Enter edit mode for a specific order
  const startEditingOrder = (order) => {
    setEditingOrder(order._id);
    setUpdatedValues({
      isPaid: order.isPaid,
      isDelivered: order.isDelivered,
    });
  };

  // Delete an order (with confirmation)
  const handleDelete = async (orderId) => {
    Swal.fire({
      title: "Êtes-vous sûr ?",
      text: "Vous ne pourrez pas revenir en arrière !",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Oui, supprimez-la !",
      cancelButtonText: "Annuler",
    }).then(async (result) => {
      if (!result.isConfirmed) return;

      try {
        // ✅ RTK endpoint expects the raw id string
        await deleteOrder(orderId).unwrap();
        Swal.fire("Supprimée !", "La commande a été supprimée.", "success");
        refetch();
      } catch (err) {
        Swal.fire(
          "Erreur",
          "Échec de la suppression de la commande. Veuillez réessayer.",
          "error"
        );
      }
    });
  };

  // -----------------------------------------------------------------
  // 7) Effects
  // -----------------------------------------------------------------
  useEffect(() => {
    // Force LTR layout for this admin table view
    document.documentElement.dir = "ltr";
  }, []);

  // -----------------------------------------------------------------
  // 8) Early returns: loading / error
  // -----------------------------------------------------------------
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg font-semibold text-gray-600">
          Chargement des commandes...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <p style={{ color: "red" }}>
        {error?.data?.message || error?.message || "Erreur de chargement"}
      </p>
    );
  }

  // -----------------------------------------------------------------
  // 9) Render
  // -----------------------------------------------------------------
  return (
    <section className="py-1 bg-blueGray-50">
      <div className="w-full max-w-7xl mx-auto px-6 mt-24">
        {/* Card wrapper */}
        <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">
          {/* Header */}
          <div className="rounded-t mb-0 px-4 py-3 border-0">
            <div className="flex flex-wrap items-center">
              <div className="relative w-full px-4 max-w-full flex-grow flex-1">
                <h3 className="font-semibold text-base text-blueGray-700">
                  Toutes les Commandes
                </h3>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="block w-full overflow-x-auto">
            <table className="items-center bg-transparent w-full border-collapse">
              {/* Table head */}
              <thead>
                <tr className="border-b border-gray-300 text-left text-md font-semibold text-gray-800">
                  <th className="px-6 py-3 border">#</th>
                  <th className="px-6 py-3 border">ID Commande</th>
                  <th className="px-6 py-3 border">Produits</th>
                  <th className="px-6 py-3 border">Client</th>
                  <th className="px-6 py-3 border">Mail</th>
                  <th className="px-6 py-3 border">Téléphone</th>
                  <th className="px-6 py-3 border">Adresse</th>
                  <th className="px-6 py-3 border">Prix Total</th>
                  <th className="px-6 py-3 border">Payé</th>
                  <th className="px-6 py-3 border">Livré</th>
                  <th className="px-6 py-3 border">Actions</th>
                </tr>
              </thead>

              {/* Table body */}
              <tbody className="text-sm font-medium text-gray-600">
                {sortedOrders.map((order, index) => (
                  <tr
                    key={`${order._id}-${index}`}
                    className="border-b hover:bg-gray-100 transition"
                  >
                    {/* Index */}
                    <td className="px-6 py-3 border">{index + 1}</td>

                    {/* Order ID (shortened) */}
                    <td className="px-6 py-3 border" title={order._id}>
                      {order._id.slice(0, 8)}...
                    </td>

                    {/* Products list */}
                    <td className="px-6 py-3 border">
                      {order.products.map((prod, idx) => {
                        // Normalize product id whether object or string
                        const productId = prod.productId?._id || prod.productId;

                        // Title fallbacks
                        const productTitle =
                          prod.productId?.title || prod.title || "Produit inconnu";

                        // Color name (supports multilingual object or string)
                        const colorName =
                          typeof prod?.color?.colorName === "object"
                            ? prod.color.colorName[lang] ||
                              prod.color.colorName.en ||
                              "Original"
                            : prod?.color?.colorName || "Original";

                        // Optional color image
                        const colorImage = prod?.color?.image;

                        return (
                          <div
                            key={`${productId || "noid"}-${idx}`}
                            className="mb-2"
                          >
                            <strong>Produit:</strong> {productTitle} <br />
                            <strong>ID:</strong>{" "}
                            {productId ? String(productId).slice(0, 8) : "N/A"} <br />
                            <strong>Qté:</strong> {prod.quantity} <br />
                            {prod.color && (
                              <div className="mt-1">
                                <strong>Couleur:</strong> {colorName} <br />
                                {colorImage ? (
                                  <img
                                    src={getImgUrl(colorImage)}
                                    alt="Couleur"
                                    className="w-16 h-16 rounded border mt-1"
                                    loading="lazy"
                                    style={{ objectFit: "cover" }}
                                  />
                                ) : (
                                  <div className="w-16 h-16 bg-gray-200 rounded border flex items-center justify-center mt-1">
                                    <span className="text-xs text-gray-500">
                                      Pas d'image
                                    </span>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </td>

                    {/* Customer info */}
                    <td className="px-6 py-3 border">{order.name}</td>
                    <td className="px-6 py-3 border">{order.email}</td>
                    <td className="px-6 py-3 border">{order.phone}</td>

                    {/* Address */}
                    <td className="px-6 py-3 border">
                      {order?.address?.city || "—"},{" "}
                      {order?.address?.street || "—"}
                    </td>

                    {/* Price */}
                    <td className="px-6 py-3 border">{order.totalPrice} USD</td>

                    {/* Select: Paid */}
                    <td className="px-4 py-3 border">
                      <div className="min-w-[90px]">
                        <select
                          value={
                            editingOrder === order._id
                              ? updatedValues.isPaid ?? order.isPaid
                              : order.isPaid
                          }
                          onChange={(e) =>
                            handleChange("isPaid", e.target.value === "true")
                          }
                          disabled={editingOrder !== order._id}
                          className="w-full px-2 py-1 rounded-md border text-xs sm:text-sm"
                        >
                          <option value="true">Oui</option>
                          <option value="false">Non</option>
                        </select>
                      </div>
                    </td>

                    {/* Select: Delivered */}
                    <td className="px-4 py-3 border">
                      <div className="min-w-[90px]">
                        <select
                          value={
                            editingOrder === order._id
                              ? updatedValues.isDelivered ?? order.isDelivered
                              : order.isDelivered
                          }
                          onChange={(e) =>
                            handleChange("isDelivered", e.target.value === "true")
                          }
                          disabled={editingOrder !== order._id}
                          className="w-full px-2 py-1 rounded-md border text-xs sm:text-sm"
                        >
                          <option value="true">Oui</option>
                          <option value="false">Non</option>
                        </select>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-3 border">
                      <div className="flex justify-center items-center gap-4">
                        {editingOrder !== order._id ? (
                          <button
                            onClick={() => startEditingOrder(order)}
                            className="min-w-[110px] px-4 py-2 rounded-full text-sm font-medium text-white text-center whitespace-nowrap bg-yellow-500 hover:bg-yellow-600 transition"
                          >
                            Modifier
                          </button>
                        ) : (
                          <button
                            onClick={() => handleEdit(order._id, order)}
                            className="min-w-[110px] px-4 py-2 rounded-full text-sm font-medium text-white text-center whitespace-nowrap bg-blue-500 hover:bg-blue-600 transition"
                          >
                            Enregistrer
                          </button>
                        )}

                        <button
                          onClick={() => handleDelete(order._id)}
                          className="min-w-[110px] px-4 py-2 rounded-full text-sm font-medium text-white text-center whitespace-nowrap bg-red-500 hover:bg-red-600 transition"
                        >
                          Supprimer
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
              {/* /Table body */}
            </table>
          </div>
          {/* /Table */}
        </div>
        {/* /Card wrapper */}
      </div>
    </section>
  );
};

export default AdminManageOrders;
