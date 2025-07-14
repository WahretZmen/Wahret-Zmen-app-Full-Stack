import React, { useState } from "react";
import { FiShoppingCart } from "react-icons/fi";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { getImgUrl } from "../../utils/getImgUrl";
import { addToCart } from "../../redux/features/cart/cartSlice";




const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  if (!i18n.isInitialized) return null;
  const [quantity, setQuantity] = useState(1);

  // ✅ Zoom state
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });
  const [isHovering, setIsHovering] = useState(false);

  if (!product) return null;

  const title =
    product?.translations?.[lang]?.title ||
    product?.title ||
    "";

  const description =
    product?.translations?.[lang]?.description ||
    product?.description ||
    "";

  const displayedColor =
    product?.colors?.[0]?.colorName?.[lang] ||
    product?.colors?.[0]?.colorName?.en ||
    t("default");

  const displayedStock =
    product?.colors?.[0]?.stock ?? product?.stockQuantity ?? 0;

  const handleQuantityChange = (e) => {
    const value = Number(e.target.value);
    setQuantity(value > displayedStock ? displayedStock : value);
  };

  const handleAddToCart = () => {
    const defaultColor = product?.colors?.[0] || {
      colorName: {
        en: "Original",
        fr: "Original",
        ar: "أصلي",
      },
      image: product?.coverImage,
      stock: product?.stockQuantity,
    };

    if ((defaultColor?.stock ?? 0) > 0 && quantity > 0) {
      dispatch(
        addToCart({
          ...product,
          quantity,
          color: defaultColor,
        })
      );
    }
  };

  // 🖱️ Zoom handlers (hover only)
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
    <div className="product-card group relative bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-500 hover:shadow-2xl hover:scale-[1.03] max-w-xs w-full mx-auto">
      <div className="relative w-full h-52 overflow-hidden">
        <Link to={`/products/${product._id}`} className="block w-full h-full">
          <img
            src={getImgUrl(product?.coverImage)}
            alt={title}
            onMouseEnter={handleMouseEnter}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className={`w-full h-full object-contain p-2 transition-transform duration-500 ${
              isHovering ? "cursor-wz-zoom" : "cursor-default"
            }`}
            
            style={{
              transform: isHovering ? "scale(2)" : "scale(1)",
              transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
            }}
          />
        </Link>
  
        {/* Stock + Trending */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          <span
            className={`text-xs font-semibold px-2 py-1 rounded-full text-white ${
              displayedStock > 0 ? "bg-green-600" : "bg-red-500"
            }`}
          >
            {displayedStock > 0 ? `${t("stock")}: ${displayedStock}` : t("out_of_stock")}
          </span>
          {product.trending && (
            <span className="text-xs font-semibold px-2 py-1 bg-red-500 text-white rounded-full">
              {t("trending")}
            </span>
          )}
        </div>
  
        {/* Add to Cart Hover Button */}
        <button
          onClick={handleAddToCart}
          disabled={displayedStock === 0}
          className={`absolute bottom-3 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full text-sm font-medium text-white transition-all duration-300
          ${
            displayedStock > 0
              ? "bg-[#8B5C3E] opacity-0 group-hover:opacity-100 translate-y-3 group-hover:translate-y-0"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          <FiShoppingCart className="inline mr-1" />
          {displayedStock > 0 ? t("add_to_cart") : t("out_of_stock")}
        </button>
      </div>
  
      <div className="p-4 text-center space-y-2">
        <Link to={`/products/${product._id}`}>
          <h3 className="text-lg font-bold text-gray-800 hover:text-[#8B5C3E] transition-colors duration-300">
            {title}
          </h3>
        </Link>
  
        <p className="text-sm text-gray-500">
          {description.length > 60 ? `${description.slice(0, 60)}...` : description}
        </p>
  
        {displayedColor && (
          <p className="text-sm italic text-gray-500">
            {t("color")}: <span className="text-gray-700 font-medium">{displayedColor}</span>
          </p>
        )}
  
        {product.colors?.length > 0 && (
          <div className="text-sm text-gray-600">
            <p className="font-medium">{t("available_colors")}:</p>
            <ul className="flex flex-wrap justify-center gap-2 mt-1">
              {product.colors.map((colorObj, idx) => (
                <li
                  key={colorObj.colorName?.[lang] || colorObj.colorName?.en || idx}
                  className="px-2 py-1 border rounded text-xs bg-gray-100"
                >
                  {colorObj.colorName?.[lang] || colorObj.colorName?.en || "-"}
                </li>
              ))}
            </ul>
          </div>
        )}
  
        <div className="text-lg font-semibold text-[#8B5C3E]">
          {product?.newPrice} DT
          {product?.oldPrice && (
            <span className="text-gray-400 text-sm line-through ml-2">
              {Math.round(product?.oldPrice)} DT
            </span>
          )}
        </div>
  
        <div className="flex items-center justify-center text-sm">
          <label className="mr-2">{t("quantity")}:</label>
          <input
            type="number"
            min="1"
            max={displayedStock}
            value={quantity}
            onChange={handleQuantityChange}
            className="border rounded px-2 w-14 text-center"
            disabled={displayedStock === 0}
          />
        </div>
        <div className="mt-3">
        <button
  onClick={handleAddToCart}
  disabled={displayedStock === 0}
  className={`add-to-cart-btn ${
    displayedStock > 0 ? "" : "bg-gray-300 cursor-not-allowed"
  }`}
>
  <FiShoppingCart className="inline mr-1" />
  {displayedStock > 0 ? t("add_to_cart") : t("out_of_stock")}
</button>

</div>


      </div>
    </div>
  );
  
 
};

export default ProductCard;


