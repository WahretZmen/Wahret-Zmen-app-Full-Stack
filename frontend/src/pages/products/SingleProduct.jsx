// src/pages/products/SingleProduct.jsx
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

  // trend flag
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
        colorName: { en: "Default", ar: "افتراضي" },
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

  // prices / discount
  const oldP = Number(product?.oldPrice || 0);
  const newP = Number(product?.newPrice || 0);
  const hasDiscount = oldP > 0 && newP > 0 && oldP > newP;
  const saveAmount = hasDiscount ? oldP - newP : 0;
  const savePercent = hasDiscount ? Math.round(((oldP - newP) / oldP) * 100) : 0;

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto p-8">
        <div className="text-center text-[#8B5E3B]">loading?.brand_loading</div>
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

  const stockCount = selectedColor?.stock ?? 0;

  return (
    <div className="product-cart px-4 sm:px-6 md:px-8 py-6 bg-white border border-[#A67C52] rounded-lg shadow-lg max-w-6xl mx-auto sp-page sp-square">
      <h1 className="text-3xl sm:text-4xl font-bold text-center text-[#8B5E3B] font-serif mb-6 sp-title">
        {translatedTitle}
      </h1>

      <div className="flex flex-col md:flex-row gap-8 sp-card">
        {/* IMAGES AREA */}
        <div className="flex-1 md:flex md:gap-4 sp-media">
          {/* Desktop thumbs */}
          <div className="hidden md:flex md:flex-col gap-2 w-20 overflow-visible thumb-rail">
            {activeGallery.map((img, idx) => {
              const isActive = idx === selectedImageIndex;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`flex-shrink-0 w-20 h-20 overflow-hidden transition-all bg-white border sp-thumb ${
                    isActive ? "is-active" : ""
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

          {/* Main image with premium badges */}
          <div className="relative sp-mainimg group w-full">
            {/* Trending badge */}
            {isTrending && (
              <span
                className="product-badge badge-top-left trending-badge"
                title={t("trending")}
                aria-label={t("trending")}
              >
                {t("trending")}
              </span>
            )}

            {/* Stock badge */}
            <span
              className={`product-badge badge-top-right stock-badge ${
                stockCount > 0 ? "in-stock" : "out-of-stock"
              }`}
              title={stockCount > 0 ? `${t("stock")}: ${stockCount}` : t("out_of_stock")}
              aria-label={stockCount > 0 ? `${t("stock")}: ${stockCount}` : t("out_of_stock")}
            >
              {stockCount > 0 ? `${t("stock")}: ${stockCount}` : t("out_of_stock")}
            </span>

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
              className="transition-transform duration-300 cursor-zoom-in object-contain"
              style={{
                width: "100%",
                height: "100%",
                transform:
                  isHovering && window.innerWidth > 768 ? "scale(2)" : "scale(1)",
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

          {/* Mobile thumbs */}
          <div className="mt-2 md:hidden flex flex-wrap gap-2 sp-thumbs">
            {activeGallery.map((img, idx) => {
              const isActive = idx === selectedImageIndex;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`w-16 h-16 overflow-hidden transition-all bg-white border sp-thumb ${
                    isActive ? "is-active" : ""
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
          <p className="text-gray-700 text-base sp-desc">{translatedDescription}</p>

          <div className="text-[#6B4226] space-y-2 text-base">
            <p>
              <strong>{t("published")}:</strong>{" "}
              {product?.createdAt
                ? new Date(product.createdAt).toLocaleDateString()
                : t("unknown")}
            </p>
            <p>
              <strong>ID:</strong> {product?._id?.slice(0, 8)}
            </p>
            <p>
              <strong>{t("category")}:</strong> {translatedCategory}
            </p>
          </div>

          {/* Price row */}
          <div className="sp-price-row">
            {hasDiscount ? (
              <>
                <span className="sp-old">{oldP.toFixed(2)} $</span>
                <span className="sp-new">{newP.toFixed(2)} $</span>
                <span className="sp-save">
                  {t("save")} {saveAmount.toFixed(2)} $
                </span>
                <span className="sp-off">-{savePercent}%</span>
              </>
            ) : (
              <span className="sp-new">{(newP || oldP).toFixed(2)} $</span>
            )}
          </div>

          {/* Colors */}
          <div className="sp-block">
            <p className="text-lg font-medium text-[#6B4226] mb-2 sp-block-label">
              {t("select_color")}:
            </p>
            <div className="flex flex-wrap gap-3 sp-colors">
              {product?.colors?.map((color, index) => {
                const translatedName =
                  color?.colorName?.[lang] || color?.colorName?.en || "Default";
                const isActive = sameColor(color, selectedColor);
                return (
                  <div key={index} className="relative">
                    <img
                      src={getImgUrl(color.image)}
                      alt={translatedName}
                      onClick={() => handleSelectColor(color)}
                      className={`w-16 h-16 object-cover cursor-pointer border-2 transition-all sp-thumb ${
                        isActive ? "is-active" : ""
                      }`}
                    />
                    <div className="sp-thumb-count" title={translatedName}>
                      {color.stock > 0 ? color.stock : t("out_of_stock")}
                    </div>
                  </div>
                );
              })}
            </div>
            <p className="mt-2 text-[#6B4226] text-sm">
              {t("selected")}:{" "}
              <strong>
                {selectedColor?.colorName?.[lang] ||
                  selectedColor?.colorName?.en ||
                  t("default")}
              </strong>
            </p>
          </div>

          {/* Qty + Add to cart */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mt-2 sp-cta-row">
            <div className="flex items-center sp-qty">
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
                disabled={selectedColor?.stock === 0}
              />
              <button
                type="button"
                onClick={() =>
                  setQuantity((q) => Math.min((selectedColor?.stock ?? 1), q + 1))
                }
                disabled={
                  (selectedColor?.stock ?? 0) === 0 ||
                  quantity >= (selectedColor?.stock ?? 1)
                }
              >
                +
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={selectedColor?.stock === 0}
              className={`w-full sm:w-auto py-3 px-6 text-white font-medium text-lg transition-all sp-add ${
                selectedColor?.stock > 0
                  ? "bg-black hover:bg-[#111]"
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
