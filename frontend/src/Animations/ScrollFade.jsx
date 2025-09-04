// src/components/ScrollFade.jsx
import React, { useState, useRef, useEffect } from "react";
import "../Styles/StylesAnimations.css"; // ✅ CSS file with fade-in animations

/**
 * ScrollFade
 * ----------------
 * Animates elements when they come into view on scroll.
 *
 * Props:
 * - children: ReactNode → The element(s) to animate.
 * - direction (string) → Animation direction type:
 *     "right" (default), "left", "up", "down",
 *     "right-to-left", "fade-rotate-zoom"
 * - delay (number) → Delay (in seconds) before animation starts.
 *
 * Behavior:
 * - Uses IntersectionObserver to detect visibility.
 * - Applies a CSS class depending on `direction`.
 * - Supports both native DOM elements (e.g., <img>) and React components.
 */
const ScrollFade = ({ children, direction = "right", delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef();

  /**
   * Setup IntersectionObserver
   * - Triggers once when element comes into view.
   * - Unobserves element after first trigger.
   */
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 } // element must be 10% visible
    );

    const el = ref.current;
    if (el) observer.observe(el);

    return () => {
      if (el) observer.unobserve(el);
    };
  }, []);

  /**
   * Choose animation class based on direction + visibility
   */
  const directionClass = isVisible
    ? direction === "fade-rotate-zoom"
      ? "fade-in-rotate-zoom"
      : direction === "right-to-left"
      ? "fade-in-right-to-left"
      : `fade-in-${direction}` // fallback: fade-in-up, fade-in-down, etc.
    : "hidden-before-scroll";

  return (
    <div
      ref={ref}
      style={{ animationDelay: `${delay}s` }}
      className={
        // If child is a DOM element (<img>, <div> etc.), apply class directly to child
        typeof children?.type === "string" ? "" : directionClass
      }
    >
      {typeof children?.type === "string"
        ? React.cloneElement(children, {
            // Append direction class to existing child classes
            className: `${children.props.className || ""} ${directionClass}`,
          })
        : children}
    </div>
  );
};

export default ScrollFade;
