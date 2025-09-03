// src/pages/Products.jsx
import React, { useEffect, useMemo, useState } from "react";
import ProductCard from "./products/ProductCard.jsx";
import { useGetAllProductsQuery } from "../redux/features/products/productsApi.js";
import SearchInput from "../components/SearchInput.jsx";
import "../Styles/StylesProducts.css";
import "../Styles/StylesSelectorProductsPage.css";
import { Helmet } from "react-helmet";
import FadeInSection from "../Animations/FadeInSection";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { productEventsActions } from "../redux/features/products/productEventsSlice.js";
import { useLocation, useNavigate } from "react-router-dom";
import SelectorPageProducts from "./../components/SelectorProductsPage";

/* ------------------------ Loaders ------------------------ */
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

/* ------------------------ Helpers ------------------------ */
const normalize = (v) => (v || "").toString().trim().toLowerCase();

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
const mapURLCategoryToUI = (raw) => CATEGORY_ALIAS_TO_UI[normalize(raw)] || "";

// price extractor
const numericPrice = (p) => {
  const raw =
    p?.newPrice ??
    p?.price ??
    p?.pricing ??
    (typeof p?.prices?.current === "number" ? p.prices.current : undefined);
  const n = Number(String(raw).replace(/[^0-9.]/g, ""));
  return Number.isFinite(n) ? n : 0;
};

// collect color names from multiple possible shapes
const productColorNames = (p) => {
  if (Array.isArray(p?.colors)) {
    return p.colors
      .map(
        (c) =>
          c?.colorName?.en ||
          c?.colorName?.fr ||
          c?.colorName?.ar ||
          c?.colorName ||
          c?.name ||
          c?.label
      )
      .filter(Boolean);
  }
  if (p?.color) return [p.color];
  return [];
};

/* ============================ Component ============================ */
const Products = () => {
  // filters
  const [categorySel, setCategorySel] = useState("All");
  const [colorSel, setColorSel] = useState("All");
  const [priceRange, setPriceRange] = useState([0, 1000]);

  // search + load more
  const [searchTerm, setSearchTerm] = useState("");
  const [loadMore, setLoadMore] = useState(12);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);

  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const isRTL = i18n?.language === "ar" || i18n?.language === "ar-SA";
  const i18nReady = Boolean(i18n && i18n.isInitialized);

  const location = useLocation();
  const navigate = useNavigate();

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

  /* --- Initialize category from ?category= URL param --- */
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const raw = params.get("category");
    const mapped = mapURLCategoryToUI(raw);
    setCategorySel(mapped || "All");
  }, [location.search]);

  /* --- Build options & price bounds from live products --- */
  const { categories, colors, minPrice, maxPrice } = useMemo(() => {
    const catSet = new Set(["All", "Men", "Women", "Children"]);
    const colorSet = new Set(["All"]);
    let minP = Number.POSITIVE_INFINITY;
    let maxP = 0;

    for (const p of products) {
      if (p?.category) catSet.add(capitalize(normalize(p.category)));
      for (const c of productColorNames(p)) {
        if (c) colorSet.add(capitalize(normalize(c)));
      }
      const pr = numericPrice(p);
      if (pr > 0) {
        if (pr < minP) minP = pr;
        if (pr > maxP) maxP = pr;
      }
    }

    if (!Number.isFinite(minP)) minP = 0;
    if (maxP < minP) maxP = minP + 500;

    return {
      categories: Array.from(catSet),
      colors: Array.from(colorSet),
      minPrice: Math.floor(minP),
      maxPrice: Math.ceil(maxP),
    };
  }, [products]);

  // sync price range to current bounds
  useEffect(() => {
    setPriceRange(([lo, hi]) => {
      const next = [
        Math.max(minPrice, lo || minPrice),
        Math.min(maxPrice, hi || maxPrice),
      ];
      if (next[0] > next[1]) return [minPrice, maxPrice];
      return next;
    });
  }, [minPrice, maxPrice]);

  /* --- Search with small delay & loader --- */
  const handleSearchChange = (term) => {
    setSearchLoading(true);
    const id = setTimeout(() => {
      setSearchTerm(term);
      setSearchLoading(false);
    }, 300);
    return () => clearTimeout(id);
  };

  /* --- Filtering & slice for Load more --- */
  const filtered = useMemo(() => {
    const q = normalize(searchTerm);

    const list = products.filter((p) => {
      // Category
      const catOk =
        categorySel === "All" ||
        normalize(p?.category) === normalize(categorySel);

      // Color
      const pColors = productColorNames(p).map((c) => normalize(c));
      const colorOk = colorSel === "All" || pColors.includes(normalize(colorSel));

      // Price
      const pr = numericPrice(p);
      const priceOk = pr >= priceRange[0] && pr <= priceRange[1];

      // Search across title variants
      const titleVariants = [
        p?.title,
        p?.translations?.fr?.title,
        p?.translations?.ar?.title,
      ].filter(Boolean);
      const searchOk = !q || titleVariants.some((t) => normalize(t).includes(q));

      return catOk && colorOk && priceOk && searchOk;
    });

    return list.slice(0, loadMore);
  }, [products, categorySel, colorSel, priceRange, searchTerm, loadMore]);

  const handleLoadMore = () => {
    setIsLoadingMore(true);
    setTimeout(() => {
      setLoadMore((prev) => prev + 12);
      setIsLoadingMore(false);
    }, 600);
  };

  const clearFilters = () => {
    setCategorySel("All");
    setColorSel("All");
    setPriceRange([minPrice, maxPrice]);
    const params = new URLSearchParams(location.search);
    params.delete("category");
    navigate({ search: params.toString() }, { replace: true });
  };

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

          {/* ========= Premium centered title + overview ========= */}
          <FadeInSection duration={0.6}>
            <header className="wz-collections-header" dir={isRTL ? "rtl" : "ltr"}>
              <h1 className="wz-collections-title wz-title-shine wz-title-bounce">
                {t("products_page.title")}
              </h1>
              <p className="wz-collections-sub">
                {t("products_page.overview")}
              </p>
            </header>
          </FadeInSection>

          {/* ========= Overview search ========= */}
          <FadeInSection delay={0.2} duration={0.6}>
            <div className="products-grid grid gap-6 grid-cols-1">
              <SearchInput
                setSearchTerm={handleSearchChange}
                placeholder={t("search_placeholder")}
              />
              {searchLoading && <InlineWahretZmenLoader />}
            </div>
          </FadeInSection>

          {/* ===== Two-column layout (sidebar must be on the right) ===== */}
          <div className="flex flex-col lg:flex-row gap-8 mt-4">
            {isRTL && (
              <SelectorPageProducts
                categorySel={categorySel}
                setCategorySel={setCategorySel}
                categories={categories}
                colorSel={colorSel}
                setColorSel={setColorSel}
                colors={colors}
                priceRange={priceRange}
                setPriceRange={setPriceRange}
                minPrice={minPrice}
                maxPrice={maxPrice}
                clearFilters={clearFilters}
              />
            )}

            {/* MAIN: products (list-only) */}
            <div className="flex-1">
              <div className="grid gap-6 grid-cols-1">
                {filtered.length > 0 ? (
                  filtered.map((product, index) => (
                    <FadeInSection
                      key={product?._id || index}
                      delay={index * 0.06}
                      duration={0.5}
                      yOffset={24}
                    >
                      <ProductCard product={product} viewMode="list" />
                    </FadeInSection>
                  ))
                ) : (
                  <p className="col-span-full text-center text-gray-500">
                    {t("no_products_found")}
                  </p>
                )}
              </div>

              {/* Load More */}
              {filtered.length < products.length && !searchLoading && (
                <div className="text-center mt-10">
                  {isLoadingMore ? (
                    <div className="flex justify-center items-center h-24">
                      <InlineWahretZmenLoader />
                    </div>
                  ) : (
                    <button className="btn-outline w240" onClick={handleLoadMore}>
                      {t("load_more")}
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* LTR: render sidebar second so it appears on the RIGHT */}
            {!isRTL && (
              <SelectorPageProducts
                categorySel={categorySel}
                setCategorySel={setCategorySel}
                categories={categories}
                colorSel={colorSel}
                setColorSel={setColorSel}
                colors={colors}
                priceRange={priceRange}
                setPriceRange={setPriceRange}
                minPrice={minPrice}
                maxPrice={maxPrice}
                clearFilters={clearFilters}
              />
            )}
          </div>
        </div>
      </div>
    </FadeInSection>
  );
};

export default Products;

/* small util */
function capitalize(s) {
  const n = String(s || "");
  if (!n) return n;
  return n.charAt(0).toUpperCase() + n.slice(1);
}
