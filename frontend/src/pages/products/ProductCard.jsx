// src/pages/products/ProductCard.jsx
// Simple product card used on catalog and similar-products grids.

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { FiShoppingCart } from "react-icons/fi";
import { Star } from "lucide-react";

import { addToCart } from "../../redux/features/cart/cartSlice";
import { getImgUrl } from "../../utils/getImgUrl";

import "../../Styles/StylesProductCard.css";

// Basic Arabic color fallback maps
const AR_FALLBACK_MAP = {
  noir: "أسود",
  black: "أسود",
  blanc: "أبيض",
  white: "أبيض",
  rouge: "أحمر",
  red: "أحمر",
  bordeaux: "خمري",
  vert: "أخضر",
  green: "أخضر",
  bleu: "أزرق",
  blue: "أزرق",
  navy: "أزرق داكن",
  turquoise: "فيروزي",
  jaune: "أصفر",
  yellow: "أصفر",
  orange: "برتقالي",
  violet: "بنفسجي",
  purple: "بنفسجي",
  rose: "وردي",
  pink: "وردي",
  marron: "بني",
  brown: "بني",
  beige: "بيج",
  gris: "رمادي",
  gray: "رمادي",
  argent: "فضي",
  silver: "فضي",
  doré: "ذهبي",
  dore: "ذهبي",
  gold: "ذهبي",
  multicolore: "متعدد الألوان",
  multicolor: "متعدد الألوان",
};

const AR_TRANSLIT_MAP = {
  "فير": "أخضر",
  "فرت": "أخضر",
  "فيرت": "أخضر",
  "خضر": "أخضر",
  "بلو": "أزرق",
  "بلوو": "أزرق",
  "ازرق": "أزرق",
  "أزرق": "أزرق",
  "نوار": "أسود",
  "بلان": "أبيض",
  "بلانش": "أبيض",
  "غري": "رمادي",
  "قري": "رمادي",
};

const normalizeKey = (v) => String(v || "").trim().toLowerCase();
const isNumericLike = (v) =>
  (typeof v === "string" || typeof v === "number") &&
  String(v).trim().match(/^\d+(\.\d+)?$/);

// Map for embroidery category → Arabic (FR/EN → AR)
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

// Color helper: convert FR/EN/Arabic-ish to Arabic label when possible
const translateToArabicIfNeeded = (label) => {
  if (!label) return label;

  const hasArabic = /[\u0600-\u06FF]/.test(label);
  if (hasArabic) {
    const ar = label.replace(/\s+/g, "");
    if (AR_TRANSLIT_MAP[ar]) return AR_TRANSLIT_MAP[ar];
    return label;
  }

  const k = normalizeKey(label);
  if (AR_FALLBACK_MAP[k]) return AR_FALLBACK_MAP[k];

  for (const key of Object.keys(AR_FALLBACK_MAP)) {
    if (k.includes(key)) return AR_FALLBACK_MAP[key];
  }

  return label;
};

// Embroidery category translation helper (for string values)
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

const ProductCard = ({
  product,
  showStockBadge = true,
  counterVariant = "default",
  showCounter = true,
}) => {
  const dispatch = useDispatch();

  const lang = "ar";
  const baseLang = "ar";
  const isRTL = true;

  const [quantity, setQuantity] = useState(1);
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });

  if (!product) return null;

  // Localized title / description (Arabic first)
  const title =
    product?.translations?.ar?.title ||
    product?.title ||
    product?.translations?.fr?.title ||
    product?.translations?.en?.title ||
    "";

  const description =
    product?.translations?.ar?.description ||
    product?.description ||
    product?.translations?.fr?.description ||
    product?.translations?.en?.description ||
    "";

  // Embroidery category: supports string OR { en, fr, ar } from backend
  const rawEmbroideryValue = (() => {
    const ec = product?.embroideryCategory;
    if (!ec) return "";

    if (typeof ec === "string") {
      return ec.trim();
    }

    if (typeof ec === "object") {
      if (baseLang === "ar") return ec.ar || ec.fr || ec.en || "";
      if (baseLang === "fr") return ec.fr || ec.en || ec.ar || "";
      return ec.en || ec.fr || ec.ar || "";
    }

    return "";
  })();

  const displayedEmbroideryCategory = translateEmbroideryCategory(
    rawEmbroideryValue
  );

  // Color helpers
  const firstColor = Array.isArray(product?.colors)
    ? product.colors[0]
    : undefined;

  const getColorLabel = (c) => {
    if (!c) return "";
    const candidates = [];

    if (c.translations && typeof c.translations === "object") {
      const tl = c.translations;
      candidates.push(
        tl?.[lang]?.name,
        tl?.[lang]?.colorName,
        tl?.[baseLang]?.name,
        tl?.[baseLang]?.colorName,
        tl?.en?.name,
        tl?.en?.colorName
      );
    }

    if (c.colorName && typeof c.colorName === "object") {
      candidates.push(c.colorName[lang], c.colorName[baseLang], c.colorName.en);
    }
    if (c.name && typeof c.name === "object") {
      candidates.push(c.name[lang], c.name[baseLang], c.name.en);
    }

    if (typeof c.name === "string") candidates.push(c.name);
    if (typeof c.colorName === "string") candidates.push(c.colorName);
    if (typeof c.title === "string") candidates.push(c.title);

    const raw =
      candidates.find(
        (v) => typeof v === "string" && v.trim() && !isNumericLike(v)
      ) || "افتراضي";

    return translateToArabicIfNeeded(raw);
  };

  const displayedColor = getColorLabel(firstColor);
  const displayedStock =
    firstColor?.stock ?? product?.stockQuantity ?? product?.stock ?? 0;

  const isTrending = Boolean(
    product?.trending ||
      product?.isTrending ||
      product?.tags?.includes?.("trending") ||
      product?.labels?.includes?.("trending")
  );

  const hasOld = Number(product?.oldPrice) > Number(product?.newPrice || 0);
  const shopName = product?.storeName || product?.vendor || product?.brand || "";

  const clampMax = Math.max(1, displayedStock || 1);

  const handleQuantityChange = (e) => {
    const raw = Number(e.target.value);
    const safe = Number.isFinite(raw) ? raw : 1;
    setQuantity(Math.max(1, Math.min(clampMax, safe)));
  };

  const decQty = () => setQuantity((q) => Math.max(1, q - 1));
  const incQty = () => setQuantity((q) => Math.min(clampMax, q + 1));

  const handleAddToCart = () => {
    const defaultColor =
      firstColor || {
        colorName: { en: "Original", fr: "Original", ar: "أصلي" },
        image: product?.coverImage,
        stock: displayedStock,
      };

    if ((defaultColor?.stock ?? displayedStock ?? 0) > 0 && quantity > 0) {
      dispatch(addToCart({ ...product, quantity, color: defaultColor }));
    }
  };

  const handleMouseMove = (e) => {
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(hover: none)").matches
    )
      return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPosition({ x, y });
  };

  const ratingValue = Math.max(0, Math.min(5, Number(product?.rating ?? 0)));

  const renderStarsTiny = (value) =>
    Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.round(value)
            ? "fill-[#F59E0B] text-[#F59E0B]"
            : "fill-gray-300 text-gray-300"
        }`}
        aria-hidden="true"
      />
    ));

  const renderStars = (value) =>
    Array.from({ length: 5 }).map((_, i) => {
      const filled = i < Math.round(value);
      return (
        <svg
          key={i}
          width="16"
          height="16"
          viewBox="0 0 24 24"
          className="inline-block"
          aria-hidden="true"
        >
          <path
            d="M12 .587l3.668 7.431 8.2 1.193-5.934 5.787 1.402 8.168L12 18.896l-7.336 3.87 1.402-8.168L.132 9.211l8.2-1.193L12 .587z"
            fill={filled ? "#F59E0B" : "none"}
            stroke={filled ? "#F59E0B" : "currentColor"}
            strokeWidth="1.2"
          />
        </svg>
      );
    });

  const stockText =
    displayedStock > 0
      ? `الكمية المتوفرة: ${displayedStock}`
      : "غير متوفر";

  return (
    <div
      className="pc-card group relative bg-white border border-gray-200 overflow-hidden w-full mx-auto shadow-sm hover:shadow-lg transition-shadow"
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Clickable header (image + badges + price) */}
      <Link
        to={`/products/${product._id}`}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="relative block w-full"
        aria-label={title}
      >
        {isTrending && (
          <span
            className="absolute z-20 top-3 left-3 text-[11px] font-extrabold text-white px-2.5 py-1 bg-red-600/90 rounded"
            title="رائج"
            aria-label="رائج"
          >
            رائج
          </span>
        )}

        {showStockBadge && (
          <span
            className={`absolute z-20 top-3 right-3 text-[11px] font-extrabold text-white px-2.5 py-1 rounded ${
              displayedStock > 0 ? "bg-green-600/90" : "bg-red-600/90"
            }`}
            title={stockText}
            aria-label={stockText}
          >
            {stockText}
          </span>
        )}

        <div className="overflow-hidden">
          <img
            src={getImgUrl(product?.coverImage)}
            alt={title}
            loading="lazy"
            onMouseMove={handleMouseMove}
            className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-105"
            style={{ transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%` }}
          />
        </div>

        <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-transparent to-black/65 opacity-90" />
        <div className="absolute inset-x-0 bottom-0 p-4 text-white">
          <h3 className="font-semibold leading-snug line-clamp-2 drop-shadow">
            {title}
          </h3>

          <div className="mt-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg font-extrabold drop-shadow">
                {Number(product?.newPrice || 0).toFixed(2)} $
              </span>
              {hasOld && (
                <span className="text-sm line-through opacity-90">
                  {Number(product?.oldPrice).toFixed(2)} $
                </span>
              )}
            </div>
            <div className="flex gap-0.5 items-center">
              {renderStarsTiny(ratingValue)}
            </div>
          </div>

          <div className="mt-2 text-xs uppercase tracking-wide opacity-90">
            عرض التفاصيل →
          </div>
        </div>
      </Link>

      <div className="pc-divider" />

      {/* Body: title + shop + price + rating + details + stepper + add to cart */}
      <div className="pc-body p-4 text-center space-y-2">
        <Link to={`/products/${product._id}`}>
          <h3 className="pc-title text-lg font-bold text-gray-800 hover:text-[#111] transition-colors duration-300">
            {title}
          </h3>
        </Link>

        {shopName && (
          <div className="pc-shop">
            <span className="pc-shop-label">المتجر:</span>{" "}
            <a href="#" className="pc-shop-name">
              {shopName}
            </a>
          </div>
        )}

        <div
          className="pc-price text-sm font-bold text-gray-900 mt-1"
          aria-label="السعر"
        >
          {hasOld && (
            <span className="pc-old">
              {Number(product?.oldPrice).toFixed(2)} $
            </span>
          )}
          <span className="pc-new">
            {Number(product?.newPrice || 0).toFixed(2)} $
          </span>
        </div>

        <div className="flex items-center justify-center gap-1 text-gray-700">
          {renderStars(ratingValue)}
          <span className="text-xs ml-1">{ratingValue.toFixed(1)}/5</span>
        </div>

        <div className="pc-extra">
          <p className="product-description text-sm text-gray-500">
            {description.length > 70
              ? `${description.slice(0, 70)}…`
              : description}
          </p>

          {displayedEmbroideryCategory && (
            <p className="text-sm text-gray-600 pc-embroidery">
              نوع التطريز:{" "}
              <span className="font-medium">
                {displayedEmbroideryCategory}
              </span>
            </p>
          )}

          {displayedColor && (
            <p className="text-sm italic text-gray-500">
              اللون:{" "}
              <span className="text-gray-700 font-medium">
                {displayedColor}
              </span>
            </p>
          )}

          {Array.isArray(product?.colors) && product.colors.length > 0 && (
            <div className="text-sm text-gray-600">
              <p className="font-medium">الألوان المتوفرة:</p>
              <ul className="color-list flex flex-wrap justify-center gap-2 mt-1">
                {product.colors.map((c, idx) => (
                  <li
                    key={`${product._id}-clr-${idx}`}
                    className="px-2 py-1 border text-xs bg-gray-100"
                  >
                    {getColorLabel(c)}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {showCounter && (
            <div className="flex items-center justify-center mt-3 sp-cta-row">
              {counterVariant === "compact" ? (
                <div
                  className="qty-mini"
                  role="group"
                  aria-label="الكمية"
                >
                  <button
                    type="button"
                    className="qm-btn qm-minus"
                    onClick={(e) => {
                      e.stopPropagation();
                      decQty();
                    }}
                    disabled={displayedStock === 0}
                    aria-label="إنقاص الكمية"
                  >
                    –
                  </button>
                  <input
                    type="number"
                    min="1"
                    max={Math.max(1, displayedStock)}
                    value={quantity}
                    onChange={handleQuantityChange}
                    disabled={displayedStock === 0}
                    aria-label="الكمية"
                    inputMode="numeric"
                  />
                  <button
                    type="button"
                    className="qm-btn qm-plus"
                    onClick={(e) => {
                      e.stopPropagation();
                      incQty();
                    }}
                    disabled={
                      displayedStock === 0 ||
                      quantity >= Math.max(1, displayedStock)
                    }
                    aria-label="زيادة الكمية"
                  >
                    +
                  </button>
                </div>
              ) : (
                <div
                  className="sp-qty"
                  role="group"
                  aria-label="الكمية"
                >
                  <button
                    type="button"
                    className="sp-btn sp-minus"
                    onClick={(e) => {
                      e.stopPropagation();
                      decQty();
                    }}
                    disabled={displayedStock === 0}
                    aria-label="إنقاص الكمية"
                  >
                    –
                  </button>
                  <input
                    type="number"
                    min="1"
                    max={Math.max(1, displayedStock)}
                    value={quantity}
                    onChange={handleQuantityChange}
                    disabled={displayedStock === 0}
                    aria-label="الكمية"
                    inputMode="numeric"
                  />
                  <button
                    type="button"
                    className="sp-btn sp-plus"
                    onClick={(e) => {
                      e.stopPropagation();
                      incQty();
                    }}
                    disabled={
                      displayedStock === 0 ||
                      quantity >= Math.max(1, displayedStock)
                    }
                    aria-label="زيادة الكمية"
                  >
                    +
                  </button>
                </div>
              )}
            </div>
          )}

          <div className="mt-3">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleAddToCart();
              }}
              onMouseDown={(e) => e.stopPropagation()}
              onTouchStart={(e) => e.stopPropagation()}
              disabled={displayedStock === 0}
              className={`add-to-cart-btn ${
                displayedStock === 0 ? "is-disabled" : ""
              }`}
              aria-label={
                displayedStock > 0 ? "أضف إلى السلة" : "غير متوفر"
              }
            >
              <FiShoppingCart className="icon" />
              {displayedStock > 0 ? "أضف إلى السلة" : "غير متوفر"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
