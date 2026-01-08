
// AdminManageOrders.jsx
// -------------------------------------------------------------
// Purpose: Admin table to view, edit (isPaid/isDelivered), and
//          delete orders. Uses RTK Query for data fetching and
//          mutations + SweetAlert2 in Arabic
// -------------------------------------------------------------

import React, { useState, useEffect, useMemo } from "react";
import {
  useGetAllOrdersQuery,
  useUpdateOrderMutation,
  useDeleteOrderMutation,
} from "../../../redux/features/orders/ordersApi.js";

import Swal from "sweetalert2";
import { getImgUrl } from "../../../utils/getImgUrl";
import { useTranslation } from "react-i18next";
import "../../../Styles/StylesAdminManageOrders.css";

const AdminManageOrders = () => {
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

  const [updateOrder] = useUpdateOrderMutation();
  const [deleteOrder] = useDeleteOrderMutation();

  const [editingOrder, setEditingOrder] = useState(null);
  const [updatedValues, setUpdatedValues] = useState({});

  const { i18n } = useTranslation();
  const lang = i18n.language || "ar";

  // 🔹 Helper embroidery text
  const embroideryText = (prod) => {
    const raw =
      prod?.embroideryCategory || prod?.productId?.embroideryCategory;

    if (!raw) return null;
    if (typeof raw === "string") return raw;

    if (typeof raw === "object") {
      const v =
        raw[lang] ||
        raw[i18n.language] ||
        raw.ar ||
        raw.fr ||
        raw.en ||
        Object.values(raw).find(
          (x) => typeof x === "string" && x.trim().length > 0
        );
      return v || null;
    }
    return null;
  };

  // 🔹 Format address
  const formatAddress = (address) => {
    if (!address) return "—";
    if (typeof address === "string") return address;

    const parts = [];
    if (address.country) parts.push(address.country);
    if (address.state) parts.push(address.state);
    if (address.city) parts.push(address.city);
    if (address.postalCode) parts.push(address.postalCode);
    if (address.street) parts.push(address.street);
    if (address.building) parts.push(address.building);
    if (address.apartment) parts.push(address.apartment);
    if (address.extra) parts.push(address.extra);

    return parts.length ? parts.join(" , ") : "—";
  };

  // 🔹 Show order details popup (Arabic)
  const handleShowDetails = (order) => {
    const createdAt = order.createdAt
      ? new Date(order.createdAt).toLocaleString("ar-TN")
      : "—";

    const fullAddress = formatAddress(order.address);
    const products = Array.isArray(order.products) ? order.products : [];

    const productsHtml = products
      .map((prod, idx) => {
        const productId = prod.productId?._id || prod.productId;
        const productTitle =
          prod.productId?.title || prod.title || "منتج غير معروف";

        const colorName =
          typeof prod?.color?.colorName === "object"
            ? prod.color.colorName.ar ||
              prod.color.colorName[lang] ||
              "افتراضي"
            : prod?.color?.colorName || "افتراضي";

        const embName = embroideryText(prod);

        const unitPrice =
          prod.price || prod.unitPrice || prod.productId?.price || 0;
        const lineTotal = Number(unitPrice) * Number(prod.quantity || 1);

        return `
          <div style="text-align:right; margin-bottom:8px; direction:rtl;">
            <strong>المنتج ${idx + 1} :</strong> ${productTitle}<br/>
            <strong>ID :</strong> ${
              productId ? String(productId).slice(0, 12) : "N/A"
            }<br/>
            <strong>الكمية :</strong> ${prod.quantity || 1}<br/>
            <strong>السعر للوحدة :</strong> ${unitPrice} TND<br/>
            <strong>إجمالي السطر :</strong> ${lineTotal} TND<br/>
            <strong>اللون :</strong> ${colorName}<br/>
            ${
              embName
                ? `<strong>نوع التطريز :</strong> ${embName}<br/>`
                : ""
            }
          </div>
        `;
      })
      .join("<hr/>");

    Swal.fire({
      title: "تفاصيل الطلب",
      html: `
        <div style="text-align:right; direction:rtl;">
          <p><strong>ID الطلب :</strong> ${order._id}</p>
          <p><strong>الاسم :</strong> ${order.name || "-"}</p>
          <p><strong>البريد :</strong> ${order.email || "-"}</p>
          <p><strong>الهاتف :</strong> ${order.phone || "-"}</p>
          <p><strong>العنوان :</strong> ${fullAddress}</p>
          <p><strong>السعر الإجمالي :</strong> ${order.totalPrice} TND</p>
          <p><strong>مدفوع :</strong> ${order.isPaid ? "نعم" : "لا"}</p>
          <p><strong>تم التسليم :</strong> ${order.isDelivered ? "نعم" : "لا"}</p>
          <p><strong>تاريخ الإنشاء :</strong> ${createdAt}</p>
          ${
            order.note || order.comment
              ? `<p><strong>ملاحظات :</strong> ${
                  order.note || order.comment
                }</p>`
              : ""
          }
          <hr/>
          <h3 style="font-size:15px; margin-top:10px; margin-bottom:6px;">المنتجات :</h3>
          ${productsHtml || "<p>لا يوجد منتجات مسجلة.</p>"}
        </div>
      `,
      width: 700,
      confirmButtonText: "إغلاق",
    });
  };

  // Sort orders oldest → newest
  const sortedOrders = useMemo(
    () =>
      [...orders].sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
      ),
    [orders]
  );

  // 🔹 Save edits
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

      Swal.fire("نجاح", "تم تحديث الطلب بنجاح", "success");
      setEditingOrder(null);
      setUpdatedValues({});
      refetch();
    } catch (err) {
      Swal.fire("خطأ", "فشل تحديث الطلب، حاول مرة أخرى", "error");
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

  // 🔹 Delete order (Arabic)
  const handleDelete = async (orderId) => {
    Swal.fire({
      title: "هل أنت متأكد؟",
      text: "لن تتمكن من التراجع بعد الحذف",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "نعم، احذف الطلب",
      cancelButtonText: "إلغاء",
    }).then(async (result) => {
      if (!result.isConfirmed) return;

      try {
        await deleteOrder(orderId).unwrap();
        Swal.fire("تم الحذف", "تم حذف الطلب بنجاح", "success");
        refetch();
      } catch (err) {
        Swal.fire("خطأ", "فشل حذف الطلب، حاول مرة أخرى", "error");
      }
    });
  };

  useEffect(() => {
    document.documentElement.dir = "ltr";
  }, []);

  if (isLoading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg font-semibold text-gray-600">
          جاري تحميل الطلبات...
        </p>
      </div>
    );

  if (error)
    return (
      <p style={{ color: "red" }}>
        فشل تحميل الطلبات، حاول لاحقاً
      </p>
    );
    
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

                    {/* Products list (more details inside cell) */}
                    <td className="px-6 py-3 border">
                      {order.products.map((prod, idx) => {
                        const productId = prod.productId?._id || prod.productId;

                        const productTitle =
                          prod.productId?.title || prod.title || "Produit inconnu";

                        const colorName =
                          typeof prod?.color?.colorName === "object"
                            ? prod.color.colorName[lang] ||
                              prod.color.colorName.en ||
                              "Original"
                            : prod?.color?.colorName || "Original";

                        const colorImage = prod?.color?.image;
                        const embName = embroideryText(prod);

                        const unitPrice =
                          prod.price || prod.unitPrice || prod.productId?.price || 0;
                        const lineTotal =
                          Number(unitPrice) * Number(prod.quantity || 1);

                        return (
                          <div
                            key={`${productId || "noid"}-${idx}`}
                            className="mb-2"
                          >
                            <strong>Produit :</strong> {productTitle} <br />
                            <strong>ID :</strong>{" "}
                            {productId ? String(productId).slice(0, 8) : "N/A"}{" "}
                            <br />
                            <strong>Qté :</strong> {prod.quantity} <br />
                            <strong>Prix unitaire :</strong> {unitPrice} USD <br />
                            <strong>Total :</strong> {lineTotal} USD <br />
                            {prod.color && (
                              <div className="mt-1">
                                <strong>Couleur :</strong> {colorName} <br />
                                {embName && (
                                  <>
                                    <strong>Broderie :</strong> {embName} <br />
                                  </>
                                )}
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

                    {/* Address (full) */}
                    <td className="px-6 py-3 border">
                      {formatAddress(order.address)}
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
                        {/* Détails (nouveau bouton, même style général) */}
                        <button
                          onClick={() => handleShowDetails(order)}
                          className="min-w-[110px] px-4 py-2 rounded-full text-sm font-medium text-white text-center whitespace-nowrap bg-gray-500 hover:bg-gray-600 transition"
                        >
                          Détails
                        </button>

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
