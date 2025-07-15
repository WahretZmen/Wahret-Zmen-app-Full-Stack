import React, { useState, useEffect } from "react";
import { FiShoppingCart } from "react-icons/fi";
import { useParams } from "react-router-dom";
import { getImgUrl } from "../../utils/getImgUrl";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/features/cart/cartSlice";
import { useGetProductByIdQuery } from "../../redux/features/products/productsApi";
import "../../Styles/StylesSingleProduct.css";
import { useTranslation } from "react-i18next";

const SingleProduct = () => {
  const { id } = useParams();
  const { data: product, isLoading, isError } = useGetProductByIdQuery(id);
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(null);
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });
  const [isHovering, setIsHovering] = useState(false);

  const translatedTitle = product?.translations?.[lang]?.title || product?.title;
  const translatedDescription = product?.translations?.[lang]?.description || product?.description;
  const categoryKey = product?.category?.toLowerCase();
  const translatedCategory = t(`categories.${categoryKey}`, product?.category);

  useEffect(() => {
    if (product) {
      setSelectedColor(
        product.colors?.[0] || {
          colorName: "Default",
          image: product?.coverImage || "/assets/default-image.png",
          stock: product?.stockQuantity || 0,
        }
      );
    }
  }, [product]);

  const handleQuantityChange = (e) => {
    const value = Number(e.target.value);
    const maxStock = selectedColor?.stock ?? 0;
    setQuantity(value > maxStock ? maxStock : value);
  };

  const handleSelectColor = (color) => {
    setSelectedColor(color);
    setQuantity(1);
  };

  const handleAddToCart = () => {
    if ((selectedColor?.stock ?? 0) > 0 && quantity > 0) {
      dispatch(addToCart({
        ...product,
        quantity,
        color: selectedColor,
      }));
    }
  };

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


  return (
    <div className="product-cart px-4 sm:px-6 md:px-8 py-6 bg-[#F5EFE6] border border-[#A67C52] rounded-lg shadow-lg max-w-6xl mx-auto">
      <h1 className="text-3xl sm:text-4xl font-bold text-center text-[#8B5E3B] font-serif mb-6">
        {translatedTitle}
      </h1>

      <div className="flex flex-col md:flex-row gap-8">
        {/* 📸 Image Section */}
        <div className="relative border border-[#A67C52] rounded-lg overflow-hidden group w-full md:w-1/2">
          <img
            src={getImgUrl(selectedColor?.image ?? "/assets/default-image.png")}
            alt={translatedTitle}
            onMouseEnter={handleMouseEnter}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="w-full rounded-lg transition-transform duration-300 cursor-zoom-in object-cover"
            style={{
              transform: isHovering && window.innerWidth > 768 ? "scale(2)" : "scale(1)",
              transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
            }}
          />
          <div className={`absolute top-2 left-2 px-2 py-1 text-xs font-bold rounded-full text-white ${selectedColor?.stock > 0 ? "bg-green-600" : "bg-red-500"}`}>
            {selectedColor?.stock > 0 ? `${t("stock")}: ${selectedColor?.stock}` : t("out_of_stock")}
          </div>
        </div>

        {/* 📝 Details Section */}
        <div className="flex-1 flex flex-col gap-4">
          <p className="text-gray-700 text-base">{translatedDescription}</p>

          <div className="text-[#6B4226] space-y-2 text-base">
            <p><strong>{t("published")}:</strong> {product?.createdAt ? new Date(product.createdAt).toLocaleDateString() : t("unknown")}</p>
            <p><strong>ID:</strong> {product?._id?.slice(0, 8)}</p>
            <p><strong>{t("category")}:</strong> {translatedCategory}</p>
          </div>

          <div className="text-2xl sm:text-3xl font-semibold text-[#8B5E3B]">
            ${product?.newPrice}
            {product?.oldPrice && (
              <span className="text-gray-500 line-through ml-4 text-xl">${Math.round(product?.oldPrice)}</span>
            )}
          </div>

          {/* 🎨 Colors */}
          <div>
            <p className="text-lg font-medium text-[#6B4226] mb-2">{t("select_color")}:</p>
            <div className="flex flex-wrap gap-4">
              {product?.colors?.map((color, index) => {
                const translatedName = color?.colorName?.[lang] || color?.colorName?.en || "Default";
                return (
                  <div key={index} className="relative group">
                    <img
                      src={getImgUrl(color.image)}
                      alt={translatedName}
                      onClick={() => handleSelectColor(color)}
                      className={`w-16 h-16 object-cover rounded cursor-pointer border-4 transition-all ${
                        selectedColor?.colorName?.en === color?.colorName?.en
                          ? "border-[#8B5E3B]"
                          : "border-transparent"
                      }`}
                    />
                    <div className={`absolute top-1 right-1 px-1.5 py-0.5 text-[11px] font-semibold rounded-full text-white shadow-md ${
                      color.stock > 0 ? "bg-green-600" : "bg-red-500"
                    }`}>
                      {color.stock > 0 ? color.stock : t("out_of_stock")}
                    </div>
                  </div>
                );
              })}
            </div>
            <p className="mt-3 text-[#6B4226] text-sm">
              {t("selected")}: <strong>{selectedColor?.colorName?.[lang] || selectedColor?.colorName?.en || t("default")}</strong>
            </p>
          </div>

          {/* 📦 Quantity + Add to Cart */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mt-4">
            <div className="flex items-center gap-3">
              <label className="text-lg font-medium text-[#6B4226]">{t("quantity")}:</label>
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
