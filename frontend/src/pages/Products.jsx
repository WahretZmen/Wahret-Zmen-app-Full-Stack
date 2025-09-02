import React, { useState, useEffect, useMemo } from "react";
import ProductCard from "../../src/pages/products/ProductCard.jsx";
import { useGetAllProductsQuery } from "../redux/features/products/productsApi.js";
import SelectorsPageProducts from "../components/SelectorProductsPage.jsx";
import SearchInput from "../components/SearchInput.jsx";
import "../Styles/StylesProducts.css";
import { Helmet } from "react-helmet";
import FadeInSection from "../Animations/FadeInSection";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { productEventsActions } from "../redux/features/products/productEventsSlice.js";
import { useLocation } from "react-router-dom";

/* ------------------------ Nice loaders ------------------------ */
const WahretZmenLoader = () => (
  <div className="loader-wrapper w-full">
    <div className="relative w-16 h-16">
      <div className="absolute inset-0 rounded-full border-4 border-t-transparent border-[#D4AF37] animate-spin"></div>
      <div className="absolute inset-2 rounded-full border-2 border-[#A67C52] opacity-40"></div>
      <span className="absolute inset-0 flex items-center justify-center font-serif text-[#D4AF37] text-xl font-bold animate-pulse">
        WZ
      </span>
    </div>
  </div>
);

const InlineWahretZmenLoader = () => (
  <div className="loader-wrapper h-[80px]">
    <div className="relative w-10 h-10">
      <div className="absolute inset-0 rounded-full border-4 border-t-transparent border-[#D4AF37] animate-spin"></div>
      <div className="absolute inset-1 rounded-full border-2 border-[#A67C52] opacity-40"></div>
      <span className="absolute inset-0 flex items-center justify-center font-serif text-[#D4AF37] text-sm font-bold animate-pulse">
        WZ
      </span>
    </div>
  </div>
);

/* ------------------------ Categories & helpers ------------------------ */
const categories = ["All", "Men", "Women", "Children"];

const normalize = (v) => (v || "").toString().trim().toLowerCase();

// map many URL aliases → UI category keys
const CATEGORY_ALIAS_TO_UI = {
  // FR
  hommes: "Men",
  femmes: "Women",
  enfants: "Children",
  // EN
  men: "Men",
  women: "Women",
  children: "Children",
  kids: "Children",
  kid: "Children",
  // Singular FR
  homme: "Men",
  femme: "Women",
  enfant: "Children",
  // AR
  "رجال": "Men",
  "نساء": "Women",
  "أطفال": "Children",
};

const mapURLCategoryToUI = (raw) => {
  const key = normalize(raw);
  return CATEGORY_ALIAS_TO_UI[key] || "";
};

/* ============================ Component ============================ */
const Products = () => {
  const [selectedCategories, setSelectedCategories] = useState(["All"]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loadMore, setLoadMore] = useState(8);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);

  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const lang = i18n?.language;
  // ❌ Do NOT early-return before hooks. Instead compute a flag:
  const i18nReady = Boolean(i18n && i18n.isInitialized);

  const location = useLocation();

  const {
    data: products = [],
    isLoading,
    isFetching,
    refetch,
    isError,
  } = useGetAllProductsQuery(undefined, {
    refetchOnMountOrArgChange: true,
    refetchOnReconnect: true,
  });

  const shouldRefetch = useSelector((state) => state.productEvents.shouldRefetch);

  useEffect(() => {
    if (shouldRefetch) {
      refetch();
      dispatch(productEventsActions.resetRefetch());
    }
  }, [shouldRefetch, refetch, dispatch]);

  /* --- Initialize filter from ?category= URL param --- */
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const raw = params.get("category");
    const mapped = mapURLCategoryToUI(raw); // "Men" | "Women" | "Children" | ""
    if (mapped) {
      setSelectedCategories([mapped]);
    } else {
      setSelectedCategories(["All"]);
    }
  }, [location.search]);

  /* --- Search with small delay & loader --- */
  const handleSearchChange = (term) => {
    setSearchLoading(true);
    const id = setTimeout(() => {
      setSearchTerm(term);
      setSearchLoading(false);
    }, 300); // slightly snappier UX than 1000ms; tweak as you like
    // optional cleanup if user types super fast
    return () => clearTimeout(id);
  };

  /* --- Filtering & sorting --- */
  const filteredProducts = useMemo(() => {
    const selectedAll = selectedCategories.includes("All");

    return products
      .filter((product) => {
        // Category match
        const productCat = normalize(product?.category); // expects "men"/"women"/"children"
        const matchesCategory =
          selectedAll ||
          selectedCategories.some(
            (cat) => normalize(cat) === productCat // compare "men" with "men", etc.
          );

        // Search match (in any available title variant)
        const q = normalize(searchTerm);
        if (!q) return matchesCategory;

        const titleVariants = [
          product?.title,
          product?.translations?.fr?.title,
          product?.translations?.ar?.title,
        ].filter(Boolean);

        const matchesSearch = titleVariants.some((title) =>
          normalize(title).includes(q)
        );

        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        // Keep your original "All" priority: Men > Women > Children
        const selectedAllLocal = selectedCategories.includes("All");
        if (selectedAllLocal) {
          const order = { men: 1, women: 2, children: 3 };
          const av = order[normalize(a?.category)] ?? 99;
          const bv = order[normalize(b?.category)] ?? 99;
          return av - bv;
        }
        return 0;
      })
      .slice(0, loadMore);
  }, [products, selectedCategories, searchTerm, loadMore]);

  const handleLoadMore = () => {
    setIsLoadingMore(true);
    setTimeout(() => {
      setLoadMore((prev) => prev + 8);
      setIsLoadingMore(false);
    }, 800);
  };

  // Centralized "not ready" UI: call all hooks above, then render a loader if needed.
  if (!i18nReady || isLoading || isFetching) {
    return <WahretZmenLoader />;
  }

  return (
    <FadeInSection>
      <div className="main-content">
        <div className="container mx-auto pt-2 sm:pt-4 pb-4 px-4 sm:px-6 md:px-10 lg:px-20 max-w-[1440px]">
          <Helmet>
            <title>{t("products_page.title")} - Wahret Zmen</title>
          </Helmet>

          <FadeInSection duration={0.6}>
            <h2 className="products-title page-title-desktop text-3xl sm:text-4xl font-bold font-serif text-center mb-6 drop-shadow-lg bg-gradient-to-r from-[#D4AF37] to-[#A67C52] bg-clip-text text-transparent hover:scale-105 transition-transform duration-300 ease-in-out">
              {t("products_page.title")}
            </h2>
          </FadeInSection>

          <FadeInSection delay={0.2} duration={0.6}>
            <div className="text-center text-gray-700 max-w-3xl mx-auto mb-8 leading-relaxed px-2">
              <p className="text-base sm:text-lg">{t("products_page.overview")}</p>
              {isError && (
                <p className="text-sm text-red-500 mt-2">
                  {t("error_loading_products") || "An error occurred while loading products."}
                </p>
              )}
            </div>
          </FadeInSection>

          <FadeInSection delay={0.3} duration={0.6}>
            <div className="mb-6 sm:mb-8 flex flex-col items-center space-y-3 sm:space-y-4">
              <SelectorsPageProducts
                options={categories}
                onSelect={setSelectedCategories}
                label="category"
              />

              {/* Your SearchInput API (setSearchTerm + placeholder) */}
              <SearchInput
                setSearchTerm={handleSearchChange}
                placeholder={t("search_placeholder")}
              />

              {searchLoading && (
                <FadeInSection delay={0.1} duration={0.6}>
                  <InlineWahretZmenLoader />
                </FadeInSection>
              )}
            </div>
          </FadeInSection>

          <FadeInSection delay={0.4} duration={0.6}>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product, index) => (
                  <FadeInSection
                    key={product?._id || index}
                    delay={index * 0.08}
                    duration={0.6}
                    yOffset={30}
                  >
                    <ProductCard product={product} />
                  </FadeInSection>
                ))
              ) : (
                <p className="col-span-full text-center text-gray-500">
                  {t("no_products_found")}
                </p>
              )}
            </div>
          </FadeInSection>

          {filteredProducts.length < products.length && !searchLoading && (
            <FadeInSection delay={0.6} duration={0.6}>
              <div className="text-center mt-8">
                {isLoadingMore ? (
                  <div className="flex justify-center items-center h-24">
                    <InlineWahretZmenLoader />
                  </div>
                ) : (
                  <button className="wahret-zmen-btn w-[250px]" onClick={handleLoadMore}>
                    {t("load_more")}
                  </button>
                )}
              </div>
            </FadeInSection>
          )}
        </div>
      </div>
    </FadeInSection>
  );
};

export default Products;
