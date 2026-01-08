// src/components/ShopByCategory.jsx
// Shop by category (Arabic / RTL)

import React from "react";
import { Link } from "react-router-dom";
import "../Styles/ShopByCategory.css";

import hommeJebba from "../assets/Jebbas/Hommes/Jebba-Homme.jpg";
import femmeJebba from "../assets/Jebbas/Femmes/Jebba-Femme.jpg";
import enfantJebba from "../assets/Jebbas/Enfants/Jebba-Enfant.jpg";

const DEFAULT_ITEMS = [
  { key: "hommes", label: "رجال", image: hommeJebba, to: "/products?category=hommes" },
  { key: "femmes", label: "نساء", image: femmeJebba, to: "/products?category=femmes" },
  { key: "enfants", label: "أطفال", image: enfantJebba, to: "/products?category=enfants" },
];

const getLabel = (label) => {
  if (!label) return "";
  if (typeof label === "string") return label;
  if (typeof label === "object") return label.ar || label.fr || "";
  return String(label);
};

const ShopByCategory = ({ items = DEFAULT_ITEMS, title = "تسوّق حسب الفئة" }) => {
  const isRTL = true;
  const overline = "المجموعة";
  const cta = "اكتشف";

  return (
    <section className="shopcat-section" aria-label="تسوّق حسب الفئة" dir={isRTL ? "rtl" : "ltr"}>
      <div className="shopcat-head">
        <h2 className="shopcat-title">{title}</h2>
      </div>

      <div className="shopcat-grid">
        {items.map((it, idx) => {
          const titleText = getLabel(it.label);

          return (
            <Link
              key={it.key || idx}
              to={it.to}
              className="cat-card"
              style={{ "--i": idx }}
              aria-label={`${overline} – ${titleText}`}
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              <div className="cat-media">
                <img
                  src={it.image}
                  alt={titleText}
                  loading="lazy"
                  decoding="async"
                  onDragStart={(e) => e.preventDefault()}
                />
              </div>

              <div className="cat-overlay">
                <span className="cat-overline">{overline}</span>
                <h3 className="cat-title">{titleText}</h3>
                <span className="cat-cta">{cta}</span>
                <span className="cat-underline" aria-hidden="true" />
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default ShopByCategory;
