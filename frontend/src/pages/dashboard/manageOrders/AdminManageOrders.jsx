import React, { useState, useEffect } from "react";
import {
  useGetAllOrdersQuery,
  useUpdateOrderMutation,
  useDeleteOrderMutation,
} from "../../../redux/features/orders/ordersApi.js";
import Swal from "sweetalert2";
import { getImgUrl } from "../../../utils/getImgUrl";
import "../../../Styles/StylesAdminManageOrders.css";
import { useTranslation } from "react-i18next";

const AdminManageOrders = () => {
  const { data: orders = [], isLoading, error, refetch } = useGetAllOrdersQuery(undefined, {
    pollingInterval: 5000,
    refetchOnMountOrArgChange: true,
    refetchOnReconnect: true,
  });
  
  const [updateOrder] = useUpdateOrderMutation();
  const [deleteOrder] = useDeleteOrderMutation();
  const [editingOrder, setEditingOrder] = useState(null);
  const [updatedValues, setUpdatedValues] = useState({});

  const { i18n } = useTranslation();

  const handleEdit = async (orderId, order) => {
    try {
      await updateOrder({
        orderId,
        isPaid:
          updatedValues.isPaid !== undefined
            ? updatedValues.isPaid
            : order.isPaid,
        isDelivered:
          updatedValues.isDelivered !== undefined
            ? updatedValues.isDelivered
            : order.isDelivered,
      }).unwrap();

      Swal.fire("Succès", "Commande mise à jour avec succès !", "success");
      setEditingOrder(null);
      setUpdatedValues({});
      refetch();
    } catch (error) {
      Swal.fire("Erreur", "Échec de la mise à jour de la commande. Veuillez réessayer.", "error");
    }
  };

  const handleChange = (field, value) => {
    setUpdatedValues((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const startEditingOrder = (order) => {
    setEditingOrder(order._id);
    setUpdatedValues({
      isPaid: order.isPaid,
      isDelivered: order.isDelivered,
    });
  };

  const handleDelete = async (orderId) => {
    Swal.fire({
      title: "Êtes-vous sûr ?",
      text: "Vous ne pourrez pas revenir en arrière !",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Oui, supprimez-le !",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteOrder({ orderId }).unwrap();
          Swal.fire("Supprimé !", "La commande a été supprimée.", "success");
          refetch();
        } catch (error) {
          Swal.fire("Erreur", "Échec de la suppression de la commande. Veuillez réessayer.", "error");
        }
      }
    });
  };

  useEffect(() => {
    document.documentElement.dir = "ltr";
  }, []);
  

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg font-semibold text-gray-600">Chargement des commandes...</p>
      </div>
    );
  }
  
  if (error) return <p style={{ color: "red" }}>{error.message}</p>;


  return (
    <section className="py-1 bg-blueGray-50">
        <div className="w-full max-w-7xl mx-auto px-6 mt-24">

            <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded ">
                <div className="rounded-t mb-0 px-4 py-3 border-0">
                    <div className="flex flex-wrap items-center">
                        <div className="relative w-full px-4 max-w-full flex-grow flex-1">
                            <h3 className="font-semibold text-base text-blueGray-700">Toutes les Commandes</h3>
                        </div>
                    </div>
                </div>
                <div className="block w-full overflow-x-auto">
                    <table className="items-center bg-transparent w-full border-collapse ">
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

                        <tbody className="text-sm font-medium text-gray-600">
                            {orders.map((order, index) => (
                                <tr key={`${order._id}-${index}`} className="border-b hover:bg-gray-100 transition">
                                    <td className="px-6 py-3 border">{index + 1}</td>
                                    <td className="px-6 py-3 border">{order._id.slice(0, 8)}...</td>
                                    <td className="px-6 py-3 border">
                                    {order.products.map((prod, idx) => (
  <div key={`${prod.productId?._id || prod.productId}-${idx}`} className="mb-2">
    <strong>Produit:</strong> {prod.productId?.title || prod.title || "Produit inconnu"} <br />
    <strong>ID:</strong> {prod.productId?._id?.slice(0, 8) || "N/A"} <br />
    <strong>Qté:</strong> {prod.quantity} <br />
    {prod.color && (
      <div>
        <strong>Couleur:</strong>{" "}
        {typeof prod.color.colorName === "object"
          ? prod.color.colorName[i18n.language] || prod.color.colorName.en || "Original"
          : prod.color.colorName || "Original"} <br />
        {prod.color.image ? (
          <img
            src={getImgUrl(prod.color.image)}
            alt="Couleur"
            className="w-16 h-16 rounded border mt-1"
            loading="lazy"
            style={{ objectFit: "cover" }}
          />
        ) : (
          <div className="w-16 h-16 bg-gray-200 rounded border flex items-center justify-center">
            <span className="text-xs text-gray-500">Pas d'image</span>
          </div>
        )}
      </div>
    )}
  </div>
))}

                                    </td>
                                    <td className="px-6 py-3 border">{order.name}</td>
                                    <td className="px-6 py-3 border">{order.email}</td>
                                    <td className="px-6 py-3 border">{order.phone}</td>
                                    <td className="px-6 py-3 border">
                                        {order.address.city}, {order.address.street}
                                    </td>
                                    <td className="px-6 py-3 border">{order.totalPrice} USD</td>
                                    <td className="px-4 py-3 border">
  <div className="min-w-[90px]">
    <select
      value={editingOrder === order._id ? updatedValues.isPaid ?? order.isPaid : order.isPaid}
      onChange={(e) => handleChange("isPaid", e.target.value === "true")}
      disabled={editingOrder !== order._id}
      className="w-full px-2 py-1 rounded-md border text-xs sm:text-sm"
    >
      <option value="true">Oui</option>
      <option value="false">Non</option>
    </select>
  </div>
</td>

<td className="px-4 py-3 border">
  <div className="min-w-[90px]">
    <select
      value={editingOrder === order._id ? updatedValues.isDelivered ?? order.isDelivered : order.isDelivered}
      onChange={(e) => handleChange("isDelivered", e.target.value === "true")}
      disabled={editingOrder !== order._id}
      className="w-full px-2 py-1 rounded-md border text-xs sm:text-sm"
    >
      <option value="true">Oui</option>
      <option value="false">Non</option>
    </select>
  </div>
</td>


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
                    </table>
                </div>
            </div>
        </div>
    </section>
);


};

export default AdminManageOrders;
