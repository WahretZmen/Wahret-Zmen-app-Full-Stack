// src/pages/products/OrderPage.jsx
// -----------------------------------------------------------------------------
// OrderPage
// -----------------------------------------------------------------------------
// Shows the authenticated user's orders (fetched by email).
// Features:
//   • Scroll-to-top when arriving.
//   • Lists each order with ID, date, contact info, total, and its products.
//   • Remove a single product (with quantity prompt) or delete the whole order.
//   • Shows embroidery type for each product line (from product / snapshot).
//   • Arabic-only UI with safe LTR rendering for phone numbers.
// -----------------------------------------------------------------------------

import React, { useEffect } from "react";
import { Helmet } from "react-helmet";
import { useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import Swal from "sweetalert2";

import {
  useGetOrderByEmailQuery,
  useDeleteOrderMutation,
  useRemoveProductFromOrderMutation,
} from "../../../redux/features/orders/ordersApi";
import { productEventsActions } from "../../../redux/features/products/productEventsSlice";

import { useAuth } from "../../../context/AuthContext";
import { getImgUrl } from "../../../utils/getImgUrl";
import LoadingSpinner from "../../../components/Loading";

/* =============================================================================
   formatPhoneLTR(raw)
============================================================================= */
function formatPhoneLTR(raw) {
  if (!raw) return null;

  const hasPlus = String(raw).trim().startsWith("+");
  const digits = String(raw).replace(/[^\d]/g, "");

  if (digits.length >= 11) {
    const cc = digits.slice(0, 3);
    const rest = digits.slice(3);

    let grouped = rest;
    if (rest.length === 8)
      grouped = `${rest.slice(0, 2)} ${rest.slice(2, 5)} ${rest.slice(5)}`;
    else if (rest.length === 9)
      grouped = `${rest.slice(0, 3)} ${rest.slice(3, 6)} ${rest.slice(6)}`;

    return { text: `+${cc} ${grouped}`, dir: "ltr" };
  }

  return { text: hasPlus ? raw : `+${digits}`, dir: "ltr" };
}

/* =============================================================================
   Embroidery helpers (FR/EN → AR, like SingleProduct / Dashboard)
============================================================================= */
const AR_EMBROIDERY_CATEGORY_MAP = {
  // French
  broderie: "تطريز",
  "broderie traditionnelle": "تطريز تقليدي",
  "broderie moderne": "تطريز عصري",
  "broderie main": "تطريز يدوي",
  "broderie à la main": "تطريز يدوي",
  "point de croix": "غرز متقاطعة",
  "broderie machine": "تطريز آلي",

  // English
  embroidery: "تطريز",
  "handmade embroidery": "تطريز يدوي",
  "machine embroidery": "تطريز آلي",
  "traditional embroidery": "تطريز تقليدي",
  "modern embroidery": "تطريز عصري",
};

const normalizeKey = (v) => String(v || "").trim().toLowerCase();

const translateEmbroideryCategory = (value) => {
  if (!value) return "";

  const hasArabic = /[\u0600-\u06FF]/.test(value);
  if (hasArabic) return value;

  const key = normalizeKey(value);

  if (AR_EMBROIDERY_CATEGORY_MAP[key]) {
    return AR_EMBROIDERY_CATEGORY_MAP[key];
  }

  for (const baseKey of Object.keys(AR_EMBROIDERY_CATEGORY_MAP)) {
    if (key.includes(baseKey)) {
      return AR_EMBROIDERY_CATEGORY_MAP[baseKey];
    }
  }

  return value;
};

/**
 * Read embroidery from:
 *  - productId.embroideryCategory (Product)
 *  - fall back to line.embroideryCategory (snapshot)
 */
const getEmbroideryLabel = (lineItem, lang = "ar") => {
  if (!lineItem) return null;

  const product = lineItem.productId || {};
  let src =
    product.embroideryCategory ?? lineItem.embroideryCategory ?? null;

  if (!src) return null;

  if (typeof src === "string") {
    const trimmed = src.trim();
    return trimmed.length ? translateEmbroideryCategory(trimmed) : null;
  }

  if (typeof src === "object") {
    const candidate =
      src[lang] ||
      src.ar ||
      src["ar-SA"] ||
      src.fr ||
      src.en ||
      Object.values(src).find(
        (v) => typeof v === "string" && v.trim().length > 0
      );
    if (!candidate) return null;
    return translateEmbroideryCategory(candidate);
  }

  return null;
};

/* =============================================================================
   Component
============================================================================= */
const OrderPage = () => {
  const location = useLocation();

  const { currentUser } = useAuth();

  // Arabic only
  const lang = "ar";

  const dispatch = useDispatch();

  const userEmail = currentUser?.email;

  const {
    data: orders = [],
    isLoading,
    refetch,
  } = useGetOrderByEmailQuery(userEmail, { skip: !userEmail });

  const [deleteOrder, { isLoading: isDeleting }] = useDeleteOrderMutation();
  const [removeProductFromOrder] = useRemoveProductFromOrderMutation();

  // Scroll-to-top UX
  useEffect(() => {
    const hashTop =
      typeof window !== "undefined" && window.location.hash === "#top";
    const stateScroll = Boolean(location.state && location.state.scrollTop);
    let sessionFlag = false;
    try {
      sessionStorage.setItem("ordersScrollTop", "0");
      sessionFlag = sessionStorage.getItem("ordersScrollTop") === "1";
    } catch {
      // ignore
    }

    if (hashTop || stateScroll || sessionFlag) {
      window.scrollTo({ top: 0, behavior: "instant" });

      try {
        sessionStorage.removeItem("ordersScrollTop");
      } catch {}

      if (hashTop && window.history && window.history.replaceState) {
        const { pathname, search } = window.location;
        window.history.replaceState(null, "", pathname + search);
      }
    }
  }, [location]);

  if (!userEmail) {
    return (
      <div
        className="bg-[#F8F1E9] min-h-screen flex items-center justify-center px-4"
        dir="rtl"
      >
        <p className="text-lg font-semibold text-gray-600">
          يرجى تسجيل الدخول للاطلاع على طلباتك.
        </p>
      </div>
    );
  }

  if (isLoading) return <LoadingSpinner />;

  const sortedOrders = [...orders].sort(
    (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
  );

  const handleDelete = async (orderId) => {
    Swal.fire({
      title: "حذف هذا الطلب؟",
      text: "هل أنت متأكد من رغبتك في حذف هذا الطلب بالكامل؟",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#8B5C3E",
      cancelButtonColor: "#A67C52",
      confirmButtonText: "نعم، حذف الطلب",
      cancelButtonText: "إلغاء",
    }).then(async (result) => {
      if (!result.isConfirmed) return;

      try {
        await deleteOrder(orderId).unwrap();
        Swal.fire("تم الحذف", "تم حذف الطلب بنجاح.", "success");
        await refetch();
        dispatch(productEventsActions.triggerRefetch());
      } catch (err) {
        console.error("Delete order failed:", err);
        Swal.fire(
          "خطأ",
          "تعذر حذف الطلب، يرجى المحاولة لاحقًا.",
          "error"
        );
      }
    });
  };

  const handleDeleteProduct = async (
    orderId,
    productId,
    colorNameObj,
    maxQuantity
  ) => {
    const canonicalColorName = (() => {
      if (!colorNameObj) return "Original";
      if (typeof colorNameObj === "string") return colorNameObj;
      return (
        colorNameObj.en ||
        colorNameObj.fr ||
        colorNameObj.ar ||
        "Original"
      );
    })();

    const productKey = `${productId}|${canonicalColorName}`;

    const { value } = await Swal.fire({
      title: "حذف كمية من هذا المنتج",
      input: "number",
      inputLabel: `أدخل الكمية التي تريد حذفها (الحد الأقصى ${maxQuantity})`,
      inputAttributes: { min: 1, max: maxQuantity, step: 1 },
      inputValue: 1,
      showCancelButton: true,
      confirmButtonText: "حذف",
      cancelButtonText: "إلغاء",
      confirmButtonColor: "#8B5C3E",
      cancelButtonColor: "#A67C52",
    });

    const quantityToRemove = Number(value);
    if (!quantityToRemove || quantityToRemove <= 0) return;

    try {
      const response = await removeProductFromOrder({
        orderId,
        productKey,
        quantityToRemove,
      }).unwrap();

      const orderFullyDeleted =
        response?.message?.toLowerCase?.().includes("no more products");

      Swal.fire(
        "تم الحذف",
        orderFullyDeleted
          ? "تم حذف الطلب بالكامل لأنه لم يعد يحتوي على منتجات."
          : `تم حذف ${quantityToRemove} من هذا المنتج من الطلب.`,
        "success"
      );

      await refetch();
      dispatch(productEventsActions.triggerRefetch());
    } catch (err) {
      console.error("❌ Failed to remove product:", err);
      Swal.fire(
        "خطأ",
        "تعذر حذف المنتج من الطلب، يرجى المحاولة لاحقًا.",
        "error"
      );
    }
  };

  return (
    <div
      id="top"
      className="bg-[#F8F1E9] min-h-screen px-4 sm:px-6 OrderPage-screen pt-28 md:pt-32 pb-12"
      dir="rtl"
    >
      <Helmet>
        <title>طلباتي</title>
      </Helmet>

      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-2xl p-4 sm:p-6 md:p-8 border border-[#A67C52]">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#A67C52] text-center">
          طلباتك
        </h2>

        {orders.length === 0 ? (
          <div className="mt-8 flex items-center justify-center">
            <p className="text-gray-500 text-center">
              لا توجد أي طلبات حتى الآن.
            </p>
          </div>
        ) : (
          <div className="mt-8 space-y-6">
            {sortedOrders.map((order, index) => {
              const phoneView = formatPhoneLTR(order?.phone);

              return (
                <div
                  key={order._id}
                  className="bg-gray-50 p-6 rounded-xl shadow-sm border border-[#A67C52]/30 order-card"
                >
                  {/* Header line */}
                  <div className="flex flex-wrap justify-between items-center gap-2 mb-3 order-header">
                    <p className="text-gray-700 font-medium">
                      <span className="text-[#A67C52] font-semibold">
                        الطلب رقم:
                      </span>{" "}
                      {index + 1}
                    </p>
                    <span className="text-gray-600 text-sm">
                      {new Date(order?.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  {/* ID pill */}
                  <div className="inline-flex items-center gap-2 bg-white border border-[#A67C52]/30 text-gray-800 text-sm px-3 py-1 rounded-full">
                    <span className="font-semibold">معرّف الطلب:</span>
                    <span dir="ltr" className="break-all">
                      {order._id.slice(0, 8)}
                    </span>
                  </div>

                  {/* Contact info */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3">
                    <p className="text-gray-700 break-words leading-snug">
                      <span className="font-medium">البريد الإلكتروني:</span>{" "}
                      <span dir="ltr" className="break-all inline-block">
                        {order.email}
                      </span>
                    </p>

                    <p className="text-gray-700">
                      <span className="font-medium">رقم الهاتف:</span>{" "}
                      {phoneView ? (
                        <span dir={phoneView.dir} className="inline-block">
                          {phoneView.text}
                        </span>
                      ) : (
                        "-"
                      )}
                    </p>
                  </div>

                  {/* Total */}
                  <p className="text-lg font-semibold text-gray-800 mt-3">
                    الإجمالي:{" "}
                    <span className="text-[#A67C52]">
                      ${order.totalPrice}
                    </span>
                  </p>

                  {/* Products */}
                  <h3 className="font-semibold text-lg mt-4 mb-2 text-[#A67C52]">
                    المنتجات في هذا الطلب
                  </h3>

                  <ul className="space-y-4">
                    {order.products.map((product, idx) => {
                      if (!product.productId) return null;

                      const title =
                        product.productId.translations?.[lang]?.title ||
                        product.productId.title ||
                        "منتج بدون عنوان";

                      const colorLabel =
                        product.color?.colorName?.[lang] ||
                        product.color?.colorName ||
                        "أصلي";

                      const imageSrc = getImgUrl(
                        product.color?.image ||
                          product.productId.coverImage
                      );

                      const embroideryLabel = getEmbroideryLabel(
                        product,
                        lang
                      );

                      return (
                        <li
                          key={`${product.productId._id}-${idx}`}
                          className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 bg-white p-4 rounded-lg shadow-sm border border-[#A67C52]/30 order-item"
                        >
                          <img
                            src={imageSrc}
                            alt={title}
                            className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-lg border-2 border-[#A67C52]/40"
                          />

                          <div className="text-center sm:text-left">
                            <p className="font-semibold text-gray-800">
                              {title}
                            </p>
                            <p className="text-gray-600">
                              الكمية: {product.quantity}
                            </p>
                            <p className="text-gray-600 capitalize">
                              اللون: {colorLabel}
                            </p>

                            {embroideryLabel && (
                              <p className="text-gray-600 capitalize">
                                نوع التطريز: {embroideryLabel}
                              </p>
                            )}

                            <button
                              onClick={() =>
                                handleDeleteProduct(
                                  order._id,
                                  product.productId._id,
                                  product.color?.colorName,
                                  product.quantity
                                )
                              }
                              className="mt-2 inline-flex items-center justify-center px-4 py-2 rounded-md font-medium
                                         text-white bg-[#8B5C3E] hover:bg-[#74452D] transition shadow-sm
                                         focus:outline-none focus:ring-2 focus:ring-[#A67C52] focus:ring-offset-2"
                            >
                              حذف هذا المنتج من الطلب
                            </button>
                          </div>
                        </li>
                      );
                    })}
                  </ul>

                  {/* Delete order */}
                  <div className="flex justify-end">
                    <button
                      onClick={() => handleDelete(order._id)}
                      disabled={isDeleting}
                      className={`mt-5 px-5 py-2 rounded-lg text-white transition shadow-sm
                                  focus:outline-none focus:ring-2 focus:ring-[#A67C3E] focus:ring-offset-2
                                  ${
                                    isDeleting
                                      ? "bg-[#C6A990] cursor-not-allowed opacity-70"
                                      : "bg-[#8B5C3E] hover:bg-[#74452D]"
                                  }`}
                    >
                      {isDeleting ? "جارٍ حذف الطلب..." : "حذف الطلب"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderPage;
