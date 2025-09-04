// ManageProducts.jsx
// -----------------------------------------------------------------------------
// Purpose: Admin screen to list, search, and manage products (edit/delete).
// Features:
//   - Dual search (by title in any language, and by product ID).
//   - Shows category, colors (localized), price, and total stock.
//   - Edit (Link) and Delete (Swal-confirmed) actions.
// Notes:
//   - "Content unchanged": logic, strings, and behavior remain the same.
//   - Only formatting, grouping, and comments were added for readability.
// -----------------------------------------------------------------------------

import { Link } from "react-router-dom";
import {
  useDeleteProductMutation,
  useGetAllProductsQuery,
} from "../../../redux/features/products/productsApi";
import Swal from "sweetalert2";
import { getImgUrl } from "../../../utils/getImgUrl";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { productEventsActions } from "../../../redux/features/products/productEventsSlice";
import "../../../Styles/StylesManageProducts.css";

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------
const ManageProducts = () => {
  // ---------------------------------------------------------------------------
  // RTK Query: load products + mutation for delete
  // ---------------------------------------------------------------------------
  const { data: products = [], isLoading, isError, refetch } =
    useGetAllProductsQuery();
  const [deleteProduct, { isLoading: deleting }] = useDeleteProductMutation();

  // ---------------------------------------------------------------------------
  // i18n / Redux
  // ---------------------------------------------------------------------------
  const { i18n } = useTranslation();
  const lang = i18n.language;
  const dispatch = useDispatch();
  const shouldRefetch = useSelector(
    (state) => state.productEvents.shouldRefetch
  );

  // ---------------------------------------------------------------------------
  // Constants / Local state
  // ---------------------------------------------------------------------------
  const categoryMapping = {
    Men: "Hommes",
    Women: "Femmes",
    Children: "Enfants",
  };

  // Dual search inputs
  const [searchTerm, setSearchTerm] = useState("");
  const [searchId, setSearchId] = useState("");

  // ---------------------------------------------------------------------------
  // Effects
  // ---------------------------------------------------------------------------

  // React to global "shouldRefetch" events (e.g., after create/update elsewhere)
  useEffect(() => {
    if (shouldRefetch) {
      refetch();
      dispatch(productEventsActions.resetRefetch());
    }
  }, [shouldRefetch, refetch, dispatch]);

  // Force LTR for this admin view (per original code)
  useEffect(() => {
    document.documentElement.dir = "ltr";
  }, []);

  // ---------------------------------------------------------------------------
  // Handlers
  // ---------------------------------------------------------------------------

  // Delete confirmation flow for a product
  const handleDeleteProduct = async (id) => {
    const confirmResult = await Swal.fire({
      title: "Êtes-vous sûr ?",
      text: "Vous ne pourrez pas revenir en arrière !",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Oui, supprimez-le !",
    });

    if (confirmResult.isConfirmed) {
      try {
        await deleteProduct(id).unwrap();
        Swal.fire("Supprimé !", "Le produit a été supprimé.", "success");
        refetch();
      } catch (error) {
        Swal.fire(
          "Erreur !",
          error?.data?.message ||
            "Échec de la suppression du produit. Veuillez réessayer.",
          "error"
        );
      }
    }
  };

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------
  return (
    <section className="p-4 bg-gray-100 min-h-screen font-sans">
      {/* --------------------------------------------------------------------- */}
      {/* 🔍 Dual Search Inputs */}
      {/* --------------------------------------------------------------------- */}
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <input
          type="text"
          placeholder="🔍 Rechercher par titre du produit..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border border-gray-300 rounded-md w-full md:max-w-sm"
        />
        <input
          type="text"
          placeholder="🔎 Rechercher par ID du produit..."
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
          className="p-2 border border-gray-300 rounded-md w-full md:max-w-sm"
        />
      </div>

      {/* --------------------------------------------------------------------- */}
      {/* 📦 Products Table */}
      {/* --------------------------------------------------------------------- */}
      <div className="w-full overflow-x-auto">
        <table className="min-w-[900px] w-full text-left border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200 text-gray-700 font-semibold">
              <th className="p-4 border border-gray-300">#</th>
              <th className="p-4 border border-gray-300">ID Produit</th>
              <th className="p-4 border border-gray-300">Produit</th>
              <th className="p-4 border border-gray-300">Catégorie</th>
              <th className="p-4 border border-gray-300">Couleurs</th>
              <th className="p-4 border border-gray-300">Prix</th>
              <th className="p-4 border border-gray-300">Stock (Total)</th>
              <th className="p-4 border border-gray-300">Actions</th>
            </tr>
          </thead>

          <tbody>
            {/* Loading row */}
            {isLoading && (
              <tr>
                <td
                  colSpan="8"
                  className="text-center p-6 border border-gray-300"
                >
                  Chargement des produits...
                </td>
              </tr>
            )}

            {/* Data rows */}
            {!isLoading && products?.length > 0 ? (
              products
                .filter((product) => {
                  // Title (multi-lingual) match
                  const lowerSearch = searchTerm.toLowerCase();
                  const matchesTitle = [product.title, product.translations?.fr?.title, product.translations?.ar?.title]
                    .filter(Boolean) // drop null/undefined
                    .map((t) => t.toLowerCase())
                    .some((title) => title.includes(lowerSearch));

                  // ID match
                  const matchesId = product._id
                    ?.toLowerCase()
                    .includes(searchId.toLowerCase());

                  return matchesTitle && matchesId;
                })
                .map((product, index) => {
                  // Sum total stock across colors
                  const totalStock = product.colors?.reduce(
                    (sum, color) => sum + (color?.stock || 0),
                    0
                  );

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

                      {/* Title + image */}
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

                      {/* Category (mapped to FR labels) */}
                      <td className="p-4 border border-gray-300 align-middle capitalize text-gray-700">
                        {categoryMapping[product.category] || "Non classifié"}
                      </td>

                      {/* Colors (localized + chip) */}
                      <td className="p-4 border border-gray-300 align-middle">
                        <div className="flex flex-wrap items-center gap-4">
                          {product.colors?.length > 0 ? (
                            [...product.colors]
                              .sort((a, b) => {
                                const aName =
                                  a.colorName?.[lang] ||
                                  a.colorName?.en ||
                                  "";
                                const bName =
                                  b.colorName?.[lang] ||
                                  b.colorName?.en ||
                                  "";
                                return aName.localeCompare(bName);
                              })
                              .map((color, idx) => (
                                <div key={idx} className="flex items-center gap-2">
                                  <div
                                    className="w-4 h-4 rounded-full border"
                                    style={{ backgroundColor: color.hex || "#fff" }}
                                  />
                                  <span className="text-sm text-gray-700">
                                    {color.colorName?.[lang] ||
                                      color.colorName?.en ||
                                      "Défaut"}
                                  </span>
                                </div>
                              ))
                          ) : (
                            <span className="text-gray-500">Par défaut</span>
                          )}
                        </div>
                      </td>

                      {/* Price */}
                      <td className="p-4 border border-gray-300 align-middle text-green-600 font-semibold">
                        ${product.newPrice}
                      </td>

                      {/* Total stock */}
                      <td className="p-4 border border-gray-300 align-middle">
                        <span
                          className={
                            totalStock === 0
                              ? "text-red-500 font-medium"
                              : "text-yellow-600 font-medium"
                          }
                        >
                          {totalStock > 0
                            ? `${totalStock} en stock`
                            : "Rupture de stock"}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="p-4 border border-gray-300 align-middle">
                        <div className="flex gap-2 sm:gap-4">
                          <Link
                            to={`/dashboard/edit-product/${product._id}`}
                            className="action-button btn-edit"
                          >
                            Modifier
                          </Link>

                          <button
                            onClick={() => handleDeleteProduct(product._id)}
                            disabled={deleting}
                            className="action-button btn-delete"
                          >
                            {deleting ? "Suppression..." : "Supprimer"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
            ) : (
              // Empty state (no products)
              !isLoading && (
                <tr>
                  <td
                    colSpan="8"
                    className="text-center p-6 border border-gray-300"
                  >
                    Aucun produit trouvé.
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

// -----------------------------------------------------------------------------
// Export
// -----------------------------------------------------------------------------
export default ManageProducts;
