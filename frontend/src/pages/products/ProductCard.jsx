// src/pages/products/ProductCard.jsx

// ---------------------
// Library & framework
// ---------------------
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { FiShoppingCart } from "react-icons/fi";

// ---------------------
// App: state & helpers
// ---------------------
import { addToCart } from "../../redux/features/cart/cartSlice";
import { getImgUrl } from "../../utils/getImgUrl";

// ---------------------
// Styles
// ---------------------
// Ensure this CSS file contains the classes used below (pc-card, product-badge, etc.)
import "../../Styles/StylesProductCard.css";

/**
 * ProductCard
 * -----------
 * Displays a single product as a card:
 * - Cover image with hover CTA
 * - Title, shop/vendor, price (new/old)
 * - Short description, color list (from first variant), stock
 * - Quantity input and "Add to Cart"
 *
 * Notes:
 * - Uses the first color variant (if present) as default for stock/color display and add-to-cart.
 * - Supports i18n titles/descriptions via product.translations[lang].
 * - Uses plain CSS classes (no Tailwind).
 */
const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  if (!i18n.isInitialized) return null;

  // ---------------------
  // Local UI state
  // ---------------------
  const [quantity, setQuantity] = useState(1);

  // Zoom state (reserved for possible image-zoom effects)
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });
  const [isHovering, setIsHovering] = useState(false);

  // Guard: no product => nothing to render
  if (!product) return null;

  // ---------------------
  // Derived fields (i18n-aware)
  // ---------------------
  const title =
    product?.translations?.[lang]?.title ||
    product?.title ||
    "";

  const description =
    product?.translations?.[lang]?.description ||
    product?.description ||
    "";

  // Display the first color variant if available
  const displayedColor =
    product?.colors?.[0]?.colorName?.[lang] ||
    product?.colors?.[0]?.colorName?.en ||
    t("default");

  // Stock from first color; fallback to product-level stock
  const displayedStock =
    product?.colors?.[0]?.stock ?? product?.stockQuantity ?? 0;

  // ---------------------
  // Quantity change handler (caps by stock)
  // ---------------------
  const handleQuantityChange = (e) => {
    const value = Number(e.target.value);
    setQuantity(value > displayedStock ? displayedStock : value);
  };

  // ---------------------
  // Add-to-Cart action
  // ---------------------
  const handleAddToCart = () => {
    const defaultColor = product?.colors?.[0] || {
      colorName: { en: "Original", fr: "Original", ar: "أصلي" },
      image: product?.coverImage,
      stock: product?.stockQuantity,
    };

    if ((defaultColor?.stock ?? 0) > 0 && quantity > 0) {
      dispatch(addToCart({ ...product, quantity, color: defaultColor }));
    }
  };

  // ---------------------
  // (Optional) Hover zoom handlers
  // ---------------------
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

  // Price display helpers
  const hasOld = Number(product?.oldPrice) > Number(product?.newPrice || 0);
  const shopName = product?.storeName || product?.vendor || product?.brand || "";

  // ---------------------
  // Render
  // ---------------------
  return (
    <div className="product-card pc-card group relative bg-white border border-gray-200 overflow-hidden transition-all duration-300 w-full sm:max-w-[280px] mx-auto">
      {/* ================= Image + hover CTA ================= */}
      <a
        href={`/products/${product._id}`}
        className="pc-imgwrap relative block w-full bg-white"
      >
        <img
          src={getImgUrl(product?.coverImage)}
          alt={title}
          onMouseEnter={handleMouseEnter}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="pc-img w-full h-full object-contain transition duration-300"
          style={{ transform: "none" }}
        />

        {/* Optional: Trending badge */}
        {product.trending && (
          <span className="product-badge trending-badge absolute z-20 text-xs font-semibold px-2 py-1 bg-red-500 text-white shadow-md">
            {t("trending")}
          </span>
        )}

        {/* Stock badge */}
        <span
          className={`product-badge stock-badge absolute z-20 text-xs font-semibold px-2 py-1 text-white shadow-md ${
            displayedStock > 0 ? "in-stock bg-green-600" : "out-of-stock bg-red-500"
          }`}
        >
          {displayedStock > 0 ? `${t("stock")}: ${displayedStock}` : t("out_of_stock")}
        </span>

        {/* Hover Add-to-Cart CTA (appears on image hover) */}
        <button
          onClick={handleAddToCart}
          disabled={displayedStock === 0}
          className={`pc-cta-ontop absolute bottom-3 left-1/2 -translate-x-1/2 px-4 py-2 text-sm font-medium text-white transition-all duration-300 ${
            displayedStock > 0
              ? "bg-[#111111] opacity-0 group-hover:opacity-100 translate-y-3 group-hover:translate-y-0"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          <FiShoppingCart className="inline mr-1" />
          {displayedStock > 0 ? t("add_to_cart") : t("out_of_stock")}
        </button>
      </a>

      {/* Divider between image and meta */}
      <div className="pc-divider" />

      {/* ================= Body: title, shop, price, extra ================= */}
      <div className="pc-body p-4 text-center space-y-2">
        {/* Title (links to product details) */}
        <Link to={`/products/${product._id}`}>
          <h3 className="pc-title text-lg font-bold text-gray-800 hover:text-[#111] transition-colors duration-300">
            {title}
          </h3>
        </Link>

        {/* Shop / Brand (optional) */}
        {shopName && (
          <div className="pc-shop">
            <span className="pc-shop-label">{t("boutique") || "Boutique:"}</span>{" "}
            <a href="#" className="pc-shop-name">{shopName}</a>
          </div>
        )}

        {/* Price row (old/new) */}
        <div className="pc-price text-sm font-bold text-gray-900 mt-1">
          {hasOld && <span className="pc-old">{Number(product?.oldPrice).toFixed(2)} $</span>}
          <span className="pc-new">{Number(product?.newPrice || 0).toFixed(2)} $</span>
        </div>

        {/* Hover-reveal panel: short description, colors, quantity, secondary button */}
        <div className="pc-extra">
          {/* Short description (clipped) */}
          <p className="product-description text-sm text-gray-500">
            {description.length > 60 ? `${description.slice(0, 60)}...` : description}
          </p>

          {/* Default color name */}
          {displayedColor && (
            <p className="text-sm italic text-gray-500">
              {t("color")}: <span className="text-gray-700 font-medium">{displayedColor}</span>
            </p>
          )}

          {/* Available colors list (if provided) */}
          {product.colors?.length > 0 && (
            <div className="text-sm text-gray-600">
              <p className="font-medium">{t("available_colors")}:</p>
              <ul className="color-list flex flex-wrap justify-center gap-2 mt-1">
                {product.colors.map((colorObj, idx) => (
                  <li
                    key={colorObj.colorName?.[lang] || colorObj.colorName?.en || idx}
                    className="px-2 py-1 border text-xs bg-gray-100"
                  >
                    {colorObj.colorName?.[lang] || colorObj.colorName?.en || "-"}
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
              max={displayedStock}
              value={quantity}
              onChange={handleQuantityChange}
              className="quantity-input border px-2 w-14 text-center"
              disabled={displayedStock === 0}
            />
          </div>

          {/* Secondary Add-to-Cart button (inside hover panel) */}
          <div className="mt-3">
            <button
              onClick={handleAddToCart}
              disabled={displayedStock === 0}
              className={`add-to-cart-btn ${displayedStock > 0 ? "" : "bg-gray-300 cursor-not-allowed"}`}
            >
              <FiShoppingCart className="inline mr-1" />
              {displayedStock > 0 ? t("add_to_cart") : t("out_of_stock")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
