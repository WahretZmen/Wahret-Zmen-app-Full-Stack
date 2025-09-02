import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Swal from "sweetalert2";
import { useCreateOrderMutation } from "../../redux/features/orders/ordersApi";
import "../../Styles/StylesCheckoutPage.css";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { clearCart } from "../../redux/features/cart/cartSlice";

const CheckoutPage = () => {

  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  if (!i18n.isInitialized) return null;

  // 🔼 Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const cartItems = useSelector((state) => state.cart.cartItems);
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = cartItems
    .reduce((acc, item) => acc + item.newPrice * item.quantity, 0)
    .toFixed(2);

  const { currentUser } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [createOrder, { isLoading }] = useCreateOrderMutation();
  const navigate = useNavigate();
  const [isChecked, setIsChecked] = useState(false);

  

const onSubmit = async (data) => {
  const newOrder = {
    name: data.name,
    email: currentUser?.email,
    address: {
      street: data.address,
      city: data.city,
      country: data.country,
      state: data.state,
      zipcode: data.zipcode,
    },
    phone: data.phone,
    products: cartItems.map((item) => ({
      productId: item._id,
      quantity: item.quantity,
      color:
        typeof item.color?.colorName === "object"
          ? item.color
          : {
              colorName: {
                en: item.color?.colorName || "Original",
                fr: item.color?.colorName || "Original",
                ar: "أصلي",
              },
              image:
                item.color?.image ||
                item.coverImage ||
                "/assets/default-image.png",
            },
    })),
    totalPrice: Number(totalPrice),
  };

  try {
    await createOrder(newOrder).unwrap();
    dispatch(clearCart()); // ✅ clear local cart
    await Swal.fire({
      title: t("checkout.order_confirmed"),
      text: t("checkout.success_message"),
      icon: "success",
      confirmButtonColor: "#A67C52",
      confirmButtonText: t("checkout.go_to_orders"),
    });
    // Better than window.location.href (keeps SPA state)
    navigate("/orders", { replace: true });
  } catch (error) {
    Swal.fire({
      title: t("checkout.error_title"),
      text: error?.data?.message || error?.message || t("checkout.error_message"),
      icon: "error",
      confirmButtonColor: "#d33",
    });
  }
};


  if (isLoading)
    return (
      <div className="text-center text-lg font-semibold py-10 text-[#A67C52]">
        {t("checkout.processing")}
      </div>
    );



    return (
      <section className="min-h-screen flex items-center justify-center bg-[#F8F1E9] screen-CheckoutPage">
        <div className="max-w-5xl w-full bg-white shadow-lg  p-8 border border-[#A67C52]">
          <h2 className="text-3xl font-bold text-[#A67C52] text-center mb-6">
            {t("checkout.title")}
          </h2>
    
          <div className="bg-[#F5EFE6]  shadow-md p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-800">
              {t("checkout.payment_method")}
            </h3>
            <p className="text-gray-700">
              {t("checkout.total_price")}{" "}
              <span className="font-bold text-[#A67C52]">${totalPrice}</span>
            </p>
            <p className="text-gray-700">
              {t("checkout.items")}: <span className="font-bold">{totalItems}</span>
            </p>
          </div>
    
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {/* Left - Personal Details */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-800">
                {t("checkout.personal_details")}
              </h3>
    
              <div>
                <label className="block font-medium">{t("checkout.full_name")}</label>
                <input
                  {...register("name", { required: true })}
                  type="text"
                  className="w-full px-4 py-2 border  focus:ring-[#ffffff] focus:border-[#ffffff]"
                />
              </div>
    
              <div>
                <label className="block font-medium">{t("checkout.email")}</label>
                <input
                  type="email"
                  className="w-full px-4 py-2 border  bg-gray-100 cursor-not-allowed"
                  disabled
                  defaultValue={currentUser?.email}
                />
              </div>
    
              <div>
                <label className="block font-medium">{t("checkout.phone")}</label>
                <input
                  {...register("phone", { required: true })}
                  type="text"
                  className="w-full px-4 py-2 border  focus:ring-[#ffffff] focus:border-[#ffffff]"
                />
              </div>
            </div>
    
            {/* Right - Address Details */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-black-800">
                {t("checkout.shipping_address")}
              </h3>
    
              <div>
                <label className="block font-medium">{t("checkout.address")}</label>
                <input
                  {...register("address", { required: true })}
                  type="text"
                  className="w-full px-4 py-2 border  focus:ring-[#ffffff] focus:border-[#fafafa]"
                />
              </div>
    
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium">{t("checkout.city")}</label>
                  <input
                    {...register("city", { required: true })}
                    type="text"
                    className="w-full px-4 py-2 border  focus:ring-[#f6f6f6] focus:border-[#ffffff]"
                  />
                </div>
                <div>
                  <label className="block font-medium">{t("checkout.country")}</label>
                  <input
                    {...register("country", { required: true })}
                    type="text"
                    className="w-full px-4 py-2 border  focus:ring-[#ffffff] focus:border-[#ffffff]"
                  />
                </div>
              </div>
    
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium">{t("checkout.state")}</label>
                  <input
                    {...register("state", { required: true })}
                    type="text"
                    className="w-full px-4 py-2 border  focus:ring-[#ffffff] focus:border-[#A67C52]"
                  />
                </div>
                <div>
                  <label className="block font-medium">{t("checkout.zipcode")}</label>
                  <input
                    {...register("zipcode", { required: true })}
                    type="text"
                    className="w-full px-4 py-2 border  focus:ring-[#ffffff] focus:border-[#A67C52]"
                  />
                </div>
              </div>
            </div>
    
            {/* Terms and Place Order */}
            <div className="md:col-span-2 flex flex-col items-center mt-4 w-full">
              <div
                className={`w-full flex items-center ${
                  i18n.language === "ar"
                    ? "flex-row-reverse justify-end gap-2"
                    : "flex-row justify-start gap-2"
                }`}
              >
                <input
                  onChange={(e) => setIsChecked(e.target.checked)}
                  type="checkbox"
                  className="form-checkbox h-5 w-5 text-[#A67C52] focus:ring-[#A67C52]"
                />
                <label className="text-black-600 text-sm">
                  {t("checkout.agree")}{" "}
                  <Link className="text-[#A67C52] underline">{t("checkout.terms")}</Link>{" "}
                  {t("checkout.and")}{" "}
                  <Link className="text-[#A67C52] underline">{t("checkout.policy")}</Link>.
                </label>
              </div>
    
              <button
                disabled={!isChecked}
                className={`mt-4 px-6 py-3 text-white font-bold  transition-all duration-200 ${
                  isChecked ? "bg-[#A67C52] hover:bg-[#fcfcfc]" : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                {t("checkout.place_order")}
              </button>
            </div>
          </form>
        </div>
      </section>
    );
      
      };


export default CheckoutPage;








