import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { FiShoppingCart } from "react-icons/fi";

import { addToCart } from "../../redux/features/cart/cartSlice";
import { getImgUrl } from "../../utils/getImgUrl";

import "../../Styles/StylesProductCard.css";  // reuses qty/add-to-cart look

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  if (!i18n.isInitialized) return null;

  const lang = i18n.language || "en";
  const baseLang = String(lang).split("-")[0];
  const isRTL =
    lang === "ar" ||
    lang === "ar-SA" ||
    (typeof lang === "string" && lang.startsWith("ar"));

  // Local UI state
  const [quantity, setQuantity] = useState(1);
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });

  if (!product) return null;

  /* ---------- i18n-aware fields ---------- */
  const title =
    product?.translations?.[lang]?.title ||
    product?.translations?.[baseLang]?.title ||
    product?.title ||
    "";

  const description =
    product?.translations?.[lang]?.description ||
    product?.translations?.[baseLang]?.description ||
    product?.description ||
    "";

  const firstColor = Array.isArray(product?.colors) ? product.colors[0] : undefined;

  const displayedColor =
    firstColor?.colorName?.[lang] ||
    firstColor?.colorName?.[baseLang] ||
    firstColor?.colorName?.en ||
    t("default", "Default");

  // Stock from first color; fallback to product-level stock
  const displayedStock =
    firstColor?.stock ?? product?.stockQuantity ?? product?.stock ?? 0;

  // Robust “trending” flag
  const isTrending = Boolean(
    product?.trending ||
      product?.isTrending ||
      product?.tags?.includes?.("trending") ||
      product?.labels?.includes?.("trending")
  );

  const hasOld = Number(product?.oldPrice) > Number(product?.newPrice || 0);
  const shopName = product?.storeName || product?.vendor || product?.brand || "";

  /* ---------- quantity handlers ---------- */
  const clampMax = Math.max(1, displayedStock || 1);
  const handleQuantityChange = (e) => {
    const raw = Number(e.target.value);
    const safe = Number.isFinite(raw) ? raw : 1;
    setQuantity(Math.max(1, Math.min(clampMax, safe)));
  };
  const decQty = () => setQuantity((q) => Math.max(1, q - 1));
  const incQty = () => setQuantity((q) => Math.min(clampMax, q + 1));

  /* ---------- actions ---------- */
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

  /* ---------- hover zoom (desktop only) ---------- */
  const handleMouseMove = (e) => {
    if (window.matchMedia("(hover: none)").matches) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPosition({ x, y });
  };

  return (
    <div
      className="pc-card group relative bg-white border border-gray-200 overflow-hidden w-full mx-auto"
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* ===== Image + Badges ===== */}
      <a
        href={`/products/${product._id}`}
        className="pc-imgwrap relative block w-full bg-white"
        aria-label={title}
      >
        <img
          src={getImgUrl(product?.coverImage)}
          alt={title}
          loading="lazy"
          onMouseMove={handleMouseMove}
          className="pc-img w-full h-full object-contain transition duration-300"
          style={{ transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%` }}
        />

        {/* Trending (top-start) */}
        {isTrending && (
          <span
            className="product-badge badge-top-left trending-badge"
            title={t("trending")}
            aria-label={t("trending")}
          >
            {t("trending")}
          </span>
        )}

        {/* Stock (top-end) */}
        <span
          className={`product-badge badge-top-right stock-badge ${
            displayedStock > 0 ? "in-stock" : "out-of-stock"
          }`}
          title={
            displayedStock > 0
              ? `${t("stock")}: ${displayedStock}`
              : t("out_of_stock")
          }
          aria-label={
            displayedStock > 0
              ? `${t("stock")}: ${displayedStock}`
              : t("out_of_stock")
          }
        >
          {displayedStock > 0
            ? `${t("stock")}: ${displayedStock}`
            : t("out_of_stock")}
        </span>
      </a>

      <div className="pc-divider" />

      {/* ===== Body ===== */}
      <div className="pc-body p-4 text-center space-y-2">
        <Link to={`/products/${product._id}`}>
          <h3 className="pc-title text-lg font-bold text-gray-800 hover:text-[#111] transition-colors duration-300">
            {title}
          </h3>
        </Link>

        {shopName && (
          <div className="pc-shop">
            <span className="pc-shop-label">{t("boutique", "Boutique")}:</span>{" "}
            <a href="#" className="pc-shop-name">
              {shopName}
            </a>
          </div>
        )}

        {/* Price row */}
        <div className="pc-price text-sm font-bold text-gray-900 mt-1" aria-label={t("price")}>
          {hasOld && (
            <span className="pc-old">{Number(product?.oldPrice).toFixed(2)} $</span>
          )}
          <span className="pc-new">{Number(product?.newPrice || 0).toFixed(2)} $</span>
        </div>

        {/* Reveal panel (always shown on mobile, hover on desktop) */}
        <div className="pc-extra">
          <p className="product-description text-sm text-gray-500">
            {description.length > 70 ? `${description.slice(0, 70)}…` : description}
          </p>

          {displayedColor && (
            <p className="text-sm italic text-gray-500">
              {t("color")}: <span className="text-gray-700 font-medium">{displayedColor}</span>
            </p>
          )}

          {Array.isArray(product?.colors) && product.colors.length > 0 && (
            <div className="text-sm text-gray-600">
              <p className="font-medium">{t("available_colors")}:</p>
              <ul className="color-list flex flex-wrap justify-center gap-2 mt-1">
                {product.colors.map((c, idx) => {
                  const name =
                    c?.colorName?.[lang] ||
                    c?.colorName?.[baseLang] ||
                    c?.colorName?.en ||
                    `#${idx + 1}`;
                  return (
                    <li key={`${name}-${idx}`} className="px-2 py-1 border text-xs bg-gray-100">
                      {name}
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {/* Quantity stepper (SingleProduct look) */}
          <div className="flex items-center justify-center mt-3 sp-cta-row">
            <div className="sp-qty">
              <button
                type="button"
                onClick={decQty}
                disabled={displayedStock === 0}
                aria-label={t("decrease")}
              >
                –
              </button>

              <input
                type="number"
                min="1"
                max={clampMax}
                value={quantity}
                onChange={handleQuantityChange}
                disabled={displayedStock === 0}
                aria-label={t("quantity")}
                inputMode="numeric"
              />

              <button
                type="button"
                onClick={incQty}
                disabled={displayedStock === 0 || quantity >= clampMax}
                aria-label={t("increase")}
              >
                +
              </button>
            </div>
          </div>

          {/* Primary CTA (Android-friendly tap target) */}
          <div className="mt-3">
           <button
  onClick={handleAddToCart}
  disabled={displayedStock === 0}
  className={`sp-add w-full ${
    displayedStock === 0 ? "cursor-not-allowed opacity-70" : ""
  }`}
>
  <FiShoppingCart className="inline mr-2" />
  {displayedStock > 0 ? t("add_to_cart") : t("out_of_stock")}
</button>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
