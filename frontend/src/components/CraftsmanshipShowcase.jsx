// src/components/CraftsmanshipShowcase.jsx
import React from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent } from "./ui/card.jsx";
import { Scissors, Palette, Crown, Heart } from "lucide-react";

/**
 * CraftsmanshipShowcase
 * --------------------------------------------------
 * Presents 4 feature cards (icon + title + description)
 * explaining the brand's craftsmanship pillars.
 *
 * i18n:
 * - Reads an array from "craftsmanship.items" (title/desc).
 * - Falls back to hardcoded items if translations are missing.
 * - Preserves RTL/LTR via dir on the <section>.
 */
const CraftsmanshipShowcase = () => {
  const { t, i18n } = useTranslation();
  if (!i18n.isInitialized) return null;

  const isRTL = i18n.language?.startsWith("ar");

  // Try to read translated items (array of { title, desc })
  const i18nItems = t("craftsmanship.items", { returnObjects: true });

  // Fallback content (icons + default strings)
  const fallback = [
    {
      title: t("craftsmanship.fallback.paletteTitle", "Inspired Design"),
      desc: t(
        "craftsmanship.fallback.paletteDesc",
        "A refined color palette guides every jebba for timeless elegance."
      ),
      icon: Palette,
      delay: 100,
    },
    {
      title: t("craftsmanship.fallback.scissorsTitle", "Hand Tailoring"),
      desc: t(
        "craftsmanship.fallback.scissorsDesc",
        "Precise cutting and sewing preserve heritage with modern technique."
      ),
      icon: Scissors,
      delay: 200,
    },
    {
      title: t("craftsmanship.fallback.crownTitle", "Premium Materials"),
      desc: t(
        "craftsmanship.fallback.crownDesc",
        "Natural silk and noble textiles selected for comfort and prestige."
      ),
      icon: Crown,
      delay: 300,
    },
    {
      title: t("craftsmanship.fallback.heartTitle", "Made with Passion"),
      desc: t(
        "craftsmanship.fallback.heartDesc",
        "Each piece is crafted with care, celebrating Tunisian heritage."
      ),
      icon: Heart,
      delay: 400,
    },
  ];

  /**
   * Merge translated items with fallback:
   * - If i18nItems is a non-empty array, override only title/desc per index.
   * - Keep icon and delay from fallback to avoid breaking visuals.
   */
  const items =
    Array.isArray(i18nItems) && i18nItems.length
      ? fallback.map((base, i) => ({
          ...base,
          title: i18nItems[i]?.title ?? base.title,
          desc: i18nItems[i]?.desc ?? base.desc,
        }))
      : fallback;

  return (
    <section
      className="py-16 md:py-20 bg-[#ffffff]"
      dir={isRTL ? "rtl" : "ltr"}
      aria-label={t("craftsmanship.aria", "The Art of Craftsmanship")}
    >
      <div className="container mx-auto px-4">
        {/* Title + Subtitle */}
        <div className="text-center mb-10 md:mb-14 anim-fade-up">
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#1e1b16] mb-3">
            {t("craftsmanship.title", "The Art of Craftsmanship")}
          </h2>
          <p className="text-base md:text-xl text-[#7a6f63] max-w-3xl mx-auto">
            {t(
              "craftsmanship.subtitle",
              "Discover the meticulous process behind each jebba, where traditional techniques meet modern precision to create timeless masterpieces."
            )}
          </p>
        </div>

        {/* Grid (forced visual LTR so card order stays consistent in RTL UIs) */}
        <div dir="ltr" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-7">
          {items.map(({ icon: Icon, title, desc, delay }, i) => (
            <Card
              key={i}
              className="group rounded-2xl border border-[#eee] bg-white
                         shadow-[0_10px_25px_rgba(0,0,0,.08)]
                         hover:shadow-[0_16px_40px_rgba(0,0,0,.12)]
                         transition-all duration-400 hover:-translate-y-1.5
                         anim-fade-up anim-delay"
              style={{ "--d": `${delay}ms` }}
            >
              <CardContent className="p-8">
                {/* Icon bubble + subtle bounce */}
                <div
                  className="mx-auto mb-6 flex items-center justify-center
                             w-16 h-16 rounded-full
                             bg[#FBE9DD] bg-[#FBE9DD] ring-1 ring-[#F2D6C3]
                             icon-bounce icon-delay"
                  style={{ "--d": `${delay}ms` }}
                >
                  <Icon className="w-8 h-8 text-[#A67C52]" />
                </div>

                {/* Title */}
                <h3
                  className="text-lg md:text-xl font-semibold text-[#2D2A26] text-center mb-3
                             group-hover:text-[#A67C52] transition-colors"
                >
                  {title}
                </h3>

                {/* Description */}
                <p className="text-sm md:text-base leading-relaxed text-[#6E6A64] text-center">
                  {desc}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CraftsmanshipShowcase;
