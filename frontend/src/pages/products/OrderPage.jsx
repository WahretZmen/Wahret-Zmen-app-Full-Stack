import React from "react";
import {
  useGetOrderByEmailQuery,
  useDeleteOrderMutation,
  useRemoveProductFromOrderMutation,
} from "../../redux/features/orders/ordersApi";
import { useAuth } from "../../context/AuthContext";
import { getImgUrl } from "../../utils/getImgUrl";
import { Helmet } from "react-helmet";
import LoadingSpinner from "../../components/Loading";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { productEventsActions } from "../../redux/features/products/productEventsSlice";

const OrderPage = () => {
  const { currentUser } = useAuth();
  const { t, i18n } = useTranslation();
  if (!i18n.isInitialized) return null;
  const lang = i18n.language;
  const dispatch = useDispatch();

  const userEmail = currentUser?.email;

  const {
    data: orders = [],
    isLoading,
    refetch,
  } = useGetOrderByEmailQuery(userEmail, {
    skip: !userEmail,
  });

  const [deleteOrder, { isLoading: isDeleting }] = useDeleteOrderMutation();
  const [removeProductFromOrder] = useRemoveProductFromOrderMutation();

  if (!userEmail) {
    return (
      <div className="bg-[#F8F1E9] min-h-screen flex items-center justify-center px-4">
        <p className="text-lg font-semibold text-gray-600">
          {t("ordersPage.pleaseLogin")}
        </p>
      </div>
    );
  }

  if (isLoading) return <LoadingSpinner />;

  const handleDelete = async (orderId) => {
    Swal.fire({
      title: t("ordersPage.confirmDeleteTitle"),
      text: t("ordersPage.confirmDeleteText"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#8B5C3E", // brand
      cancelButtonColor: "#A67C52",  // brand accent
      confirmButtonText: t("ordersPage.confirmDeleteBtn"),
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteOrder({ orderId }).unwrap();
          Swal.fire(t("ordersPage.deleted"), t("ordersPage.orderDeleted"), "success");
          refetch();
          dispatch(productEventsActions.triggerRefetch());
        } catch (error) {
          Swal.fire(t("ordersPage.error"), t("ordersPage.orderDeleteFailed"), "error");
        }
      }
    });
  };

  const handleDeleteProduct = async (
    orderId,
    productId,
    colorNameObj,
    maxQuantity
  ) => {
    const colorName = colorNameObj?.[lang] || colorNameObj?.en || "Original";
    const productKey = `${productId}|${colorName}`;

    const { value: quantityToRemove } = await Swal.fire({
      title: t("ordersPage.removeQuantityTitle"),
      input: "number",
      inputLabel: t("ordersPage.removeQuantityLabel", { max: maxQuantity }),
      inputAttributes: {
        min: 1,
        max: maxQuantity,
        step: 1,
      },
      inputValue: 1,
      showCancelButton: true,
      confirmButtonText: t("ordersPage.removeBtn"),
      cancelButtonText: t("ordersPage.cancelBtn"),
      confirmButtonColor: "#8B5C3E", // brand
      cancelButtonColor: "#A67C52",  // brand accent
    });

    if (!quantityToRemove || quantityToRemove <= 0) return;

    try {
      const response = await removeProductFromOrder({
        orderId,
        productKey,
        quantityToRemove,
      }).unwrap();

      Swal.fire(
        t("ordersPage.removed"),
        response.message.includes("no more products")
          ? t("ordersPage.orderDeleted")
          : t("ordersPage.productRemoved", { qty: quantityToRemove }),
        "success"
      );

      await refetch();
      dispatch(productEventsActions.triggerRefetch());
    } catch (error) {
      console.error("❌ Failed to remove product:", error);
      Swal.fire(t("ordersPage.error"), t("ordersPage.productRemoveFailed"), "error");
    }
  };

  return (
    <div className="bg-[#F8F1E9] min-h-screen px-4 sm:px-6 OrderPage-screen pt-28 md:pt-32 pb-12">
      <Helmet>
        <title>{t("ordersPage.title")}</title>
      </Helmet>

      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-2xl p-4 sm:p-6 md:p-8 border border-[#A67C52]">
        {/* Title */}
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#A67C52] text-center">
          {t("ordersPage.yourOrders")}
        </h2>

        {/* Empty state */}
        {orders.length === 0 ? (
          <div className="mt-8 flex items-center justify-center">
            <p className="text-gray-500 text-center">{t("ordersPage.noOrders")}</p>
          </div>
        ) : (
          <div className="mt-8 space-y-6">
            {orders.map((order, index) => (
              <div
                key={order._id}
                className="bg-gray-50 p-6 rounded-xl shadow-sm border border-[#A67C52]/30"
              >
                {/* Top row: number + date */}
                <div className="flex flex-wrap justify-between items-center gap-2 mb-3">
                  <p className="text-gray-700 font-medium">
                    <span className="text-[#A67C52] font-semibold">
                      {t("ordersPage.orderNumber")}:
                    </span>{" "}
                    {index + 1}
                  </p>
                  <span className="text-gray-600 text-sm">
                    {new Date(order?.createdAt).toLocaleDateString()}
                  </span>
                </div>

                {/* Order ID pill */}
                <div className="inline-flex items-center gap-2 bg-white border border-[#A67C52]/30 text-gray-800 text-sm px-3 py-1 rounded-full">
                  <span className="font-semibold">{t("ordersPage.orderId")}:</span>
                  <span dir="ltr" className="break-all">
                    {order._id.slice(0, 8)}
                  </span>
                </div>

                {/* Contact info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3">
                  <p className="text-gray-700 break-words leading-snug">
                    <span className="font-medium">{t("ordersPage.email")}:</span>{" "}
                    <span className="break-all inline-block">{order.email}</span>
                  </p>
                  <p className="text-gray-700">
                    <span className="font-medium">{t("ordersPage.phone")}:</span>{" "}
                    {order.phone}
                  </p>
                </div>

                {/* Total */}
                <p className="text-lg font-semibold text-gray-800 mt-3">
                  {t("ordersPage.total")}:{" "}
                  <span className="text-[#A67C52]">${order.totalPrice}</span>
                </p>

                {/* Products */}
                <h3 className="font-semibold text-lg mt-4 mb-2 text-[#A67C52]">
                  {t("ordersPage.orderedProducts")}
                </h3>

                <ul className="space-y-4">
                  {order.products.map((product, idx) => {
                    if (!product.productId) return null;

                    const title =
                      product.productId.translations?.[lang]?.title ||
                      product.productId.title ||
                      t("ordersPage.noTitle");

                    const colorLabel =
                      product.color?.colorName?.[lang] ||
                      product.color?.colorName ||
                      t("ordersPage.original");

                    const imageSrc = getImgUrl(
                      product.color?.image || product.productId.coverImage
                    );

                    return (
                      <li
                        key={`${product.productId._id}-${idx}`}
                        className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 bg-white p-4 rounded-lg shadow-sm border border-[#A67C52]/30"
                      >
                        <img
                          src={imageSrc}
                          alt={title}
                          className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-lg border-2 border-[#A67C52]/40"
                        />
                        <div className="text-center sm:text-left">
                          <p className="font-semibold text-gray-800">{title}</p>
                          <p className="text-gray-600">
                            {t("ordersPage.quantity")}: {product.quantity}
                          </p>
                          <p className="text-gray-600 capitalize">
                            {t("ordersPage.color")}: {colorLabel}
                          </p>

                          {/* Delete product (brand colors) */}
                          <button
                            onClick={() =>
                              handleDeleteProduct(
                                order._id,
                                product.productId._id,
                                product.color?.colorName,
                                product.quantity
                              )
                            }
                            className="mt-2 inline-flex items-center justify-center px-4 py-2 rounded-md font-medium
                                       text-white bg-[#8B5C3E] hover:bg-[#74452D] transition shadow-sm
                                       focus:outline-none focus:ring-2 focus:ring-[#A67C52] focus:ring-offset-2"
                          >
                            {t("ordersPage.removeProduct")}
                          </button>
                        </div>
                      </li>
                    );
                  })}
                </ul>

                {/* Delete whole order (brand colors + disabled state) */}
                <div className="flex justify-end">
                  <button
                    onClick={() => handleDelete(order._id)}
                    disabled={isDeleting}
                    className={`mt-5 px-5 py-2 rounded-lg text-white transition shadow-sm
                      focus:outline-none focus:ring-2 focus:ring-[#A67C52] focus:ring-offset-2
                      ${isDeleting
                        ? "bg-[#C6A990] cursor-not-allowed opacity-70"
                        : "bg-[#8B5C3E] hover:bg-[#74452D]"
                      }`}
                  >
                    {isDeleting ? t("ordersPage.deleting") : t("ordersPage.deleteOrder")}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderPage;
