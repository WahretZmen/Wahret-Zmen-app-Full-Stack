// src/components/CraftsmanshipShowcase.jsx
// -----------------------------------------------------------------------------
// Craftsmanship showcase: four cards highlighting key values of the brand.
// Arabic-only text with icons and subtle animations.
// -----------------------------------------------------------------------------

import React from "react";
import { Card, CardContent } from "./ui/card.jsx";
import { Scissors, Palette, Crown, Heart } from "lucide-react";

const CraftsmanshipShowcase = () => {
  const isRTL = true;

  // Static Arabic content for the four cards
  const items = [
    {
      title: "تصاميم مستوحاة بعناية",
      desc: "لوحة ألوان متناسقة وخطوط مدروسة تمنح كل جبّة لمسة من الأناقة الخالدة.",
      icon: Palette,
      delay: 100,
    },
    {
      title: "خياطة يدوية دقيقة",
      desc: "كل تفصيلة من القصّ إلى التطريز تمرّ بين أيدي حرفيين متمرسين يحترمون أصول المهنة.",
      icon: Scissors,
      delay: 200,
    },
    {
      title: "أقمشة وخامات فاخرة",
      desc: "اختيار دقيق للأقمشة الراقية ليشعر العميل بالراحة والفخامة في كل مناسبة.",
      icon: Crown,
      delay: 300,
    },
    {
      title: "صناعة بروح وشغف",
      desc: "كل قطعة تحمل جزءًا من قصة وهرة زمان، وتُصنع بحبّ للتراث واعتزاز بالهوية التونسية.",
      icon: Heart,
      delay: 400,
    },
  ];

  return (
    <section
      className="py-16 md:py-20 bg-[#ffffff]"
      dir={isRTL ? "rtl" : "ltr"}
      aria-label="فن الحرفة في وهرة زمان"
    >
      <div className="container mx-auto px-4">
        {/* Title + Subtitle */}
        <div className="text-center mb-10 md:mb-14 anim-fade-up">
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#1e1b16] mb-3">
            فن الحرفة في وهرة زمان
          </h2>
          <p className="text-base md:text-xl text-[#7a6f63] max-w-3xl mx-auto">
            اكتشفوا المراحل الدقيقة وراء كل جبّة، حيث تلتقي التقنيات التقليدية
            بدقة التنفيذ الحديثة لخلق قطع مميزة تدوم لسنوات.
          </p>
        </div>

        {/* Grid – visual order stays LTR while text is RTL */}
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
                {/* Icon circle */}
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
