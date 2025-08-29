import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../../context/AuthContext";
import { useGetOrderByEmailQuery } from "../../../redux/features/orders/ordersApi";
import { getImgUrl } from "../../../utils/getImgUrl";
import LoadingSpinner from "../../../components/Loading";
import {
  FaKey,
  FaShoppingBag,
  FaCalendarAlt,
  FaDollarSign,
  FaUserCircle,
  FaGoogle,
  FaEnvelope,
} from "react-icons/fa";

const UserDashboard = () => {
  const { currentUser } = useAuth();
  const { t, i18n } = useTranslation();
  if (!i18n.isInitialized) return null;

  // Data
  const email = currentUser?.email || "";
  const mailName = email ? email.split("@")[0] : "";
  const initial = mailName ? mailName.charAt(0).toUpperCase() : "U";

  const displayName =
    currentUser?.displayName ||
    currentUser?.username ||
    t("userDashboard.defaultUser");
  const provider = currentUser?.providerData?.[0]?.providerId || "password";

  const {
    data: orders = [],
    isLoading,
    isFetching,
  } = useGetOrderByEmailQuery(email, { skip: !email });

  const lang = i18n.language;

  // Stats
  const { totalOrders, totalSpent } = useMemo(() => {
    const count = orders.length;
    const spent = orders.reduce((sum, o) => sum + (o?.totalPrice || 0), 0);
    return { totalOrders: count, totalSpent: spent.toFixed(2) };
  }, [orders]);

  // Helpers
  const initials = (name) =>
    name
      ?.split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((s) => s[0]?.toUpperCase())
      .join("") || "WZ";

  const providerBadge = () => {
    if (provider === "google.com")
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-red-50 text-red-700 border border-red-200 px-2.5 py-1 text-xs">
          <FaGoogle />
          Google
        </span>
      );
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-1 text-xs">
        <FaEnvelope />
        {t("changePassword.not_password_user_title", {
          defaultValue: "Email & Password",
        })}
      </span>
    );
  };

  if (isLoading || isFetching) return <LoadingSpinner />;

  return (
    <div className="bg-[#F8F1E9] min-h-screen px-2 sm:px-4 UserDashboard-screen pt-28 md:pt-32 pb-12">
      <Helmet>
        <title>{t("userDashboard.title")}</title>
      </Helmet>

      {/* Header / Profile */}
      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0 -z-10 opacity-[0.06] pointer-events-none">
          <div className="h-64 w-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#8B5C3E] to-transparent" />
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
          <div className="bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 border border-[#A67C52]/20 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.08)] p-6 md:p-8">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              {/* RIGHT: Avatar with first letter of user's email (link to change-password) */}
              <div className="w-14 h-14 flex justify-end">
                <Link
                  to="/change-password"
                  aria-label={t("changePassword.open_btn", { defaultValue: "Change Password" })}
                  title={t("changePassword.tooltip", { defaultValue: "Email & Password" })}
                  className="group relative inline-block"
                >
                  <div
                    className="w-14 h-14 rounded-full overflow-hidden shadow border border-[#A67C52]/20 flex items-center justify-center select-none"
                    style={{ background: "linear-gradient(135deg, #8B5C3E 0%, #74452D 100%)" }}
                  >
                    <span className="text-white font-bold text-xl leading-none">{initial}</span>
                  </div>

                  {/* tooltip (optional) */}
                  <span className="pointer-events-none absolute left-1/2 -translate-x-1/2 -bottom-2 translate-y-full
                                   bg-amber-50 text-amber-800 text-[11px] font-semibold px-2.5 py-1 rounded-full shadow
                                   border border-amber-200 opacity-0 group-hover:opacity-100 transition">
                    {t("changePassword.tooltip", { defaultValue: "Email & Password" })}
                  </span>
                </Link>
              </div>

              {/* Info */}
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#8B5C3E]">
                  {t("userDashboard.welcome", { name: displayName })}
                </h1>
                <p className="mt-1 text-gray-600">
                  {t("userDashboard.overview")}
                </p>

                {/* Quick actions (UPDATED BUTTON STYLES) */}
                <div className="mt-4 flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
                  <Link
                    to="/change-password"
                    className="inline-flex items-center justify-center gap-2 rounded-xl
                               bg-[#8B5C3E] text-white px-4 py-2.5 font-semibold shadow
                               hover:bg-[#74452D] transition
                               focus:outline-none focus:ring-2 focus:ring-[#A67C52] focus:ring-offset-2"
                    aria-label="Change password"
                  >
                    <FaKey />
                    {t("changePassword.open_btn", {
                      defaultValue: "Change Password",
                    })}
                  </Link>

                  <Link
                    to="/products"
                    className="inline-flex items-center justify-center gap-2 rounded-xl
                               bg-white text-[#8B5C3E] border border-[#A67C52]/40 px-4 py-2.5 font-semibold shadow-sm
                               hover:bg-[#F8F1E9] transition
                               focus:outline-none focus:ring-2 focus:ring-[#A67C52] focus:ring-offset-2"
                  >
                    <FaShoppingBag />
                    {t("products", { defaultValue: "Products" })}
                  </Link>
                </div>
              </div>

              {/* Stats */}
              <div className="w-full md:w-auto grid grid-cols-2 sm:flex sm:flex-col gap-3">
                <div className="rounded-xl border border-[#A67C52]/30 bg-white px-4 py-3 text-center">
                  <div className="text-xs uppercase tracking-wide text-gray-500">
                    {t("userDashboard.yourOrders", { defaultValue: "Your Orders" })}
                  </div>
                  <div className="mt-1 text-2xl font-extrabold text-[#8B5C3E]">
                    {totalOrders}
                  </div>
                </div>
                <div className="rounded-xl border border-[#A67C52]/30 bg-white px-4 py-3 text-center">
                  <div className="text-xs uppercase tracking-wide text-gray-500">
                    {t("userDashboard.total", { defaultValue: "Total" })}
                  </div>
                  <div className="mt-1 text-2xl font-extrabold text-[#8B5C3E]">
                    ${totalSpent}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Orders List */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h2 className="text-xl sm:text-2xl font-bold text-[#A67C52] mb-5 text-center">
          {t("userDashboard.yourOrders")}
        </h2>

        {orders.length === 0 ? (
          <div className="mx-auto max-w-2xl text-center bg-white border border-dashed border-[#A67C52]/40 rounded-2xl p-10 shadow-sm">
            <div className="text-5xl text-[#8B5C3E] mx-auto w-fit mb-3">
              <FaShoppingBag />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">
              {t("userDashboard.noOrders")}
            </h3>
            <p className="text-gray-500 mt-1">
              {t("products_page.overview", {
                defaultValue:
                  "Discover our handcrafted collection inspired by Tunisian heritage.",
              })}
            </p>
            <Link
              to="/products"
              className="mt-4 inline-block rounded-xl bg-[#8B5C3E] text-white px-5 py-2.5 font-semibold shadow
                         hover:bg-[#74452D] transition
                         focus:outline-none focus:ring-2 focus:ring-[#A67C52] focus:ring-offset-2"
            >
              {t("products", { defaultValue: "Products" })}
            </Link>
          </div>
        ) : (
          <div className="grid gap-6">
            {orders.map((order) => (
              <article
                key={order._id}
                className="bg-white rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.06)] border border-[#A67C52]/20 overflow-hidden"
              >
                {/* Order header */}
                <div className="px-5 py-4 bg-[#8B5C3E]/5 border-b border-[#A67C52]/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3 text-gray-800">
                    <div className="h-10 w-10 grid place-items-center rounded-full bg-[#8B5C3E]/10 text-[#8B5C3E]">
                      <FaUserCircle />
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">
                        {t("userDashboard.orderId")}:
                      </div>
                      <div className="font-semibold" dir="ltr">
                        {order._id.slice(0, 8)}...
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <FaCalendarAlt className="opacity-70" />
                    {new Date(order?.createdAt).toLocaleDateString()}
                  </div>
                  <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 text-sm">
                    <FaDollarSign />
                    {t("userDashboard.total")}: ${order.totalPrice}
                  </div>
                </div>

                {/* Items */}
                <div className="p-5">
                  <h3 className="font-semibold text-[#8B5C3E] mb-3">
                    {t("userDashboard.orderedProducts")}
                  </h3>
                  <ul className="grid gap-4">
                    {order.products.map((product, idx) => {
                      if (!product.productId) return null;

                      const translatedColorName =
                        product.color?.colorName?.[lang] ||
                        product.color?.colorName?.en ||
                        t("userDashboard.original");

                      const title =
                        product.productId.translations?.[lang]?.title ||
                        product.productId.title ||
                        t("userDashboard.noTitle");

                      const imageSrc = product.color?.image
                        ? getImgUrl(product.color.image)
                        : getImgUrl(product.productId.coverImage);

                      return (
                        <li
                          className="flex items-start gap-4 rounded-xl border border-[#A67C52]/20 p-3 sm:p-4"
                          key={`${product.productId._id}-${idx}`}
                        >
                          <img
                            src={imageSrc}
                            alt={title}
                            className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg object-cover border-2 border-[#A67C52]/30"
                          />
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-800">{title}</h4>
                            <div className="mt-1 text-sm text-gray-600 flex flex-wrap gap-3">
                              <span>
                                {t("userDashboard.quantity")}:{" "}
                                <span className="font-medium">{product.quantity}</span>
                              </span>
                              <span className="capitalize">
                                {t("userDashboard.color")}:{" "}
                                <span className="font-medium">{translatedColorName}</span>
                              </span>
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default UserDashboard;
