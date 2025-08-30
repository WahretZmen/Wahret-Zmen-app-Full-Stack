// src/pages/dashboard/products/AddProduct.jsx
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useAddProductMutation } from "../../../redux/features/products/productsApi";
import Swal from "sweetalert2";
import axios from "axios";
import imageCompression from "browser-image-compression";
import getBaseUrl from "../../../utils/baseURL";
import "../../../Styles/StylesAddProduct.css";

const AddProduct = () => {
  const { register, handleSubmit, reset } = useForm();
  const [addProduct, { isLoading }] = useAddProductMutation();

  // ---- Cover image state ----
  const [coverImageFile, setCoverImageFile] = useState(null);
  const [coverPreviewURL, setCoverPreviewURL] = useState("");

  // ---- Colors state ----
  /**
   * Each color element:
   * {
   *   colorName: string,         // EN source; backend will translate
   *   stock: number,
   *   images: string[],          // uploaded URLs for this color
   *   pendingFile: File|null,    // selected but not uploaded yet
   *   pendingPreview: string,    // objectURL for preview
   *   uploading: boolean
   * }
   */
  const [colorInputs, setColorInputs] = useState([
    { colorName: "", stock: 0, images: [], pendingFile: null, pendingPreview: "", uploading: false },
  ]);

  // ================= Utils =================
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
      // server returns a relative path or full URL in res.data.image
      return res.data.image;
    } catch (err) {
      console.error("❌ Image upload failed:", err);
      Swal.fire("Erreur", "Échec de l’envoi de l’image. Réessayez.", "error");
      return "";
    }
  };

  // ================= Cover handlers =================
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

  // ================= Color handlers =================
  const setColorAt = (index, patch) => {
    setColorInputs((prev) => prev.map((c, i) => (i === index ? { ...c, ...patch } : c)));
  };

  const addColorInput = () => {
    setColorInputs((prev) => [
      ...prev,
      { colorName: "", stock: 0, images: [], pendingFile: null, pendingPreview: "", uploading: false },
    ]);
  };

  const deleteColorInput = (index) => {
    setColorInputs((prev) => prev.filter((_, i) => i !== index));
  };

  const handleColorFieldChange = (index, field, value) => {
    setColorAt(index, { [field]: value });
  };

  const handlePickColorFile = (index, file) => {
    if (file && file.type.startsWith("image/")) {
      setColorAt(index, { pendingFile: file, pendingPreview: URL.createObjectURL(file) });
    }
  };

  const cancelPendingColorFile = (index) => {
    setColorAt(index, { pendingFile: null, pendingPreview: "" });
  };

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
        });
      }
    } finally {
      setColorAt(index, { uploading: false });
    }
  };

  const removeUploadedImage = (colorIndex, imgIndex) => {
    setColorInputs((prev) =>
      prev.map((c, i) =>
        i === colorIndex ? { ...c, images: c.images.filter((_, j) => j !== imgIndex) } : c
      )
    );
  };

  // ================= Submit =================
  const onSubmit = async (data) => {
    try {
      // 1) Upload cover if selected
      let coverImage = "";
      if (coverImageFile) {
        coverImage = await uploadImage(coverImageFile);
      }

      // 2) Build filtered copy of colors (keep only valid rows)
      const preparedColors = colorInputs
        .filter((c) => c.colorName && (c.images.length > 0 || c.pendingFile))
        .map((c) => ({ ...c, images: [...c.images] })); // clone arrays

      // 3) ✅ Upload any leftover pending files **on preparedColors itself** (fixed index bug)
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

      // 4) Guards
      if (preparedColors.length === 0) {
        Swal.fire("Données manquantes", "Ajoutez au moins une couleur avec une image.", "warning");
        return;
      }

      if (preparedColors.some((c) => !Array.isArray(c.images) || c.images.length === 0)) {
        Swal.fire("Image manquante", "Chaque couleur doit avoir au moins une image.", "warning");
        return;
      }

      // If cover is still empty, use first color's first image
      if (!coverImage) {
        coverImage = preparedColors[0]?.images?.[0] || "";
      }
      if (!coverImage) {
        Swal.fire("Image principale", "Veuillez fournir une image principale.", "warning");
        return;
      }

      // 5) Map payload for server
      const colorsForServer = preparedColors.map((c) => ({
        colorName: c.colorName,         // EN; backend translates to FR/AR
        image: c.images[0] || "",       // main image for that color
        images: c.images,               // full gallery for the color
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
        stockQuantity: colorsForServer.reduce((sum, c) => sum + (c.stock || 0), 0),
        trending: !!data.trending,
      };

      // 6) Send
      await addProduct(payload).unwrap();

      // 7) Done
      Swal.fire("Succès", "Produit ajouté avec succès !", "success");
      reset();
      setCoverImageFile(null);
      setCoverPreviewURL("");
      setColorInputs([
        { colorName: "", stock: 0, images: [], pendingFile: null, pendingPreview: "", uploading: false },
      ]);
    } catch (error) {
      console.error("❌ Error adding product:", error?.data || error);
      Swal.fire("Erreur", error?.data?.message || "Échec de l’ajout du produit.", "error");
    }
  };

  useEffect(() => {
    // Force LTR in dashboard
    document.documentElement.dir = "ltr";
  }, []);

  // Helper to show uploaded images whether URL is relative or absolute
  const fullUrl = (url) => (url?.startsWith("http") ? url : `${getBaseUrl()}${url}`);

  return (
    <div className="max-w-md mx-auto p-4 bg-white rounded-lg shadow-md w-full">
      <h2 className="text-2xl font-bold text-center text-[#A67C52] mb-4">
        Ajouter un Nouveau Produit
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input
          {...register("title")}
          className="w-full p-2 border rounded"
          placeholder="Nom du Produit"
          required
        />

        <textarea
          {...register("description")}
          className="w-full p-2 border rounded"
          placeholder="Description"
          required
        />

        <select {...register("category")} className="w-full p-2 border rounded" required>
          <option value="">Sélectionner une Catégorie</option>
          <option value="Men">Homme</option>
          <option value="Women">Femme</option>
          <option value="Children">Enfants</option>
        </select>

        <div className="grid grid-cols-2 gap-4">
          <input
            {...register("oldPrice")}
            type="number"
            className="w-full p-2 border rounded"
            placeholder="Ancien Prix"
            required
          />
          <input
            {...register("newPrice")}
            type="number"
            className="w-full p-2 border rounded"
            placeholder="Nouveau Prix"
            required
          />
        </div>

        <label className="flex items-center">
          <input type="checkbox" {...register("trending")} className="mr-2" />
          Produit Tendance
        </label>

        {/* ===== Cover image ===== */}
        <div>
          <label className="block font-medium mb-1">Image Principale</label>
          <div className="flex items-center gap-2">
            <label
              htmlFor="cover-file"
              className="inline-flex items-center px-3 py-2 rounded-md border border-gray-300 bg-gray-50 hover:bg-gray-100 text-sm cursor-pointer"
            >
              Choisir une image
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
                Annuler la sélection
              </button>
            )}
          </div>

          {coverPreviewURL && (
            <img
              src={coverPreviewURL}
              alt="Aperçu de l'Image"
              className="w-32 h-32 mt-2 object-cover rounded border"
            />
          )}
        </div>

        {/* ===== Colors ===== */}
        <div>
          <label className="block font-medium mb-2">Couleurs du Produit</label>

          {colorInputs.map((color, index) => (
            <div key={index} className="space-y-3 border border-gray-200 p-3 rounded-md">
              <input
                type="text"
                placeholder="Nom de la Couleur (EN)"
                className="w-full p-2 border rounded"
                value={color.colorName}
                onChange={(e) => handleColorFieldChange(index, "colorName", e.target.value)}
                required
              />

              <input
                type="number"
                placeholder="Quantité en stock"
                className="w-full p-2 border rounded"
                value={color.stock}
                onChange={(e) =>
                  handleColorFieldChange(index, "stock", Number(e.target.value) || 0)
                }
                required
              />

              {/* File picker row */}
              <div className="flex items-center gap-2">
                <input
                  id={`color-file-${index}`}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handlePickColorFile(index, e.target.files?.[0])}
                />
                <label
                  htmlFor={`color-file-${index}`}
                  className="inline-flex items-center px-3 py-2 rounded-md border border-gray-300 bg-gray-50 hover:bg-gray-100 text-sm cursor-pointer"
                >
                  Choisir une image
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
                  {color.uploading ? "Envoi..." : "Upload"}
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
                  Annuler la sélection
                </button>
              </div>

              {/* Pending preview */}
              {color.pendingPreview && (
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-600">Aperçu (non envoyé) :</span>
                  <img
                    src={color.pendingPreview}
                    alt="pending"
                    className="w-16 h-16 object-cover rounded border"
                  />
                </div>
              )}

              {/* Uploaded images grid */}
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
                        title="Supprimer l'image"
                        onClick={() => removeUploadedImage(index, imgIdx)}
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
                Supprimer la Couleur
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={addColorInput}
            className="w-full mt-3 px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded"
          >
            Ajouter une Couleur
          </button>
        </div>

        <button
          type="submit"
          className="block w-full mt-4 bg-[#A67C52] text-white py-3 rounded hover:bg-[#8a5d3b] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#A67C52] active:scale-95 transition duration-200"
        >
          {isLoading ? "Ajout en cours..." : "Ajouter le Produit"}
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
