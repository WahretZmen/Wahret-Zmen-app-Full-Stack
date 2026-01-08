// src/components/AboutWahretZmen.jsx
// -----------------------------------------------------------------------------
// About section for Wahret Zmen.
// Arabic-only text with a two-column layout (story + feature cards).
// -----------------------------------------------------------------------------

import React from "react";
import { Award, Heart, Sparkles } from "lucide-react";
import "../Styles/StylesAboutWahretZmen.css";

const AboutWahretZmen = () => {
  const isRTL = true;

  return (
    <section className="wz-about-basic" dir={isRTL ? "rtl" : "ltr"}>
      <div className="wz-container">
        <div className="wz-grid">
          {/* Left column: story and CTA */}
          <div className="wz-left wz-anim-slide-left">
            <h2 className="wz-title wz-anim-fade-up">
              فن الأناقة التقليدية
            </h2>

            <p className="wz-paragraph wz-anim-delay-200">
              في <strong>وهرة زمان باي صبري</strong> نحافظ على ثراء الحرف
              التقليدية مع لمسة عصرية راقية. كل جبّة تُنسج وتُخاط يدوياً بعناية
              على يد حرفيين ذوي خبرة، توارثوا أسرار المهنة عبر الأجيال.
            </p>

            <p className="wz-paragraph wz-anim-delay-300">
              نؤمن أن كل قطعة تحمل قصة، لذلك نختار تفاصيلنا بعناية لنقدّم لكم
              تصاميم أصيلة تجمع بين روح التراث التونسي وجمال الأناقة الحديثة.
            </p>

            <a href="/products" className="wz-btn wz-btn-luxury wz-anim-delay-400">
              اكتشفوا مجموعتنا
            </a>
          </div>

          {/* Right column: three feature cards */}
          <div className="wz-right wz-anim-slide-right">
            {/* Card 1: Craftsmanship */}
            <div className="wz-card wz-anim-delay-200">
              <div className="wz-icon">
                <Award />
              </div>
              <div className="wz-card-content">
                <h3 className="wz-card-title">حرفية متقنة</h3>
                <p className="wz-card-text">
                  كل جبّة تُصنع يدوياً بخطوات دقيقة، من القصّ إلى الخياطة، لضمان
                  تناسق مثالي وجودة تدوم لسنوات.
                </p>
              </div>
            </div>

            {/* Card 2: Heritage */}
            <div className="wz-card wz-anim-delay-300">
              <div className="wz-icon">
                <Heart />
              </div>
              <div className="wz-card-content">
                <h3 className="wz-card-title">تراث أصيل</h3>
                <p className="wz-card-text">
                  تصاميمنا مستوحاة من اللباس التقليدي التونسي، مع لمسات حديثة
                  تحافظ على روح الهوية وتمنحكم راحة وحرية في الحركة.
                </p>
              </div>
            </div>

            {/* Card 3: Quality */}
            <div className="wz-card wz-anim-delay-400">
              <div className="wz-icon">
                <Sparkles />
              </div>
              <div className="wz-card-content">
                <h3 className="wz-card-title">جودة فاخرة</h3>
                <p className="wz-card-text">
                  نعتمد على أقمشة مختارة بعناية وخامات عالية الجودة، لتكون كل
                  جبّة قطعة مميزة تليق بالمناسبات الخاصة واليومية.
                </p>
              </div>
            </div>
          </div>
          {/* /Right column */}
        </div>
      </div>
    </section>
  );
};

export default AboutWahretZmen;
