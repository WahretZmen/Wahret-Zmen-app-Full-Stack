// ============================================================================
// RatingStars.jsx
// ----------------------------------------------------------------------------
// Purpose:
//   • Display a 0–5 star rating (supports half stars like 4.5).
//   • Optionally show numeric value next to stars.
//   • Fully customizable via props (color class, size, etc.).
//
// Notes:
//   • Works safely even if rating is not a number.
//   • You can replace the star glyphs with SVG icons if you prefer.
// ============================================================================

import React from "react";

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------
const RatingStars = ({
  value = 0,                   // numeric rating (0–5)
  size = "text-yellow-500",    // Tailwind color class for stars
  showNumber = true,           // whether to show numeric text "(4.5)"
}) => {
  const v = Math.max(0, Math.min(5, Number(value))); // clamp between 0–5
  const full = Math.floor(v);
  const half = v - full >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);

  // Star glyphs — easily replace with SVGs if desired
  const Star = () => <span aria-hidden="true">★</span>;
  const Half = () => <span aria-hidden="true">⯪</span>;
  const Empty = () => <span aria-hidden="true" className="text-gray-300">★</span>;

  return (
    <div
      className={`inline-flex items-center gap-1 ${size}`}
      title={`Rating: ${v.toFixed(1)} / 5`}
      aria-label={`Rating ${v.toFixed(1)} out of 5 stars`}
    >
      {Array.from({ length: full }).map((_, i) => <Star key={`f${i}`} />)}
      {half && <Half key="h" />}
      {Array.from({ length: empty }).map((_, i) => <Empty key={`e${i}`} />)}
      {showNumber && (
        <span className="ml-1 text-gray-700 text-sm">
          ({v.toFixed(1)})
        </span>
      )}
    </div>
  );
};

// -----------------------------------------------------------------------------
// Export
// -----------------------------------------------------------------------------
export default RatingStars;
