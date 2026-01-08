// SearchInput.jsx
import React, { useCallback } from "react";
import FadeInSection from "../Animations/FadeInSection.jsx";

/* =============================================================================
   🔎 SearchInput Component (Arabic Only - No i18n)
   - Controlled input (via setSearchTerm)
   - Static Arabic placeholder
   - Accessible Arabic label for screen readers
   - Optional debounce ready
============================================================================= */
const SearchInput = ({ setSearchTerm }) => {
  const handleChange = useCallback(
    (e) => {
      const value = e.target.value;
      setSearchTerm(value);
    },
    [setSearchTerm]
  );

  return (
    <FadeInSection delay={0.1}>
      <div className="w-full max-w-md relative group transition-all duration-300" dir="rtl">
        {/* Hidden label for accessibility */}
        <label htmlFor="search" className="sr-only">
          ابحث عن المنتجات
        </label>

        {/* Input */}
        <input
          id="search"
          type="text"
          placeholder=" ابحث عن المنتجات..."
          onChange={handleChange}
          className="w-full px-5 py-3 text-gray-800 bg-white rounded-xl border border-gray-300 shadow-inner
                     transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]
                     focus:border-[#A67C52] focus:shadow-md placeholder-gray-400 text-sm sm:text-base
                     hover:border-[#A67C52]"
          autoComplete="off"
        />

        {/* Icon */}
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-[#A67C52] opacity-80">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M21 21l-4.35-4.35M10 18a8 8 0 100-16 8 8 0 000 16z" />
          </svg>
        </div>
      </div>
    </FadeInSection>
  );
};

export default SearchInput;
