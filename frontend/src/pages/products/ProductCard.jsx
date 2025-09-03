import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { FiShoppingCart } from "react-icons/fi";

import { addToCart } from "../../redux/features/cart/cartSlice";
import { getImgUrl } from "../../utils/getImgUrl";

import "../../Styles/StylesProductCard.css";

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
  const [isHovering, setIsHovering] = useState(false);

  if (!product) return null;

  // i18n-aware fields
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

  const displayedColor =
    product?.colors?.[0]?.colorName?.[lang] ||
    product?.colors?.[0]?.colorName?.[baseLang] ||
    product?.colors?.[0]?.colorName?.en ||
    t("default", "Default");

  // Stock from first color; fallback to product-level stock
  const displayedStock =
    product?.colors?.[0]?.stock ?? product?.stockQuantity ?? 0;

  // Robust “trending” flag
  const isTrending = Boolean(
    product?.trending ||
      product?.isTrending ||
      product?.tags?.includes?.("trending") ||
      product?.labels?.includes?.("trending")
  );

  const hasOld =
    Number(product?.oldPrice) > Number(product?.newPrice || 0);

  const shopName =
    product?.storeName || product?.vendor || product?.brand || "";

  // Quantity handler: clamp and handle NaN
  const handleQuantityChange = (e) => {
    const raw = Number(e.target.value);
    const safe = Number.isFinite(raw) ? raw : 1;
    const max = Math.max(1, displayedStock || 1);
    const capped = Math.max(1, Math.min(max, safe));
    setQuantity(capped);
  };

  // Add-to-Cart action
  const handleAddToCart = () => {
    const defaultColor =
      product?.colors?.[0] || {
        colorName: { en: "Original", fr: "Original", ar: "أصلي" },
        image: product?.coverImage,
        stock: product?.stockQuantity,
      };

    if ((defaultColor?.stock ?? displayedStock ?? 0) > 0 && quantity > 0) {
      dispatch(addToCart({ ...product, quantity, color: defaultColor }));
    }
  };

  // (Optional) hover zoom handlers
  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPosition({ x, y });
  };
  const handleMouseEnter = () => setIsHovering(true);
  const handleMouseLeave = () => {
    setIsHovering(false);
    setZoomPosition({ x: 50, y: 50 });
  };

  return (
    <div
      className="product-card pc-card group relative bg-white border border-gray-200 overflow-hidden transition-all duration-300 w-full mx-auto"
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
          onMouseEnter={handleMouseEnter}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="pc-img w-full h-full object-contain transition duration-300"
          style={{
            transform: "none",
            transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
          }}
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

        {/* Hover Add-to-Cart (desktop/hover) */}
        <button
          onClick={handleAddToCart}
          disabled={displayedStock === 0}
          className={`pc-cta-ontop ${
            displayedStock > 0 ? "is-active" : "is-disabled"
          }`}
          aria-label={displayedStock > 0 ? t("add_to_cart") : t("out_of_stock")}
        >
          <FiShoppingCart className="inline icon" />
          <span className="label">
            {displayedStock > 0 ? t("add_to_cart") : t("out_of_stock")}
          </span>
        </button>
      </a>

      {/* Divider */}
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
            <span className="pc-shop-label">
              {t("boutique", "Boutique")}:
            </span>{" "}
            <a href="#" className="pc-shop-name">
              {shopName}
            </a>
          </div>
        )}

        {/* Price row */}
        <div className="pc-price text-sm font-bold text-gray-900 mt-1">
          {hasOld && (
            <span className="pc-old">
              {Number(product?.oldPrice).toFixed(2)} $
            </span>
          )}
          <span className="pc-new">
            {Number(product?.newPrice || 0).toFixed(2)} $
          </span>
        </div>

        {/* Hover-reveal panel */}
        <div className="pc-extra">
          {/* Short description */}
          <p className="product-description text-sm text-gray-500">
            {description.length > 60
              ? `${description.slice(0, 60)}...`
              : description}
          </p>

          {/* Default color name */}
          {displayedColor && (
            <p className="text-sm italic text-gray-500">
              {t("color")}:{" "}
              <span className="text-gray-700 font-medium">
                {displayedColor}
              </span>
            </p>
          )}

          {/* Available colors (if any) */}
          {product.colors?.length > 0 && (
            <div className="text-sm text-gray-600">
              <p className="font-medium">{t("available_colors")}:</p>
              <ul className="color-list flex flex-wrap justify-center gap-2 mt-1">
                {product.colors.map((colorObj, idx) => (
                  <li
                    key={
                      colorObj.colorName?.[lang] ||
                      colorObj.colorName?.[baseLang] ||
                      colorObj.colorName?.en ||
                      idx
                    }
                    className="px-2 py-1 border text-xs bg-gray-100"
                  >
                    {colorObj.colorName?.[lang] ||
                      colorObj.colorName?.[baseLang] ||
                      colorObj.colorName?.en ||
                      "-"}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Quantity selector */}
          <div className="flex items-center justify-center text-sm">
            <label className="mr-2">{t("quantity")}:</label>
            <input
              type="number"
              min="1"
              max={Math.max(1, displayedStock || 1)}
              value={quantity}
              onChange={handleQuantityChange}
              className="quantity-input border px-2 w-14 text-center"
              disabled={displayedStock === 0}
            />
          </div>

          {/* Primary CTA */}
          <div className="mt-3">
            <button
              onClick={handleAddToCart}
              disabled={displayedStock === 0}
              className={`add-to-cart-btn ${
                displayedStock > 0 ? "" : "is-disabled"
              }`}
              aria-label={displayedStock > 0 ? t("add_to_cart") : t("out_of_stock")}
            >
              <FiShoppingCart className="inline icon" />
              <span className="label">
                {displayedStock > 0 ? t("add_to_cart") : t("out_of_stock")}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
