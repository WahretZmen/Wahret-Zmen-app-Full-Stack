// src/pages/products/ProductCard.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { FiShoppingCart } from "react-icons/fi";

import { addToCart } from "../../redux/features/cart/cartSlice";
import { getImgUrl } from "../../utils/getImgUrl";

import "../../Styles/StylesProductCard.css";

/**
 * Product card with RTL support, mobile-friendly quantity stepper,
 * badges, and list/card layout modes.
 *
 * Props:
 * - product: Product object
 * - viewMode: "card" | "list"   (optional; default "card")
 */
const ProductCard = ({ product, viewMode = "card" }) => {
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  if (!i18n?.isInitialized || !product) return null;

  const lang = i18n.language || "ar";
  const baseLang = String(lang).split("-")[0];
  const isRTL = /^ar/i.test(lang);

  // Local state
  const [quantity, setQuantity] = useState(1);
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });

  /* ---------- i18n-aware fields ---------- */
  const title =
    product?.translations?.[lang]?.title ||
    product?.translations?.[baseLang]?.title ||
    product?.title ||
    t("unknown_product", "Unknown product");

  const description =
    product?.translations?.[lang]?.description ||
    product?.translations?.[baseLang]?.description ||
    product?.description ||
    t("no_description", "No description available.");

  const firstColor = Array.isArray(product?.colors) ? product.colors[0] : undefined;

  const displayedColor =
    firstColor?.colorName?.[lang] ||
    firstColor?.colorName?.[baseLang] ||
    firstColor?.colorName?.en ||
    t("default", "Default");

  // Stock from first color; fallback to product-level stock
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

  const isList = viewMode === "list";
  const rootClasses = [
    "pc-card",
    isList ? "pc-list" : "",
    "group relative bg-white border border-gray-200 overflow-visible w-full mx-auto",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={rootClasses} dir={isRTL ? "rtl" : "ltr"}>
      {/* ===== Image + Badges ===== */}
      <a
        href={`/products/${product._id}`}
        className={isList ? "pc-list-imgwrap pc-imgwrap" : "pc-imgwrap"}
        aria-label={title}
      >
        <img
          src={getImgUrl(product?.coverImage)}
          alt={title}
          loading="lazy"
          onMouseMove={handleMouseMove}
          className="pc-img"
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
      <div className={isList ? "pc-list-body pc-body" : "pc-body"}>
        <Link to={`/products/${product._id}`}>
          <h3 className="pc-title">{title}</h3>
        </Link>

        {shopName && (
          <div className="pc-shop" aria-label={t("boutique", "Boutique")}>
            <span className="pc-shop-label">{t("boutique", "Boutique")}:</span>{" "}
            <a href="#" className="pc-shop-name">
              {shopName}
            </a>
          </div>
        )}

        {/* Price row */}
        <div className="pc-price" aria-label={t("price", "Price")}>
          {hasOld && (
            <span className="pc-old">
              {Number(product?.oldPrice).toFixed(2)} $
            </span>
          )}
          <span className="pc-new">
            {Number(product?.newPrice || 0).toFixed(2)} $
          </span>
        </div>

        {/* Extra content (always shown on touch) */}
        <div className={`pc-extra ${isList ? "pc-extra--always" : ""}`}>
          <p className="product-description">
            {description.length > 90 ? `${description.slice(0, 90)}…` : description}
          </p>

          {displayedColor && (
            <p className="pc-colorline">
              {t("color")}: <span className="pc-colorval">{displayedColor}</span>
            </p>
          )}

          {Array.isArray(product?.colors) && product.colors.length > 0 && (
            <div className="pc-colors">
              <p className="pc-colors-label">{t("available_colors")}:</p>
              <ul className="color-list">
                {product.colors.map((c, idx) => {
                  const name =
                    c?.colorName?.[lang] ||
                    c?.colorName?.[baseLang] ||
                    c?.colorName?.en ||
                    `#${idx + 1}`;
                  return <li key={`${name}-${idx}`}>{name}</li>;
                })}
              </ul>
            </div>
          )}

          {/* Quantity stepper */}
          <div className="sp-cta-row">
            <div className="sp-qty">
              <button
                type="button"
                className="sp-btn sp-minus"
                onClick={decQty}
                disabled={displayedStock === 0}
                aria-label={t("decrease", "Decrease")}
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
                className="sp-btn sp-plus"
                onClick={incQty}
                disabled={displayedStock === 0 || quantity >= clampMax}
                aria-label={t("increase", "Increase")}
              >
                +
              </button>
            </div>
          </div>

          {/* Primary CTA */}
          <div className="pc-cta">
            <button
              onClick={handleAddToCart}
              disabled={displayedStock === 0}
              className={`add-to-cart-btn ${
                displayedStock === 0 ? "is-disabled" : ""
              }`}
            >
              <FiShoppingCart className="icon" />
              {displayedStock > 0 ? t("add_to_cart") : t("out_of_stock")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
