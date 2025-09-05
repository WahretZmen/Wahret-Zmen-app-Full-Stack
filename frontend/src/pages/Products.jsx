// src/pages/Products.jsx
// -----------------------------------------------------------------------------
// Purpose : Products catalog page with search, filters (category, color, price),
//           and "load more" pagination. Uses RTK Query for data fetching,
//           Redux for refetch triggers, and i18n for RTL support.
// -----------------------------------------------------------------------------

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

// -----------------------------------------------------------------------------
// Loaders
// -----------------------------------------------------------------------------
const HeaderSpinner = () => (
  <div
    className="flex items-center justify-center mt-3"
    aria-label="Loading products"
  >
    <div className="relative w-10 h-10">
      <div className="absolute inset-0 rounded-full border-4 border-t-transparent border-[#D4AF37] animate-spin" />
      <div className="absolute inset-1 rounded-full border-2 border-[#A67C52] opacity-40" />
      <span className="absolute inset-0 flex items-center justify-center font-serif text-[#D4AF37] text-xs font-bold">
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

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------
const normalize = (v) => (v || "").toString().trim().toLowerCase();
const capitalize = (s) => {
  const n = String(s || "");
  if (!n) return n;
  return n.charAt(0).toUpperCase() + n.slice(1);
};

// Canonical map for category aliases (EN/FR/AR) ⇒ "Men"|"Women"|"Children"|"All"
const CATEGORY_ALIAS_TO_UI = {
  // All
  all: "All",
  tous: "All",
  "الكل": "All",

  // EN
  men: "Men",
  women: "Women",
  children: "Children",
  kids: "Children",
  kid: "Children",

  // FR
  hommes: "Men",
  homme: "Men",
  femmes: "Women",
  femme: "Women",
  enfants: "Children",
  enfant: "Children",

  // AR
  رجال: "Men",
  نساء: "Women",
  أطفال: "Children",
};

const canonicalCategory = (raw) => {
  const n = normalize(raw);
  return CATEGORY_ALIAS_TO_UI[n] || capitalize(n) || "";
};

const mapURLCategoryToUI = (raw) => CATEGORY_ALIAS_TO_UI[normalize(raw)] || "All";

const numericPrice = (p) => {
  const raw =
    p?.newPrice ??
    p?.price ??
    p?.pricing ??
    (typeof p?.prices?.current === "number" ? p.prices.current : undefined);
  const n = Number(String(raw).replace(/[^0-9.]/g, ""));
  return Number.isFinite(n) ? n : 0;
};

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

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------
const Products = () => {
  // 1) Local UI state
  const [categorySel, setCategorySel] = useState("All");
  const [colorSel, setColorSel] = useState("All");
  const [priceRange, setPriceRange] = useState([0, 1000]);

  const [searchTerm, setSearchTerm] = useState("");
  const [loadMore, setLoadMore] = useState(12);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);

  // Android-only margin helper (we’ll also show the spinner under the title)
  const [isAndroid, setIsAndroid] = useState(false);
  useEffect(() => {
    const ua =
      (typeof navigator !== "undefined" && (navigator.userAgent || navigator.vendor)) ||
      "";
    setIsAndroid(/Android/i.test(ua));
  }, []);

  // 2) i18n, router, redux
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const isRTL = i18n?.language === "ar" || i18n?.language === "ar-SA";
  const i18nReady = Boolean(i18n && i18n.isInitialized);

  const location = useLocation();
  const navigate = useNavigate();

  // 3) Data: products
  const {
    data: products = [],
    isLoading,
    isFetching,
    refetch,
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

  // 4) Initialize category filter from URL (?category=)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const raw = params.get("category");
    setCategorySel(mapURLCategoryToUI(raw));
  }, [location.search]);

  // 5) Build filter options & price bounds
  const { categories, colors, minPrice, maxPrice } = useMemo(() => {
    const catSet = new Set(["All", "Men", "Women", "Children"]);
    const colorSet = new Set(["All"]);
    let minP = Number.POSITIVE_INFINITY;
    let maxP = 0;

    for (const p of products) {
      const canon = canonicalCategory(p?.category);
      if (canon) catSet.add(canon);

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

  // Keep priceRange in sync with computed bounds
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

  // 6) Search debounce
  const handleSearchChange = (term) => {
    setSearchLoading(true);
    const id = setTimeout(() => {
      setSearchTerm(term);
      setSearchLoading(false);
    }, 300);
    return () => clearTimeout(id);
  };

  // 7) Filtering pipeline
  const matched = useMemo(() => {
    const q = normalize(searchTerm);
    const sel = canonicalCategory(categorySel) || "All";

    return products.filter((p) => {
      const catOfProduct = canonicalCategory(p?.category);
      const catOk = sel === "All" || catOfProduct === sel;

      const pColors = productColorNames(p).map((c) => normalize(c));
      const colorOk = colorSel === "All" || pColors.includes(normalize(colorSel));

      const pr = numericPrice(p);
      const priceOk = pr >= priceRange[0] && pr <= priceRange[1];

      const titleVariants = [
        p?.title,
        p?.translations?.fr?.title,
        p?.translations?.ar?.title,
        p?.translations?.en?.title,
      ].filter(Boolean);
      const searchOk = !q || titleVariants.some((t) => normalize(t).includes(q));

      return catOk && colorOk && priceOk && searchOk;
    });
  }, [products, categorySel, colorSel, priceRange, searchTerm]);

  // Paginated slice
  const filtered = useMemo(() => matched.slice(0, loadMore), [matched, loadMore]);

  // Load more
  const handleLoadMore = () => {
    setIsLoadingMore(true);
    setTimeout(() => {
      setLoadMore((prev) => prev + 12);
      setIsLoadingMore(false);
    }, 600);
  };

  // Reset filters & clean URL
  const clearFilters = () => {
    setCategorySel("All");
    setColorSel("All");
    setPriceRange([minPrice, maxPrice]);
    const params = new URLSearchParams(location.search);
    params.delete("category");
    navigate({ search: params.toString() }, { replace: true });
  };

  // Early guard only for i18n
  if (!i18nReady) {
    return <HeaderSpinner />;
  }

  // Render
  return (
    <FadeInSection>
      <div className="main-content">
        <div className="container mx-auto pt-0 sm:pt-0 md:pt-0 pb-4 px-4 sm:px-6 md:px-10 lg:px-20 max-w-[1440px]">
          {/* SEO */}
          <Helmet>
            <title>{t("products_page.title")} - Wahret Zmen</title>
          </Helmet>

          {/* Title + Overview */}
          <FadeInSection duration={0.6}>
            <header
              className="wz-collections-header"
              style={{ marginTop: isAndroid ? "2rem" : "0.75rem" }}
              dir={isRTL ? "rtl" : "ltr"}
            >
              <h1 className="wz-collections-title premium-gradient">
                {t("products_page.title")}
              </h1>
              <p className="wz-collections-sub">{t("products_page.overview")}</p>

              {/* 🔁 Show a compact spinner under the title while data is loading */}
              {(isLoading || isFetching) && <HeaderSpinner />}
            </header>
          </FadeInSection>

          {/* Search */}
          <FadeInSection delay={0.2} duration={0.6}>
            <div className="products-grid grid gap-6 grid-cols-1">
              <SearchInput
                setSearchTerm={handleSearchChange}
                placeholder={t("search_placeholder")}
              />
              {searchLoading && <InlineWahretZmenLoader />}
            </div>
          </FadeInSection>

          {/* Layout */}
          <div className="flex flex-col lg:flex-row gap-8 mt-2">
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

            {/* MAIN: products */}
            <div className="flex-1">
              <div className="products-list grid gap-6 grid-cols-1 place-items-center md:place-items-stretch">
                {filtered.length > 0 ? (
                  filtered.map((product, index) => (
                    <FadeInSection
                      key={product?._id || index}
                      delay={index * 0.06}
                      duration={0.5}
                      yOffset={24}
                    >
                      <ProductCard product={product} />
                    </FadeInSection>
                  ))
                ) : (
                  // 👉 Only show "no products" once we're not loading anymore
                  !isLoading &&
                  !isFetching && (
                    <p className="col-span-full text-center text-gray-500">
                      {t("no_products_found")}
                    </p>
                  )
                )}
              </div>

              {/* Load More */}
              {matched.length > 0 &&
                filtered.length < matched.length &&
                !searchLoading && (
                  <div className="text-center mt-10">
                    {isLoadingMore ? (
                      <div className="flex justify-center items-center h-24">
                        <InlineWahretZmenLoader />
                      </div>
                    ) : (
                      <button className="btn-outline btn-narrow" onClick={handleLoadMore}>
                        {t("load_more")}
                      </button>
                    )}
                  </div>
                )}
            </div>

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
