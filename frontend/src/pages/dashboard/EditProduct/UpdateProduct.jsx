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
import getBaseUrl from "../../../utils/baseURL";

const UpdateProduct = () => {
  const { id } = useParams();
  const { data: productData, isLoading, isError, refetch } = useGetProductByIdQuery(id);
  const { register, handleSubmit, setValue } = useForm();
  const [updateProduct, { isLoading: updating }] = useUpdateProductMutation();

  const [imageFile, setImageFile] = useState(null);
  const [previewURL, setPreviewURL] = useState("");
  const [colors, setColors] = useState([]);

  useEffect(() => {
    if (productData) {
      setValue("title", productData.title);
      setValue("description", productData.description);
      setValue("category", productData.category);
      setValue("trending", productData.trending);
      setValue("oldPrice", productData.oldPrice);
      setValue("newPrice", productData.newPrice);
      setValue("stockQuantity", productData.stockQuantity);

      let coverImageUrl = productData.coverImage || "";
      if (coverImageUrl) {
        setPreviewURL(
          coverImageUrl.startsWith("http")
            ? coverImageUrl
            : `${getBaseUrl()}${coverImageUrl}`
        );
      }

      if (Array.isArray(productData.colors)) {
        const formattedColors = productData.colors.map((color) => ({
          colorName:
            typeof color.colorName === "object"
              ? color.colorName.en
              : color.colorName || "",
          image: color.image || "",
          stock: color.stock || 0,
          imageFile: null,
          previewURL:
            color.image && color.image.startsWith("http")
              ? color.image
              : `${getBaseUrl()}${color.image}`,
        }));
        setColors(formattedColors);
      }
    }
  }, [productData, setValue]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreviewURL(URL.createObjectURL(file));
    }
  };

  const handleColorChange = (index, field, value) => {
    const updatedColors = [...colors];
    if (field === "imageFile") {
      updatedColors[index][field] = value;
      updatedColors[index].previewURL = URL.createObjectURL(value);
    } else {
      updatedColors[index][field] = value;
    }
    setColors(updatedColors);
  };

  const addColor = () => {
    setColors([
      ...colors,
      { colorName: "", stock: 0, imageFile: null, previewURL: "" },
    ]);
  };

  const deleteColor = (index) => {
    setColors(colors.filter((_, i) => i !== index));
  };

  const uploadImage = async (file) => {
    if (!file) return "";
    const formData = new FormData();
    formData.append("image", file);
    const res = await axios.post(`${getBaseUrl()}/api/upload`, formData);
    return res.data.image;
  };

  const onSubmit = async (data) => {
    let coverImage = productData.coverImage || "";
    if (imageFile) {
      coverImage = await uploadImage(imageFile);
    }

    const updatedColors = await Promise.all(
      colors.map(async (color) => {
        let imageUrl = color.image || "";
        if (color.imageFile) {
          imageUrl = await uploadImage(color.imageFile);
        }

        return {
          colorName: color.colorName, // ✅ Send as EN string, let backend translate
          image: imageUrl,
          stock: Number(color.stock) || 0,
        };
      })
    );

    const allowedCategories = ["Men", "Women", "Children"];
    const finalCategory = allowedCategories.includes(data.category)
      ? data.category
      : "Men";

    const updatedProductData = {
      ...data,
      category: finalCategory,
      coverImage,
      colors: updatedColors,
      oldPrice: Number(data.oldPrice),
      newPrice: Number(data.newPrice),
      stockQuantity: updatedColors[0]?.stock || 0, // ✅ Use first color's stock
    };

    try {
      await updateProduct({ id, ...updatedProductData }).unwrap();
      Swal.fire("Succès !", "Produit mis à jour avec succès !", "success");
      refetch();
    } catch (error) {
      Swal.fire("Erreur !", "Échec de la mise à jour du produit.", "error");
    }
  };

  useEffect(() => {
    document.documentElement.dir = "ltr";
  }, []);
  


if (isLoading) return <Loading />;
if (isError) return <div className="text-center text-red-500">Erreur lors de la récupération des données du produit.</div>;


return (
  <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md">
    <h2 className="text-2xl font-bold text-center text-[#A67C52] mb-4">Mettre à Jour le Produit</h2>
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

      <label className="font-semibold text-gray-700">Nom du Produit</label>
      <input {...register("title")} className="w-full p-2 border rounded" required />

      <label className="font-semibold text-gray-700">Description</label>
      <textarea {...register("description")} className="w-full p-2 border rounded" required />

      <label className="font-semibold text-gray-700">Catégorie</label>
      <select {...register("category")} className="w-full p-2 border rounded" required>
        <option value="">Sélectionner une Catégorie</option>
        <option value="Men">Homme</option>
        <option value="Women">Femme</option>
        <option value="Children">Enfants</option>
      </select>

      <label className="font-semibold text-gray-700">Ancien Prix (USD)</label>
      <input {...register("oldPrice")} type="number" className="w-full p-2 border rounded" required />

      <label className="font-semibold text-gray-700">Nouveau Prix (USD)</label>
      <input {...register("newPrice")} type="number" className="w-full p-2 border rounded" required />

      <label className="font-semibold text-gray-700">Quantité en Stock (Totale)</label>
      <input {...register("stockQuantity")} type="number" className="w-full p-2 border rounded" min="0" required />

      <label className="flex items-center justify-center w-full">
        <input type="checkbox" {...register("trending")} className="mr-2" />
        Définir comme Produit Tendance
      </label>

      <label className="font-semibold text-gray-700">Image Principale</label>
      <input type="file" accept="image/*" onChange={handleFileChange} className="w-full p-2 border rounded" />
      {previewURL && (
        <img
          src={previewURL}
          alt="Aperçu"
          className="w-64 h-64 object-cover border rounded-md mt-4 mx-auto"
        />
      )}

      <label className="font-semibold text-gray-700">Couleurs</label>
      {colors.map((color, index) => (
        <div key={index} className="space-y-2 border p-3 rounded-md">
          <input
            type="text"
            value={color.colorName}
            onChange={(e) => handleColorChange(index, "colorName", e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Nom de la Couleur (EN)"
            required
          />

          <input
            type="number"
            value={color.stock}
            onChange={(e) => handleColorChange(index, "stock", Number(e.target.value))}
            className="w-full p-2 border rounded"
            placeholder="Stock pour cette couleur"
            required
          />

          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleColorChange(index, "imageFile", e.target.files[0])}
            className="w-full p-2 border rounded"
          />

          {color.previewURL && (
            <img
              src={color.previewURL}
              alt="Aperçu de la Couleur"
              className="w-20 h-20 mt-2 object-cover border rounded"
            />
          )}

          <button
            type="button"
            onClick={() => deleteColor(index)}
            className="px-3 py-1 bg-red-500 text-white rounded"
          >
            Supprimer la Couleur
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={addColor}
        className="px-3 py-2 bg-gray-300 rounded"
      >
        Ajouter une Couleur
      </button>

      <button
        type="submit"
        className="w-full py-2 bg-[#A67C52] text-white rounded-md hover:bg-[#8a5d3b] transition-colors duration-300"
      >
        {updating ? "Mise à jour en cours..." : "Mettre à Jour le Produit"}
      </button>
    </form>
  </div>
);
};

export default UpdateProduct;
