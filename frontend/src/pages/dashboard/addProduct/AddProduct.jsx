// ============================================================================
// AddProduct – Admin create product (Arabic / RTL)
// ============================================================================

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useAddProductMutation } from "../../../redux/features/products/productsApi";
import Swal from "sweetalert2";
import axios from "axios";
import imageCompression from "browser-image-compression";
import getBaseUrl from "../../../utils/baseURL";
import "../../../Styles/StylesAddProduct.css";

const AddProduct = () => {
  // Form with default rating
  const { register, handleSubmit, reset } = useForm({ defaultValues: { rating: 0 } });
  const [addProduct, { isLoading }] = useAddProductMutation();

  // Cover image state
  const [coverImageFile, setCoverImageFile] = useState(null);
  const [coverPreviewURL, setCoverPreviewURL] = useState("");

  // Colors state
  const [colorInputs, setColorInputs] = useState([
    {
      colorName: "",
      stock: 0,
      images: [],
      pendingFile: null,
      pendingPreview: "",
      uploading: false,
    },
  ]);

  // Image compression + upload helpers
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
      return res.data.image || "";
    } catch (err) {
      console.error("❌ Image upload failed:", err);
      Swal.fire("خطأ", "فشل رفع الصورة. يرجى المحاولة مرة أخرى.", "error");
      return "";
    }
  };

  // Cover handlers
  const handleCoverImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setCoverImageFile(file);
      setCoverPreviewURL(URL.createObjectURL(file));
    } else {
      setCoverImageFile(null);
      setCoverPreviewURL("");
    }
  };

  // Remove an image from a color
  const removeColorImage = (cIdx, imgIdx) => {
    Swal.fire({
      title: "حذف الصورة؟",
      text: "سيتم إزالة هذه الصورة من اللون.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "نعم، احذف",
      cancelButtonText: "إلغاء",
    }).then((res) => {
      if (!res.isConfirmed) return;
      setColorInputs((prev) =>
        prev.map((c, i) =>
          i === cIdx ? { ...c, images: c.images.filter((_, j) => j !== imgIdx) } : c
        )
      );
    });
  };

  // Color helpers
  const setColorAt = (index, patch) =>
    setColorInputs((prev) => prev.map((c, i) => (i === index ? { ...c, ...patch } : c)));

  const addColorInput = () =>
    setColorInputs((prev) => [
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

  const deleteColorInput = (index) =>
    setColorInputs((prev) => prev.filter((_, i) => i !== index));

  const handleColorFieldChange = (index, field, value) =>
    setColorAt(index, { [field]: value });

  const handlePickColorFile = (index, file) => {
    if (file && file.type.startsWith("image/")) {
      setColorAt(index, {
        pendingFile: file,
        pendingPreview: URL.createObjectURL(file),
      });
    }
  };

  const cancelPendingColorFile = (index) =>
    setColorAt(index, { pendingFile: null, pendingPreview: "" });

  const uploadPendingColorFile = async (index) => {
    const color = colorInputs[index];
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

  const fullUrl = (url) => (url?.startsWith("http") ? url : `${getBaseUrl()}${url}`);

  // Submit handler
  const onSubmit = async (data) => {
    try {
      let coverImage = "";
      if (coverImageFile) {
        coverImage = await uploadImage(coverImageFile);
      }

      // Prepare colors
      const preparedColors = colorInputs
        .map((c) => ({ ...c, colorName: c.colorName.trim() }))
        .filter((c) => c.colorName && (c.images.length > 0 || c.pendingFile));

      // Upload pending files
      for (let i = 0; i < preparedColors.length; i++) {
        const color = preparedColors[i];
        if (color.pendingFile) {
          const url = await uploadImage(color.pendingFile);
          if (url) {
            color.images.push(url);
            color.pendingFile = null;
            color.pendingPreview = "";
          }
        }
      }

      if (preparedColors.length === 0) {
        Swal.fire(
          "بيانات ناقصة",
          "أضِف لونًا واحدًا على الأقل مع صورة.",
          "warning"
        );
        return;
      }

      if (preparedColors.some((c) => !Array.isArray(c.images) || c.images.length === 0)) {
        Swal.fire(
          "صورة مفقودة",
          "كل لون يجب أن يحتوي على صورة واحدة على الأقل.",
          "warning"
        );
        return;
      }

      // Fallback cover
      if (!coverImage) coverImage = preparedColors[0]?.images?.[0] || "";
      if (!coverImage) {
        Swal.fire(
          "الصورة الرئيسية",
          "يرجى اختيار صورة رئيسية للمنتج.",
          "warning"
        );
        return;
      }

      const colorsForServer = preparedColors.map((c) => ({
        colorName: c.colorName,
        images: c.images,
        stock: Number(c.stock) || 0,
      }));

      // Category fallback
      const allowedCategories = ["Men", "Women", "Children"];
      const finalCategory = allowedCategories.includes(data.category) ? data.category : "Men";

      // Clamp rating to 0..5
      const rating = Math.max(0, Math.min(5, Number(data.rating ?? 0)));

      const payload = {
        title: (data.title || "").trim(),
        description: (data.description || "").trim(),
        category: finalCategory,
        // free text embroidery (EN source, controller will translate)
        embroideryCategory: (data.embroideryCategory || "").trim(),
        coverImage,
        colors: colorsForServer,
        oldPrice: Number(data.oldPrice),
        newPrice: Number(data.newPrice),
        stockQuantity: colorsForServer.reduce((sum, c) => sum + (c.stock || 0), 0),
        trending: !!data.trending,
        rating,
      };

      await addProduct(payload).unwrap();

      Swal.fire("تم إنشاء المنتج بنجاح!", "نجاح");

      // Reset form + local state
      reset({ rating: 0, embroideryCategory: "" });
      setCoverImageFile(null);
      setCoverPreviewURL("");
      setColorInputs([
        {
          colorName: "",
          stock: 0,
          images: [],
          pendingFile: null,
          pendingPreview: "",
          uploading: false,
        },
      ]);
    } catch (error) {
      console.error("❌ Error adding product:", error?.data || error);
      Swal.fire(
        "خطأ",
        error?.data?.message || "فشل في إضافة المنتج.",
        "error"
      );
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white rounded-lg shadow-md w-full" dir="rtl">
      <h2 className="text-2xl font-bold text-center text-[#A67C52] mb-4">
        إضافة منتج جديد
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Title + description (RTL text) */}
        <input
          {...register("title")}
          className="w-full p-2 border rounded rtl-input"
          placeholder="اسم المنتج"
          required
          autoComplete="off"
        />

        <textarea
          {...register("description")}
          className="w-full p-2 border rounded rtl-input"
          placeholder="وصف المنتج"
          required
          rows={3}
        />

        {/* Main category */}
        <select
          {...register("category")}
          className="w-full p-2 border rounded"
          required
          aria-label="الفئة"
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

        {/* Admin rating */}
        <div className="grid grid-cols-3 items-center gap-3">
          <label className="font-medium col-span-1 text-right">التقييم (0–5)</label>
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

        {/* Trending flag */}
        <label className="flex items-center justify-end gap-2">
          <span>منتج رائج</span>
          <input type="checkbox" {...register("trending")} />
        </label>

        {/* Cover image */}
        <div>
          <label className="block font-medium mb-1 text-right">الصورة الرئيسية</label>
          <div className="flex items-center gap-2 justify-end">
            <label
              htmlFor="cover-file"
              className="inline-flex items-center px-3 py-2 rounded-md border border-gray-300 bg-gray-50 hover:bg-gray-100 text-sm cursor-pointer"
            >
              اختيار صورة
            </label>
            <input
              id="cover-file"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleCoverImageChange}
            />
            {coverPreviewURL && (
              <button
                type="button"
                onClick={() => {
                  setCoverImageFile(null);
                  setCoverPreviewURL("");
                }}
                className="px-3 py-2 rounded-md border text-sm bg-gray-100 hover:bg-gray-200"
              >
                إلغاء الاختيار
              </button>
            )}
          </div>
          {coverPreviewURL && (
            <img
              src={coverPreviewURL}
              alt="معاينة الصورة"
              className="w-32 h-32 mt-2 object-cover rounded border mx-auto"
            />
          )}
        </div>

        {/* Colors editor */}
        <div>
          <label className="block font-medium mb-2 text-right">ألوان المنتج</label>
          {colorInputs.map((color, index) => (
            <div key={index} className="space-y-3 border border-gray-200 p-3 rounded-md">
              <input
                type="text"
                placeholder="اسم اللون "
                className="w-full p-2 border rounded rtl-input"
                value={color.colorName}
                onChange={(e) =>
                  handleColorFieldChange(index, "colorName", e.target.value)
                }
                required
              />

              <input
                type="number"
                placeholder="الكمية في المخزون"
                className="w-full p-2 border rounded rtl-input"
                value={color.stock}
                onChange={(e) =>
                  handleColorFieldChange(
                    index,
                    "stock",
                    Number(e.target.value) || 0
                  )
                }
                required
                min="0"
              />

              <div className="flex items-center gap-2 flex-wrap">
                <input
                  id={`color-file-${index}`}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) =>
                    handlePickColorFile(index, e.target.files?.[0])
                  }
                />
                <label
                  htmlFor={`color-file-${index}`}
                  className="inline-flex items-center px-3 py-2 rounded-md border border-gray-300 bg-gray-50 hover:bg-gray-100 text-sm cursor-pointer"
                >
                  اختيار صورة
                </label>
                <button
                  type="button"
                  onClick={() => uploadPendingColorFile(index)}
                  disabled={!color.pendingFile || color.uploading}
                  className={`px-4 py-2 rounded-md text-white text-sm ${
                    color.pendingFile && !color.uploading
                      ? "bg-[#2F3A4A] hover:bg-[#232c39]"
                      : "bg-gray-300 cursor-not-allowed"
                  }`}
                >
                  {color.uploading ? "جارٍ الرفع..." : "رفع"}
                </button>
                <button
                  type="button"
                  onClick={() => cancelPendingColorFile(index)}
                  disabled={!color.pendingFile || color.uploading}
                  className={`px-4 py-2 rounded-md text-sm border ${
                    color.pendingFile && !color.uploading
                      ? "bg-gray-100 hover:bg-gray-200"
                      : "bg-gray-100 opacity-60 cursor-not-allowed"
                  }`}
                >
                  إلغاء الاختيار
                </button>
              </div>

              {color.pendingPreview && (
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-600">
                    معاينة (لم تُرفع بعد):
                  </span>
                  <img
                    src={color.pendingPreview}
                    alt="pending"
                    className="w-16 h-16 object-cover rounded border"
                  />
                </div>
              )}

              {color.images.length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {color.images.map((img, imgIdx) => (
                    <div key={imgIdx} className="relative">
                      <img
                        src={fullUrl(img)}
                        alt={`color-${index}-img-${imgIdx}`}
                        className="w-20 h-20 object-cover rounded border"
                      />
                      <button
                        type="button"
                        title="حذف الصورة"
                        onClick={() => removeColorImage(index, imgIdx)}
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
                onClick={() => deleteColorInput(index)}
                className="w-full px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded"
              >
                حذف اللون
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={addColorInput}
            className="w-full mt-3 px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded"
          >
            إضافة لون
          </button>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading}
          className="block w-full mt-4 bg-[#A67C52] text-white py-3 rounded hover:bg-[#8a5d3b] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#A67C52] active:scale-95 transition duration-200 disabled:opacity-60"
        >
          {isLoading ? "جارٍ الإضافة..." : "إضافة المنتج"}
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
