// src/pages/products/SingleProduct.jsx
// Product detail page with:
// - Gallery (thumbnails + zoom on hover desktop)
// - Price/stock/rating
// - Color selector, quantity, Add to Cart
// - Inline checkout (Cash on Delivery)
// - Local search bar
// - Similar products by category
// - Similar products by embroidery type
// - Boutique-wide premium rating section (Wahret Zmen – المدينة، تونس)

import React, { useEffect, useMemo, useState, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { FiShoppingCart } from "react-icons/fi";
import { Star } from "lucide-react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";

// Context
import { useAuth } from "../../context/AuthContext.jsx";

// Data (RTK Query)
import {
  useGetProductByIdQuery,
  useGetAllProductsQuery,
} from "../../redux/features/products/productsApi.js";
import { useCreateOrderMutation } from "../../redux/features/orders/ordersApi.js";

// Redux cart
import { addToCart } from "../../redux/features/cart/cartSlice.js";

// Utils / Styles
import { getImgUrl } from "../../utils/getImgUrl.js";
import "../../Styles/StylesSingleProduct.css";

// Android-friendly search input
import SearchInput from "../../components/SearchInput.jsx";

// Animations
import FadeInSection from "../../Animations/FadeInSection.jsx";

// Helpers
const num = (v, d = 0) => (Number.isFinite(Number(v)) ? Number(v) : d);
const unique = (arr) => [...new Set(arr.filter(Boolean))];
const safeStr = (v) => (typeof v === "string" ? v : String(v ?? ""));
const normalizeKey = (v) => String(v || "").trim().toLowerCase();

// Normalize color object from backend → consistent shape
function normalizeColor(color) {
  if (!color) return null;
  const images =
    Array.isArray(color.images) && color.images.length
      ? color.images
      : color.image
      ? [color.image]
      : [];
  const first = images[0];
  const colorName =
    typeof color.colorName === "string"
      ? { en: color.colorName }
      : color.colorName || {};
  const name = color.name || colorName;
  return {
    _id: color._id,
    colorName,
    name,
    images,
    image: first,
    stock: num(color.stock),
  };
}

const pickText = (p, lang, key) => {
  // We call it with "ar" but still keep some fallback langs
  return (
    p?.translations?.[lang]?.[key] ||
    p?.translations?.fr?.[key] ||
    p?.translations?.en?.[key] ||
    p?.[key] ||
    ""
  );
};

// Optional: simple category → Arabic map
const AR_CATEGORY_MAP = {
  men: "رجال",
  women: "نساء",
  children: "أطفال",
  kids: "أطفال",
  kid: "أطفال",
  hommes: "رجال",
  homme: "رجال",
  femmes: "نساء",
  femme: "نساء",
  enfants: "أطفال",
  enfant: "أطفال",
  رجال: "رجال",
  نساء: "نساء",
  أطفال: "أطفال",
};

const mapCategoryToArabic = (raw) => {
  const key = normalizeKey(raw);
  return AR_CATEGORY_MAP[key] || raw || "غير معروف";
};

// 🔑 Normalize embroidery value from a product (for comparisons)
const getEmbroideryKey = (product) => {
  const e = product?.embroideryCategory;
  if (!e) return "";
  if (typeof e === "string") return normalizeKey(e);
  return normalizeKey(e.ar || e.fr || e.en || "");
};

/* ============================================================================
   Wahret Zmen boutique rating meta (REAL GOOGLE MAPS DATA)
   - This is global boutique reputation, not a single product review.
   - Data based on Google Maps: 5.0 / 5, 4 reviews, all 5 stars.
============================================================================ */
const BOUTIQUE_RATING = {
  // ⭐ Average rating on Google Maps
  overallScore: 5.0,

  // 👥 Total Google Maps reviews
  totalReviews: 4,

  // 📊 distribution in %
  distribution: {
    5: 100,
    4: 0,
    3: 0,
    2: 0,
    1: 0,
  },

  // 🧵 Internal quality impressions (boutique’s own metrics)
  quality: {
    embroidery: 96, // جودة التطريز
    fabric: 94, // جودة القماش
    fit: 92, // تطابق المقاس
    packaging: 90, // تغليف الهدايا
  },

  // 🏪 location & owner labels
  locationLabel: "المدينة العتيقة - تونس",
  ownerLabel: "بإدارة صبري بسّعد",
};

const SingleProduct = () => {
  // Router / Redux / Auth
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // We force Arabic UI
  const lang = "ar";
  const shortLang = "ar";
  const isRTL = true;

  const { currentUser } = useAuth();
  const [createOrder, { isLoading: isPlacingOrder }] = useCreateOrderMutation();

  // Local state
  const [searchTerm, setSearchTerm] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [agreeTerms, setAgreeTerms] = useState(false);

  const { data: product, isLoading, isError } = useGetProductByIdQuery(id);
  const { data: allProducts = [] } = useGetAllProductsQuery();

  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [showInlineCheckout, setShowInlineCheckout] = useState(false);
  const checkoutRef = useRef(null);

  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });
  const [isHovering, setIsHovering] = useState(false);

  // Texts / category / flags
  const translatedTitle =
    product?.translations?.ar?.title ||
    product?.title ||
    product?.translations?.fr?.title ||
    product?.translations?.en?.title ||
    "منتج غير معروف";

  const translatedDescription =
    product?.translations?.ar?.description ||
    product?.description ||
    product?.translations?.fr?.description ||
    product?.translations?.en?.description ||
    "لا يوجد وصف متاح لهذا المنتج.";

  const categoryKey = (product?.category || "").toLowerCase();
  const translatedCategory = mapCategoryToArabic(product?.category);

  const isTrending = Boolean(
    product?.trending ||
      product?.isTrending ||
      product?.tags?.includes?.("trending") ||
      product?.labels?.includes?.("trending")
  );

  // 🧵 Embroidery category (raw value, no auto translation)
  const rawEmbroidery =
    typeof product?.embroideryCategory === "string"
      ? product.embroideryCategory.trim()
      : product?.embroideryCategory?.ar ||
        product?.embroideryCategory?.fr ||
        product?.embroideryCategory?.en ||
        "";

  const embroideryText = rawEmbroidery;

  // Gallery
  const activeGallery = useMemo(() => {
    if (!product) return [];
    const norm = selectedColor ? normalizeColor(selectedColor) : null;
    if (norm && norm.images.length > 0) return unique(norm.images);
    return product.coverImage ? [product.coverImage] : [];
  }, [product, selectedColor]);

  // Preselect first color
  useEffect(() => {
    if (!product) return;
    const firstColor =
      (Array.isArray(product.colors) && product.colors.length > 0
        ? normalizeColor(product.colors[0])
        : null) ||
      (product.coverImage
        ? {
            colorName: { en: "Default", ar: "افتراضي" },
            name: { en: "Default", ar: "افتراضي" },
            images: [product.coverImage],
            image: product.coverImage,
            stock: num(product.stockQuantity),
          }
        : null);
    setSelectedColor(firstColor);
    setSelectedImageIndex(0);
    setQuantity(1);
    setShowInlineCheckout(false);
  }, [product]);

  // Similar products (same category, exclude current)
  const similarProducts = useMemo(() => {
    if (!product || !Array.isArray(allProducts)) return [];
    const cat = String(product.category || "").toLowerCase();
    return allProducts
      .filter(
        (p) =>
          p?._id !== product._id &&
          String(p?.category || "").toLowerCase() === cat
      )
      .slice(0, 6);
  }, [allProducts, product]);

  // NEW: Similar products by embroidery type (exclude current)
  const similarEmbroideryProducts = useMemo(() => {
    if (!product || !Array.isArray(allProducts)) return [];
    const currentKey = getEmbroideryKey(product);
    if (!currentKey) return [];
    return allProducts
      .filter(
        (p) =>
          p?._id !== product._id && getEmbroideryKey(p) === currentKey
      )
      .slice(0, 6);
  }, [allProducts, product]);

  // Header quick search
  const filteredProducts = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return [];
    const picks = [];

    for (const p of allProducts) {
      const titleMain = safeStr(p?.title).toLowerCase();
      const tAr = safeStr(p?.translations?.ar?.title).toLowerCase();
      const tFr = safeStr(p?.translations?.fr?.title).toLowerCase();
      const tEn = safeStr(p?.translations?.en?.title).toLowerCase();
      const cat = safeStr(p?.category).toLowerCase();
      const id8 = safeStr(p?._id).slice(0, 8).toLowerCase();

      const matchesTitle =
        titleMain.includes(q) || tAr.includes(q) || tFr.includes(q) || tEn.includes(q);
      const matchesCat = cat.includes(q);
      const matchesId =
        id8.includes(q) || safeStr(p?._id).toLowerCase().includes(q);

      if (matchesTitle || matchesCat || matchesId) picks.push(p);
    }

    return picks.slice(0, 10);
  }, [allProducts, searchTerm]);

  // Handlers
  const handleSelectColor = (color) => {
    const norm = normalizeColor(color);
    setSelectedColor(norm);
    setSelectedImageIndex(0);
    setQuantity(1);
  };

  const handleQuantityChange = (e) => {
    const maxStock = num(selectedColor?.stock);
    const next = Math.max(
      1,
      Math.min(maxStock || 1, Number(e.target.value || 1))
    );
    setQuantity(next);
  };

  const handleAddToCart = () => {
    if (!product || !selectedColor) return;
    const max = num(selectedColor.stock);
    if (max <= 0 || quantity <= 0) return;

    const colorForCart = {
      _id: selectedColor._id,
      colorName: selectedColor.colorName,
      name: selectedColor.name,
      images: selectedColor.images,
      image: selectedColor.image,
      stock: selectedColor.stock,
    };

    dispatch(
      addToCart({
        ...product,
        quantity,
        color: colorForCart,
      })
    );

    // Show inline checkout
    setShowInlineCheckout(true);

    // Scroll ONLY to the inline checkout section
    setTimeout(() => {
      if (checkoutRef.current) {
        checkoutRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, 150);
  };

  // Hover zoom
  const handleMouseEnter = () => setIsHovering(true);
  const handleMouseLeave = () => {
    setIsHovering(false);
    setZoomPosition({ x: 50, y: 50 });
  };
  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPosition({ x, y });
  };

  // Price / rating / stock
  const oldP = num(product?.oldPrice);
  const newP = num(product?.newPrice);
  const hasDiscount = oldP > 0 && newP > 0 && oldP > newP;
  const saveAmount = hasDiscount ? oldP - newP : 0;
  const savePercent = hasDiscount
    ? Math.round(((oldP - newP) / oldP) * 100)
    : 0;

  const stockCount = num(selectedColor?.stock);
  const ratingValue = Math.max(
    0,
    Math.min(5, Math.round(Number(product?.rating ?? 0)))
  );

  const STAR_SIZE = 50;
  const renderStarsLarge = (rating) =>
    Array.from({ length: 5 }).map((_, index) => (
      <Star
        key={index}
        size={STAR_SIZE}
        className={
          index < rating
            ? "fill-[#F59E0B] text-[#F59E0B]"
            : "fill-gray-300 text-gray-300"
        }
        style={{
          filter:
            index < rating
              ? "drop-shadow(0 4px 10px rgba(245,158,11,.45))"
              : "none",
          strokeWidth: 1,
        }}
        aria-hidden="true"
      />
    ));
  const renderStarsTiny = (rating) =>
    Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating
            ? "fill-[#F59E0B] text-[#F59E0B]"
            : "fill-gray-300 text-gray-300"
        }`}
        aria-hidden="true"
      />
    ));

  const lineTotal = Number((newP || oldP) * quantity || 0).toFixed(2);

  // Inline checkout submit
  const onSubmitInlineCheckout = async (data) => {
    if (!currentUser?.email) {
      Swal.fire({
        icon: "error",
        title: "خطأ في إتمام الطلب",
        text: "يرجى تسجيل الدخول أولًا.",
        confirmButtonColor: "#d33",
      });
      return;
    }
    if (!product || !selectedColor || quantity <= 0) {
      Swal.fire({
        icon: "error",
        title: "خطأ في إتمام الطلب",
        text: "تعذّر إتمام الطلب، يرجى المحاولة مرة أخرى.",
        confirmButtonColor: "#d33",
      });
      return;
    }

    const street = (data.address || "").trim();
    const city = (data.city || "").trim();
    const country = (data.country || "تونس").trim();
    const state = (data.state || "—").trim();
    const zipcode = ((data.zipcode ?? "0000") + "").trim();

    if (!street || !city) {
      Swal.fire({
        icon: "error",
        title: "خطأ في إتمام الطلب",
        text: "يرجى إدخال العنوان والمدينة.",
        confirmButtonColor: "#d33",
      });
      return;
    }

    const rawCn = selectedColor?.colorName;
    const colorName =
      rawCn && typeof rawCn === "object"
        ? rawCn
        : {
            en: (rawCn && String(rawCn)) || "Original",
            fr: (rawCn && String(rawCn)) || "Original",
            ar: "أصلي",
          };

    const image =
      selectedColor?.image || selectedColor?.images?.[0] || product.coverImage;

    // 🧵 embroidery data for order (no auto-translation)
    const embroideryForOrder = (() => {
      const src = product?.embroideryCategory;
      if (!src) return undefined;

      if (typeof src === "string") {
        return {
          ar: src,
          fr: src,
          en: src,
        };
      }

      if (typeof src === "object") {
        return src;
      }

      return undefined;
    })();

    const newOrder = {
      name: data.name,
      email: currentUser.email,
      phone: data.phone,
      address: { street, city, country, state, zipcode },
      products: [
        {
          productId: product._id,
          quantity: Number(quantity),
          color: {
            colorName,
            image,
            ...(selectedColor?._id ? { _id: selectedColor._id } : {}),
          },
          embroideryCategory: embroideryForOrder,
        },
      ],
      totalPrice: Number(lineTotal),
      paymentMethod: "Cash on Delivery",
    };

    try {
      await createOrder(newOrder).unwrap();
      await Swal.fire({
        title: "تم تأكيد طلبك",
        text: "شكرًا لطلبك! سنتواصل معك لتأكيد التوصيل.",
        icon: "success",
        confirmButtonColor: "#A67C52",
        confirmButtonText: "عرض طلباتي",
      });

      try {
        sessionStorage.setItem("ordersScrollTop", "1");
      } catch {}

      navigate("/orders#top", {
        replace: true,
        state: { scrollTop: true, ts: Date.now() },
      });
    } catch (error) {
      Swal.fire({
        title: "خطأ في إتمام الطلب",
        text:
          error?.data?.message ||
          error?.message ||
          "تعذّر إتمام الطلب، يرجى المحاولة مرة أخرى.",
        icon: "error",
        confirmButtonColor: "#d33",
      });
    }
  };

  // Loading / error
  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto p-8">
        <div className="text-center text-[#8B5E3B]">جارٍ التحميل...</div>
      </div>
    );
  }
  if (isError || !product) {
    return (
      <div className="max-w-6xl mx-auto p-8 text-center text-red-600">
        المنتج غير موجود
      </div>
    );
  }

  // Render
  return (
    <div
      className="product-cart px-4 sm:px-6 md:px-8 py-6 bg-white border border-[#A67C52] rounded-2xl shadow-lg max-w-6xl mx-auto sp-page sp-square"
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Top search */}
      <div className="sp-search-wrapper">
        <div className="sp-search-inner">
          <SearchInput setSearchTerm={setSearchTerm} />

          {searchTerm && (
            <div className="mt-3 border rounded-xl overflow-hidden shadow-sm bg-white w-full">
              {filteredProducts.length === 0 ? (
                <div className="p-4 text-sm text-gray-600">
                  لا توجد منتجات مطابقة
                </div>
              ) : (
                <ul className="max-h-96 overflow-auto divide-y">
                  {filteredProducts.map((p) => {
                    const title =
                      p?.translations?.ar?.title ||
                      p?.title ||
                      p?.translations?.fr?.title ||
                      p?.translations?.en?.title ||
                      "";
                    const price = Number(p?.newPrice || 0);
                    const rating = Math.max(
                      0,
                      Math.min(5, Math.round(Number(p?.rating ?? 0)))
                    );
                    return (
                      <li
                        key={p._id}
                        className="bg-white hover:bg-gray-50 transition-colors"
                      >
                        <Link
                          to={`/products/${p._id}`}
                          onClick={() =>
                            window.scrollTo({ top: 0, behavior: "smooth" })
                          }
                          className="flex items-center gap-3 p-3"
                        >
                          <img
                            src={getImgUrl(p.coverImage)}
                            alt={title}
                            className="w-14 h-14 rounded object-cover flex-shrink-0 border"
                            loading="lazy"
                          />
                          <div className="min-w-0 flex-1">
                            <div className="text-sm font-medium text-gray-900 line-clamp-1">
                              {title}
                            </div>
                            <div className="mt-0.5 flex items-center gap-3 text-xs text-gray-600">
                              <span>{price.toFixed(2)} $</span>
                              <span className="flex items-center gap-1">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-3.5 h-3.5 ${
                                      i < rating
                                        ? "fill-[#F59E0B] text-[#F59E0B]"
                                        : "fill-gray-300 text-gray-300"
                                    }`}
                                  />
                                ))}
                              </span>
                              <span className="hidden sm:inline text-gray-400">
                                #{safeStr(p._id).slice(0, 8)}
                              </span>
                            </div>
                          </div>
                          <span className="text-[11px] text-[#A67C52] font-semibold">
                            عرض
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Title */}
      <h1 className="text-3xl sm:text-4xl font-bold text-center text-[#8B5E3B] font-serif mb-6 sp-title">
        {translatedTitle}
      </h1>

      <div className="flex flex-col md:flex-row gap-8 sp-card">
        {/* LEFT: IMAGES */}
        <div className="flex-1 md:flex md:gap-4 sp-media">
          {/* Thumb rail (desktop) */}
          <div className="hidden md:flex md:flex-col gap-2 w-20 overflow-visible thumb-rail">
            {activeGallery.map((img, idx) => {
              const isActive = idx === selectedImageIndex;
              return (
                <button
                  key={img + idx}
                  type="button"
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`flex-shrink-0 w-20 h-20 overflow-hidden transition-all bg-white border sp-thumb ${
                    isActive ? "is-active" : ""
                  }`}
                  style={{ borderColor: "#e5e7eb", borderWidth: 1 }}
                  aria-label={`صورة رقم ${idx + 1}`}
                >
                  <img
                    src={getImgUrl(img)}
                    alt={`thumb-${idx}`}
                    className="w-full h-full object-cover block"
                  />
                </button>
              );
            })}
          </div>

          {/* Main image */}
          <div
            className="relative sp-mainimg group w-full overflow-hidden rounded-lg border"
            style={{
              aspectRatio: "3 / 4",
              maxHeight: 640,
              borderColor: "#e5e7eb",
            }}
          >
            {/* Badges */}
            {isTrending && (
              <span
                className="product-badge badge-top-left trending-badge"
                title="رائج"
                aria-label="رائج"
              >
                رائج
              </span>
            )}
            <span
              className={`product-badge badge-top-right stock-badge ${
                stockCount > 0 ? "in-stock" : "out-of-stock"
              }`}
              title={
                stockCount > 0
                  ? `الكمية المتوفرة: ${stockCount}`
                  : "غير متوفر"
              }
              aria-label={
                stockCount > 0
                  ? `الكمية المتوفرة: ${stockCount}`
                  : "غير متوفر"
              }
            >
              {stockCount > 0
                ? `الكمية المتوفرة: ${stockCount}`
                : "غير متوفر"}
            </span>

            {/* Prev / Next */}
            {activeGallery.length > 1 && (
              <button
                type="button"
                className="sp-arrow sp-arrow-left"
                onClick={() =>
                  setSelectedImageIndex(
                    (prev) =>
                      (prev - 1 + activeGallery.length) % activeGallery.length
                  )
                }
                aria-label="الصورة السابقة"
              >
                ‹
              </button>
            )}

            {/* Main image with hover zoom */}
            <img
              src={getImgUrl(
                activeGallery[selectedImageIndex] || selectedColor?.image
              )}
              alt={translatedTitle}
              onMouseEnter={handleMouseEnter}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className="transition-transform duration-300 cursor-zoom-in block"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                transform:
                  isHovering &&
                  typeof window !== "undefined" &&
                  window.innerWidth > 768
                    ? "scale(2)"
                    : "scale(1)",
                transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                border: "none",
              }}
            />

            {activeGallery.length > 1 && (
              <button
                type="button"
                className="sp-arrow sp-arrow-right"
                onClick={() =>
                  setSelectedImageIndex(
                    (prev) => (prev + 1) % activeGallery.length
                  )
                }
                aria-label="الصورة التالية"
              >
                ›
              </button>
            )}
          </div>

          {/* Thumbs (mobile) */}
          <div className="mt-2 md:hidden flex flex-wrap gap-2 sp-thumbs">
            {activeGallery.map((img, idx) => {
              const isActive = idx === selectedImageIndex;
              return (
                <button
                  key={img + idx}
                  type="button"
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`w-16 h-16 overflow-hidden transition-all bg-white border sp-thumb ${
                    isActive ? "is-active" : ""
                  }`}
                  style={{ borderColor: "#e5e7eb", borderWidth: 1 }}
                  aria-label={`صورة رقم ${idx + 1}`}
                >
                  <img
                    src={getImgUrl(img)}
                    alt={`thumb-m-${idx}`}
                    className="w-full h-full object-cover block"
                  />
                </button>
              );
            })}
          </div>
        </div>

        {/* RIGHT: DETAILS */}
        <div className="flex-1 flex flex-col gap-4 sp-right">
          {/* Description + meta */}
          <p className="text-gray-700 text-base sp-desc">
            {translatedDescription}
          </p>

          <div className="text-[#6B4226] space-y-2 text-base">
            <p>
              <strong>تاريخ النشر:</strong>{" "}
              {product?.createdAt
                ? new Date(product.createdAt).toLocaleDateString()
                : "غير معروف"}
            </p>
            <p>
              <strong>المعرف (ID):</strong> {product?._id?.slice(0, 8)}
            </p>
            <p>
              <strong>الفئة:</strong> {translatedCategory}
            </p>

            {/* 🧵 Embroidery meta (raw value, no translation) */}
            {embroideryText && (
              <p className="sp-embroidery">
                <strong>نوع التطريز:</strong> {embroideryText}
              </p>
            )}
          </div>

          {/* Price row */}
          <div className="sp-price-row">
            {hasDiscount ? (
              <>
                <span className="sp-old">{oldP.toFixed(2)} $</span>
                <span className="sp-new">{newP.toFixed(2)} $</span>
                <span className="sp-save">وفر {saveAmount.toFixed(2)} $</span>
                <span className="sp-off">-{savePercent}%</span>
              </>
            ) : (
              <span className="sp-new">{(newP || oldP).toFixed(2)} $</span>
            )}
          </div>

          {/* CTA: qty, rating, colors, add to cart */}
          <div className="flex flex-col items-center gap-4 mt-2 sp-cta-row">
            {/* Quantity */}
            <div
              className="flex items-center sp-qty"
              style={{ borderColor: "#111" }}
            >
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                disabled={stockCount === 0}
                style={{ background: "#111", color: "#fff" }}
                aria-label="إنقاص الكمية"
              >
                –
              </button>
              <input
                type="number"
                min="1"
                max={stockCount || 1}
                value={quantity}
                onChange={handleQuantityChange}
                disabled={stockCount === 0}
                aria-label="الكمية"
              />
              <button
                type="button"
                onClick={() =>
                  setQuantity((q) => Math.min(stockCount || 1, q + 1))
                }
                disabled={stockCount === 0 || quantity >= (stockCount || 1)}
                style={{ background: "#111", color: "#fff" }}
                aria-label="زيادة الكمية"
              >
                +
              </button>
            </div>

            {/* Rating */}
            <div
              className="flex flex-col items-center gap-1"
              style={{ marginTop: 2 }}
            >
              <div className="flex items-center gap-2">
                <span className="text-base font-medium text-[#1f2937] ">
                  التقييم:
                </span>
                <div className="flex gap-1">
                  {renderStarsLarge(ratingValue)}
                </div>
              </div>
              <span className="text-gray-500 text-sm">
                ({ratingValue} نجوم)
              </span>
            </div>

            {/* Color selector */}
            <div className="flex flex-col items-center w-full">
              <p className="text-base font-medium text-[#6B4226] mb-2">
                اختر اللون
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                {product?.colors?.map((color, index) => {
                  const norm = normalizeColor(color);
                  const translatedName =
                    norm?.name?.[lang] ||
                    norm?.colorName?.[lang] ||
                    norm?.name?.[shortLang] ||
                    norm?.colorName?.[shortLang] ||
                    norm?.name?.en ||
                    norm?.colorName?.en ||
                    "افتراضي";
                  const isActive =
                    selectedColor &&
                    (selectedColor._id
                      ? norm?._id === selectedColor._id
                      : norm?.image === selectedColor?.image);
                  const swatch = norm?.images?.[0] || norm?.image;

                  return (
                    <div key={index} className="relative">
                      <img
                        src={getImgUrl(swatch)}
                        alt={translatedName}
                        onClick={() => handleSelectColor(color)}
                        className={`w-14 h-14 object-cover cursor-pointer border-2 transition-all sp-thumb ${
                          isActive ? "is-active" : ""
                        }`}
                        style={{ borderColor: "#e5e7eb" }}
                        title={translatedName}
                      />
                      <div className="sp-thumb-count" title={translatedName}>
                        {num(norm?.stock) > 0 ? norm.stock : "غير متوفر"}
                      </div>
                    </div>
                  );
                })}
              </div>

              <p className="mt-2 text-[#6B4226] text-sm">
                اللون المختار:{" "}
                <strong>
                  {selectedColor?.name?.[lang] ||
                    selectedColor?.colorName?.[lang] ||
                    selectedColor?.name?.[shortLang] ||
                    selectedColor?.colorName?.[shortLang] ||
                    selectedColor?.name?.en ||
                    selectedColor?.colorName?.en ||
                    "افتراضي"}
                </strong>
              </p>
            </div>

            {/* Add to Cart */}
            <button
              onClick={handleAddToCart}
              disabled={stockCount === 0}
              className={`w-full sm:w-auto py-3 px-6 text-white font-medium text-lg transition-all sp-add ${
                stockCount > 0
                  ? "bg-black hover:bg-[#111]"
                  : "bg-gray-300 cursor-not-allowed is-disabled"
              }`}
              aria-label={stockCount > 0 ? "أضف إلى السلة" : "غير متوفر"}
            >
              <FiShoppingCart className="inline ml-2" />
              {stockCount > 0 ? "أضف إلى السلة" : "غير متوفر"}
            </button>
          </div>
        </div>
      </div>

      {/* Inline Checkout (shown after Add to Cart) */}
      {showInlineCheckout && (
        <section
          id="inline-checkout"
          ref={checkoutRef}
          className="mt-12"
          dir={isRTL ? "rtl" : "ltr"}
        >
          <div className="wz-inline-checkout bg-[#F8F4EF] rounded-2xl border border-[#E5D9C9] shadow-sm px-4 py-6 md:px-8 md:py-8">
            {/* Heading */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-[#2b2b2b] mb-2">
                إتمام الطلب
              </h2>
              <p className="text-[color:var(--muted-foreground,#6b7280)]">
                أكمل بياناتك لإتمام الطلب بنظام الدفع عند التسليم.
              </p>
            </div>

            {/* Two-column layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* LEFT: Shipping Information */}
              <form
                onSubmit={handleSubmit(onSubmitInlineCheckout)}
                className="space-y-6"
              >
                <div className="rounded-2xl border border-[#E5D9C9] bg-white shadow-sm">
                  <div className="p-6 border-b border-[#F0E7DA]">
                    <h3 className="flex items-center gap-2 text-xl font-semibold text-[#2b2b2b]">
                      <svg
                        className="h-5 w-5 text-[#A67C52]"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                      >
                        <path
                          d="M3 7h13v10H3zM16 10h5l-1.5 3H16z"
                          strokeWidth="2"
                        />
                      </svg>
                      عنوان الشحن
                    </h3>
                  </div>

                  <div className="p-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* FULL NAME */}
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          الاسم الكامل
                        </label>
                        <input
                          {...register("name", { required: true })}
                          type="text"
                          placeholder="أحمد بن علي"
                          className={`w-full px-4 py-3 text-base rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#E6D3BF] ${
                            errors.name ? "border-red-400" : "border-[#E6D3BF]"
                          }`}
                        />
                      </div>

                      {/* EMAIL (read-only) */}
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          البريد الإلكتروني
                        </label>
                        <input
                          value={currentUser?.email || ""}
                          readOnly
                          aria-readonly="true"
                          inputMode="email"
                          type="text"
                          autoCorrect="off"
                          autoCapitalize="none"
                          spellCheck={false}
                          dir="ltr"
                          onFocus={(e) => e.target.select()}
                          onClick={(e) => e.currentTarget.select()}
                          onTouchStart={(e) => e.currentTarget.select()}
                          className="w-full px-4 py-3 text-base rounded-lg border border-[#E6D3BF] bg-gray-50 email-plain"
                          title={currentUser?.email || ""}
                        />
                        <div
                          className="md:hidden mt-1 text-xs text-gray-600 email-full-line"
                          dir="ltr"
                        >
                          {currentUser?.email || ""}
                        </div>
                      </div>
                    </div>

                    {/* PHONE */}
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        رقم الهاتف
                      </label>
                      <input
                        {...register("phone", { required: true })}
                        type="tel"
                        placeholder="+216 XX XXX XXX"
                        className={`w-full px-4 py-3 text-base rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#E6D3BF] ${
                          errors.phone
                            ? "border-red-400"
                            : "border-[#E6D3BF]"
                        }`}
                      />
                    </div>

                    {/* ADDRESS */}
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        العنوان
                      </label>
                      <input
                        {...register("address", { required: true })}
                        type="text"
                        placeholder="الشارع، الإقامة، رقم المنزل..."
                        className={`w-full px-4 py-3 text-base rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#E6D3BF] ${
                          errors.address
                            ? "border-red-400"
                            : "border-[#E6D3BF]"
                        }`}
                      />
                    </div>

                    {/* CITY / STATE / ZIP */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          المدينة
                        </label>
                        <input
                          {...register("city", { required: true })}
                          type="text"
                          placeholder="المدينة"
                          className={`w-full px-4 py-3 text-base rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#E6D3BF] ${
                            errors.city
                              ? "border-red-400"
                              : "border-[#E6D3BF]"
                          }`}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          الولاية / المنطقة
                        </label>
                        <input
                          {...register("state")}
                          type="text"
                          placeholder="الولاية / المنطقة"
                          className="w-full px-4 py-3 text-base rounded-lg border border-[#E6D3BF] focus:outline-none focus:ring-2 focus:ring-[#E6D3BF]"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          الرمز البريدي
                        </label>
                        <input
                          {...register("zipcode")}
                          type="text"
                          placeholder="0000"
                          className="w-full px-4 py-3 text-base rounded-lg border border-[#E6D3BF] focus:outline-none focus:ring-2 focus:ring-[#E6D3BF]"
                        />
                      </div>
                    </div>

                    {/* COUNTRY */}
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        البلد
                      </label>
                      <input
                        {...register("country")}
                        type="text"
                        placeholder="تونس"
                        className="w-full px-4 py-3 text-base rounded-lg border border-[#E6D3BF] focus:outline-none focus:ring-2 focus:ring-[#E6D3BF]"
                      />
                    </div>
                  </div>
                </div>

                {/* Terms + Submit */}
                <div className="rounded-2xl border border-[#E5D9C9] bg-white shadow-sm p-6">
                  <div
                    className={`flex ${
                      isRTL ? "flex-row-reverse" : "flex-row"
                    } items-start gap-3`}
                  >
                    <input
                      id="agree"
                      type="checkbox"
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                      className="mt-1 h-5 w-5 rounded border-[#E6D3BF] text-[#A67C52] focus:ring-[#A67C52]"
                    />
                    <label htmlFor="agree" className="text-sm text-[#2b2b2b]">
                      أوافق على{" "}
                      <Link to="#" className="text-[#A67C52] underline">
                        الشروط والأحكام
                      </Link>{" "}
                      و{" "}
                      <Link to="#" className="text-[#A67C52] underline">
                        سياسة الخصوصية
                      </Link>
                      .
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={!agreeTerms || isPlacingOrder}
                    className={`mt-6 w-full rounded-2xl px-6 py-3 font-semibold transition-all duration-200
                      ${
                        agreeTerms && !isPlacingOrder
                          ? "bg-[#A67C52] text-white hover:bg-[#8E683F] focus:ring-2 focus:ring-offset-2 focus:ring-[#E6D3BF]"
                          : "bg-gray-300 text-white cursor-not-allowed"
                      }`}
                  >
                    {isPlacingOrder ? "جارٍ معالجة الطلب..." : "تأكيد الطلب"}
                  </button>

                  <p className="mt-3 text-center text-sm text-gray-600">
                    عدد القطع:{" "}
                    <span className="font-medium">{quantity}</span> · المجموع
                    الكلي{" "}
                    <span className="font-semibold text-[#A67C52]">
                      ${lineTotal}
                    </span>
                  </p>
                </div>
              </form>

              {/* RIGHT: Payment / Delivery info */}
              <div className="space-y-6">
                <div className="rounded-2xl border border-[#E5D9C9] bg-white shadow-sm">
                  <div className="p-6 border-b border-[#F0E7DA]">
                    <h3 className="flex items-center gap-2 text-xl font-semibold text-[#2b2b2b]">
                      <svg
                        className="h-5 w-5 text-[#A67C52]"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                      >
                        <rect
                          x="3"
                          y="4"
                          width="18"
                          height="16"
                          rx="2"
                          strokeWidth="2"
                        />
                        <path d="M3 10h18" strokeWidth="2" />
                      </svg>
                      طريقة الدفع
                    </h3>
                  </div>
                  <div className="p-6 space-y-3 text-[15px] leading-relaxed text-[#444]">
                    <p>
                      <strong>الدفع عند التسليم</strong> — ستدفع ثمن الطلب نقدًا
                      عند استلامه، ولا تحتاج إلى أي دفع إلكتروني الآن.
                    </p>
                    <ul className="list-disc ps-5 space-y-1">
                      <li>من الأفضل تجهيز المبلغ تقريبًا بشكل دقيق.</li>
                      <li>سيتواصل معك عامل التوصيل قبل الوصول لتأكيد العنوان.</li>
                      <li>الإرجاع أو تغيير المقاس حسب سياسة المتجر.</li>
                    </ul>
                    <div className="rounded-lg bg-[#F8F4EF] border border-[#E6D3BF] p-4 text-sm">
                      <span className="font-medium">الأمان والسرية:</span> يتم
                      نقل بياناتك الشخصية بشكل آمن ومشفّر.
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-[#E5D9C9] bg-white shadow-sm">
                  <div className="p-6 flex items-start gap-3">
                    <svg
                      className="h-6 w-6 mt-0.5 text-[#A67C52]"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                    >
                      <path d="M3 12h18M3 12l4-4m-4 4l4 4" strokeWidth="2" />
                    </svg>
                    <div className="text-[15px] text-[#444]">
                      <p className="font-semibold">معلومات التوصيل</p>
                      <p>التوصيل عادةً بين 24 و72 ساعة حسب ولايتك/مدينتك.</p>
                    </div>
                  </div>
                </div>
              </div>
              {/* /RIGHT */}
            </div>
          </div>
        </section>
      )}

      {/* Similar Products by Category */}
      {similarProducts.length > 0 && (
        <FadeInSection delay={0.1}>
          <section className="mt-12 pt-8 border-t border-gray-200">
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-extrabold text-[#1f2937] tracking-tight">
                منتجات مشابهة
              </h2>
              <p className="text-gray-600">
                اكتشف المزيد من هذه الفئة: {translatedCategory}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
              {similarProducts.map((sp) => {
                const title =
                  sp?.translations?.ar?.title ||
                  sp.title ||
                  sp?.translations?.fr?.title ||
                  sp?.translations?.en?.title ||
                  "منتج غير معروف";

                const price = num(sp?.newPrice);
                const old = num(sp?.oldPrice);
                const simRating = Math.max(
                  0,
                  Math.min(5, Math.round(Number(sp?.rating ?? 0)))
                );

                const simTrending = Boolean(
                  sp?.trending ||
                    sp?.isTrending ||
                    sp?.tags?.includes?.("trending") ||
                    sp?.labels?.includes?.("trending")
                );

                const hasDiscount = old > price && price > 0;

                return (
                  <Link
                    key={sp._id}
                    to={`/products/${sp._id}`}
                    onClick={() =>
                      window.scrollTo({ top: 0, behavior: "smooth" })
                    }
                    className="group relative block bg-white border border-gray-200 shadow-sm hover:shadow-lg transition-shadow overflow-hidden"
                    aria-label={title}
                  >
                    {/* Badges */}
                    {simTrending && (
                      <span className="absolute z-20 top-3 left-3 text-[11px] font-extrabold text-white px-2.5 py-1 bg-red-600/90 rounded">
                        رائج
                      </span>
                    )}
                    {hasDiscount && (
                      <span className="absolute z-20 top-3 right-3 text-[11px] font-extrabold text-white px-2.5 py-1 bg-black/90 rounded">
                        -{Math.round(((old - price) / old) * 100)}%
                      </span>
                    )}

                    {/* Image */}
                    <div className="overflow-hidden">
                      <img
                        src={getImgUrl(sp.coverImage)}
                        alt={title}
                        className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-105"
                        loading="lazy"
                      />
                    </div>

                    {/* Gradient overlay */}
                    <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-transparent to-black/65 opacity-90" />

                    {/* Bottom content */}
                    <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                      <h3 className="font-semibold leading-snug line-clamp-2 drop-shadow">
                        {title}
                      </h3>

                      <div className="mt-2 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-extrabold drop-shadow">
                            {price.toFixed(2)} $
                          </span>
                          {hasDiscount && (
                            <span className="text-sm line-through opacity-80">
                              {old.toFixed(2)} $
                            </span>
                          )}
                        </div>

                        <div className="flex gap-0.5 items-center">
                          {renderStarsTiny(simRating)}
                        </div>
                      </div>

                      <div className="mt-2 text-xs uppercase tracking-wide opacity-90">
                        عرض التفاصيل →
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        </FadeInSection>
      )}

      {/* Similar Products by Embroidery Type */}
      {embroideryText && similarEmbroideryProducts.length > 0 && (
        <FadeInSection delay={0.1}>
          <section className="mt-12 pt-8 border-t border-gray-200">
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-extrabold text-[#1f2937] tracking-tight">
                قطع بنفس نوع التطريز
              </h2>
            <p className="text-gray-600">
              نفس نوع التطريز: <span className="font-semibold">{embroideryText}</span>
            </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
              {similarEmbroideryProducts.map((sp) => {
                const title =
                  sp?.translations?.ar?.title ||
                  sp.title ||
                  sp?.translations?.fr?.title ||
                  sp?.translations?.en?.title ||
                  "منتج غير معروف";
                const price = num(sp?.newPrice);
                const old = num(sp?.oldPrice);
                const simRating = Math.max(
                  0,
                  Math.min(5, Math.round(Number(sp?.rating ?? 0)))
                );
                const simTrending = Boolean(
                  sp?.trending ||
                    sp?.isTrending ||
                    sp?.tags?.includes?.("trending") ||
                    sp?.labels?.includes?.("trending")
                );

                const hasDiscount = old > price && price > 0;

                return (
                  <Link
                    key={sp._id}
                    to={`/products/${sp._id}`}
                    onClick={() =>
                      window.scrollTo({ top: 0, behavior: "smooth" })
                    }
                    className="group relative block bg-white border border-gray-200 shadow-sm hover:shadow-lg transition-shadow overflow-hidden"
                    aria-label={title}
                  >
                    {/* Badges */}
                    {simTrending && (
                      <span className="absolute z-20 top-3 left-3 text-[11px] font-extrabold text-white px-2.5 py-1 bg-red-600/90 rounded">
                        رائج
                      </span>
                    )}
                    {hasDiscount && (
                      <span className="absolute z-20 top-3 right-3 text-[11px] font-extrabold text-white px-2.5 py-1 bg-black/90 rounded">
                        -{Math.round(((old - price) / old) * 100)}%
                      </span>
                    )}

                    {/* Image */}
                    <div className="overflow-hidden">
                      <img
                        src={getImgUrl(sp.coverImage)}
                        alt={title}
                        className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-105"
                        loading="lazy"
                      />
                    </div>

                    {/* Gradient overlay */}
                    <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-transparent to-black/65 opacity-90" />

                    {/* Bottom content */}
                    <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                      <h3 className="font-semibold leading-snug line-clamp-2 drop-shadow">
                        {title}
                      </h3>

                      <div className="mt-2 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-extrabold drop-shadow">
                            {price.toFixed(2)} $
                          </span>
                          {hasDiscount && (
                            <span className="text-sm line-through opacity-80">
                              {old.toFixed(2)} $
                            </span>
                          )}
                        </div>
                        <div className="flex gap-0.5 items-center">
                          {renderStarsTiny(simRating)}
                        </div>
                      </div>

                      <div className="mt-2 text-xs uppercase tracking-wide opacity-90">
                        عرض التفاصيل →
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        </FadeInSection>
      )}

      {/* ===== Boutique-wide premium rating, under Similar Products ===== */}
      <FadeInSection delay={0.1}>
        <section
          className="wz-premium-rating mt-12"
          aria-label="تقييم متجر وهرة زمان وجودة المنتجات"
        >
          <h2 className="wz-premium-title">
            ثقة العملاء في متجر <span>وهرة زمان</span>
          </h2>
          <p className="text-center text-sm text-gray-600 mb-4">
            {BOUTIQUE_RATING.locationLabel} · {BOUTIQUE_RATING.ownerLabel}
          </p>

          <div className="wz-premium-grid">
            {/* Overall score */}
            <div className="wz-premium-overall">
              <div className="wz-premium-score">
                {BOUTIQUE_RATING.overallScore.toFixed(1)}
              </div>
              <div className="wz-premium-star">★</div>
              <p className="wz-premium-label">
                متوسط التقييم على خرائط Google
              </p>
              <p className="wz-premium-sub">
                بناءً على{" "}
                <strong>{BOUTIQUE_RATING.totalReviews}</strong> آراء حقيقية من
                عملاء المتجر في المدينة العتيقة بتونس
              </p>
            </div>

            {/* Rating distribution */}
            <div className="wz-premium-distribution">
              <h3 className="wz-premium-subtitle">توزيع التقييمات</h3>

              {[5, 4, 3, 2, 1].map((stars) => (
                <div className="wz-premium-row" key={stars}>
                  <span className="wz-premium-row-label">{stars} نجوم</span>
                  <div className="wz-premium-row-bar">
                    <span
                      className="wz-premium-row-fill"
                      style={{
                        "--wz-bar": `${BOUTIQUE_RATING.distribution[stars]}%`,
                      }}
                    ></span>
                  </div>
                  <span className="wz-premium-row-percent">
                    {BOUTIQUE_RATING.distribution[stars]}%
                  </span>
                </div>
              ))}

              <p className="wz-premium-footnote">
                بيانات التقييمات مأخوذة من صفحة{" "}
                <strong>sabri wahret zmen</strong> على خرائط Google
                (5.0/5 من 4 آراء)، مع توزيع 100٪ تقييمات ⭐⭐⭐⭐⭐.
              </p>
            </div>

            {/* Quality opinions */}
            <div className="wz-premium-quality">
              <h3 className="wz-premium-subtitle">آراء العملاء في الجودة</h3>

              <div className="wz-premium-quality-row">
                <div className="wz-premium-quality-label">
                  جودة التطريز
                  <span>دقة في التفاصيل ولمسات تقليدية فاخرة</span>
                </div>
                <div className="wz-premium-quality-track">
                  <span
                    className="wz-premium-quality-fill"
                    style={{
                      "--wz-bar": `${BOUTIQUE_RATING.quality.embroidery}%`,
                    }}
                  ></span>
                </div>
                <span className="wz-premium-quality-percent">
                  {BOUTIQUE_RATING.quality.embroidery}%
                </span>
              </div>

              <div className="wz-premium-quality-row">
                <div className="wz-premium-quality-label">
                  جودة القماش
                  <span>خامات مريحة ومختارة بعناية</span>
                </div>
                <div className="wz-premium-quality-track">
                  <span
                    className="wz-premium-quality-fill"
                    style={{
                      "--wz-bar": `${BOUTIQUE_RATING.quality.fabric}%`,
                    }}
                  ></span>
                </div>
                <span className="wz-premium-quality-percent">
                  {BOUTIQUE_RATING.quality.fabric}%
                </span>
              </div>

              <div className="wz-premium-quality-row">
                <div className="wz-premium-quality-label">
                  تطابق المقاس
                  <span>المقاسات مطابقة لما هو مذكور</span>
                </div>
                <div className="wz-premium-quality-track">
                  <span
                    className="wz-premium-quality-fill"
                    style={{
                      "--wz-bar": `${BOUTIQUE_RATING.quality.fit}%`,
                    }}
                  ></span>
                </div>
                <span className="wz-premium-quality-percent">
                  {BOUTIQUE_RATING.quality.fit}%
                </span>
              </div>

              <div className="wz-premium-quality-row">
                <div className="wz-premium-quality-label">
                  تغليف الهدايا
                  <span>تغليف أنيق يناسب الهدايا الخاصة</span>
                </div>
                <div className="wz-premium-quality-track">
                  <span
                    className="wz-premium-quality-fill"
                    style={{
                      "--wz-bar": `${BOUTIQUE_RATING.quality.packaging}%`,
                    }}
                  ></span>
                </div>
                <span className="wz-premium-quality-percent">
                  {BOUTIQUE_RATING.quality.packaging}%
                </span>
              </div>
            </div>
          </div>
        </section>
      </FadeInSection>
    </div>
  );
};

export default SingleProduct;