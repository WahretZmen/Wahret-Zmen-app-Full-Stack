// src/pages/products/CartPage.jsx
// ============================================================================
// CartPage (Arabic / RTL)
// - Shows cart items with quantity controls and totals
// - ✅ Category is forced to Arabic (maps FR/EN keys -> AR)
// ============================================================================

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";

// Layout
import Header from "../../components/ui/Header.jsx";
import Footer from "../../components/ui/Footer.jsx";
import { Card, CardContent } from "../../components/ui/card.jsx";

// Utils
import getImgUrl from "../../utils/getImgUrl.js";

// Redux actions
import {
  clearCart,
  removeFromCart,
  updateQuantity,
} from "../../redux/features/cart/cartSlice.js";

// Styles
import "../../Styles/StylesCartPage.css";

/* =============================================================================
   Helpers
============================================================================= */

const isArabicText = (s) =>
  typeof s === "string" && /[\u0600-\u06FF]/.test(s);

const normalizeKey = (s) => {
  if (!s) return "";
  return String(s)
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove accents
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");
};

// Put here every category you use in DB/UI (FR/EN/keys -> AR)
const CATEGORY_AR_MAP = {
  hommes: "رجال",
  homme: "رجال",
  men: "رجال",
  man: "رجال",
  male: "رجال",

  femmes: "نساء",
  femme: "نساء",
  women: "نساء",
  woman: "نساء",
  female: "نساء",

  enfants: "أطفال",
  enfant: "أطفال",
  kids: "أطفال",
  kid: "أطفال",
  children: "أطفال",
  child: "أطفال",

  couffin: "قفّة",
  panier: "قفّة",

  vetement: "ملابس",
  vetements: "ملابس",
  clothing: "ملابس",
  clothes: "ملابس",

  accessoires: "إكسسوارات",
  accessoire: "إكسسوارات",
  accessories: "إكسسوارات",
  accessory: "إكسسوارات",
};

/* =============================================================================
   Component
============================================================================= */

const CartPage = () => {
  // Scroll to top on entry
  useEffect(() => {
    if (typeof window !== "undefined" && typeof window.scrollTo === "function") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, []);

  const lang = "ar";
  const isRTL = true;

  const dispatch = useDispatch();
  const cartItems = useSelector((s) => s.cart.cartItems || []);

  // Title (Arabic first)
  const titleFor = (p) =>
    p?.translations?.ar?.title || p?.titleAr || p?.title || "بدون عنوان";

  // Category (force Arabic output)
  const categoryFor = (p) => {
    const raw =
      p?.translations?.ar?.category ||
      p?.categoryAr ||
      p?.category ||
      p?.product?.category ||
      p?.productId?.category;

    if (!raw) return "غير مصنّف";

    // If DB stores category as object {ar/fr/en}
    if (typeof raw === "object" && raw !== null) {
      const v =
        raw.ar ||
        raw["ar-SA"] ||
        raw["ar_TN"] ||
        raw.fr ||
        raw.en ||
        Object.values(raw).find(
          (x) => typeof x === "string" && x.trim().length > 0
        );
      if (!v) return "غير مصنّف";
      if (isArabicText(v)) return v.trim();
      const k = normalizeKey(v);
      return CATEGORY_AR_MAP[k] || v;
    }

    // If DB stores category as array (rare)
    if (Array.isArray(raw)) {
      const first = raw.find((x) => typeof x === "string" && x.trim().length);
      if (!first) return "غير مصنّف";
      if (isArabicText(first)) return first.trim();
      const k = normalizeKey(first);
      return CATEGORY_AR_MAP[k] || first;
    }

    // If DB stores category as string
    const str = String(raw).trim();
    if (!str) return "غير مصنّف";
    if (isArabicText(str)) return str;

    const key = normalizeKey(str);
    return CATEGORY_AR_MAP[key] || str;
  };

  // Embroidery type (string or {en, fr, ar})
  const embroideryFor = (item) => {
    const raw =
      item?.embroideryCategory ||
      item?.embroidery ||
      item?.product?.embroideryCategory ||
      item?.productId?.embroideryCategory;

    if (!raw) return null;

    if (typeof raw === "string") return raw;

    if (typeof raw === "object") {
      const v =
        raw.ar ||
        raw["ar-SA"] ||
        raw.fr ||
        raw.en ||
        Object.values(raw).find(
          (x) => typeof x === "string" && x.trim().length > 0
        );
      return v || null;
    }

    return null;
  };

  // Quantity (1..stock)
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

  // Totals
  const subtotal = cartItems.reduce(
    (acc, item) =>
      acc + Number(item?.newPrice || 0) * Number(item?.quantity || 0),
    0
  );
  const shipping = subtotal > 500 ? 0 : cartItems.length ? 25 : 0;
  const total = subtotal + shipping;

  return (
    <div className="cart-page min-h-screen bg-background" dir={isRTL ? "rtl" : "ltr"}>
      <Header />

      <main className="py-10 md:py-16">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="mb-8 text-center md:text-left animate-fade-in-up">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              سلة المشتريات
            </h1>
            <p className="text-muted-foreground">
              راجع المنتجات التي اخترتها قبل إتمام الطلب
            </p>
          </div>

          {cartItems.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Items */}
              <div className="lg:col-span-2 space-y-4">
                {cartItems.map((product, index) => {
                  const imgSrc = getImgUrl(
                    product?.color?.images?.[0] ||
                      product?.color?.image ||
                      product?.coverImage
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

                  const colorLabel =
                    product?.color?.name?.[lang] ||
                    product?.color?.colorName?.[lang] ||
                    (typeof product?.color?.name === "string"
                      ? product.color.name
                      : typeof product?.color?.colorName === "string"
                      ? product.color.colorName
                      : null) ||
                    product?.color?.name?.en ||
                    product?.color?.colorName?.en ||
                    "أصلي";

                  const embroideryLabel =
                    embroideryFor(product) || "بدون تطريز خاص";

                  return (
                    <Card
                      key={`${product._id}-${product?.color?._id || index}`}
                      className={`cart-card animate-fade-in-delay-${(index + 1) * 100}`}
                    >
                      <CardContent className="p-4 sm:p-6">
                        <div className="cart-row flex flex-col md:flex-row items-center md:items-stretch gap-4 md:gap-6">
                          <div className="cart-img-box">
                            <img
                              src={imgSrc}
                              alt={titleFor(product)}
                              className="cart-img"
                              onError={(e) => {
                                e.currentTarget.src = "/default-image.jpg";
                              }}
                            />
                          </div>

                          <div className="flex-1 w-full">
                            <div className="flex flex-wrap justify-between items-start gap-3 mb-2">
                              <h3 className="text-lg sm:text-xl font-semibold text-foreground text-center md:text-start w-full md:w-auto">
                                <Link to={`/products/${product._id}`} className="hover:underline">
                                  {titleFor(product)}
                                </Link>
                              </h3>

                              <button
                                className="remove-btn inline-flex h-9 w-9 items-center justify-center rounded-md border border-neutral-300 bg-white text-red-600 shadow-sm hover:bg-neutral-50 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-500/30 transition"
                                aria-label="حذف المنتج"
                                onClick={() => handleRemove(product)}
                                title="حذف المنتج"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>

                            <div className="text-sm text-muted-foreground mb-4 space-y-1 text-center md:text-start">
                              <p>
                                الفئة:{" "}
                                <span className="text-foreground">
                                  {categoryFor(product)}
                                </span>
                              </p>

                              <p className="capitalize">
                                نوع التطريز:{" "}
                                <span className="text-foreground">
                                  {embroideryLabel}
                                </span>
                              </p>

                              <p className="capitalize">اللون: {colorLabel}</p>

                              {typeof maxStock === "number" && (
                                <p className="text-xs">المخزون: {maxStock}</p>
                              )}
                            </div>

                            <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-4">
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

                              <div className="qty-group flex items-center gap-3" role="group" aria-label="الكمية">
                                <button
                                  className="qty-btn inline-flex h-9 w-9 sm:h-8 sm:w-8 items-center justify-center rounded-md border border-neutral-300 bg-white text-neutral-700 shadow-sm hover:bg-neutral-50 active:scale-95 focus:outline-none transition disabled:opacity-40"
                                  aria-label="إنقاص الكمية"
                                  disabled={product.quantity <= 1}
                                  onClick={() => product.quantity > 1 && dec(product)}
                                >
                                  <Minus className="h-4 w-4" />
                                </button>

                                <span className="qty-val font-medium text-base min-w-6 text-center select-none">
                                  {product.quantity}
                                </span>

                                <button
                                  className="qty-btn inline-flex h-9 w-9 sm:h-8 sm:w-8 items-center justify-center rounded-md border border-neutral-300 bg-white text-neutral-700 shadow-sm hover:bg-neutral-50 active:scale-95 focus:outline-none transition disabled:opacity-40"
                                  aria-label="زيادة الكمية"
                                  disabled={typeof maxStock === "number" && product.quantity >= maxStock}
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

                            <div className="mt-3 text-center md:text-right text-sm text-muted-foreground">
                              المجموع الفرعي:{" "}
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

                <div className="animate-fade-in-up">
                  <button
                    className="w-full h-12 px-4 inline-flex items-center justify-center rounded-md bg-red-600 text-white font-semibold tracking-wide shadow-sm hover:bg-red-700 active:scale-[.99] transition"
                    onClick={handleClearCart}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    تفريغ العربة
                  </button>
                </div>
              </div>

              {/* Summary */}
              <div className="animate-fade-in-delay-300">
                <Card className="order-summary lg:sticky lg:top-24">
                  <CardContent className="p-6">
                    <h3 className="text-2xl font-semibold text-foreground mb-6 text-center md:text-left">
                      ملخص الطلب
                    </h3>

                    <div className="space-y-4 mb-6">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">المجموع الفرعي</span>
                        <span className="font-medium">${subtotal.toFixed(2)}</span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-muted-foreground">الشحن</span>
                        <span className="font-medium">
                          {shipping === 0 ? "مجاني" : `$${shipping.toFixed(2)}`}
                        </span>
                      </div>

                      <hr className="border-border" />

                      <div className="flex justify-between text-lg">
                        <span className="font-semibold">الإجمالي</span>
                        <span className="font-bold text-foreground">
                          ${total.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    <div className="cart-buttons">
                      <Link to="/checkout">
                        <button className="btn-brown-gradient">المتابعة للدفع</button>
                      </Link>

                      <Link to="/products">
                        <button className="btn-outline">مواصلة التسوق</button>
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
                سلة المشتريات فارغة
              </h2>
              <p className="text-muted-foreground mb-8">
                اكتشف مجموعتنا الجميلة من الجُبَب التقليدية
              </p>
              <Link to="/products">
                <button className="cart-btn w-48 mx-auto block bg-orange-600 hover:bg-orange-700 rounded-lg">
                  ابدأ التسوق
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
