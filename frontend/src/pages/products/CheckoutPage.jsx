// src/pages/checkout/CheckoutPage.jsx

import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useAuth } from "../../context/AuthContext";
import { useCreateOrderMutation } from "../../redux/features/orders/ordersApi";
import { clearCart } from "../../redux/features/cart/cartSlice";
import { Truck, Lock, X } from "lucide-react";
import "../../Styles/StylesCheckoutPage.css";

/* --------------------------------------------------------------------------- */
/* 🧵 Embroidery helpers                                                       */
/* --------------------------------------------------------------------------- */

// Detect if a cart item has embroidery (flexible: supports many field names)
const hasEmbroideryFlag = (item) => {
  if (!item) return false;

  const flag =
    item.embroidery ||
    item.hasEmbroidery ||
    item.withEmbroidery ||
    item.embroiderySelected ||
    item.embroideryOption ||
    item.options?.embroidery;

  return Boolean(flag);
};

// Optional: try to extract a custom embroidery text/name
const getEmbroideryText = (item) => {
  if (!item) return null;

  const raw =
    item.embroideryText ||
    item.embroideryLabel ||
    item?.embroidery?.text ||
    item?.embroidery?.label ||
    item.options?.embroideryText;

  if (!raw) return null;
  return String(raw);
};

/* --------------------------------------------------------------------------- */
/* Minimal, accessible modal used for Terms & Privacy (with fade in/out)       */
/* --------------------------------------------------------------------------- */
const TermsModal = ({ open, onClose, title, children, isRTL = false }) => {
  const dialogRef = useRef(null);

  // Smooth fade-out mount control (matches CSS ~250–320ms)
  const [visible, setVisible] = useState(open);
  useEffect(() => {
    if (open) setVisible(true);
    else {
      const t = setTimeout(() => setVisible(false), 250);
      return () => clearTimeout(t);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  useEffect(() => {
    if (open && dialogRef.current) dialogRef.current.focus();
  }, [open]);

  if (!visible) return null;

  return (
    <div
      className="wz-modal-backdrop"
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div
        ref={dialogRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="wz-modal-title"
        className={`wz-modal ${open ? "" : "wz-modal--closing"}`}
      >
        <div className="wz-modal-header">
          <h3 id="wz-modal-title" className="wz-modal-title">
            {title}
          </h3>
          <button
            type="button"
            className="wz-modal-close"
            aria-label="إغلاق"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="wz-modal-body">{children}</div>
        <div className="wz-modal-footer">
          <button type="button" className="wz-btn" onClick={onClose}>
            حسناً
          </button>
        </div>
      </div>
    </div>
  );
};

const CheckoutPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isRTL = true;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const cartItems = useSelector((s) => s.cart.cartItems || []);
  const totalItems = cartItems.reduce(
    (acc, item) => acc + Number(item.quantity || 0),
    0
  );
  const totalPrice = cartItems
    .reduce(
      (acc, item) =>
        acc + Number(item.newPrice || 0) * Number(item.quantity || 0),
      0
    )
    .toFixed(2);

  // 🧵 any embroidered items in this order?
  const anyEmbroidered = cartItems.some(hasEmbroideryFlag);

  const { currentUser } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [createOrder, { isLoading }] = useCreateOrderMutation();
  const [isChecked, setIsChecked] = useState(false);

  // which modal is open: "terms" | "privacy" | null
  const [openWhich, setOpenWhich] = useState(null);

  const onSubmit = async (data) => {
    if (!currentUser?.email) {
      Swal.fire({
        icon: "error",
        title: "خطأ",
        text: "يرجى تسجيل الدخول أولاً.",
        confirmButtonColor: "#d33",
      });
      return;
    }
    if (!cartItems || cartItems.length === 0) {
      Swal.fire({
        icon: "error",
        title: "خطأ",
        text: "سلة المشتريات فارغة.",
        confirmButtonColor: "#d33",
      });
      return;
    }

    const street = (data.address || "").trim();
    const city = (data.city || "").trim();
    const country = (data.country || "تونس").trim();
    const state = (data.state || "—").trim();
    const zipcode = ((data.zipcode ?? "0000") + "").trim();

    if (!street || !city) {
      Swal.fire({
        icon: "error",
        title: "خطأ",
        text: "تعذر إتمام الطلب، يرجى التحقق من بيانات العنوان والمحاولة مرة أخرى.",
        confirmButtonColor: "#d33",
      });
      return;
    }

    const products = cartItems.map((item) => {
      const rawCn = item?.color?.colorName;
      const hasObj = rawCn && typeof rawCn === "object";
      const colorName = hasObj
        ? rawCn
        : {
            en: (rawCn && String(rawCn)) || "Original",
            fr: (rawCn && String(rawCn)) || "Original",
            ar: "أصلي",
          };

      const image =
        item?.color?.image || item?.coverImage || "/assets/default-image.png";

      // 🧵 embroidery flags per product (optional)
      const embroidered = hasEmbroideryFlag(item);
      const embroideryText = getEmbroideryText(item);

      const base = {
        productId: item._id,
        quantity: Number(item.quantity || 0),
        color: {
          colorName,
          image,
          ...(item?.color?._id ? { _id: item.color._id } : {}),
        },
      };

      // Add embroidery info only if present (safe even if backend ignores it)
      if (embroidered) {
        base.embroidery = true;
      }
      if (embroideryText) {
        base.embroideryText = embroideryText;
      }

      return base;
    });

    const newOrder = {
      name: data.name,
      email: currentUser.email,
      phone: data.phone,
      address: { street, city, country, state, zipcode },
      products,
      totalPrice: Number(totalPrice),
      paymentMethod: "Cash on Delivery",
    };

    try {
      await createOrder(newOrder).unwrap();
      dispatch(clearCart());

      await Swal.fire({
        title: "تم تأكيد طلبك",
        html: `
          <p>شكرًا لثقتك بنا! تم استلام طلبك بنجاح.</p>
          <hr style="margin:10px 0" />
          <p style="font-size:14px;color:#555;">
            🚚 سنتواصل معك قريبًا لتأكيد موعد ومكان التوصيل.
          </p>
        `,
        icon: "success",
        confirmButtonColor: "#A67C52",
        confirmButtonText: "الذهاب إلى طلباتي",
      });

      navigate("/orders", { replace: true });
    } catch (error) {
      Swal.fire({
        title: "خطأ",
        text:
          error?.data?.message ||
          error?.message ||
          "تعذر إتمام الطلب، يرجى المحاولة مرة أخرى.",
        icon: "error",
        confirmButtonColor: "#d33",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="text-center text-lg font-semibold py-10 text-[#A67C52]">
        جاري معالجة الطلب...
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-[#F8F4EF]" dir={isRTL ? "rtl" : "ltr"}>
      <div className="container mx-auto max-w-6xl px-4 py-16">
        {/* Page heading */}
        <div className="mb-2">
          <h1 className="text-4xl font-bold text-[#2b2b2b] mb-2">
            إتمام الطلب
          </h1>
          <p className="text-[color:var(--muted-foreground,#6b7280)]">
            أكمل بياناتك لإتمام الطلب بأمان مع بوتيك وهرة زمان.
          </p>
        </div>

        {/* Boutique location badge */}
        <p className="mb-8 inline-block rounded-full bg-[#F0E7DA] px-4 py-1 text-sm text-[#7a5a38]">
          بوتيك وهرة زمان – المدينة العتيقة بتونس، سوق الصوف
        </p>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* LEFT: Shipping Information (form) */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Shipping card */}
            <div className="rounded-2xl border border-[#E5D9C9] bg-white shadow-sm animate-fade-in">
              <div className="p-6 border-b border-[#F0E7DA]">
                <h2 className="flex items-center gap-2 text-xl font-semibold text-[#2b2b2b]">
                  <Truck className="h-5 w-5 text-[#A67C52]" />
                  عنوان الشحن
                </h2>
              </div>

              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* FULL NAME */}
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      الاسم الكامل
                    </label>
                    <input
                      {...register("name", { required: true })}
                      type="text"
                      placeholder="أحمد بن علي"
                      className={`w-full px-4 py-3 text-base rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#E6D3BF] ${
                        errors.name ? "border-red-400" : "border-[#E6D3BF]"
                      }`}
                    />
                  </div>

                  {/* EMAIL – fully viewable */}
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      البريد الإلكتروني
                    </label>
                    <input
                      value={currentUser?.email || ""}
                      readOnly
                      aria-readonly="true"
                      inputMode="email"
                      type="email"
                      dir="ltr"
                      onFocus={(e) => e.target.select()}
                      className="w-full px-4 py-3 text-base rounded-lg border border-[#E6D3BF] bg-gray-100 email-plain overflow-x-auto whitespace-nowrap"
                      title={currentUser?.email || ""}
                    />
                    {/* Mobile-only helper: show full email wrapped */}
                    <div
                      className="md:hidden mt-1 text-xs text-gray-600 email-full-line"
                      dir="ltr"
                    >
                      {currentUser?.email || ""}
                    </div>
                  </div>
                </div>

                {/* PHONE */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    رقم الهاتف
                  </label>
                  <input
                    {...register("phone", { required: true })}
                    type="tel"
                    placeholder="+216 XX XXX XXX"
                    className={`w-full px-4 py-3 text-base rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#E6D3BF] ${
                      errors.phone ? "border-red-400" : "border-[#E6D3BF]"
                    }`}
                  />
                </div>

                {/* ADDRESS */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    عنوان الشارع
                  </label>
                  <input
                    {...register("address", { required: true })}
                    type="text"
                    placeholder="الشارع، رقم المنزل أو العمارة"
                    className={`w-full px-4 py-3 text-base rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#E6D3BF] ${
                      errors.address ? "border-red-400" : "border-[#E6D3BF]"
                    }`}
                  />
                </div>

                {/* CITY / STATE / ZIP */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      المدينة
                    </label>
                    <input
                      {...register("city", { required: true })}
                      type="text"
                      placeholder="المدينة"
                      className={`w-full px-4 py-3 text-base rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#E6D3BF] ${
                        errors.city ? "border-red-400" : "border-[#E6D3BF]"
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      المنطقة / الولاية
                    </label>
                    <input
                      {...register("state")}
                      type="text"
                      placeholder="المنطقة أو الولاية"
                      className="w-full px-4 py-3 text-base rounded-lg border border-[#E6D3BF] focus:outline-none focus:ring-2 focus:ring-[#E6D3BF]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      الرمز البريدي
                    </label>
                    <input
                      {...register("zipcode")}
                      type="text"
                      placeholder="0000"
                      className="w-full px-4 py-3 text-base rounded-lg border border-[#E6D3BF] focus:outline-none focus:ring-2 focus:ring-[#E6D3BF]"
                    />
                  </div>
                </div>

                {/* COUNTRY */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    البلد
                  </label>
                  <input
                    {...register("country")}
                    type="text"
                    placeholder="تونس"
                    className="w-full px-4 py-3 text-base rounded-lg border border-[#E6D3BF] focus:outline-none focus:ring-2 focus:ring-[#E6D3BF]"
                  />
                </div>
              </div>
            </div>

            {/* Terms + Submit */}
            <div className="rounded-2xl border border-[#E5D9C9] bg-white shadow-sm p-6">
              {/* 1) Centered sentence with the two links */}
              <div className="wz-consent-wrapper">
                <p className="wz-consent-line">
                  <span className="wz-consent-chunk">
                    عند إتمام الطلب فأنت توافق على
                  </span>

                  <button
                    type="button"
                    className="wz-inline-link"
                    onClick={() => setOpenWhich("terms")}
                  >
                    الشروط والأحكام
                  </button>

                  <span className="wz-consent-and">و</span>

                  <button
                    type="button"
                    className="wz-inline-link"
                    onClick={() => setOpenWhich("privacy")}
                  >
                    سياسة الخصوصية
                  </button>
                </p>
              </div>

              {/* 2) Checkbox centered, directly above the order button */}
              <div className="wz-checkbox-center">
                <input
                  id="agree"
                  type="checkbox"
                  onChange={(e) => setIsChecked(e.target.checked)}
                  className="h-5 w-5 rounded border-[#E6D3BF] text-[#A67C52] focus:ring-[#A67C52]"
                />
                <label htmlFor="agree" className="wz-checkbox-label">
                  أوافق
                </label>
              </div>

              {/* 3) Order button */}
              <button
                type="submit"
                disabled={!isChecked || isLoading}
                className={`mt-4 w-full rounded-xl px-6 py-3 font-semibold transition-all duration-200
                  ${
                    isChecked && !isLoading
                      ? "bg-[#A67C52] text-white hover:bg-[#8E683F] focus:ring-2 focus:ring-offset-2 focus:ring-[#E6D3BF]"
                      : "bg-gray-300 text-white cursor-not-allowed"
                  }`}
              >
                {isLoading ? "جاري معالجة الطلب..." : "تأكيد الطلب"}
              </button>

              <p className="mt-3 text-center text-sm text-gray-600">
                عدد المنتجات:{" "}
                <span className="font-medium">{totalItems}</span> · إجمالي
                المبلغ:{" "}
                <span className="font-semibold text-[#A67C52]">
                  ${totalPrice}
                </span>
              </p>

              {/* 🧵 Embroidery indicator */}
              {anyEmbroidered && (
                <p className="mt-1 text-center text-xs text-amber-700">
                  🧵 مع تطريز
                </p>
              )}
            </div>
          </form>

          {/* RIGHT: Payment (Cash on Delivery) + Delivery info */}
          <div className="space-y-6">
            <div className="rounded-2xl border border-[#E5D9C9] bg-white shadow-sm animate-fade-in delay-100">
              <div className="p-6 border-b border-[#F0E7DA]">
                <h2 className="flex items-center gap-2 text-xl font-semibold text-[#2b2b2b]">
                  <Lock className="h-5 w-5 text-[#A67C52]" />
                  طريقة الدفع
                </h2>
              </div>
              <div className="p-6 space-y-3 text-[15px] leading-relaxed text-[#444]">
                <p>
                  <strong>الدفع عند التسليم</strong>{" "}
                  — ستقوم بالدفع نقدًا عند استلام طلبك. لا يوجد أي دفع
                  إلكتروني.
                </p>
                <ul className="list-disc ps-5 space-y-1">
                  <li>يرجى تجهيز المبلغ قدر الإمكان بشكل دقيق.</li>
                  <li>سيقوم عامل التوصيل بالاتصال بك قبل الوصول.</li>
                  <li>يتم التعامل مع الطلبات وفقًا لشروط البوتيك المعتمدة.</li>
                </ul>
                <div className="rounded-lg bg-[#F8F4EF] border border-[#E6D3BF] p-4 text-sm">
                  <span className="font-medium">آمن ومشفّر:</span>{" "}
                  يتم نقل بياناتك الشخصية بشكل آمن.
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-[#E5D9C9] bg-white shadow-sm">
              <div className="p-6 flex items-start gap-3">
                <Truck className="h-6 w-6 mt-0.5 text-[#A67C52]" />
                <div className="text-[15px] text-[#444]">
                  <p className="font-semibold">معلومات التوصيل</p>
                  <p>سنتواصل معك قريبًا لتأكيد موعد ومكان التوصيل.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal mounts */}
        <TermsModal
          open={openWhich === "terms"}
          onClose={() => setOpenWhich(null)}
          title="الشروط والأحكام"
          isRTL={isRTL}
        >
          <article
            className="prose-wz"
            dir={isRTL ? "rtl" : "ltr"}
            lang={isRTL ? "ar" : "en"}
            role="document"
          >
            <p>
              باستخدام موقع وبوتيك <strong>«وهرة زمان»</strong> وخدمة الشراء عبر
              الإنترنت، فإنك توافق على الشروط التالية المنظمة لعملية الطلب
              والتوصيل داخل تونس. بوتيك «وهرة زمان» متواجد في{" "}
              <strong>المدينة العتيقة بتونس، سوق الصوف</strong>.
            </p>

            <ul className="wz-bullets">
              <li>
                المنتجات المعروضة أصلية ومن اختيار وتصميم بوتيك
                <strong> وهرة زمان</strong> الكائن بالمدينة العتيقة – تونس،
                سوق الصوف، وتُباع حصريًا عبر قنواتنا الرسمية.
              </li>

              <li>
                طريقة الدفع المعتمدة حاليًا هي
                <strong> الدفع نقدًا عند التسليم (الدفع عند الاستلام)</strong>،
                ولا نقبل أي وسيلة دفع إلكترونية في الوقت الراهن.
              </li>

              <li>
                بعد تأكيد الطلب عبر الاتصال الهاتفي من فريق
                <strong> وهرة زمان</strong>، يُعتبر الطلب معتمدًا ويتم الشروع
                في تجهيزه وتحديد موعد التوصيل.
              </li>

              <li>
                في حال تعذّر الاتصال بك على رقم الهاتف المدوّن أو عدم الرد
                المتكرر، يحتفظ البوتيك بحق تأجيل أو إلغاء الطلب.
              </li>

              <li>
                تكاليف التوصيل تُحدَّد حسب المنطقة داخل تونس وسيتم إعلامك
                بالتفاصيل الدقيقة عند تأكيد الطلب.
              </li>

              
            </ul>

            <p>
              نسعى في <strong>«وهرة زمان»</strong> إلى تقديم تجربة شراء راقية
              وآمنة، ونسعد دائمًا بخدمتك والإجابة عن أي استفسار عبر وسائل
              الاتصال المتاحة.
            </p>
          </article>
        </TermsModal>

        <TermsModal
          open={openWhich === "privacy"}
          onClose={() => setOpenWhich(null)}
          title="سياسة الخصوصية"
          isRTL={isRTL}
        >
          <article
            className="prose-wz"
            dir={isRTL ? "rtl" : "ltr"}
            lang={isRTL ? "ar" : "en"}
            role="document"
          >
            <p>
              في <strong>«وهرة زمان»</strong>، المتواجد في{" "}
              <strong>المدينة العتيقة بتونس، سوق الصوف</strong>، نحترم
              خصوصيتك ونلتزم بحماية بياناتك الشخصية واستخدامها فقط بالقدر
              اللازم لمعالجة طلباتك وتقديم خدمة راقية وآمنة.
            </p>

            <ul className="wz-bullets">
              <li>
                نقوم بجمع البيانات الأساسية التالية عند إتمام الطلب: الاسم
                الكامل، رقم الهاتف، عنوان التوصيل، والبريد الإلكتروني.
              </li>

              <li>
                تُستخدم هذه البيانات حصريًا من أجل: تأكيد الطلب، تجهيز
                المنتجات، تنظيم عملية التوصيل، والتواصل معك عند الحاجة بخصوص
                طلبك.
              </li>

              <li>
                لا نقوم <strong>ببيع</strong> أو <strong>مشاركة</strong>{" "}
                بياناتك مع أي طرف ثالث لأغراض تسويقية أو إعلانية.
              </li>

              <li>
                قد نستخدم بيانات الاتصال للتواصل معك حول حالة طلبك أو لتحسين
                تجربة الخدمة المقدمة من بوتيك «وهرة زمان».
              </li>

              <li>
                نعمل على حماية بياناتك قدر الإمكان من الوصول غير المصرح به أو
                الاستخدام غير القانوني وفق المعايير المتاحة.
              </li>
            </ul>

            <p>
              بإتمام الطلب على موقع <strong>«وهرة زمان»</strong>، فإنك توافق
              على سياسة الخصوصية هذه وعلى طريقة استخدام بياناتك كما هو موضح
              أعلاه.
            </p>
          </article>
        </TermsModal>
      </div>
    </section>
  );
};

export default CheckoutPage;
