import React, { useState, useRef, useEffect } from "react";
import "../Styles/StylesAnimations.css";

const ScrollFade = ({ children, direction = "right", delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target); // Only once
        }
      },
      { threshold: 0.1 }
    );

    const el = ref.current;
    if (el) observer.observe(el);

    return () => {
      if (el) observer.unobserve(el);
    };
  }, []);

  const directionClass = isVisible
  ? direction === "right-to-left"
    ? "fade-in-right-to-left"
    : `fade-in-${direction}`
  : "hidden-before-scroll";

  return (
    <div
      ref={ref}
      className={directionClass}
      style={{ animationDelay: `${delay}s` }}
    >
      {children}
    </div>
  );
};

export default ScrollFade;
