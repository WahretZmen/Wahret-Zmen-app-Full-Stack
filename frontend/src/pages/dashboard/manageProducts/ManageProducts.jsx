// src/pages/dashboard/products/ManageProducts.jsx
// صفحة إدارة المنتجات: عرض، بحث، تعديل، حذف (عربي / RTL)

import { Link } from "react-router-dom";
import {
  useDeleteProductMutation,
  useGetAllProductsQuery,
} from "../../../redux/features/products/productsApi";
import Swal from "sweetalert2";
import { getImgUrl } from "../../../utils/getImgUrl";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { productEventsActions } from "../../../redux/features/products/productEventsSlice";
import "../../../Styles/StylesManageProducts.css";

/* Small rating component */
const Stars = ({ value = 0 }) => {
  const full = Math.floor(value);
  const half = value - full >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);
  const star = "★";
  const emptyStar = "☆";
  return (
    <div className="text-yellow-500 text-base flex items-center justify-end gap-1">
      <span>
        {"".padStart(full, star)}
        {half ? "⯪" : ""}
        {"".padStart(empty, emptyStar)}
      </span>
      <span className="text-gray-600 text-sm">
        ({Number(value).toFixed(1)})
      </span>
    </div>
  );
};

// Helper: safely convert any field (string or object) to a searchable string
const toSearchString = (value) => {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (typeof value === "object") {
    try {
      return Object.values(value)
        .filter((v) => typeof v === "string")
        .join(" ");
    } catch {
      return "";
    }
  }
  return "";
};

const ManageProducts = () => {
  // Data: list + delete mutation
  const {
    data: products = [],
    isLoading,
    isError,
    refetch,
  } = useGetAllProductsQuery();
  const [deleteProduct, { isLoading: deleting }] = useDeleteProductMutation();

  // redux
  const dispatch = useDispatch();
  const shouldRefetch = useSelector(
    (state) => state.productEvents.shouldRefetch
  );

  // Search fields
  const [searchTerm, setSearchTerm] = useState("");
  const [searchId, setSearchId] = useState("");

  // Category labels (Arabic display)
  const categoryMapping = {
    Men: "رجال",
    Women: "نساء",
    Children: "أطفال",
  };

  // External refetch trigger
  useEffect(() => {
    if (shouldRefetch) {
      refetch();
      dispatch(productEventsActions.resetRefetch());
    }
  }, [shouldRefetch, refetch, dispatch]);

  // Delete handler
  const handleDeleteProduct = async (id) => {
    const confirmResult = await Swal.fire({
      title: "هل أنت متأكد؟",
      text: "لا يمكنك التراجع بعد الحذف!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "نعم، احذفه!",
      cancelButtonText: "إلغاء",
    });

    if (confirmResult.isConfirmed) {
      try {
        await deleteProduct(id).unwrap();
        Swal.fire("تم الحذف!", "تم حذف المنتج بنجاح.", "success");
        refetch();
      } catch (error) {
        Swal.fire(
          "خطأ!",
          error?.data?.message ||
            "فشل في حذف المنتج. يرجى المحاولة مرة أخرى.",
          "error"
        );
      }
    }
  };

  // Filter products by title/embroidery and ID
  const filteredProducts = products.filter((product) => {
    const term = searchTerm.trim().toLowerCase();
    const idTerm = searchId.trim().toLowerCase();

    // Match on titles (FR/AR/EN base title) + embroideryCategory (multi-lang object)
    const titleCandidates = [
      product.title,
      product.translations?.fr?.title,
      product.translations?.ar?.title,
      product.translations?.en?.title,
      product.embroideryCategory, // can be string OR { en, fr, ar }
    ]
      .map(toSearchString)
      .filter((s) => s && s.trim().length > 0)
      .map((s) => s.toLowerCase());

    const matchesText =
      term === "" || titleCandidates.some((t) => t.includes(term));

    // Match on product ID (partial)
    const matchesId =
      idTerm === "" ||
      (product._id && product._id.toLowerCase().includes(idTerm));

    return matchesText && matchesId;
  });

  return (
    <section className="p-4 bg-gray-100 min-h-screen font-sans" dir="rtl">
      {/* Search controls */}
      <div className="flex flex-col md:flex-row gap-4 mb-4 justify-end">
        <input
          type="text"
          placeholder="🔍 ابحث بالعنوان أو فئة التطريز..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border border-gray-300 rounded-md w-full md:max-w-sm text-right"
        />
        <input
          type="text"
          placeholder="🔎 ابحث بمعرّف المنتج..."
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
          className="p-2 border border-gray-300 rounded-md w-full md:max-w-sm text-right"
        />
      </div>

      {/* Table */}
      <div className="w-full overflow-x-auto">
        <table className="min-w-[1100px] w-full border-collapse border border-gray-300 text-right">
          <thead>
            <tr className="bg-gray-200 text-gray-700 font-semibold">
              <th className="p-4 border border-gray-300">#</th>
              <th className="p-4 border border-gray-300">معرّف المنتج</th>
              <th className="p-4 border border-gray-300">المنتج</th>
              <th className="p-4 border border-gray-300">الفئة</th>
              <th className="p-4 border border-gray-300">فئة التطريز</th>
              <th className="p-4 border border-gray-300">الألوان</th>
              <th className="p-4 border border-gray-300">السعر</th>
              <th className="p-4 border border-gray-300">المخزون</th>
              <th className="p-4 border border-gray-300">التقييم</th>
              <th className="p-4 border border-gray-300">إجراءات</th>
            </tr>
          </thead>

          <tbody>
            {/* Loading row */}
            {isLoading && (
              <tr>
                <td
                  colSpan="10"
                  className="text-center p-6 border border-gray-300"
                >
                  جارٍ تحميل المنتجات...
                </td>
              </tr>
            )}

            {/* Error row */}
            {isError && !isLoading && (
              <tr>
                <td
                  colSpan="10"
                  className="text-center p-6 border border-gray-300 text-red-600"
                >
                  حدث خطأ أثناء تحميل المنتجات.
                </td>
              </tr>
            )}

            {/* Data rows */}
            {!isLoading && !isError && filteredProducts.length > 0 ? (
              filteredProducts.map((product, index) => {
                const totalStock = product.colors?.reduce(
                  (sum, c) => sum + (c?.stock || 0),
                  0
                );

                // Embroidery label: support object { en, fr, ar } or plain string
                let embroideryLabel = "—";
                const emb = product.embroideryCategory;
                if (emb) {
                  if (typeof emb === "string") {
                    embroideryLabel = emb.trim() || "—";
                  } else if (typeof emb === "object") {
                    embroideryLabel =
                      emb.ar || emb.fr || emb.en || "—";
                  }
                }

                // helper for color name: prefer AR then EN then FR then raw
                const getColorName = (color) => {
                  if (color && typeof color.colorName === "object") {
                    return (
                      color.colorName.ar ||
                      color.colorName.en ||
                      color.colorName.fr ||
                      "افتراضي"
                    );
                  }
                  return color?.colorName || "افتراضي";
                };

                return (
                  <tr
                    key={product._id}
                    className="hover:bg-gray-100 transition"
                  >
                    {/* Index */}
                    <td className="p-4 border border-gray-300 align-middle">
                      {index + 1}
                    </td>

                    {/* Short ID */}
                    <td className="p-4 border border-gray-300 align-middle text-sm text-gray-600">
                      {product._id.slice(0, 8)}...
                    </td>

                    {/* Product title + image */}
                    <td className="p-4 border border-gray-300">
                      <div className="flex flex-col items-center justify-center text-center">
                        <span className="font-medium text-gray-800 mt-2 text-sm md:text-base break-words">
                          {product.title}
                        </span>
                        <img
                          src={getImgUrl(product.coverImage)}
                          alt={product.title}
                          className="w-16 h-16 md:w-20 md:h-20 rounded-lg object-cover border mt-2"
                        />
                      </div>
                    </td>

                    {/* Category (Arabic labels) */}
                    <td className="p-4 border border-gray-300 align-middle capitalize text-gray-700">
                      {categoryMapping[product.category] || "غير مصنّف"}
                    </td>

                    {/* Embroidery (AR/FR/EN) */}
                    <td className="p-4 border border-gray-300 align-middle text-gray-700">
                      {embroideryLabel}
                    </td>

                    {/* Colors */}
                    <td className="p-4 border border-gray-300 align-middle">
                      <div className="flex flex-wrap items-center gap-4 justify-end">
                        {product.colors?.length > 0 ? (
                          [...product.colors].map((color, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                              <span className="text-sm text-gray-700">
                                {getColorName(color)}
                              </span>
                              <div
                                className="w-4 h-4 rounded-full border"
                                style={{
                                  backgroundColor: color.hex || "#fff",
                                }}
                              />
                            </div>
                          ))
                        ) : (
                          <span className="text-gray-500">افتراضي</span>
                        )}
                      </div>
                    </td>

                    {/* Price */}
                    <td className="p-4 border border-gray-300 align-middle text-green-600 font-semibold">
                      ${product.newPrice}
                    </td>

                    {/* Stock (sum of color stocks) */}
                    <td className="p-4 border border-gray-300 align-middle">
                      <span
                        className={
                          totalStock === 0
                            ? "text-red-500 font-medium"
                            : "text-yellow-600 font-medium"
                        }
                      >
                        {totalStock > 0
                          ? `${totalStock} في المخزون`
                          : "غير متوفر"}
                      </span>
                    </td>

                    {/* Rating */}
                    <td className="p-4 border border-gray-300 align-middle">
                      <Stars value={Number(product.rating ?? 0)} />
                    </td>

                    {/* Actions */}
                    <td className="p-4 border border-gray-300 align-middle">
                      <div className="flex gap-2 sm:gap-4 justify-end">
                        <Link
                          to={`/dashboard/edit-product/${product._id}`}
                          className="action-button btn-edit"
                        >
                          تعديل
                        </Link>
                        <button
                          onClick={() => handleDeleteProduct(product._id)}
                          disabled={deleting}
                          className="action-button btn-delete"
                        >
                          {deleting ? "جارٍ الحذف..." : "حذف"}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              !isLoading &&
              !isError && (
                <tr>
                  <td
                    colSpan="10"
                    className="text-center p-6 border border-gray-300"
                  >
                    لا توجد منتجات.
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default ManageProducts;
