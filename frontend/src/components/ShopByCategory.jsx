import React from "react";
import { Link } from "react-router-dom";
import "../Styles/StylesCategories.css";

// ✅ import local images (these paths look correct for /src/components/ → /src/assets/)
import hommeJebba from "../assets/Jebbas/Hommes/Jebba-Homme.jpg";
import femmeJebba from "../assets/Jebbas/Femmes/Jebba-Femme.jpg";
import enfantJebba from "../assets/Jebbas/Enfants/Jebba-Enfant.jpg";

const DEFAULT_ITEMS = [
  {
    key: "hommes",
    label: "HOMMES",
    image: hommeJebba,
    to: "/products?category=hommes",   // ✅ link to Products.jsx with query
  },
  {
    key: "femmes",
    label: "FEMMES",
    image: femmeJebba,
    to: "/products?category=femmes",
  },
  {
    key: "enfants",
    label: "ENFANTS",
    image: enfantJebba,
    to: "/products?category=enfants",
  },
];




const ShopByCategory = ({ items = DEFAULT_ITEMS, title = "Achetez par Catégorie" }) => {
  return (
    <section className="mx-auto max-w-6xl px-4 sm:px-6 md:px-8 my-12">
      <h2 className="text-center text-[15px] sm:text-base font-semibold tracking-wide text-gray-800 mb-6">
        {title}<span className="ml-1">🔥</span>
      </h2>

     <div className="flex justify-center gap-10 flex-wrap">
  {items.map((it) => (
    <Link
      key={it.key}
      to={it.to}
      className="group w-32 sm:w-40 lg:w-48 flex flex-col items-center"
    >
      {/* Circular image */}
      <span className="relative block w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48 rounded-full ring-2 ring-gray-200 overflow-hidden bg-white shadow-md transition-transform duration-200 group-hover:-translate-y-2">
        <img
          src={it.image}
          alt={it.label}
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
        />
      </span>

      {/* Label */}
      <span className="mt-4 text-base sm:text-lg font-bold tracking-wide text-gray-900 uppercase group-hover:opacity-90">
        {it.label}
      </span>
    </Link>
  ))}
</div>


      <div className="text-center mt-8">
        <Link to="/categories" className="inline-block text-sm font-semibold underline underline-offset-2 hover:opacity-80">
          Voir plus &gt;
        </Link>
      </div>
    </section>
  );
};

export default ShopByCategory;
