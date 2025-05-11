import React, { useState, useEffect } from "react";
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

// 🌀 Beautiful Wahret Zmen Loader
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



// 🆕 Compact Loader (under SearchInput only)
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



const categories = ["All", "Men", "Women", "Children"];

const Products = () => {
  const [selectedCategories, setSelectedCategories] = useState(["All"]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loadMore, setLoadMore] = useState(8);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false); // ✅ New state

  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  if (!i18n.isInitialized) return null;

  const {
    data: products = [],
    isLoading,
    isFetching,
    refetch,
  } = useGetAllProductsQuery(undefined, {
    refetchOnMountOrArgChange: true,
    refetchOnReconnect: true,
  });

  const shouldRefetch = useSelector(
    (state) => state.productEvents.shouldRefetch
  );

  useEffect(() => {
    if (shouldRefetch) {
      refetch();
      dispatch(productEventsActions.resetRefetch());
    }
  }, [shouldRefetch, refetch, dispatch]);

  // ✅ Handle search term with delay and loader
  const handleSearchChange = (term) => {
    setSearchLoading(true);
    setTimeout(() => {
      setSearchTerm(term);
      setSearchLoading(false);
    }, 1000);
  };

  if (isLoading || isFetching) {
    return <WahretZmenLoader />;
  }

  const filteredProducts = products
    .filter((product) => {
      const matchesCategory =
        selectedCategories.includes("All") ||
        selectedCategories.some(
          (cat) =>
            cat.toLowerCase() === product.category?.toLowerCase()
        );

      const lowerSearch = searchTerm.toLowerCase();

      const titleVariants = [
        product.title,
        product.translations?.fr?.title,
        product.translations?.ar?.title,
      ].filter(Boolean);

      const matchesSearch = titleVariants.some((title) =>
        title.toLowerCase().includes(lowerSearch)
      );

      return matchesCategory && matchesSearch;
    })
    .slice(0, loadMore);

  const handleLoadMore = () => {
    setIsLoadingMore(true);
    setTimeout(() => {
      setLoadMore((prev) => prev + 8);
      setIsLoadingMore(false);
    }, 800);
  };



  return (
    <FadeInSection>
      <div className="main-content">
        <div className="container mx-auto py-10 px-4 sm:px-6 md:px-10 lg:px-20 max-w-[1440px]">
          <Helmet>
            <title>{t("products_page.title")} - Wahret Zmen</title>
          </Helmet>

          <FadeInSection duration={0.6}>
            <h2 className="text-3xl sm:text-4xl font-bold font-serif text-center mb-6 drop-shadow-lg bg-gradient-to-r from-[#D4AF37] to-[#A67C52] bg-clip-text text-transparent hover:scale-105 transition-transform duration-300 ease-in-out">
              {t("products_page.title")}
            </h2>
          </FadeInSection>

          <FadeInSection delay={0.2} duration={0.6}>
            <div className="text-center text-gray-700 max-w-3xl mx-auto mb-8 leading-relaxed px-2">
              <p className="text-base sm:text-lg">{t("products_page.overview")}</p>
            </div>
          </FadeInSection>

          <FadeInSection delay={0.3} duration={0.6}>
            <div className="mb-8 flex flex-col items-center space-y-4">
              <SelectorsPageProducts
                options={categories}
                onSelect={setSelectedCategories}
                label="category"
              />
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
        key={index}
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

