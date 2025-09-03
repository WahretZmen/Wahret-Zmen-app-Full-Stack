// src/pages/checkout/CheckoutPage.jsx
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../context/AuthContext";
import { useCreateOrderMutation } from "../../redux/features/orders/ordersApi";
import { clearCart } from "../../redux/features/cart/cartSlice";
import { Truck, Lock } from "lucide-react";
import "../../Styles/StylesCheckoutPage.css";

const CheckoutPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  if (!i18n.isInitialized) return null;

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const cartItems = useSelector((s) => s.cart.cartItems || []);
  const totalItems = cartItems.reduce((acc, item) => acc + Number(item.quantity || 0), 0);
  const totalPrice = cartItems
    .reduce((acc, item) => acc + Number(item.newPrice || 0) * Number(item.quantity || 0), 0)
    .toFixed(2);

  const { currentUser } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [createOrder, { isLoading }] = useCreateOrderMutation();
  const [isChecked, setIsChecked] = useState(false);

  const onSubmit = async (data) => {
    if (!currentUser?.email) {
      Swal.fire({
        icon: "error",
        title: t("checkout.error_title"),
        text: t("login.no_account") || "Please log in first.",
        confirmButtonColor: "#d33",
      });
      return;
    }
    if (!cartItems || cartItems.length === 0) {
      Swal.fire({
        icon: "error",
        title: t("checkout.error_title"),
        text: t("cart.empty") || "Your cart is empty.",
        confirmButtonColor: "#d33",
      });
      return;
    }

    const street = (data.address || "").trim();
    const city = (data.city || "").trim();
    const country = (data.country || "Tunisia").trim();
    const state = (data.state || "—").trim();
    const zipcode = ((data.zipcode ?? "0000") + "").trim();

    if (!street || !city) {
      Swal.fire({
        icon: "error",
        title: t("checkout.error_title"),
        text: t("checkout.error_message") || "Failed to place an order",
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

      return {
        productId: item._id,
        quantity: Number(item.quantity || 0),
        color: {
          colorName,
          image,
          ...(item?.color?._id ? { _id: item.color._id } : {}),
        },
      };
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
        title: t("checkout.order_confirmed"),
        text: t("checkout.success_message"),
        icon: "success",
        confirmButtonColor: "#A67C52",
        confirmButtonText: t("checkout.go_to_orders"),
      });
      navigate("/orders", { replace: true });
    } catch (error) {
      Swal.fire({
        title: t("checkout.error_title"),
        text:
          error?.data?.message ||
          error?.message ||
          t("checkout.error_message"),
        icon: "error",
        confirmButtonColor: "#d33",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="text-center text-lg font-semibold py-10 text-[#A67C52]">
        {t("checkout.processing")}
      </div>
    );
  }

  const isRTL =
    i18n.language === "ar" ||
    i18n.language === "ar-SA" ||
    (typeof i18n.language === "string" && i18n.language.startsWith("ar"));

  return (
    <section className="min-h-screen bg-[#F8F4EF]" dir={isRTL ? "rtl" : "ltr"}>
      <div className="container mx-auto max-w-6xl px-4 py-16">
        {/* Page heading */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#2b2b2b] mb-2">
            {t("checkout.title")}
          </h1>
          <p className="text-[color:var(--muted-foreground,#6b7280)]">
            {t("checkout.subtitle") || "Complete your order securely"}
          </p>
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* LEFT: Shipping Information (form) */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Shipping card */}
            <div className="rounded-2xl border border-[#E5D9C9] bg-white shadow-sm animate-fade-in">
              <div className="p-6 border-b border-[#F0E7DA]">
                <h2 className="flex items-center gap-2 text-xl font-semibold text-[#2b2b2b]">
                  <Truck className="h-5 w-5 text-[#A67C52]" />
                  {t("checkout.shipping_address")}
                </h2>
              </div>

              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      {t("checkout.full_name")}
                    </label>
                    <input
                      {...register("name", { required: true })}
                      type="text"
                      placeholder="Ahmed Ben Ali"
                      className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#E6D3BF] ${
                        errors.name ? "border-red-400" : "border-[#E6D3BF]"
                      }`}
                    />
                  </div>

                  {/* EMAIL – forced LTR + readOnly for correct display on RTL/mobile */}
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      {t("checkout.email")}
                    </label>
                    <input
                      value={currentUser?.email || ""}
                      readOnly
                      aria-readonly="true"
                      inputMode="email"
                      dir="ltr"
                      onFocus={(e) => e.target.select()}
                      className="w-full px-4 py-2 rounded-lg border border-[#E6D3BF] bg-gray-100 email-plain"
                      title={currentUser?.email || ""}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    {t("checkout.phone")}
                  </label>
                  <input
                    {...register("phone", { required: true })}
                    type="tel"
                    placeholder="+216 XX XXX XXX"
                    className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#E6D3BF] ${
                      errors.phone ? "border-red-400" : "border-[#E6D3BF]"
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    {t("checkout.address")}
                  </label>
                  <input
                    {...register("address", { required: true })}
                    type="text"
                    placeholder={isRTL ? "شارع..." : "Street address"}
                    className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#E6D3BF] ${
                      errors.address ? "border-red-400" : "border-[#E6D3BF]"
                    }`}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      {t("checkout.city")}
                    </label>
                    <input
                      {...register("city", { required: true })}
                      type="text"
                      placeholder={isRTL ? "المدينة" : "City"}
                      className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#E6D3BF] ${
                        errors.city ? "border-red-400" : "border-[#E6D3BF]"
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      {t("checkout.state")}
                    </label>
                    <input
                      {...register("state")}
                      type="text"
                      placeholder={isRTL ? "المنطقة" : "State/Region"}
                      className="w-full px-4 py-2 rounded-lg border border-[#E6D3BF] focus:outline-none focus:ring-2 focus:ring-[#E6D3BF]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      {t("checkout.zipcode")}
                    </label>
                    <input
                      {...register("zipcode")}
                      type="text"
                      placeholder="0000"
                      className="w-full px-4 py-2 rounded-lg border border-[#E6D3BF] focus:outline-none focus:ring-2 focus:ring-[#E6D3BF]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    {t("checkout.country")}
                  </label>
                  <input
                    {...register("country")}
                    type="text"
                    placeholder={isRTL ? "تونس" : "Tunisia"}
                    className="w-full px-4 py-2 rounded-lg border border-[#E6D3BF] focus:outline-none focus:ring-2 focus:ring-[#E6D3BF]"
                  />
                </div>
              </div>
            </div>

            {/* Terms + Submit */}
            <div className="rounded-2xl border border-[#E5D9C9] bg-white shadow-sm p-6">
              <div
                className={`flex ${isRTL ? "flex-row-reverse" : "flex-row"} items-start gap-3`}
              >
                <input
                  id="agree"
                  type="checkbox"
                  onChange={(e) => setIsChecked(e.target.checked)}
                  className="mt-1 h-5 w-5 rounded border-[#E6D3BF] text-[#A67C52] focus:ring-[#A67C52]"
                />
                <label htmlFor="agree" className="text-sm text-[#2b2b2b]">
                  {t("checkout.agree")}{" "}
                  <Link to="#" className="text-[#A67C52] underline">
                    {t("checkout.terms")}
                  </Link>{" "}
                  {t("checkout.and")}{" "}
                  <Link to="#" className="text-[#A67C52] underline">
                    {t("checkout.policy")}
                  </Link>
                  .
                </label>
              </div>

              <button
                type="submit"
                disabled={!isChecked || isLoading}
                className={`mt-6 w-full rounded-xl px-6 py-3 font-semibold transition-all duration-200
                  ${
                    isChecked && !isLoading
                      ? "bg-[#A67C52] text-white hover:bg-[#8E683F] focus:ring-2 focus:ring-offset-2 focus:ring-[#E6D3BF]"
                      : "bg-gray-300 text-white cursor-not-allowed"
                  }`}
              >
                {isLoading ? t("checkout.processing") : t("checkout.place_order")}
              </button>

              <p className="mt-3 text-center text-sm text-gray-600">
                {t("checkout.items")}: <span className="font-medium">{totalItems}</span> ·{" "}
                {t("checkout.total_price")}{" "}
                <span className="font-semibold text-[#A67C52]">${totalPrice}</span>
              </p>
            </div>
          </form>

          {/* RIGHT: Payment (Cash on Delivery) */}
          <div className="space-y-6">
            <div className="rounded-2xl border border-[#E5D9C9] bg-white shadow-sm animate-fade-in delay-100">
              <div className="p-6 border-b border-[#F0E7DA]">
                <h2 className="flex items-center gap-2 text-xl font-semibold text-[#2b2b2b]">
                  <Lock className="h-5 w-5 text-[#A67C52]" />
                  {t("checkout.payment_method")}
                </h2>
              </div>
              <div className="p-6 space-y-3 text-[15px] leading-relaxed text-[#444]">
                <p>
                  <strong>{t("checkout.cod_title") || "Cash on Delivery"}</strong> —{" "}
                  {t("checkout.cod_desc") ||
                    "You will pay in cash when your order is delivered. No online payment is required."}
                </p>
                <ul className="list-disc ps-5 space-y-1">
                  <li>
                    {t("checkout.cod_point1") ||
                      "Please prepare the exact amount if possible."}
                  </li>
                  <li>
                    {t("checkout.cod_point2") ||
                      "Our delivery agent will contact you before arrival."}
                  </li>
                  <li>
                    {t("checkout.cod_point3") ||
                      "Returns and exchanges follow our standard policy."}
                  </li>
                </ul>
                <div className="rounded-lg bg-[#F8F4EF] border border-[#E6D3BF] p-4 text-sm">
                  <span className="font-medium">
                    {t("checkout.security_note") || "Secure & Encrypted:"}
                  </span>{" "}
                  {t("checkout.security_desc") ||
                    "Your personal information is transmitted securely."}
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-[#E5D9C9] bg-white shadow-sm">
              <div className="p-6 flex items-start gap-3">
                <Truck className="h-6 w-6 mt-0.5 text-[#A67C52]" />
                <div className="text-[15px] text-[#444]">
                  <p className="font-semibold">
                    {t("checkout.delivery_info_title") || "Delivery Information"}
                  </p>
                  <p>
                    {t("checkout.delivery_info_desc") ||
                      "Standard delivery in 24–72h depending on your city."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CheckoutPage;
