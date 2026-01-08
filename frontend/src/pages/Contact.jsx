// src/pages/Contact.jsx
// -----------------------------------------------------------------------------
// Contact page: contact info + contact form + Google map
// -----------------------------------------------------------------------------

import React, { useState, useEffect } from "react";
import ContactForm from "../components/Contact-form.jsx";
import "../Styles/StylesContact.css";
import "../Styles/StylesContact-form.css";
import FadeInSection from "../Animations/FadeInSection.jsx";
import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";

const Contact = () => {
  const [successMessage, setSuccessMessage] = useState(null);

  // Scroll to top on mount (and handle #top/hash usage)
  const location = useLocation();
  useEffect(() => {
    const shouldScroll =
      location.hash === "#top" ||
      Boolean(location.state && location.state.scrollTop) ||
      true;

    if (shouldScroll) {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });

      // Clean the hash so it does not jump again
      if (location.hash === "#top" && window.history.replaceState) {
        const { pathname, search } = window.location;
        window.history.replaceState(null, "", pathname + search);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div id="top" className="main-content">
      <FadeInSection>
        <div
          className="contact-container px-4 sm:px-6 md:px-10 lg:px-20 max-w-[1440px] mx-auto py-10"
          // Safe offset so the hero/title is not hidden under a fixed header
          style={{
            paddingTop:
              "calc(var(--header-h, 64px) + env(safe-area-inset-top, 0px) + 8px)",
          }}
        >
          {/* SEO meta title */}
          <Helmet>
            <title>اتصل بنا | هرة زمان</title>
          </Helmet>

          {/* Page heading */}
          <h2
            className="contact-title contact-title-desktop text-3xl font-bold text-center text-[#5a382d] mb-2"
            // When scrolled to via anchor, keep some space from the navbar
            style={{
              scrollMarginTop:
                "calc(var(--header-h, 64px) + env(safe-area-inset-top, 0px) + 12px)",
            }}
          >
            اتصل بنا
          </h2>

          {/* Short description */}
          <p className="contact-subtitle text-center text-gray-600 mb-6">
            يسعدنا تواصلكم لأي استفسار أو طلب بخصوص منتجات وهرة زمان.
          </p>

          {/* Static contact information */}
          <div className="contact-info text-center text-gray-700 mb-8">
            <p>
              <strong>العنوان:</strong>{" "}
              Tunis, Rue Mohamed Abd el Wahab, Résidence Green Manar 1, Bloc C,
              App. 22
            </p>
            <p>
              <strong>البريد الإلكتروني:</strong> emnabes930@gmail.com
            </p>
            <p>wahretzmensabri521@gmail.com</p>
            <p>
              <strong>الهاتف:</strong>{" "}
              {/* Force LTR so the phone digits are not reversed in RTL */}
              <span dir="ltr" style={{ unicodeBidi: "bidi-override" }}>
                +216 12 345 678
              </span>
            </p>
          </div>

          {/* Layout: form + map */}
          <div className="contact-content flex flex-col lg:flex-row gap-10 items-start justify-center">
            {/* Left side: form */}
            <div className="contact-left w-full lg:w-1/2">
              <ContactForm onSuccess={setSuccessMessage} />
              {successMessage && (
                <p className="message-status">{successMessage}</p>
              )}
            </div>

            {/* Right side: Google map */}
            <div className="contact-right w-full lg:w-1/2">
              <div className="google-map w-full h-[300px] md:h-[400px] rounded-lg overflow-hidden">
                <iframe
                  title="Google Maps"
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  style={{ border: 0 }}
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3194.899436156162!2d10.168883975609846!3d36.79696146788252!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12fd353026677d91%3A0xf877b7effea31709!2ssabri%20wahret%20zmen!5e0!3m2!1sfr!2stn!4v1741992302530!5m2!1sfr!2stn"
                  allowFullScreen
                  loading="lazy"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </FadeInSection>
    </div>
  );
};

export default Contact;
