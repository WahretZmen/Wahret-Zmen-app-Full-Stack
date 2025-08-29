// src/pages/dashboard/products/UpdateProduct.jsx
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
  const { data: productData, isLoading, isError, refetch } = useGetProductByIdQuery(id);
  const { register, handleSubmit, setValue } = useForm();
  const [updateProduct, { isLoading: updating }] = useUpdateProductMutation();

  // Cover image
  const [coverFile, setCoverFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState("");

  // Colors state
  /**
   * each color:
   * {
   *   colorName: string (EN),
   *   stock: number,
   *   images: string[],          // uploaded URLs for this color
   *   pendingFile: File|null,    // not-yet-uploaded
   *   pendingPreview: string,    // objectURL
   *   uploading: boolean
   * }
   */
  const [colors, setColors] = useState([]);

  // ---------- helpers ----------
  const compressImage = async (file) => {
    const options = { maxSizeMB: 1, maxWidthOrHeight: 1024, useWebWorker: true };
    return await imageCompression(file, options);
  };

  const uploadImage = async (file) => {
    if (!file) return "";
    try {
      const compressed = await compressImage(file);
      const formData = new FormData();
      formData.append("image", compressed);
      const res = await axios.post(`${getBaseUrl()}/api/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data.image; // relative path or full URL
    } catch (err) {
      console.error("❌ Image upload failed:", err);
      Swal.fire("Erreur", "Échec de l’envoi de l’image. Réessayez.", "error");
      return "";
    }
  };

  const fullUrl = (url) => (url?.startsWith("http") ? url : `${getBaseUrl()}${url}`);

  // ---------- init from API ----------
  useEffect(() => {
    if (!productData) return;

    // fill simple fields
    setValue("title", productData.title);
    setValue("description", productData.description);
    setValue("category", productData.category);
    setValue("trending", !!productData.trending);
    setValue("oldPrice", productData.oldPrice);
    setValue("newPrice", productData.newPrice);
    setValue("stockQuantity", productData.stockQuantity || 0);

    // cover preview
    const cover = productData.coverImage || "";
    setCoverPreview(cover ? fullUrl(cover) : "");

    // prepare colors with images array
    const prepared =
      Array.isArray(productData.colors) && productData.colors.length
        ? productData.colors.map((c) => {
            const name =
              typeof c.colorName === "object" ? c.colorName.en : c.colorName || "";
            const imgs =
              Array.isArray(c.images) && c.images.length
                ? c.images
                : c.image
                ? [c.image]
                : [];
            return {
              colorName: name,
              stock: Number(c.stock) || 0,
              images: imgs, // keep as relative; we’ll display with fullUrl
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
  }, [productData, setValue]);

  // ---------- small state utils ----------
  const setColorAt = (index, patch) => {
    setColors((prev) => prev.map((c, i) => (i === index ? { ...c, ...patch } : c)));
  };

  const handleColorField = (index, field, value) => setColorAt(index, { [field]: value });

  const addColor = () =>
    setColors((prev) => [
      ...prev,
      { colorName: "", stock: 0, images: [], pendingFile: null, pendingPreview: "", uploading: false },
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
        });
      }
    } finally {
      setColorAt(index, { uploading: false });
    }
  };

  const removeImage = (cIdx, imgIdx) =>
    setColors((prev) =>
      prev.map((c, i) =>
        i === cIdx ? { ...c, images: c.images.filter((_, j) => j !== imgIdx) } : c
      )
    );

  const handleCover = (e) => {
    const f = e.target.files?.[0];
    if (f && f.type.startsWith("image/")) {
      setCoverFile(f);
      setCoverPreview(URL.createObjectURL(f));
    }
  };

  const cancelCover = () => {
    setCoverFile(null);
    setCoverPreview(productData?.coverImage ? fullUrl(productData.coverImage) : "");
  };

  // ---------- submit ----------
  const onSubmit = async (data) => {
    try {
      // upload cover if changed
      let coverImage = productData.coverImage || "";
      if (coverFile) {
        const url = await uploadImage(coverFile);
        if (url) coverImage = url;
      }

      // opportunistically upload any pending files
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

      const colorsForServer = prepared
        .filter((c) => c.colorName && (c.images.length > 0))
        .map((c) => ({
          colorName: c.colorName, // EN; backend translates
          image: c.images[0] || "",
          images: c.images,
          stock: Number(c.stock) || 0,
        }));

      const allowedCategories = ["Men", "Women", "Children"];
      const finalCategory = allowedCategories.includes(data.category) ? data.category : "Men";

      const payload = {
        title: data.title,
        description: data.description,
        category: finalCategory,
        coverImage,
        colors: colorsForServer,
        oldPrice: Number(data.oldPrice),
        newPrice: Number(data.newPrice),
        stockQuantity: Number(data.stockQuantity) || colorsForServer[0]?.stock || 0,
        trending: !!data.trending,
      };

      await updateProduct({ id, ...payload }).unwrap();

      Swal.fire("Succès !", "Produit mis à jour avec succès !", "success");
      refetch();
    } catch (error) {
      console.error(error);
      Swal.fire("Erreur !", "Échec de la mise à jour du produit.", "error");
    }
  };

  useEffect(() => {
    document.documentElement.dir = "ltr";
  }, []);

  if (isLoading) return <Loading />;
  if (isError) return <div className="text-center text-red-500">Erreur lors du chargement du produit.</div>;

  return (
    <div className="max-w-md mx-auto p-4 bg-white rounded-lg shadow-md w-full">
      <h2 className="text-2xl font-bold text-center text-[#A67C52] mb-4">
        Mettre à Jour le Produit
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input {...register("title")} className="w-full p-2 border rounded" required />
        <textarea {...register("description")} className="w-full p-2 border rounded" required />

        <select {...register("category")} className="w-full p-2 border rounded" required>
          <option value="">Sélectionner une Catégorie</option>
          <option value="Men">Homme</option>
          <option value="Women">Femme</option>
          <option value="Children">Enfants</option>
        </select>

        <div className="grid grid-cols-2 gap-4">
          <input {...register("oldPrice")} type="number" className="w-full p-2 border rounded" required />
          <input {...register("newPrice")} type="number" className="w-full p-2 border rounded" required />
        </div>

        <input
          {...register("stockQuantity")}
          type="number"
          className="w-full p-2 border rounded"
          min="0"
          placeholder="Quantité en Stock (Totale)"
          required
        />

        <label className="inline-flex items-center">
          <input type="checkbox" {...register("trending")} className="mr-2" />
          Produit Tendance
        </label>

        {/* Cover image */}
        <div>
          <label className="block font-medium mb-1">Image Principale</label>
          <div className="flex items-center gap-2">
            <label
              htmlFor="cover-upload"
              className="inline-flex items-center px-3 py-2 rounded-md border border-gray-300 bg-gray-50 hover:bg-gray-100 text-sm cursor-pointer"
            >
              Choisir une image
            </label>
            <input id="cover-upload" type="file" accept="image/*" className="hidden" onChange={handleCover} />

            {coverPreview && (
              <button
                type="button"
                onClick={cancelCover}
                className="px-3 py-2 rounded-md border text-sm bg-gray-100 hover:bg-gray-200"
              >
                Annuler la sélection
              </button>
            )}
          </div>

          {coverPreview && (
            <img
              src={coverPreview}
              alt="Aperçu"
              className="w-32 h-32 object-cover border rounded mt-2"
            />
          )}
        </div>

        {/* Colors */}
        <div>
          <label className="block font-medium mb-2">Couleurs</label>

          {colors.map((c, index) => (
            <div key={index} className="space-y-3 border border-gray-200 p-3 rounded-md">
              <input
                type="text"
                value={c.colorName}
                onChange={(e) => handleColorField(index, "colorName", e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="Nom de la Couleur (EN)"
                required
              />

              <input
                type="number"
                value={c.stock}
                onChange={(e) => handleColorField(index, "stock", Number(e.target.value) || 0)}
                className="w-full p-2 border rounded"
                placeholder="Stock"
                required
              />

              <div className="flex items-center gap-2">
                <input
                  id={`pick-${index}`}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => pickColorFile(index, e.target.files?.[0])}
                />
                <label
                  htmlFor={`pick-${index}`}
                  className="inline-flex items-center px-3 py-2 rounded-md border border-gray-300 bg-gray-50 hover:bg-gray-100 text-sm cursor-pointer"
                >
                  Choisir une image
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
                  {c.uploading ? "Envoi..." : "Upload"}
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
                  Annuler la sélection
                </button>
              </div>

              {c.pendingPreview && (
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-600">Aperçu (non envoyé) :</span>
                  <img
                    src={c.pendingPreview}
                    alt="pending"
                    className="w-16 h-16 object-cover rounded border"
                  />
                </div>
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
                        title="Supprimer l'image"
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
                Supprimer la Couleur
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={addColor}
            className="w-full mt-3 px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded"
          >
            Ajouter une Couleur
          </button>
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-[#A67C52] text-white rounded-md hover:bg-[#8a5d3b] transition"
        >
          {updating ? "Mise à jour en cours..." : "Mettre à Jour le Produit"}
        </button>
      </form>
    </div>
  );
};

export default UpdateProduct;
