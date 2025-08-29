// src/pages/cart/CartPage.jsx
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getImgUrl } from "../../utils/getImgUrl";
import {
  clearCart,
  removeFromCart,
  updateQuantity,
} from "../../redux/features/cart/cartSlice";
import { useTranslation } from "react-i18next";
import { FiTrash2, FiMinus, FiPlus } from "react-icons/fi";

const CartPage = () => {
  const { t, i18n } = useTranslation();
  if (!i18n.isInitialized) return null;

  const cartItems = useSelector((state) => state.cart.cartItems);
  const dispatch = useDispatch();

  const totalPrice = cartItems
    .reduce((acc, item) => acc + item.newPrice * item.quantity, 0)
    .toFixed(2);

  const handleRemoveFromCart = (product) => dispatch(removeFromCart(product));
  const handleClearCart = () => cartItems.length && dispatch(clearCart());

  const setQuantity = (product, quantity) => {
    const max = product?.color?.stock ?? 999;
    const next = Math.min(Math.max(1, quantity), max);
    if (next !== product.quantity) {
      dispatch(
        updateQuantity({
          _id: product._id,
          color: product.color,
          quantity: next,
        })
      );
    }
  };
  const inc = (p) => setQuantity(p, p.quantity + 1);
  const dec = (p) => setQuantity(p, p.quantity - 1);

  return (
    <div className="main-content">
      <div className="min-h-screen bg-[#F8F1E9] py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-2xl p-6 sm:p-8 border border-[#A67C52]">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b pb-4 gap-4">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#8B5C3E]">
              {t("cart.title")}
            </h2>

            {cartItems.length > 0 && (
              <button
                onClick={handleClearCart}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl
                           text-[#8B5C3E] border-2 border-[#C9A47C] bg-white
                           hover:bg-[#F7EFE7] hover:border-[#8B5C3E]
                           active:scale-[.98] transition-all duration-150
                           shadow-sm focus:outline-none focus:ring-2 focus:ring-[#E2C9AD]"
              >
                <FiTrash2 className="text-sm" />
                {t("cart.clear_cart")}
              </button>
            )}
          </div>

          {/* Cart Items */}
          <div className="mt-6">
            {cartItems.length > 0 ? (
              <ul className="space-y-4">
                {cartItems.map((product) => {
                  const linePrice = (product.newPrice * product.quantity).toFixed(2);
                  const maxStock = product?.color?.stock ?? undefined;

                  return (
                    <li
                      key={`${product._id}-${product.color?.colorName?.en ?? "default"}`}
                      className="flex flex-col sm:flex-row items-center sm:items-start bg-gray-50 p-4 rounded-xl shadow-sm border border-[#A67C52]/50 gap-4"
                    >
                      {/* Image */}
                      <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg border-2 border-[#A67C52]/80 shadow-sm">
                        <img
                          src={getImgUrl(product.color?.image || product.coverImage)}
                          alt={product.title}
                          className="h-full w-full object-cover"
                        />
                      </div>

                      {/* Details */}
                      <div className="flex-1 w-full">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            <Link
                              to={`/products/${product._id}`}
                              className="hover:text-[#8B5C3E] transition-colors"
                            >
                              {product.title}
                            </Link>
                          </h3>
                          <p className="text-xl font-bold text-[#8B5C3E]">${linePrice}</p>
                        </div>

                        <div className="mt-1 text-sm text-gray-600">
                          <p>
                            {t("cart.category")}:{" "}
                            <span className="capitalize">{product.category}</span>
                          </p>
                          <p className="capitalize">
                            {t("cart.color")}:{" "}
                            {product.color?.colorName?.[i18n.language] || t("cart.original")}
                          </p>
                          {typeof maxStock === "number" && (
                            <p className="text-xs text-gray-500">
                              {t("stock")}: {maxStock}
                            </p>
                          )}
                        </div>

                        {/* Quantity + Remove */}
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mt-3 gap-4">
                          {/* Quantity stepper */}
                          <div>
                            <span className="mr-3 text-gray-700">{t("cart.qty")}:</span>
                            <div className="inline-flex items-stretch rounded-xl border border-[#A67C52] overflow-hidden shadow-sm">
                              <button
                                onClick={() => dec(product)}
                                className="px-3 py-2 bg-[#F7F1EA] hover:bg-[#F0E6DA] active:scale-[.98] transition-colors text-[#8B5C3E] focus:outline-none"
                                aria-label="decrease quantity"
                              >
                                <FiMinus />
                              </button>
                              <input
                                type="number"
                                min={1}
                                max={maxStock}
                                value={product.quantity}
                                onChange={(e) => setQuantity(product, Number(e.target.value))}
                                className="w-16 text-center outline-none px-2 py-2 bg-white"
                              />
                              <button
                                onClick={() => inc(product)}
                                className="px-3 py-2 bg-[#8B5C3E] text-white hover:bg-[#74452D] active:scale-[.98] transition-colors focus:outline-none"
                                aria-label="increase quantity"
                              >
                                <FiPlus />
                              </button>
                            </div>
                          </div>

                          {/* Remove Button — new style */}
                          <button
                            onClick={() => handleRemoveFromCart(product)}
                            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl
                                       bg-gradient-to-r from-red-600 to-rose-600 text-white
                                       hover:from-red-700 hover:to-rose-700
                                       active:scale-[.98] transition-all duration-150
                                       shadow focus:outline-none focus:ring-2 focus:ring-rose-300 w-full sm:w-auto"
                          >
                            <FiTrash2 />
                            {t("cart.remove")}
                          </button>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="text-center text-gray-500 text-lg mt-4">{t("cart.empty")}</p>
            )}
          </div>

          {/* Cart Summary */}
          {cartItems.length > 0 && (
            <div className="border-t border-[#A67C52] pt-6 mt-6">
              <div className="flex flex-col sm:flex-row justify-between text-lg font-semibold gap-2">
                <p>{t("cart.subtotal")}</p>
                <p className="text-[#8B5C3E]">${totalPrice}</p>
              </div>

              <Link
                to="/checkout"
                className="mt-6 block text-center text-white font-bold py-3 px-6 rounded-xl
                           bg-gradient-to-r from-[#8B5C3E] to-[#A67C52]
                           hover:from-[#74452D] hover:to-[#8B5C3E]
                           active:scale-[.99]
                           shadow-md transition-all duration-200 w-full focus:outline-none focus:ring-2 focus:ring-[#C8B095]"
              >
                {t("cart.proceed_to_checkout")}
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartPage;
