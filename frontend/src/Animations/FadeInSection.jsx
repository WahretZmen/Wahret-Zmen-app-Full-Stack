// src/components/FadeInSection.jsx
import { motion } from "framer-motion";
import { useEffect, useState, useRef } from "react";

/**
 * FadeInSection
 * ------------------
 * Wraps child elements and animates them into view
 * when they enter the viewport using IntersectionObserver.
 *
 * Props:
 * - children: ReactNode → Content to animate.
 * - delay (number) → Start delay for the animation (default: 0).
 * - yOffset (number) → Vertical offset for entry animation (default: 20px).
 * - duration (number) → Duration of fade-in animation in seconds (default: 0.6).
 * - triggerOnce (boolean) → If true, animation triggers only the first time element appears (default: true).
 * - threshold (number) → % of element visible before animation triggers (0–1, default: 0.1).
 */
const FadeInSection = ({
  children,
  delay = 0,
  yOffset = 20,
  duration = 0.6,
  triggerOnce = true,
  threshold = 0.1,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  /**
   * Setup IntersectionObserver to detect when element is in view.
   * If triggerOnce = true, stop observing after first reveal.
   */
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);

          // Stop observing once it's visible (if triggerOnce = true)
          if (triggerOnce && ref.current) observer.unobserve(ref.current);
        }
      },
      { threshold } // e.g., 0.1 = 10% visible required
    );

    if (ref.current) observer.observe(ref.current);

    // Cleanup observer when component unmounts
    return () => observer.disconnect();
  }, [triggerOnce, threshold]);

  return (
    <motion.div
      ref={ref}
      /** Initial state: hidden + offset */
      initial={{ opacity: 0, y: yOffset }}
      /** Animate to visible if in viewport */
      animate={isVisible ? { opacity: 1, y: 0 } : {}}
      /** Transition timing */
      transition={{ duration, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {children}
    </motion.div>
  );
};

export default FadeInSection;
