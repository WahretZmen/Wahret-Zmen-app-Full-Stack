// src/pages/products/CartPage.jsx
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";

import Header from "../../components/ui/Header.jsx";
import Footer from "../../components/ui/Footer.jsx";
import { Card, CardContent } from "../../components/ui/card.jsx";

import getImgUrl from "../../utils/getImgUrl.js";

import {
  clearCart,
  removeFromCart,
  updateQuantity,
} from "../../redux/features/cart/cartSlice.js";

import "../../Styles/StylesCartPage.css";

const CartPage = () => {
  const { t, i18n } = useTranslation();
  if (!i18n.isInitialized) return null;

  const lang = i18n.language;
  const dispatch = useDispatch();
  const cartItems = useSelector((s) => s.cart.cartItems || []);

  const titleFor = (p) =>
    p?.translations?.[lang]?.title || p?.title || t("ordersPage.noTitle");

  const categoryFor = (p) => {
    const key = (p?.category || "").toLowerCase();
    return t(`categories.${key}`, p?.category || "");
  };

  const setQuantity = (product, quantity) => {
    const max =
      typeof product?.color?.stock === "number" ? product.color.stock : 999;
    const next = Math.min(Math.max(1, Number(quantity) || 1), max);
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

  const handleRemove = (product) => dispatch(removeFromCart(product));
  const handleClearCart = () => cartItems.length && dispatch(clearCart());

  // ---- Pricing (NO TAX) ----
  const subtotal = cartItems.reduce(
    (acc, item) =>
      acc + Number(item?.newPrice || 0) * Number(item?.quantity || 0),
    0
  );
  const shipping = subtotal > 500 ? 0 : cartItems.length ? 25 : 0;
  const total = subtotal + shipping;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="py-16">
        <div className="container mx-auto px-4">
          {/* Title */}
          <div className="mb-8 animate-fade-in-up">
            <h1 className="text-4xl font-bold text-foreground mb-2">
              {t("cart.title", "Shopping Cart")}
            </h1>
            <p className="text-muted-foreground">
              {t("cart.review", "Review your selected items")}
            </p>
          </div>

          {cartItems.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {cartItems.map((product, index) => {
                  const imgSrc = getImgUrl(
                    product?.color?.image || product?.coverImage
                  );
                  const linePrice =
                    Number(product?.newPrice || 0) *
                    Number(product?.quantity || 0);
                  const hasOriginal =
                    product?.price &&
                    Number(product.price) > Number(product.newPrice || 0);

                  const maxStock =
                    typeof product?.color?.stock === "number"
                      ? product.color.stock
                      : undefined;

                  return (
                    <Card
                      key={`${product._id}-${product?.color?.image || index}`}
                      className={`animate-fade-in-delay-${(index + 1) * 100}`}
                    >
                      <CardContent className="p-6">
  <div className="flex flex-col md:flex-row gap-4">
    {/* Image (full view, no crop) */}
   <div className="cart-img-box">
  <img src={imgSrc} alt={titleFor(product)} className="cart-img"
       onError={(e) => { e.currentTarget.src = "/default-image.jpg"; }} />
</div>



                          {/* Details */}
                          <div className="flex-1">
                            <div className="flex justify-between items-start mb-2">
                              <h3 className="text-xl font-semibold text-foreground">
                                <Link
                                  to={`/products/${product._id}`}
                                  className="hover:underline"
                                >
                                  {titleFor(product)}
                                </Link>
                              </h3>

                              {/* Remove */}
                              <button
                                className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-neutral-300 bg-white text-red-600 shadow-sm hover:bg-neutral-50 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-500/30 transition"
                                aria-label={t("cart.remove", "Remove")}
                                onClick={() => handleRemove(product)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>

                            <div className="text-sm text-muted-foreground mb-3 space-y-1">
                              <p>
                                {t("cart.category", "Category")}:{" "}
                                <span className="text-foreground">
                                  {categoryFor(product)}
                                </span>
                              </p>
                              <p className="capitalize">
                                {t("cart.color", "Color")}:{" "}
                                {product?.color?.colorName?.[lang] ||
                                  product?.color?.colorName ||
                                  t("cart.original", "Original")}
                              </p>
                              {typeof maxStock === "number" && (
                                <p className="text-xs">
                                  {t("stock", "Stock")}: {maxStock}
                                </p>
                              )}
                            </div>

                            <div className="flex items-center justify-between">
                              {/* Price */}
                              <div className="flex items-center gap-2">
                                <span className="text-2xl font-bold text-foreground">
                                  ${Number(product?.newPrice || 0).toFixed(2)}
                                </span>
                                {hasOriginal && (
                                  <span className="text-lg text-muted-foreground line-through">
                                    ${Number(product.price).toFixed(2)}
                                  </span>
                                )}
                              </div>

                              {/* Qty controls — rounded like cart.tsx */}
                              <div className="flex items-center gap-3">
                                <button
                                  className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-neutral-300 bg-white text-neutral-700 shadow-sm hover:bg-neutral-50 active:scale-95 focus:outline-none transition disabled:opacity-40"
                                  aria-label={t(
                                    "cart.decrease_qty",
                                    "Decrease quantity"
                                  )}
                                  disabled={product.quantity <= 1}
                                  onClick={() =>
                                    product.quantity > 1 && dec(product)
                                  }
                                >
                                  <Minus className="h-4 w-4" />
                                </button>

                                <span className="font-medium text-base min-w-6 text-center select-none">
                                  {product.quantity}
                                </span>

                                <button
                                  className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-neutral-300 bg-white text-neutral-700 shadow-sm hover:bg-neutral-50 active:scale-95 focus:outline-none transition disabled:opacity-40"
                                  aria-label={t(
                                    "cart.increase_qty",
                                    "Increase quantity"
                                  )}
                                  disabled={
                                    typeof maxStock === "number" &&
                                    product.quantity >= maxStock
                                  }
                                  onClick={() =>
                                    !(
                                      typeof maxStock === "number" &&
                                      product.quantity >= maxStock
                                    ) && inc(product)
                                  }
                                >
                                  <Plus className="h-4 w-4" />
                                </button>
                              </div>
                            </div>

                            {/* Line total */}
                            <div className="mt-2 text-right text-sm text-muted-foreground">
                              {t("cart.subtotal", "Subtotal")}:{" "}
                              <span className="text-foreground font-semibold">
                                ${linePrice.toFixed(2)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}

                {/* Clear cart */}
                <div className="animate-fade-in-up">
                  <button
                    className="w-full h-12 px-4 inline-flex items-center justify-center rounded-md bg-red-600 text-white font-semibold tracking-wide shadow-sm hover:bg-red-700 active:scale-[.99] transition"
                    onClick={handleClearCart}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    {t("cart.clear_cart", "Clear Cart")}
                  </button>
                </div>
              </div>

              {/* Order Summary */}
              <div className="animate-fade-in-delay-300">
                <Card className="sticky top-24">
                  <CardContent className="p-6">
                    <h3 className="text-2xl font-semibold text-foreground mb-6">
                      {t("cart.summary", "Order Summary")}
                    </h3>

                    <div className="space-y-4 mb-6">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          {t("cart.subtotal", "Subtotal")}
                        </span>
                        <span className="font-medium">
                          ${subtotal.toFixed(2)}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          {t("cart.shipping", "Shipping")}
                        </span>
                        <span className="font-medium">
                          {shipping === 0
                            ? t("free", "Free")
                            : `$${shipping.toFixed(2)}`}
                        </span>
                      </div>

                      <hr className="border-border" />

                      <div className="flex justify-between text-lg">
                        <span className="font-semibold">
                          {t("total", "Total")}
                        </span>
                        <span className="font-bold text-foreground">
                          ${total.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {/* Checkout + Continue shopping (keeps your CSS classes) */}
                    <div className="cart-buttons">
                      <Link to="/checkout">
                        <button className="btn-brown-gradient">
                          {t(
                            "cart.proceed_to_checkout",
                            "Proceed to Checkout"
                          )}
                        </button>
                      </Link>

                      <Link to="/products">
                        <button className="btn-outline">
                          {t("continue_shopping", "Continue Shopping")}
                        </button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          ) : (
            <div className="text-center py-16 animate-fade-in">
              <ShoppingBag className="h-24 w-24 text-muted-foreground mx-auto mb-6" />
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                {t("cart.empty", "Your cart is empty!")}
              </h2>
              <p className="text-muted-foreground mb-8">
                {t(
                  "cart.empty_hint",
                  "Discover our beautiful collection of traditional jebbas"
                )}
              </p>
              <Link to="/products">
                <button className="cart-btn w-48 mx-auto block bg-orange-600 hover:bg-orange-700 rounded-lg">
                  {t("start_shopping", "Start Shopping")}
                </button>
              </Link>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CartPage;
