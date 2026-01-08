// src/pages/user/UserDashboard.jsx

// -----------------------------------------------------------------------------
// Purpose:
//   Authenticated user's dashboard showing profile details, quick actions,
//   and a list of orders fetched by the user's email (RTK Query).
// -----------------------------------------------------------------------------

import React, { useMemo, useEffect } from "react";

// Router / Meta
import { Link, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet";

// Auth
import { useAuth } from "../../../context/AuthContext";

// Data (RTK Query)
import { useGetOrderByEmailQuery } from "../../../redux/features/orders/ordersApi";

// Utils / Components
import { getImgUrl } from "../../../utils/getImgUrl"; // (used for product thumbs)
import LoadingSpinner from "../../../components/Loading";

// Icons
import {
  FaKey,
  FaShoppingBag,
  FaCalendarAlt,
  FaDollarSign,
  FaUserCircle,
  FaGoogle,
  FaEnvelope,
} from "react-icons/fa";

// Styles
import "../../../Styles/StylesUserDashboard.css";

/* =============================================================================
   🔤 Embroidery helpers (same spirit as ProductCard / SingleProduct)
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

  // already Arabic
  const hasArabic = /[\u0600-\u06FF]/.test(value);
  if (hasArabic) return value;

  const key = normalizeKey(value);

  if (AR_EMBROIDERY_CATEGORY_MAP[key]) {
    return AR_EMBROIDERY_CATEGORY_MAP[key];
  }

  // allow partial matches like "Broderie traditionnelle – luxe"
  for (const baseKey of Object.keys(AR_EMBROIDERY_CATEGORY_MAP)) {
    if (key.includes(baseKey)) return AR_EMBROIDERY_CATEGORY_MAP[baseKey];
  }

  return value;
};

/**
 * Read embroidery from:
 *  - line.productId.embroideryCategory
 *  - or line.embroideryCategory snapshot
 */
const getEmbroideryFromLine = (line, lang = "ar") => {
  if (!line) return null;
  const product = line.productId || {};
  let src = product.embroideryCategory ?? line.embroideryCategory ?? null;
  if (!src) return null;

  if (typeof src === "string") {
    const trimmed = src.trim();
    if (!trimmed) return null;
    return translateEmbroideryCategory(trimmed);
  }

  if (typeof src === "object") {
    const raw =
      src[lang] ||
      src.ar ||
      src["ar-SA"] ||
      src.fr ||
      src.en ||
      Object.values(src).find(
        (x) => typeof x === "string" && x.trim().length > 0
      );
    if (!raw) return null;
    return translateEmbroideryCategory(raw);
  }

  return null;
};

/* =============================================================================
   Component: UserDashboard
============================================================================= */
const UserDashboard = () => {
  /* ---------------------------------------------------------------------------
   1) Context
  --------------------------------------------------------------------------- */
  const { currentUser } = useAuth();

  // Arabic only
  const lang = "ar";
  const isRTL = true;

  /* ---------------------------------------------------------------------------
   2) Scroll-to-top on mount
  --------------------------------------------------------------------------- */
  const location = useLocation();
  useEffect(() => {
    const shouldScroll =
      location.hash === "#top" ||
      Boolean(location.state && location.state.scrollTop) ||
      true;

    if (shouldScroll) {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });

      if (location.hash === "#top" && window.history.replaceState) {
        const { pathname, search } = window.location;
        window.history.replaceState(null, "", pathname + search);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ---------------------------------------------------------------------------
   3) User info derivations
  --------------------------------------------------------------------------- */
  const email = currentUser?.email || "";
  const mailName = email ? email.split("@")[0] : "";
  const initial = mailName ? mailName.charAt(0).toUpperCase() : "U";

  const displayName =
    currentUser?.displayName || currentUser?.username || "المستخدم";

  const provider = currentUser?.providerData?.[0]?.providerId || "password";

  /* ---------------------------------------------------------------------------
   4) Data fetching (orders by email)
  --------------------------------------------------------------------------- */
  const {
    data: orders = [],
    isLoading,
    isFetching,
  } = useGetOrderByEmailQuery(email, { skip: !email });

  /* ---------------------------------------------------------------------------
   5) Derived stats & sorted list
  --------------------------------------------------------------------------- */
  const { totalOrders, totalSpent } = useMemo(() => {
    const count = orders.length;
    const spent = orders.reduce((sum, o) => sum + (o?.totalPrice || 0), 0);
    return { totalOrders: count, totalSpent: spent.toFixed(2) };
  }, [orders]);

  const sortedOrders = useMemo(
    () =>
      [...orders].sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
      ),
    [orders]
  );

  /* ---------------------------------------------------------------------------
   6) Auth provider badge helper
  --------------------------------------------------------------------------- */
  const providerBadge = () => {
    if (provider === "google.com")
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-red-50 text-red-700 border border-red-200 px-2.5 py-1 text-xs">
          <FaGoogle />
          Google
        </span>
      );

    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-1 text-xs">
        <FaEnvelope />
        البريد الإلكتروني وكلمة المرور
      </span>
    );
  };

  /* ---------------------------------------------------------------------------
   7) Loading state
  --------------------------------------------------------------------------- */
  if (isLoading || isFetching) return <LoadingSpinner />;

  /* ---------------------------------------------------------------------------
   8) Render
  --------------------------------------------------------------------------- */
  return (
    <div
      id="top"
      className="bg-[#F8F1E9] min-h-screen px-2 sm:px-4 UserDashboard-screen pt-28 md:pt-32 pb-12"
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* SEO */}
      <Helmet>
        <title>لوحة المستخدم</title>
      </Helmet>

      {/* ===================================================================== */}
      {/* Header / Profile                                                     */}
      {/* ===================================================================== */}
      <section className="relative isolate overflow-hidden">
        {/* Soft background accent behind the card */}
        <div className="absolute inset-0 -z-10 opacity-[0.06] pointer-events-none">
          <div className="h-64 w-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#8B5C3E] to-transparent" />
        </div>

        {/* Profile card */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
          <div className="bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 border border-[#A67C52]/20 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.08)] p-6 md:p-8">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              {/* Avatar → Change password shortcut */}
              <div className="w-14 h-14 flex justify-end">
                <Link
                  to="/change-password"
                  aria-label="تغيير كلمة المرور"
                  title="تعديل البريد وكلمة المرور"
                  className="group relative inline-block"
                >
                  <div
                    className="w-14 h-14 rounded-full overflow-hidden shadow border border-[#A67C52]/20 flex items-center justify-center select-none"
                    style={{
                      background:
                        "linear-gradient(135deg, #8B5C3E 0%, #74452D 100%)",
                    }}
                  >
                    <span className="text-white font-bold text-xl leading-none">
                      {initial}
                    </span>
                  </div>

                  {/* Hover tooltip */}
                  <span
                    className="pointer-events-none absolute left-1/2 -translate-x-1/2 -bottom-2 translate-y-full
                                   bg-amber-50 text-amber-800 text-[11px] font-semibold px-2.5 py-1 rounded-full shadow
                                   border border-amber-200 opacity-0 group-hover:opacity-100 transition"
                  >
                    تعديل البريد وكلمة المرور
                  </span>
                </Link>
              </div>

              {/* Intro / quick actions */}
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#8B5C3E] break-words">
                  {`مرحبًا، ${displayName}`}
                </h1>
                <p className="mt-1 text-gray-600">
                  هنا تجد ملخص حسابك والطلبات التي قمت بها.
                </p>

                {/* Action buttons */}
                <div className="mt-4 flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
                  <Link
                    to="/change-password"
                    className="inline-flex items-center justify-center gap-2 rounded-xl
                               bg-[#8B5C3E] text-white px-4 py-2.5 font-semibold shadow
                               hover:bg-[#74452D] transition
                               focus:outline-none focus:ring-2 focus:ring-[#A67C52] focus:ring-offset-2"
                    aria-label="تغيير كلمة المرور"
                  >
                    <FaKey />
                    تغيير كلمة المرور
                  </Link>

                  <Link
                    to="/products"
                    className="inline-flex items-center justify-center gap-2 rounded-xl
                               bg-white text-[#8B5C3E] border border-[#A67C52]/40 px-4 py-2.5 font-semibold shadow-sm
                               hover:bg-[#F8F1E9] transition
                               focus:outline-none focus:ring-2 focus:ring-[#A67C52] focus:ring-offset-2"
                  >
                    <FaShoppingBag />
                    المنتجات
                  </Link>
                </div>
              </div>

              {/* Small stats */}
              <div className="w-full md:w-auto grid grid-cols-2 sm:flex sm:flex-col gap-3">
                <div className="rounded-xl border border-[#A67C52]/30 bg-white px-4 py-3 text-center">
                  <div className="text-xs uppercase tracking-wide text-gray-500">
                    طلباتك
                  </div>
                  <div className="mt-1 text-2xl font-extrabold text-[#8B5C3E]">
                    {totalOrders}
                  </div>
                </div>
                <div className="rounded-xl border border-[#A67C52]/30 bg-white px-4 py-3 text-center">
                  <div className="text-xs uppercase tracking-wide text-gray-500">
                    الإجمالي
                  </div>
                  <div className="mt-1 text-2xl font-extrabold text-[#8B5C3E]">
                    ${totalSpent}
                  </div>
                </div>
              </div>
            </div>

            {/* Provider badge */}
            <div className="mt-4 flex justify-center md:justify-start">
              {providerBadge()}
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* Orders List                                                          */}
      {/* ===================================================================== */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h2 className="text-xl sm:text-2xl font-bold text-[#A67C52] mb-5 text-center">
          طلباتك
        </h2>

        {/* Empty state */}
        {orders.length === 0 ? (
          <div className="mx-auto max-w-2xl text-center bg-white border border-dashed border-[#A67C52]/40 rounded-2xl p-10 shadow-sm">
            <div className="text-5xl text-[#8B5C3E] mx-auto w-fit mb-3">
              <FaShoppingBag />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">
              لا توجد لديك أي طلبات حتى الآن.
            </h3>
            <p className="text-gray-500 mt-1">
              اكتشف مجموعتنا المستوحاة من الجبة التونسية والتراث الأصيل.
            </p>
            <Link
              to="/products"
              className="mt-4 inline-block rounded-xl bg-[#8B5C3E] text-white px-5 py-2.5 font-semibold shadow
                         hover:bg-[#74452D] transition
                         focus:outline-none focus:ring-2 focus:ring-[#A67C52] focus:ring-offset-2"
            >
              تصفح المنتجات
            </Link>
          </div>
        ) : (
          // Orders list
          <div className="grid gap-6">
            {sortedOrders.map((order) => (
              <article
                key={order._id}
                className="bg-white rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.06)] border border-[#A67C52]/20 overflow-hidden"
              >
                {/* Order header */}
                <div className="px-5 py-4 bg-[#8B5C3E]/5 border-b border-[#A67C52]/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  {/* ID + avatar */}
                  <div className="flex items-center gap-3 text-gray-800">
                    <div className="h-10 w-10 grid place-items-center rounded-full bg-[#8B5C3E]/10 text-[#8B5C3E]">
                      <FaUserCircle />
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">رقم الطلب:</div>
                      <div className="font-semibold" dir="ltr">
                        {order._id.slice(0, 8)}...
                      </div>
                    </div>
                  </div>

                  {/* Date */}
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <FaCalendarAlt className="opacity-70" />
                    {new Date(order?.createdAt).toLocaleDateString()}
                  </div>

                  {/* Total */}
                  <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 text-sm">
                    <FaDollarSign />
                    الإجمالي: ${order.totalPrice}
                  </div>
                </div>

                {/* Order items */}
                <div className="p-5">
                  <h3 className="font-semibold text-[#8B5C3E] mb-3">
                    المنتجات في هذا الطلب
                  </h3>

                  <ul className="grid gap-4">
                    {order.products.map((product, idx) => {
                      if (!product.productId) return null;

                      // title from product
                      const title =
                        product.productId.translations?.[lang]?.title ||
                        product.productId.title ||
                        "منتج بدون عنوان";

                      // color
                      const translatedColorName =
                        product.color?.colorName?.[lang] ||
                        product.color?.colorName?.en ||
                        "أصلي";

                      // image
                      const imageSrc = product.color?.image
                        ? getImgUrl(product.color.image)
                        : getImgUrl(product.productId.coverImage);

                      // embroidery from line/product
                      const embroideryLabel = getEmbroideryFromLine(
                        product,
                        lang
                      );

                      return (
                        <li
                          key={`${product.productId._id}-${idx}`}
                          className="order-item flex flex-col sm:flex-row items-center sm:items-start gap-4 rounded-xl border border-[#A67C52]/20 p-3 sm:p-4"
                        >
                          {/* Thumbnail */}
                          <img
                            src={imageSrc}
                            alt={title}
                            className="order-item__img w-24 h-24 sm:w-28 sm:h-28 rounded-lg object-cover border-2 border-[#A67C52]/30 flex-shrink-0 mx-auto sm:mx-0"
                          />

                          {/* Details */}
                          <div className="order-item__body flex-1 min-w-0 text-center sm:text-start">
                            <h4 className="font-semibold text-gray-800 break-words leading-relaxed">
                              {title}
                            </h4>

                            <div className="mt-1 text-sm text-gray-600 flex flex-wrap justify-center sm:justify-start gap-x-4 gap-y-1">
                              <span>
                                الكمية:{" "}
                                <span className="font-medium">
                                  {product.quantity}
                                </span>
                              </span>

                              <span className="capitalize">
                                اللون:{" "}
                                <span className="font-medium">
                                  {translatedColorName}
                                </span>
                              </span>

                              {embroideryLabel && (
                                <span className="capitalize">
                                  نوع التطريز:{" "}
                                    <span className="font-medium">
                                      {embroideryLabel}
                                    </span>
                                </span>
                              )}
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default UserDashboard;
