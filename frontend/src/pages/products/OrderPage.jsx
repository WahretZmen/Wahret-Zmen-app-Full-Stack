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
      <div className="flex items-center justify-center min-h-screen px-4">
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
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: t("ordersPage.confirmDeleteBtn"),
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteOrder({ orderId }).unwrap();
          Swal.fire(
            t("ordersPage.deleted"),
            t("ordersPage.orderDeleted"),
            "success"
          );
          refetch();
          dispatch(productEventsActions.triggerRefetch()); // ✅ Refresh stock
        } catch (error) {
          Swal.fire(
            t("ordersPage.error"),
            t("ordersPage.orderDeleteFailed"),
            "error"
          );
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
    });

    if (!quantityToRemove || quantityToRemove <= 0) return;

    try {
      await removeProductFromOrder({
        orderId,
        productKey,
        quantityToRemove,
      }).unwrap();

      Swal.fire(
        t("ordersPage.removed"),
        t("ordersPage.productRemoved", { qty: quantityToRemove }),
        "success"
      );
      refetch();
      dispatch(productEventsActions.triggerRefetch()); // ✅ Refresh product stock
    } catch (error) {
      console.error("❌ Failed to remove product:", error);
      Swal.fire(
        t("ordersPage.error"),
        t("ordersPage.productRemoveFailed"),
        "error"
      );
    }
  };

  
  return (
    <div className="bg-gray-50 py-12 min-h-screen px-4 sm:px-6 mt-6 md:mt-12 OrderPage OrderPage-screen">
      <Helmet>
        <title>{t("ordersPage.title")}</title>
      </Helmet>

      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-lg p-4 sm:p-6 md:p-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">
          {t("ordersPage.yourOrders")}
        </h2>

        {orders.length === 0 ? (
          <p className="text-gray-500">{t("ordersPage.noOrders")}</p>
        ) : (
          <div className="space-y-6">
            {orders.map((order, index) => (
              <div key={order._id} className="bg-gray-100 p-6 rounded-lg shadow-sm">
                <div className="flex flex-wrap justify-between items-center gap-2 mb-3">
                  <p className="text-gray-700 font-medium">
                    <span className="text-gray-900 font-semibold">
                      {t("ordersPage.orderNumber")}:
                    </span>{" "}
                    {index + 1}
                  </p>
                  <p className="text-gray-600 text-sm">
                    {new Date(order?.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <h2 className="font-semibold text-gray-900">
  {t("ordersPage.orderId")}: {order._id.slice(0, 8)}
</h2>



                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <p className="text-gray-700 break-words max-w-full w-full text-wrap leading-snug">
  <span className="font-medium">{t("ordersPage.email")}:</span>{" "}
  <span className="break-all inline-block">{order.email}</span>
</p>


  <p className="text-gray-700">
    <span className="font-medium">{t("ordersPage.phone")}:</span> {order.phone}
  </p>
</div>

                <p className="text-lg font-semibold text-gray-800">
                  {t("ordersPage.total")}:{" "}
                  <span className="text-green-600">${order.totalPrice}</span>
                </p>

                <h3 className="font-semibold text-lg mt-4 mb-2">
                  {t("ordersPage.orderedProducts")}
                </h3>

                <ul className="space-y-4">
                  {order.products.map((product, idx) => {
                    if (!product.productId) return null;

                    return (
                      <li
                        key={`${product.productId._id}-${idx}`}
                        className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 bg-white p-4 rounded-lg shadow-sm"
                      >
                        <img
                          src={getImgUrl(product.color?.image || product.productId.coverImage)}
                          alt={product.productId.title}
                          className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-lg border"
                        />
                        <div className="text-center sm:text-left">
                          <p className="font-semibold text-gray-800">
                            {product.productId.title || t("ordersPage.noTitle")}
                          </p>
                          <p className="text-gray-600">
                            {t("ordersPage.quantity")}: {product.quantity}
                          </p>
                          <p className="text-gray-600 capitalize">
                            {t("ordersPage.color")}:{" "}
                            {product.color?.colorName?.[lang] ||
                              product.color?.colorName ||
                              t("ordersPage.original")}
                          </p>

                          <button
                            onClick={() =>
                              handleDeleteProduct(
                                order._id,
                                product.productId._id,
                                product.color.colorName,
                                product.quantity
                              )
                            }
                            className="mt-2 px-4 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                          >
                            {t("ordersPage.removeProduct")}
                          </button>
                        </div>
                      </li>
                    );
                  })}
                </ul>

                <button
                  onClick={() => handleDelete(order._id)}
                  className={`mt-4 px-5 py-2 ${
                    isDeleting
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-red-600 hover:bg-red-700"
                  } text-white rounded-lg transition-all duration-200`}
                  disabled={isDeleting}
                >
                  {isDeleting
                    ? t("ordersPage.deleting")
                    : t("ordersPage.deleteOrder")}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderPage;
