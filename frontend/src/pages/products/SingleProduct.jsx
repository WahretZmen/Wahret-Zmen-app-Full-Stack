import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { FiShoppingCart } from "react-icons/fi";
import { useTranslation } from "react-i18next";

import { useGetProductByIdQuery } from "../../redux/features/products/productsApi";
import { addToCart } from "../../redux/features/cart/cartSlice";
import { getImgUrl } from "../../utils/getImgUrl";
import "../../Styles/StylesSingleProduct.css";

const SingleProduct = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  const { data: product, isLoading, isError } = useGetProductByIdQuery(id);

  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  // zoom state
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });
  const [isHovering, setIsHovering] = useState(false);

  const translatedTitle =
    product?.translations?.[lang]?.title || product?.title || t("unknown_product");
  const translatedDescription =
    product?.translations?.[lang]?.description || product?.description || t("no_description");
  const categoryKey = product?.category?.toLowerCase();
  const translatedCategory = t(`categories.${categoryKey}`, product?.category || t("unknown"));

  // robust trending detection
  const isTrending = Boolean(
    product?.trending ||
      product?.isTrending ||
      product?.tags?.includes?.("trending") ||
      product?.labels?.includes?.("trending")
  );

  const sameColor = (a, b) => {
    if (!a || !b) return false;
    if (a._id && b._id) return a._id === b._id;
    return a.image === b.image;
  };

  const activeGallery = useMemo(() => {
    if (!selectedColor && !product) return [];
    const base = [];
    if (Array.isArray(selectedColor?.gallery) && selectedColor.gallery.length > 0) {
      base.push(...selectedColor.gallery);
    }
    if (selectedColor?.image && !base.includes(selectedColor.image)) {
      base.unshift(selectedColor.image);
    }
    if (product?.coverImage && !base.includes(product.coverImage)) {
      base.push(product.coverImage);
    }
    return [...new Set(base.filter(Boolean))];
  }, [selectedColor, product]);

  useEffect(() => {
    if (!product) return;
    const initial =
      product.colors?.[0] || {
        colorName: { en: "Default", fr: "Défaut", ar: "افتراضي" },
        image: product.coverImage,
        stock: product.stockQuantity || 0,
      };
    setSelectedColor(initial);
    setSelectedImageIndex(0);
    setQuantity(1);
  }, [product]);

  const handleSelectColor = (color) => {
    setSelectedColor(color);
    setSelectedImageIndex(0);
    setQuantity(1);
  };

  const handleQuantityChange = (e) => {
    const maxStock = selectedColor?.stock ?? 0;
    const value = Math.max(1, Math.min(maxStock, Number(e.target.value || 1)));
    setQuantity(value);
  };

  const handleAddToCart = () => {
    if ((selectedColor?.stock ?? 0) > 0 && quantity > 0) {
      dispatch(addToCart({ ...product, quantity, color: selectedColor }));
    }
  };

  // zoom handlers
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

  // discount helpers
  const oldP = Number(product?.oldPrice || 0);
  const newP = Number(product?.newPrice || 0);
  const hasDiscount = oldP > 0 && newP > 0 && oldP > newP;
  const saveAmount = hasDiscount ? oldP - newP : 0;
  const savePercent = hasDiscount ? Math.round(((oldP - newP) / oldP) * 100) : 0;

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto p-8">
        <div className="text-center text-black/70">loading?.brand_loading</div>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="max-w-6xl mx-auto p-8 text-center text-red-600">
        {t("unknown_product")}
      </div>
    );
  }

  return (
    <div className="product-cart px-4 sm:px-6 md:px-8 py-6 bg-white border border-[#A67C52] rounded-lg shadow-lg max-w-6xl mx-auto sp-page sp-square">
      <h1 className="text-3xl sm:text-4xl font-extrabold text-center text-black font-serif mb-6 sp-title">
        {translatedTitle}
      </h1>

      <div className="flex flex-col md:flex-row gap-8 sp-card">
        {/* IMAGES AREA */}
        <div className="flex-1 md:flex md:gap-4 sp-media">
          {/* Desktop: vertical thumbs */}
          <div className="hidden md:flex md:flex-col gap-3 w-20 overflow-visible">
            {activeGallery.map((img, idx) => {
              const isActive = idx === selectedImageIndex;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden transition-all bg-white border ${
                    isActive
                      ? "ring-2 ring-black ring-offset-2 ring-offset-white border-transparent sp-thumb is-active"
                      : "border-[#E7D9CC] hover:border-neutral-400 sp-thumb"
                  }`}
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

          {/* Main image with arrows + badges */}
          <div className="relative border border-[#A67C52] overflow-hidden group w-full sp-mainimg">
            {/* Trending badge (top-left) */}
            {isTrending && (
              <div className="sp-flag sp-flag--trending" title={t("trending")} aria-label={t("trending")}>
                {t("trending")}
              </div>
            )}

            {/* Stock badge (top-right) */}
            <div
              className={`sp-stock ${
                (selectedColor?.stock ?? 0) > 0 ? "sp-stock--ok" : "sp-stock--out"
              }`}
              title={
                (selectedColor?.stock ?? 0) > 0
                  ? `${t("stock")}: ${selectedColor?.stock}`
                  : t("out_of_stock")
              }
              aria-label={
                (selectedColor?.stock ?? 0) > 0
                  ? `${t("stock")}: ${selectedColor?.stock}`
                  : t("out_of_stock")
              }
            >
              {(selectedColor?.stock ?? 0) > 0
                ? `${t("stock")}: ${selectedColor?.stock}`
                : t("out_of_stock")}
            </div>

            {/* Left Arrow */}
            {activeGallery.length > 1 && (
              <button
                type="button"
                className="sp-arrow sp-arrow-left"
                onClick={() =>
                  setSelectedImageIndex(
                    (prev) => (prev - 1 + activeGallery.length) % activeGallery.length
                  )
                }
              >
                ‹
              </button>
            )}

            {/* Main Image */}
            <img
              src={getImgUrl(activeGallery[selectedImageIndex] || selectedColor?.image)}
              alt={translatedTitle}
              onMouseEnter={handleMouseEnter}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className="w-full transition-transform duration-300 cursor-zoom-in object-contain"
              style={{
                transform: isHovering && window.innerWidth > 768 ? "scale(2)" : "scale(1)",
                transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
              }}
            />

            {/* Right Arrow */}
            {activeGallery.length > 1 && (
              <button
                type="button"
                className="sp-arrow sp-arrow-right"
                onClick={() =>
                  setSelectedImageIndex((prev) => (prev + 1) % activeGallery.length)
                }
              >
                ›
              </button>
            )}
          </div>

          {/* Mobile: thumbs wrap */}
          <div className="mt-3 md:hidden flex flex-wrap gap-3 sp-thumbs">
            {activeGallery.map((img, idx) => {
              const isActive = idx === selectedImageIndex;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`w-16 h-16 rounded-lg overflow-hidden transition-all bg-white border sp-thumb ${
                    isActive
                      ? "ring-2 ring-black ring-offset-2 ring-offset-white border-transparent is-active"
                      : "border-[#E7D9CC] hover:border-neutral-400"
                  }`}
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

        {/* DETAILS AREA */}
        <div className="flex-1 flex flex-col gap-4 sp-right">
          <p className="text-black/80 text-base sp-desc">{translatedDescription}</p>

          <div className="text-black/80 space-y-2 text-base">
            <p>
              <strong className="text-black">{t("published")}:</strong>{" "}
              {product?.createdAt
                ? new Date(product.createdAt).toLocaleDateString()
                : t("unknown")}
            </p>
            <p>
              <strong className="text-black">ID:</strong> {product?._id?.slice(0, 8)}
            </p>
            <p>
              <strong className="text-black">{t("category")}:</strong> {translatedCategory}
            </p>
          </div>

          {/* PRICE ROW */}
          <div className="sp-price-row">
            {hasDiscount && <span className="sp-percent">{savePercent}%-</span>}
            {hasDiscount ? (
              <>
                <span className="sp-old">{oldP.toFixed(2)} $</span>
                <span className="sp-new">{newP.toFixed(2)} $</span>
                <span className="sp-save">
                  {t("save", "save")} {saveAmount.toFixed(2)} $
                </span>
              </>
            ) : (
              <span className="sp-new">{(newP || oldP).toFixed(2)} $</span>
            )}
          </div>

          {/* Color selector */}
          <div className="sp-block">
            <p className="text-lg font-extrabold text-black mb-2 sp-block-label">
              {t("select_color")}:
            </p>
            <div className="flex flex-wrap gap-4 sp-colors">
              {product?.colors?.map((color, index) => {
                const translatedName =
                  color?.colorName?.[lang] || color?.colorName?.en || "Default";
                const isActive = sameColor(color, selectedColor);
                const badgeClass = isActive
                  ? "sp-thumb-badge is-active"
                  : `sp-thumb-badge neutral${color.stock > 0 ? "" : " dim"}`;
                return (
                  <div key={index} className="relative">
                    <img
                      src={getImgUrl(color.image)}
                      alt={translatedName}
                      onClick={() => handleSelectColor(color)}
                      className={`w-16 h-16 object-cover rounded-lg cursor-pointer border-2 transition-all ${
                        isActive
                          ? "ring-2 ring-black ring-offset-2 ring-offset-white border-transparent"
                          : "border-[#E7D9CC]"
                      }`}
                    />
                    <div className={badgeClass} title={translatedName}>
                      {color.stock > 0 ? color.stock : t("out_of_stock")}
                    </div>
                  </div>
                );
              })}
            </div>
            <p className="mt-3 text-black/80 text-sm">
              {t("selected")}:{" "}
              <strong className="text-black">
                {selectedColor?.colorName?.[lang] ||
                  selectedColor?.colorName?.en ||
                  t("default")}
              </strong>
            </p>
          </div>

          {/* Qty + Add to cart */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mt-4 sp-cta-row">
            <div className="flex items-center gap-3 sp-qty">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                disabled={(selectedColor?.stock ?? 0) === 0}
              >
                –
              </button>
              <input
                type="number"
                min="1"
                max={selectedColor?.stock ?? 0}
                value={quantity}
                onChange={handleQuantityChange}
                className="border rounded px-4 py-2 w-24 text-center border-neutral-300"
                disabled={selectedColor?.stock === 0}
              />
              <button
                type="button"
                onClick={() =>
                  setQuantity((q) => Math.min((selectedColor?.stock ?? 1), q + 1))
                }
                disabled={(selectedColor?.stock ?? 0) === 0 || quantity >= (selectedColor?.stock ?? 1)}
              >
                +
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={selectedColor?.stock === 0}
              className={`w-full sm:w-auto py-3 px-6 rounded-lg text-white font-medium text-lg transition-all sp-add ${
                selectedColor?.stock > 0
                  ? "bg-black hover:bg-neutral-900"
                  : "bg-gray-300 cursor-not-allowed is-disabled"
              }`}
            >
              <FiShoppingCart className="inline mr-2" />
              {selectedColor?.stock > 0 ? t("add_to_cart") : t("out_of_stock")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleProduct;
