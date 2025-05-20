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
          observer.unobserve(entry.target);
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
    ? direction === "fade-rotate-zoom"
      ? "fade-in-rotate-zoom"
      : direction === "right-to-left"
        ? "fade-in-right-to-left"
        : `fade-in-${direction}`
    : "hidden-before-scroll";

  return (
    <div
      ref={ref}
      style={{ animationDelay: `${delay}s` }}
      className={
        typeof children?.type === "string"
          ? "" // If the child is a native element like <img>, we pass the class inside it
          : directionClass
      }
    >
      {typeof children?.type === "string"
        ? React.cloneElement(children, {
            className: `${children.props.className || ""} ${directionClass}`,
          })
        : children}
    </div>
  );
};


export default ScrollFade;



