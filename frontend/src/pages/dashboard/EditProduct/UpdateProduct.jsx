// src/pages/dashboard/products/UpdateProduct.jsx
// -----------------------------------------------------------------------------
// UpdateProduct – Admin edit existing product (Arabic / RTL)
// -----------------------------------------------------------------------------

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import {
  useGetProductByIdQuery,
  useUpdateProductMutation,
} from "../../../redux/features/products/productsApi";
import Loading from "../../../components/Loading";
import Swal from "sweetalert2";
import axios from "axios";
import imageCompression from "browser-image-compression";
import getBaseUrl from "../../../utils/baseURL";

const UpdateProduct = () => {
  const { id } = useParams();

  // Fetch product
  const {
    data: productData,
    isLoading,
    isError,
    refetch,
  } = useGetProductByIdQuery(id);

  // Form + mutation
  const { register, handleSubmit, setValue } = useForm();
  const [updateProduct, { isLoading: updating }] = useUpdateProductMutation();

  // Local state
  const [coverFile, setCoverFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState("");
  const [colors, setColors] = useState([]);

  // Upload helpers
  const compressImage = async (file) =>
    imageCompression(file, {
      maxSizeMB: 1,
      maxWidthOrHeight: 1024,
      useWebWorker: true,
    });

  const uploadImage = async (file) => {
    if (!file) return "";
    try {
      const compressed = await compressImage(file);
      const formData = new FormData();
      formData.append("image", compressed);

      const res = await axios.post(`${getBaseUrl()}/api/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data.image;
    } catch (err) {
      console.error("❌ Image upload failed:", err);
      Swal.fire("خطأ", "فشل رفع الصورة. يرجى المحاولة مرة أخرى.", "error");
      return "";
    }
  };

  const fullUrl = (url) =>
    url?.startsWith("http") ? url : `${getBaseUrl()}${url}`;

  // Initialize form from product
  useEffect(() => {
    if (!productData) return;

    setValue("title", productData.title || "");
    setValue("description", productData.description || "");
    setValue("category", productData.category || "");
    setValue("trending", !!productData.trending);
    setValue("oldPrice", productData.oldPrice);
    setValue("newPrice", productData.newPrice);
    setValue("rating", Number(productData.rating ?? 0));

    // embroidery: take EN as source if object, else fallback to string
    let emb = "";
    if (productData.embroideryCategory) {
      if (typeof productData.embroideryCategory === "string") {
        emb = productData.embroideryCategory;
      } else {
        emb =
          productData.embroideryCategory.en ||
          productData.embroideryCategory.fr ||
          productData.embroideryCategory.ar ||
          "";
      }
    }
    setValue("embroideryCategory", emb);

    const cover = productData.coverImage || "";
    setCoverPreview(cover ? fullUrl(cover) : "");

    const prepared =
      Array.isArray(productData.colors) && productData.colors.length
        ? productData.colors.map((c) => {
            const name =
              typeof c.colorName === "object"
                ? c.colorName.en
                : c.colorName || "";
            const imgs =
              Array.isArray(c.images) && c.images.length
                ? c.images
                : c.image
                ? [c.image]
                : [];
            return {
              colorName: name,
              stock: Number(c.stock) || 0,
              images: imgs,
              pendingFile: null,
              pendingPreview: "",
              uploading: false,
            };
          })
        : [
            {
              colorName: "",
              stock: 0,
              images: [],
              pendingFile: null,
              pendingPreview: "",
              uploading: false,
            },
          ];

    setColors(prepared);

    // Compute total stock from colors (fallback to productData.stockQuantity)
    const colorsTotal = prepared.reduce(
      (sum, c) => sum + (Number(c.stock) || 0),
      0
    );
    setValue(
      "stockQuantity",
      colorsTotal || productData.stockQuantity || 0
    );
  }, [productData, setValue]);

  // Color helpers
  const setColorAt = (index, patch) =>
    setColors((prev) =>
      prev.map((c, i) => (i === index ? { ...c, ...patch } : c))
    );

  const handleColorField = (index, field, value) =>
    setColorAt(index, { [field]: value });

  const addColor = () =>
    setColors((prev) => [
      ...prev,
      {
        colorName: "",
        stock: 0,
        images: [],
        pendingFile: null,
        pendingPreview: "",
        uploading: false,
      },
    ]);

  const deleteColor = (index) =>
    setColors((prev) => prev.filter((_, i) => i !== index));

  const pickColorFile = (index, file) => {
    if (file && file.type.startsWith("image/")) {
      setColorAt(index, {
        pendingFile: file,
        pendingPreview: URL.createObjectURL(file),
      });
    }
  };

  const cancelPending = (index) =>
    setColorAt(index, { pendingFile: null, pendingPreview: "" });

  const uploadPending = async (index) => {
    const color = colors[index];
    if (!color.pendingFile) return;
    try {
      setColorAt(index, { uploading: true });
      const url = await uploadImage(color.pendingFile);
      if (url) {
        setColorAt(index, {
          images: [...color.images, url],
          pendingFile: null,
          pendingPreview: "",
          uploading: false,
        });
      } else {
        setColorAt(index, { uploading: false });
      }
    } catch {
      setColorAt(index, { uploading: false });
    }
  };

  const removeImage = (cIdx, imgIdx) =>
    setColors((prev) =>
      prev.map((c, i) =>
        i === cIdx
          ? { ...c, images: c.images.filter((_, j) => j !== imgIdx) }
          : c
      )
    );

  // Cover handlers
  const handleCover = (e) => {
    const f = e.target.files?.[0];
    if (f && f.type.startsWith("image/")) {
      setCoverFile(f);
      setCoverPreview(URL.createObjectURL(f));
    }
  };

  const cancelCover = () => {
    setCoverFile(null);
    setCoverPreview(
      productData?.coverImage ? fullUrl(productData.coverImage) : ""
    );
  };

  // Submit
  const onSubmit = async (data) => {
    try {
      // Cover upload
      let coverImage = productData.coverImage || "";
      if (coverFile) {
        const url = await uploadImage(coverFile);
        if (url) coverImage = url;
      }

      // Upload pending color images
      const prepared = [...colors];
      for (let i = 0; i < prepared.length; i++) {
        const c = prepared[i];
        if (c.pendingFile) {
          const url = await uploadImage(c.pendingFile);
          if (url) {
            prepared[i] = {
              ...c,
              images: [...c.images, url],
              pendingFile: null,
              pendingPreview: "",
            };
          }
        }
      }

      // Normalize colors for backend
      const colorsForServer = prepared
        .map((c) => ({ ...c, colorName: (c.colorName || "").trim() }))
        .filter((c) => c.colorName && c.images.length > 0)
        .map((c) => ({
          colorName: c.colorName,
          images: c.images,
          stock: Number(c.stock) || 0,
        }));

      const allowedCategories = ["Men", "Women", "Children"];
      const finalCategory = allowedCategories.includes(data.category)
        ? data.category
        : "Men";

      // Always recompute stock from colors (authoritative)
      const stockQuantity = colorsForServer.reduce(
        (sum, c) => sum + (c.stock || 0),
        0
      );

      const rating = Math.max(
        0,
        Math.min(5, Number(data.rating ?? productData.rating ?? 0))
      );

      const payload = {
        id,
        title: (data.title || "").trim(),
        description: (data.description || "").trim(),
        category: finalCategory,
        // free text embroidery (EN/FR source, backend will translate to {en,fr,ar})
        embroideryCategory: (data.embroideryCategory || "").trim(),
        coverImage,
        colors: colorsForServer,
        oldPrice: Number(data.oldPrice),
        newPrice: Number(data.newPrice),
        stockQuantity,
        trending: !!data.trending,
        rating,
      };

      await updateProduct(payload).unwrap();

      Swal.fire("نجاح", " ! تم تحديث المنتج بنجاح", "نجاح");
      refetch();
    } catch (error) {
      console.error(error);
      Swal.fire(
        "خطأ",
        error?.data?.message || "فشل تحديث المنتج",
        "error"
      );
    }
  };

  if (isLoading) return <Loading />;
  if (isError)
    return (
      <div className="text-center text-red-500" dir="rtl">
        حدث خطأ أثناء تحميل المنتج.
      </div>
    );

  return (
    <div
      className="max-w-md mx-auto p-4 bg-white rounded-lg shadow-md w-full"
      dir="rtl"
    >
      <h2 className="text-2xl font-bold text-center text-[#A67C52] mb-4">
        تحديث المنتج
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Core fields */}
        <input
          {...register("title")}
          className="w-full p-2 border rounded rtl-input"
          placeholder="عنوان المنتج"
          required
        />
        <textarea
          {...register("description")}
          className="w-full p-2 border rounded rtl-input"
          placeholder="وصف المنتج"
          required
        />

        <select
          {...register("category")}
          className="w-full p-2 border rounded"
          required
        >
          <option value="">اختر الفئة</option>
          <option value="Men">رجال</option>
          <option value="Women">نساء</option>
          <option value="Children">أطفال</option>
        </select>

        {/* Free text embroidery category */}
        <input
          {...register("embroideryCategory")}
          className="w-full p-2 border rounded rtl-input"
          placeholder="فئة التطريز (اختياري)"
        />

        {/* Prices */}
        <div className="grid grid-cols-2 gap-4">
          <input
            {...register("oldPrice")}
            type="number"
            className="w-full p-2 border rounded"
            placeholder="السعر القديم"
            required
            step="0.01"
            min="0"
          />
          <input
            {...register("newPrice")}
            type="number"
            className="w-full p-2 border rounded"
            placeholder="السعر الجديد"
            required
            step="0.01"
            min="0"
          />
        </div>

        {/* Stock total (informational, but value is recomputed from colors on submit) */}
        <input
          {...register("stockQuantity")}
          type="number"
          className="w-full p-2 border rounded"
          min="0"
          placeholder="الكمية الإجمالية في المخزون"
        />

        {/* Rating */}
        <div className="grid grid-cols-3 items-center gap-3">
          <label className="font-medium col-span-1 text-right">
            التقييم (0–5)
          </label>
          <input
            {...register("rating")}
            type="number"
            min="0"
            max="5"
            step="0.5"
            className="col-span-2 w-full p-2 border rounded"
            placeholder="مثال: 4.5"
          />
        </div>

        {/* Trending */}
        <label className="inline-flex items-center justify-end gap-2">
          <span>منتج رائج</span>
          <input type="checkbox" {...register("trending")} />
        </label>

        {/* Cover image */}
        <div>
          <label className="block font-medium mb-1 text-right">
            الصورة الرئيسية
          </label>
          <div className="flex items-center gap-2 justify-end">
            <label
              htmlFor="cover-upload"
              className="inline-flex items-center px-3 py-2 rounded-md border border-gray-300 bg-gray-50 hover:bg-gray-100 text-sm cursor-pointer"
            >
              اختيار صورة
            </label>
            <input
              id="cover-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleCover}
            />
            {coverPreview && (
              <button
                type="button"
                onClick={cancelCover}
                className="px-3 py-2 rounded-md border text-sm bg-gray-100 hover:bg-gray-200"
              >
                إلغاء الاختيار
              </button>
            )}
          </div>
          {coverPreview && (
            <img
              src={coverPreview}
              alt="معاينة"
              className="w-32 h-32 object-cover border rounded mt-2 mx-auto"
            />
          )}
        </div>

        {/* Colors manager */}
        <div>
          <label className="block font-medium mb-2 text-right">الألوان</label>

          {colors.map((c, index) => (
            <div
              key={index}
              className="space-y-3 border border-gray-200 p-3 rounded-md"
            >
              <input
                type="text"
                value={c.colorName}
                onChange={(e) =>
                  handleColorField(index, "colorName", e.target.value)
                }
                className="w-full p-2 border rounded rtl-input"
                placeholder="اسم اللون (بالإنجليزية)"
                required
              />

              <input
                type="number"
                value={c.stock}
                onChange={(e) =>
                  handleColorField(
                    index,
                    "stock",
                    Number(e.target.value) || 0
                  )
                }
                className="w-full p-2 border rounded rtl-input"
                placeholder="الكمية في المخزون"
                required
              />

              <div className="flex items-center gap-2 flex-wrap">
                <input
                  id={`pick-${index}`}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) =>
                    pickColorFile(index, e.target.files?.[0])
                  }
                />
                <label
                  htmlFor={`pick-${index}`}
                  className="inline-flex items-center px-3 py-2 rounded-md border border-gray-300 bg-gray-50 hover:bg-gray-100 text-sm cursor-pointer"
                >
                  اختيار صورة
                </label>

                <button
                  type="button"
                  onClick={() => uploadPending(index)}
                  disabled={!c.pendingFile || c.uploading}
                  className={`px-4 py-2 rounded-md text-white text-sm ${
                    c.pendingFile && !c.uploading
                      ? "bg-[#2F3A4A] hover:bg-[#232c39]"
                      : "bg-gray-300 cursor-not-allowed"
                  }`}
                >
                  {c.uploading ? "جارٍ الرفع..." : "رفع"}
                </button>

                <button
                  type="button"
                  onClick={() => cancelPending(index)}
                  disabled={!c.pendingFile || c.uploading}
                  className={`px-4 py-2 rounded-md text-sm border ${
                    c.pendingFile && !c.uploading
                      ? "bg-gray-100 hover:bg-gray-200"
                      : "bg-gray-100 opacity-60 cursor-not-allowed"
                  }`}
                >
                  إلغاء الاختيار
                </button>
              </div>

              {c.pendingPreview && (
                <img
                  src={c.pendingPreview}
                  alt="pending"
                  className="w-16 h-16 object-cover rounded border"
                />
              )}

              {c.images.length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {c.images.map((img, imgIdx) => (
                    <div key={imgIdx} className="relative">
                      <img
                        src={fullUrl(img)}
                        alt={`color-${index}-img-${imgIdx}`}
                        className="w-20 h-20 object-cover rounded border"
                      />
                      <button
                        type="button"
                        title="حذف الصورة"
                        onClick={() => removeImage(index, imgIdx)}
                        className="absolute -top-2 -right-2 bg-red-600 hover:bg-red-700 text-white rounded-full w-6 h-6 flex items-center justify-center shadow"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <button
                type="button"
                onClick={() => deleteColor(index)}
                className="w-full px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded"
              >
                حذف اللون
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={addColor}
            className="w-full mt-3 px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded"
          >
            إضافة لون
          </button>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full py-3 bg-[#A67C52] text-white rounded-md hover:bg-[#8a5d3b] transition disabled:opacity-60"
          disabled={updating}
        >
          {updating ? "جارٍ تحديث المنتج..." : "تحديث المنتج"}
        </button>
      </form>
    </div>
  );
};

export default UpdateProduct;
