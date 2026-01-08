// src/pages/dashboard/manageOrders/AdminOrdersProgress.jsx

// ============================================================================
// AdminOrdersProgress
// ----------------------------------------------------------------------------
// • Tracks per-item production progress for each order.
// • Each order line (product + color) is expanded into N items (quantity).
// • For every item you can select a percentage (20/40/60/80/100).
// • Saves to order.productProgress and can send notifications at 60% / 100%.
// • Shows color name and embroidery type for clarity.
// ============================================================================

import React, { useState, useEffect, useMemo } from "react";
import {
  useGetAllOrdersQuery,
  useUpdateOrderMutation,
  useSendOrderNotificationMutation,
} from "../../../redux/features/orders/ordersApi";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";

const AdminOrdersProgress = () => {
  // Data: fetch all orders
  const {
    data: ordersRaw = [],
    isLoading,
    refetch,
  } = useGetAllOrdersQuery();

  const [updateOrder] = useUpdateOrderMutation();
  const [sendNotification] = useSendOrderNotificationMutation();

  // UI state
  const [progressChanges, setProgressChanges] = useState({});
  const [editingProductKey, setEditingProductKey] = useState(null);

  const { i18n } = useTranslation();
  const lang = i18n.language || "ar";

  const progressSteps = [20, 40, 60, 80, 100];

  // Normalize orders
  const orders = useMemo(
    () => (Array.isArray(ordersRaw) ? ordersRaw : []),
    [ordersRaw]
  );

  // Build initial progress map on orders/lang change
  useEffect(() => {
    if (!orders.length) {
      setProgressChanges({});
      return;
    }
    const initial = {};

    for (const order of orders) {
      const progressMap = order?.productProgress || {};
      const lines = Array.isArray(order?.products) ? order.products : [];

      lines.forEach((prod, lineIndex) => {
        const pid =
          typeof prod?.productId === "string"
            ? prod.productId
            : prod?.productId?._id;

        if (!pid || !order?._id) return;

        const cn = prod?.color?.colorName;
        const colorName =
          typeof cn === "object"
            ? cn[lang] || cn.en || cn.fr || cn.ar || "أصلي"
            : cn || prod?.color?.name || "أصلي";

        const qty = Math.max(1, Number(prod?.quantity || 1));

        for (let itemIndex = 0; itemIndex < qty; itemIndex++) {
          const productKey = `${pid}|${colorName}|${lineIndex}-${itemIndex}`;
          const fullKey = `${order._id}|${productKey}`;
          initial[fullKey] = progressMap?.[productKey] ?? 0;
        }
      });
    }

    setProgressChanges(initial);
  }, [orders, lang]);

  // Radio change only works when item is in editing mode
  const handleCheckboxChange = (fullKey, value) => {
    if (editingProductKey === fullKey) {
      setProgressChanges((prev) => ({ ...prev, [fullKey]: value }));
    }
  };

  const handleEdit = (fullKey) => setEditingProductKey(fullKey);

  // Save progress and optionally send notification
  const handleSave = async (orderId, productKey) => {
    try {
      const fullKey = `${orderId}|${productKey}`;
      const updatedValue = progressChanges[fullKey];

      const order = orders.find((o) => o?._id === orderId);
      if (!order) {
        Swal.fire({
          title: "خطأ",
          text: "لم يتم العثور على هذا الطلب!",
          icon: "error",
          confirmButtonText: "حسناً",
        });
        return;
      }

      const email = order?.email;

      const updatedProgress = {
        ...(order.productProgress || {}),
        [productKey]: updatedValue,
      };

      await updateOrder({ orderId, productProgress: updatedProgress }).unwrap();

      Swal.fire({
        title: "تم الحفظ",
        text: "تم حفظ تقدّم هذا المنتج في الطلب بنجاح",
        icon: "success",
        confirmButtonText: "حسناً",
      });

      // Notification at 60% or 100%
      if ([60, 100].includes(updatedValue) && productKey && email) {
        const [pid, rawColorName] = productKey.split("|").slice(0, 2);
        const cleanColorName = (rawColorName || "أصلي").trim();
        const cleanProductKey = `${pid}|${cleanColorName}`;

        await sendNotification({
          orderId,
          email,
          productKey: cleanProductKey,
          progress: updatedValue,
        }).unwrap();

        // ✅ FIXED Arabic sentence order here:
        Swal.fire({
  title: "تم إرسال إشعار",
  text: `حول تقدّم هذا المنتج ${order?.name ?? "العميل"} تم إرسال إشعار إلى  بنسبة  % ${updatedValue}`,
  icon: "info",
  confirmButtonText: "حسناً",
});

      }

      setEditingProductKey(null);
      refetch();
    } catch (error) {
      console.error("❌ Save/notify error:", error);
      Swal.fire({
        title: "خطأ",
        text:
          error?.data?.message ||
          "فشل حفظ تقدّم الطلب. يرجى المحاولة مرة أخرى.",
        icon: "error",
        confirmButtonText: "حسناً",
      });
    }
  };

  if (isLoading) return <p dir="rtl">جارٍ تحميل الطلبات...</p>;

  // Embroidery helper for this screen
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

  return (
    <div className="admin-orders-progress p-4" dir="rtl">
      {/* Scoped CSS for this admin view only */}
      <style>{`
        .admin-orders-progress .wz-btn {
          appearance: none;
          border: none;
          border-radius: 12px;
          padding: 0.6rem 1.3rem;
          font-weight: 700;
          font-size: 0.95rem;
          letter-spacing: 0.3px;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.4rem;
          user-select: none;
          text-decoration: none;
          position: relative;
          overflow: hidden;
          transition: all 0.25s ease;
        }
        .admin-orders-progress .wz-btn:focus-visible {
          outline: 2px solid rgba(17,24,39,0.6);
          outline-offset: 2px;
        }
        .admin-orders-progress .wz-btn:active {
          transform: scale(0.97);
          box-shadow: 0 1px 4px rgba(0,0,0,.25) inset;
        }
        .admin-orders-progress .wz-btn[disabled],
        .admin-orders-progress .wz-btn[aria-disabled="true"] {
          opacity: .6;
          cursor: not-allowed;
        }

        .admin-orders-progress .wz-btn--edit {
          background: linear-gradient(135deg, #f5d365 0%, #f7b500 50%, #e0a400 100%);
          color: #222;
          box-shadow: 0 2px 6px rgba(247,181,0,0.45), inset 0 1px 1px rgba(255,255,255,0.3);
        }
        .admin-orders-progress .wz-btn--edit:hover {
          background: linear-gradient(135deg, #ffe58a 0%, #ffd14f 50%, #f5b400 100%);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(247,181,0,0.55);
          color: #1a1a1a;
        }

        .admin-orders-progress .wz-btn--save {
          background: linear-gradient(135deg, #2563eb 0%, #1e4fd6 60%, #153fae 100%);
          color: #fff;
          box-shadow: 0 2px 6px rgba(37,99,235,0.45), inset 0 1px 1px rgba(255,255,255,0.25);
        }
        .admin-orders-progress .wz-btn--save:hover {
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 70%, #1d4ed8 100%);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(37,99,235,0.55);
          color: #fff;
        }

        .admin-orders-progress .wz-btn::after {
          content: "";
          position: absolute;
          top: -120%;
          left: -30%;
          width: 200%;
          height: 300%;
          background: radial-gradient(circle at 10% 20%, rgba(255,255,255,0.45), transparent 70%);
          transform: rotate(25deg);
          opacity: 0;
          transition: opacity .4s ease;
        }
        .admin-orders-progress .wz-btn:hover::after {
          opacity: 1;
        }

        .admin-orders-progress .order-card {
          border: 1px solid rgba(0,0,0,.08);
          border-radius: 12px;
          padding: 1rem;
          margin-bottom: 1.5rem;
          background: #fff;
        }
        .admin-orders-progress .order-title {
          margin: 0 0 .75rem 0;
          font-weight: 700;
          font-size: 1.1rem;
          text-align: center;
        }
        .admin-orders-progress .item-block {
          border-top: 1px solid rgba(0,0,0,.06);
          padding-top: 1rem;
          margin-bottom: 1rem;
          text-align: center;
        }
        .admin-orders-progress .stepper {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          margin-top: .5rem;
        }
        .admin-orders-progress .stepper label {
          display: flex;
          flex-direction: column;
          align-items: center;
          font-size: .9rem;
        }
        .admin-orders-progress .stepper .hint {
          font-size: .7rem;
          color: #6b7280;
          margin-bottom: .25rem;
        }

        @media (prefers-reduced-motion: reduce) {
          .admin-orders-progress .wz-btn {
            transition: none !important;
          }
          .admin-orders-progress .wz-btn:hover {
            transform: none !important;
          }
          .admin-orders-progress .wz-btn::after {
            display: none !important;
          }
        }
      `}</style>

      <h2 className="text-xl font-bold mb-4 text-right">
        متابعة تقدّم تجهيز الطلبات
      </h2>

      <div className="max-h-[70vh] overflow-y-auto">
        {(orders || []).map((order, orderIdx) => {
          const orderId = order?._id || `order-${orderIdx}`;
          const lines = Array.isArray(order?.products) ? order.products : [];

          return (
            <div key={orderId} className="order-card">
              {/* Order header */}
              <h3 className="order-title">
                الطلب رقم {String(orderId).slice(0, 10)} —{" "}
                {order?.name || "—"}
              </h3>

              {/* No products case */}
              {lines.length === 0 && (
                <p className="text-center text-sm text-gray-500">
                  لا توجد منتجات مسجّلة في هذا الطلب.
                </p>
              )}

              {/* Expand each line into quantity-based items */}
              {lines.flatMap((prod, lineIndex) => {
                const pid =
                  typeof prod?.productId === "string"
                    ? prod.productId
                    : prod?.productId?._id;

                if (!pid) {
                  return (
                    <div
                      key={`missing-${orderId}-${lineIndex}`}
                      className="mb-3"
                    >
                      <p className="text-center text-xs text-red-500">
                        منتج غير صالح (productId مفقود) — تم تجاهل هذا السطر.
                      </p>
                    </div>
                  );
                }

                const title = prod?.productId?.title || prod?.title || "—";

                const cn = prod?.color?.colorName;
                const colorName =
                  typeof cn === "object"
                    ? cn[lang] || cn.en || cn.fr || cn.ar || "أصلي"
                    : cn || prod?.color?.name || "أصلي";

                const qty = Math.max(1, Number(prod?.quantity || 1));

                const emb = embroideryText(prod);

                return Array.from({ length: qty }, (_, itemIndex) => {
                  const productKey = `${pid}|${colorName}|${lineIndex}-${itemIndex}`;
                  const fullKey = `${orderId}|${productKey}`;

                  return (
                    <div key={fullKey} className="item-block">
                      {/* Item info */}
                      <p>
                        <strong>{title}</strong> — لون: {colorName}
                        {emb && <> — نوع التطريز: {emb}</>}
                        <br />
                        <span
                          className="text-gray-500 text-sm"
                          style={{ direction: "ltr", display: "inline-block" }}
                        >
                          ID: {pid} — عنصر #{itemIndex + 1}
                        </span>
                      </p>

                      {/* Radio stepper + buttons */}
                      <div className="stepper">
                        {progressSteps.map((val, stepIndex) => (
                          <label key={val}>
                            <span className="hint">
                              المرحلة {stepIndex + 1}
                            </span>
                            <input
                              type="radio"
                              name={fullKey}
                              value={val}
                              checked={progressChanges[fullKey] === val}
                              onChange={() =>
                                handleCheckboxChange(fullKey, val)
                              }
                              disabled={editingProductKey !== fullKey}
                            />
                            <span className="mt-1">{val}%</span>
                          </label>
                        ))}

                        {editingProductKey === fullKey ? (
                          <button
                            onClick={() => handleSave(orderId, productKey)}
                            className="wz-btn wz-btn--save"
                          >
                            حفظ
                          </button>
                        ) : (
                          <button
                            onClick={() => handleEdit(fullKey)}
                            className="wz-btn wz-btn--edit"
                          >
                            تعديل
                          </button>
                        )}
                      </div>
                    </div>
                  );
                });
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AdminOrdersProgress;
