// src/pages/Products.jsx
// -----------------------------------------------------------------------------
// Product catalog page: search, filters (category, color, embroidery, price),
// and "Load more" pagination with smooth loaders. RTL-only Arabic UI.
// -----------------------------------------------------------------------------

import React, { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

import ProductCard from "./products/ProductCard.jsx";
import SearchInput from "../components/SearchInput.jsx";
import SelectorPageProducts from "../components/SelectorProductsPage.jsx";

import { useGetAllProductsQuery } from "../redux/features/products/productsApi.js";
import { productEventsActions } from "../redux/features/products/productEventsSlice.js";

import FadeInSection from "../Animations/FadeInSection";

import "../Styles/StylesProducts.css";
import "../Styles/StylesSelectorProductsPage.css";

/* ============================================================================
   Small loaders
   ========================================================================== */

const PageLoader = () => (
  <div className="page-loader" role="status" aria-live="polite">
    <div className="relative w-16 h-16">
      <div className="absolute inset-0 rounded-full border-4 border-t-transparent border-[#D4AF37] animate-spin"></div>
      <div className="absolute inset-2 rounded-full border-2 border-[#A67C52] opacity-40"></div>
      {/* ✅ Use global Cairo (no font-serif override) */}
      <span className="absolute inset-0 flex items-center justify-center text-[#D4AF37] text-xl font-bold">
        WZ
      </span>
    </div>
  </div>
);

const WahretZmenLoader = () => (
  <div className="loader-wrapper w-full">
    <div className="relative w-16 h-16">
      <div className="absolute inset-0 rounded-full border-4 border-t-transparent border-[#D4AF37] animate-spin"></div>
      <div className="absolute inset-2 rounded-full border-2 border-[#A67C52] opacity-40"></div>
      {/* ✅ Use global Cairo (no font-serif override) */}
      <span className="absolute inset-0 flex items-center justify-center text-[#D4AF37] text-xl font-bold animate-pulse">
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
      {/* ✅ Use global Cairo (no font-serif override) */}
      <span className="absolute inset-0 flex items-center justify-center text-[#D4AF37] text-sm font-bold animate-pulse">
        WZ
      </span>
    </div>
  </div>
);

/* ============================================================================
   Helpers
   ========================================================================== */

const normalize = (v) => (v || "").toString().trim().toLowerCase();

const capitalize = (s) => {
  const n = String(s || "");
  if (!n) return n;
  return n.charAt(0).toUpperCase() + n.slice(1);
};

const CATEGORY_ALIAS_TO_UI = {
  all: "All",
  tous: "All",
  "الكل": "All",

  men: "Men",
  women: "Women",
  children: "Children",
  kids: "Children",
  kid: "Children",

  hommes: "Men",
  homme: "Men",
  femmes: "Women",
  femme: "Women",
  enfants: "Children",
  enfant: "Children",

  رجال: "Men",
  نساء: "Women",
  أطفال: "Children",
};

const canonicalCategory = (raw) => {
  const n = normalize(raw);
  return CATEGORY_ALIAS_TO_UI[n] || capitalize(n) || "";
};

const mapURLCategoryToUI = (raw) =>
  raw ? CATEGORY_ALIAS_TO_UI[normalize(raw)] || "All" : "All";

// Try to extract a numeric price from different shapes
const numericPrice = (p) => {
  const raw =
    p?.newPrice ??
    p?.price ??
    p?.pricing ??
    (typeof p?.prices?.current === "number" ? p.prices.current : undefined);

  const n = Number(String(raw ?? "").replace(/[^0-9.]/g, ""));
  return Number.isFinite(n) ? n : 0;
};

// Collect color names in any language
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

// Safely convert embroidery (string OR {en,fr,ar}) to a searchable text
const toSearchString = (value) => {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (typeof value === "object") {
    try {
      return Object.values(value)
        .filter((v) => typeof v === "string")
        .join(" ");
    } catch {
      return "";
    }
  }
  return "";
};

/* ============================================================================
   Component
   ========================================================================== */

const Products = () => {
  // Filters + pagination
  const [categorySel, setCategorySel] = useState("All");
  const [colorSel, setColorSel] = useState("All");
  const [embroiderySel, setEmbroiderySel] = useState("All");
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loadMore, setLoadMore] = useState(12);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);

  const dispatch = useDispatch();
  const isRTL = true;

  const location = useLocation();
  const navigate = useNavigate();

  // Fetch products + external "refetch" trigger from Redux
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

  // Init category from URL (?category=men, etc.)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const raw = params.get("category");
    setCategorySel(mapURLCategoryToUI(raw));
  }, [location.search]);

  // Init search from URL (?search=jebba, ?q=jebba)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get("search") || params.get("q") || "";
    setSearchTerm(q);
  }, [location.search]);

  // Build select options and price bounds from current products
  const { categories, colors, minPrice, maxPrice, embroideryTypes } = useMemo(() => {
    const catSet = new Set(["All", "Men", "Women", "Children"]);
    const colorSet = new Set(["All"]);
    const embroideryList = [];
    let minP = Number.POSITIVE_INFINITY;
    let maxP = 0;

    for (const p of products) {
      const canon = canonicalCategory(p?.category);
      if (canon) catSet.add(canon);

      for (const c of productColorNames(p)) {
        if (c) colorSet.add(capitalize(normalize(c)));
      }

      if (p?.embroideryCategory) {
        embroideryList.push(p.embroideryCategory);
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
      embroideryTypes: embroideryList,
    };
  }, [products]);

  // Keep price range inside new min/max bounds
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

  // Debounced search handler (used by SearchInput)
  const handleSearchChange = (term) => {
    setSearchLoading(true);
    const id = setTimeout(() => {
      setSearchTerm(term);
      setSearchLoading(false);
    }, 300);
    return () => clearTimeout(id);
  };

  // Filtering pipeline
  const matched = useMemo(() => {
    const q = normalize(searchTerm);
    const sel = canonicalCategory(categorySel) || "All";
    const embroideryFilter = normalize(embroiderySel || "All");

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

      const embroideryText = toSearchString(p?.embroideryCategory);
      const searchPool = [...titleVariants, embroideryText].filter(Boolean);

      const searchOk =
        !q || searchPool.some((t) => normalize(t).includes(q));

      const embroideryOk =
        !embroideryFilter ||
        embroideryFilter === "all" ||
        normalize(embroideryText).includes(embroideryFilter);

      return catOk && colorOk && priceOk && searchOk && embroideryOk;
    });
  }, [products, categorySel, colorSel, priceRange, searchTerm, embroiderySel]);

  // Slice for "Load more"
  const filtered = useMemo(() => matched.slice(0, loadMore), [matched, loadMore]);

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
    setEmbroiderySel("All");
    setPriceRange([minPrice, maxPrice]);
    setSearchTerm("");

    const params = new URLSearchParams(location.search);
    params.delete("category");
    params.delete("search");
    params.delete("q");
    navigate({ search: params.toString() }, { replace: true });
  };

  // Loading state
  if (isLoading || isFetching) {
    return <PageLoader />;
  }

  // Render
  return (
    <FadeInSection>
      <div className="main-content">
        <div className="container mx-auto pt-8 sm:pt-12 md:pt-16 pb-4 px-4 sm:px-6 md:px-10 lg:px-20 max-w-[1440px]">
          <Helmet>
            <title>المنتجات - Wahret Zmen</title>
          </Helmet>

          {/* Title + intro */}
          <FadeInSection duration={0.6}>
            <header className="wz-collections-header" dir="rtl">
              <h1 className="wz-collections-title premium-gradient">
                مجموعة المنتجات
              </h1>
              <p className="wz-collections-sub">
                اكتشف أحدث تشكيلات الجبّة، القفطان والأزياء التقليدية من وهرة زمان،
                واختر الموديل الذي يناسب ذوقك ومناسباتك.
              </p>
            </header>
          </FadeInSection>

          {/* Search bar */}
          <FadeInSection delay={0.2} duration={0.6}>
            <div className="products-grid grid gap-6 grid-cols-1">
              <SearchInput
                setSearchTerm={handleSearchChange}
                placeholder="ابحث عن منتج، لون أو نوع تطريز..."
                initialValue={searchTerm}
                defaultValue={searchTerm}
                value={searchTerm}
              />
              {searchLoading && <InlineWahretZmenLoader />}
            </div>
          </FadeInSection>

          {/* Main layout: sidebar + products */}
          <div className="flex flex-col lg:flex-row gap-8 mt-4">
            {/* Sidebar (RTL: appears visually on the right) */}
            <FadeInSection delay={0.2} duration={0.6}>
            <SelectorPageProducts
              categorySel={categorySel}
              setCategorySel={setCategorySel}
              categories={categories}
              colorSel={colorSel}
              setColorSel={setColorSel}
              colors={colors}
              embroiderySel={embroiderySel}
              setEmbroiderySel={setEmbroiderySel}
              embroideryTypes={embroideryTypes}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              minPrice={minPrice}
              maxPrice={maxPrice}
              clearFilters={clearFilters}
            />
            </FadeInSection>
            {/* Products grid */}
            <div className="flex-1">
              <div
                className="products-list grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 place-items-stretch"
                style={{ justifyItems: "stretch" }}
              >
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
                  <p className="col-span-full text-center text-gray-500">
                    لم يتم العثور على منتجات مطابقة لبحثك.
                  </p>
                )}
              </div>

              {/* Load more button */}
              {matched.length > 0 &&
                filtered.length < matched.length &&
                !searchLoading && (
                  <div className="text-center mt-10">
                    {isLoadingMore ? (
                      <div className="flex justify-center items-center h-24">
                        <InlineWahretZmenLoader />
                      </div>
                    ) : (
                      <button
                        className="btn-outline btn-narrow"
                        onClick={handleLoadMore}
                      >
                        عرض المزيد من المنتجات
                      </button>
                    )}
                  </div>
                )}
            </div>
          </div>
        </div>
      </div>
    </FadeInSection>
  );
};

export default Products;
