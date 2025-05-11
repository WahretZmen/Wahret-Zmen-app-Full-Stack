import React from "react";
import { useTranslation } from "react-i18next";

const Banner1 = () => {
  const { t } = useTranslation();

  return (
    <div className="w-full py-12 bg-[#A67C52] text-center text-white">
      <h2 className="text-3xl font-bold">
        {t("update_product")}
      </h2>
      <p className="mt-2 text-lg">
        {t("update_product_description")}
      </p>
    </div>
  );
};

export default Banner1;
