import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useAddProductMutation } from "../../../redux/features/products/productsApi";
import Swal from "sweetalert2";
import axios from "axios";
import imageCompression from "browser-image-compression";
import getBaseUrl from "../../../utils/baseURL";
import "../../../Styles/StylesAddProduct.css";



const AddProduct = () => {
  const { register, handleSubmit, reset } = useForm();
  const [coverImageFile, setCoverImageFile] = useState(null);
  const [coverPreviewURL, setCoverPreviewURL] = useState("");
  const [colorInputs, setColorInputs] = useState([]);
  const [addProduct, { isLoading }] = useAddProductMutation();

  // ✅ compresse l'image avant upload
  const compressImage = async (file) => {
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1024,
      useWebWorker: true,
    };
    return await imageCompression(file, options);
  };

  const handleCoverImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setCoverImageFile(file);
      const url = URL.createObjectURL(file);
      setCoverPreviewURL(url);
    } else {
      setCoverImageFile(null);
      setCoverPreviewURL("");
    }
  };

  const handleColorInputChange = (index, field, value) => {
    const newInputs = [...colorInputs];
    if (field === "imageFile" && value instanceof File && value.type.startsWith("image/")) {
      newInputs[index][field] = value;
      newInputs[index].previewURL = URL.createObjectURL(value);
    } else {
      newInputs[index][field] = value;
    }
    setColorInputs(newInputs);
  };

  const addColorInput = () => {
    setColorInputs([
      ...colorInputs,
      { colorName: "", imageFile: null, previewURL: "", stock: 0 },
    ]);
  };

  const deleteColorInput = (index) => {
    setColorInputs(colorInputs.filter((_, i) => i !== index));
  };

  const uploadImage = async (file) => {
    if (!file || !(file instanceof File) || !file.type.startsWith("image/")) return "";

    try {
      const compressedFile = await compressImage(file);

      const formData = new FormData();
      formData.append("image", compressedFile);

      const res = await axios.post(`${getBaseUrl()}/api/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return res.data.image;
    } catch (error) {
      console.error("❌ Image upload failed:", error);
      Swal.fire("Erreur", "Échec de l’envoi de l’image. Vérifiez la taille ou la connexion.", "error");
      return "";
    }
  };

  const onSubmit = async (data) => {
    try {
      let coverImageUploadPromise = null;
      if (coverImageFile instanceof File && coverImageFile.type.startsWith("image/")) {
        coverImageUploadPromise = uploadImage(coverImageFile);
      }

      const colorUploadPromises = colorInputs.map(async (colorInput) => {
        if (colorInput.imageFile instanceof File && colorInput.colorName && colorInput.stock >= 0) {
          const imageUrl = await uploadImage(colorInput.imageFile);
          return {
            colorName: colorInput.colorName, // anglais uniquement
            image: imageUrl,
            stock: Number(colorInput.stock),
          };
        }
        return null;
      });

      const [coverImage, colorsArray] = await Promise.all([
        coverImageUploadPromise,
        Promise.all(colorUploadPromises),
      ]);

      const filteredColors = colorsArray.filter(Boolean);

      const allowedCategories = ["Men", "Women", "Children"];
      const finalCategory = allowedCategories.includes(data.category) ? data.category : "Men";

      const newProductData = {
        title: data.title,
        description: data.description,
        category: finalCategory,
        coverImage,
        colors: filteredColors,
        oldPrice: Number(data.oldPrice),
        newPrice: Number(data.newPrice),
        stockQuantity: filteredColors[0]?.stock || 0,
        trending: data.trending || false,
      };

      await addProduct(newProductData).unwrap();
      Swal.fire("Succès", "Produit ajouté avec succès !", "success");

      reset();
      setCoverImageFile(null);
      setCoverPreviewURL("");
      setColorInputs([]);
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
      <h2 className="text-2xl font-bold text-center text-[#A67C52] mb-4">Ajouter un Nouveau Produit</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input {...register("title")} className="w-full p-2 border rounded" placeholder="Nom du Produit" required />
        
        <textarea {...register("description")} className="w-full p-2 border rounded" placeholder="Description" required />
        
        <select {...register("category")} className="w-full p-2 border rounded" required>
          <option value="">Sélectionner une Catégorie</option>
          <option value="Men">Homme</option>
          <option value="Women">Femme</option>
          <option value="Children">Enfants</option>
        </select>

        <div className="grid grid-cols-2 gap-4">
          <input {...register("oldPrice")} type="number" className="w-full p-2 border rounded" placeholder="Ancien Prix" required />
          <input {...register("newPrice")} type="number" className="w-full p-2 border rounded" placeholder="Nouveau Prix" required />
        </div>

        <label className="flex items-center">
          <input type="checkbox" {...register("trending")} className="mr-2" />
          Produit Tendance
        </label>

        {/* Cover Image Upload */}
        <label className="block font-medium">Image Principale</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleCoverImageChange}
          className="w-full p-2 border rounded"
          required
        />
        {coverPreviewURL && (
          <img
            src={coverPreviewURL}
            alt="Aperçu de l'Image"
            className="w-32 h-32 mt-2 object-cover rounded border"
          />
        )}

        {/* Color Inputs */}
        <label className="block font-medium">Couleurs du Produit</label>
        {colorInputs.map((input, index) => (
          <div key={index} className="space-y-2 border border-gray-300 p-3 rounded-md">
            <input
              type="text"
              placeholder="Nom de la Couleur (EN)"
              className="w-full p-2 border rounded"
              value={input.colorName}
              onChange={(e) => handleColorInputChange(index, "colorName", e.target.value)}
              required
            />

            <input
              type="number"
              placeholder="Quantité en stock"
              value={input.stock}
              onChange={(e) => handleColorInputChange(index, "stock", Number(e.target.value))}
              className="w-full p-2 border rounded"
              required
            />

            <input
              type="file"
              accept="image/*"
              className="w-full p-2 border rounded"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file && file.type.startsWith("image/")) {
                  handleColorInputChange(index, "imageFile", file);
                }
              }}
              required
            />

            {input.previewURL && (
              <img
                src={input.previewURL}
                alt="Aperçu de la Couleur"
                className="w-20 h-20 mt-1 object-cover rounded border"
              />
            )}

            <button
              type="button"
              onClick={() => deleteColorInput(index)}
              className="px-3 py-1 bg-red-500 text-white rounded"
            >
              Supprimer la Couleur
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={addColorInput}
          className="px-3 py-2 bg-gray-300 rounded"
        >
          Ajouter une Couleur
        </button>

        {/* Submit Button */}
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
