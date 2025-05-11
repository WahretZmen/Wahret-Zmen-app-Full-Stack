import React, { useState } from 'react';
import ContactForm from '../components/Contact-form.jsx';
import "../Styles/StylesContact.css";
import "../Styles/StylesContact-form.css";
import FadeInSection from '../Animations/FadeInSection.jsx';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';


const Contact = () => {
  const { t, i18n } = useTranslation();
    if (!i18n.isInitialized) return null;
  const [successMessage, setSuccessMessage] = useState(null);

  return (
    <div className='main-content'>
    <FadeInSection>
      <div className="contact-container px-4 sm:px-6 md:px-10 lg:px-20 max-w-[1440px] mx-auto py-10">
        <Helmet>
          <title>{t("contact.page_title")}</title>
        </Helmet>

        <h2 className="contact-title text-3xl font-bold text-center text-[#5a382d] mb-2">
          {t("contact.heading")}
        </h2>
        <p className="contact-subtitle text-center text-gray-600 mb-6">
          {t("contact.subtitle")}
        </p>

        <div className="contact-info text-center text-gray-700 mb-8">
          <p><strong>{t("contact.address_label")}:</strong> {t("contact.address_value")}</p>
          <p><strong>{t("contact.email_label")}:</strong> emnabes930@gmail.com</p>
          <p>wahretzmensabri521@gmail.com</p>
          <p><strong>{t("contact.phone_label")}:</strong>{' '}
          <span dir="ltr" style={{ unicodeBidi: 'bidi-override' }}>+216 12 345 678</span>
          </p>

        </div>

        <div className="contact-content flex flex-col lg:flex-row gap-10 items-start justify-center">
          <div className="contact-left w-full lg:w-1/2">
            <ContactForm onSuccess={setSuccessMessage} />
            {successMessage && <p className="message-status">{successMessage}</p>}
          </div>

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
