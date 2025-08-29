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

  // Cover
  const [coverImageFile, setCoverImageFile] = useState(null);
  const [coverPreviewURL, setCoverPreviewURL] = useState("");

  // Colors
  const [colorInputs, setColorInputs] = useState([
    { colorName: "", stock: 0, images: [], pendingFile: null, pendingPreview: "", uploading: false },
  ]);

  // ------- utils -------
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
      return res.data.image; // server returns relative path or full URL
    } catch (err) {
      console.error("❌ Image upload failed:", err);
      Swal.fire("Erreur", "Échec de l’envoi de l’image. Réessayez.", "error");
      return "";
    }
  };

  // ------- cover handlers -------
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

  // ------- color handlers -------
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

  // ------- submit -------
  const onSubmit = async (data) => {
    try {
      // upload cover if selected
      let coverImage = "";
      if (coverImageFile) {
        coverImage = await uploadImage(coverImageFile);
      }

      // build colors payload
      const preparedColors = colorInputs
        .filter((c) => c.colorName && (c.images.length > 0 || c.pendingFile)) // at least one image intended
        .map((c) => {
          const images = [...c.images]; // already uploaded images
          // If user forgot to click "Upload" for the pending image, try to upload it now:
          return { ...c, images };
        });

      // opportunistic upload of any leftover pending files (if any)
      for (let i = 0; i < preparedColors.length; i++) {
        const color = colorInputs[i];
        if (color.pendingFile) {
          const url = await uploadImage(color.pendingFile);
          if (url) preparedColors[i].images.push(url);
        }
      }

      const colorsForServer = preparedColors.map((c) => ({
        colorName: c.colorName, // EN name; backend will translate
        image: c.images[0] || "", // first image as "main"
        images: c.images, // full gallery for this color
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
        stockQuantity: colorsForServer[0]?.stock || 0,
        trending: !!data.trending,
      };

      await addProduct(payload).unwrap();

      Swal.fire("Succès", "Produit ajouté avec succès !", "success");
      reset();
      setCoverImageFile(null);
      setCoverPreviewURL("");
      setColorInputs([
        { colorName: "", stock: 0, images: [], pendingFile: null, pendingPreview: "", uploading: false },
      ]);
    } catch (error) {
      console.error("❌ Error adding product:", error?.data || error);
      Swal.fire("Erreur", "Échec de l’ajout du produit.", "error");
    }
  };

  useEffect(() => {
    document.documentElement.dir = "ltr";
  }, []);

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
              required
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
                        src={img.startsWith("http") ? img : `${getBaseUrl()}${img}`}
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
