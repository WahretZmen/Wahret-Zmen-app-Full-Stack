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
        colorName: { en: "Default" },
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

  return (
    <div className="product-cart px-4 sm:px-6 md:px-8 py-6 bg-[#F5EFE6] border border-[#A67C52] rounded-lg shadow-lg max-w-6xl mx-auto">
      <h1 className="text-3xl sm:text-4xl font-bold text-center text-[#8B5E3B] font-serif mb-6">
        {translatedTitle}
      </h1>

      <div className="flex flex-col md:flex-row gap-8">
        {/* IMAGES AREA */}
        <div className="flex-1 md:flex md:gap-4">
          {/* Desktop: vertical thumbs — ring is NOT clipped */}
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
                      ? "ring-2 ring-[#8B5E3B] ring-offset-2 ring-offset-[#F5EFE6] border-transparent"
                      : "border-[#E7D9CC] hover:border-[#C9AF97]"
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

          {/* Main image */}
          <div className="relative border border-[#A67C52] rounded-lg overflow-hidden group w-full">
            <img
              src={getImgUrl(activeGallery[selectedImageIndex] || selectedColor?.image)}
              alt={translatedTitle}
              onMouseEnter={handleMouseEnter}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className="w-full rounded-lg transition-transform duration-300 cursor-zoom-in object-cover"
              style={{
                transform:
                  isHovering && window.innerWidth > 768 ? "scale(2)" : "scale(1)",
                transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
              }}
            />
            <div
              className={`absolute top-2 left-2 px-2 py-1 text-xs font-bold rounded-full text-white ${
                selectedColor?.stock > 0 ? "bg-green-600" : "bg-red-500"
              }`}
            >
              {selectedColor?.stock > 0
                ? `${t("stock")}: ${selectedColor?.stock}`
                : t("out_of_stock")}
            </div>
          </div>

          {/* Mobile: thumbs wrap */}
          <div className="mt-3 md:hidden flex flex-wrap gap-3">
            {activeGallery.map((img, idx) => {
              const isActive = idx === selectedImageIndex;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`w-16 h-16 rounded-lg overflow-hidden transition-all bg-white border ${
                    isActive
                      ? "ring-2 ring-[#8B5E3B] ring-offset-2 ring-offset-[#F5EFE6] border-transparent"
                      : "border-[#E7D9CC] hover:border-[#C9AF97]"
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
        <div className="flex-1 flex flex-col gap-4">
          <p className="text-gray-700 text-base">{translatedDescription}</p>

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

          <div className="text-2xl sm:text-3xl font-semibold text-[#8B5E3B]">
            ${product?.newPrice}
            {!!product?.oldPrice && (
              <span className="text-gray-500 line-through ml-4 text-xl">
                ${Math.round(product.oldPrice)}
              </span>
            )}
          </div>

          {/* Color selector */}
          <div>
            <p className="text-lg font-medium text-[#6B4226] mb-2">
              {t("select_color")}:
            </p>
            <div className="flex flex-wrap gap-4">
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
                      className={`w-16 h-16 object-cover rounded-lg cursor-pointer border-2 transition-all ${
                        isActive
                          ? "ring-2 ring-[#8B5E3B] ring-offset-2 ring-offset-[#F5EFE6] border-transparent"
                          : "border-[#E7D9CC]"
                      }`}
                    />
                    <div
                      className={`absolute top-1 right-1 px-1.5 py-0.5 text-[11px] font-semibold rounded-full text-white shadow-md ${
                        color.stock > 0 ? "bg-green-600" : "bg-red-500"
                      }`}
                      title={translatedName}
                    >
                      {color.stock > 0 ? color.stock : t("out_of_stock")}
                    </div>
                  </div>
                );
              })}
            </div>
            <p className="mt-3 text-[#6B4226] text-sm">
              {t("selected")}:{" "}
              <strong>
                {selectedColor?.colorName?.[lang] ||
                  selectedColor?.colorName?.en ||
                  t("default")}
              </strong>
            </p>
          </div>

          {/* Qty + Add to cart */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mt-4">
            <div className="flex items-center gap-3">
              <label className="text-lg font-medium text-[#6B4226]">
                {t("quantity")}:
              </label>
              <input
                type="number"
                min="1"
                max={selectedColor?.stock ?? 0}
                value={quantity}
                onChange={handleQuantityChange}
                className="border rounded px-4 py-2 w-24 text-center border-[#A67C52]"
                disabled={selectedColor?.stock === 0}
              />
            </div>

            <button
              onClick={handleAddToCart}
              disabled={selectedColor?.stock === 0}
              className={`w-full sm:w-auto py-3 px-6 rounded-lg text-white font-medium text-lg transition-all ${
                selectedColor?.stock > 0
                  ? "bg-[#8B5E3B] hover:bg-[#6B4226]"
                  : "bg-gray-300 cursor-not-allowed"
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
