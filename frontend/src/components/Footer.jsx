import {
  FaHome,
  FaShoppingCart,
  FaInfoCircle,
  FaPhoneAlt,
  FaEnvelope,
  FaGlobe,
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaTiktok,
} from "react-icons/fa";
import "../Styles/StylesFooter.css";
import { useTranslation } from "react-i18next";
import i18n from "../i18n";

const Footer = () => {
  const { t, i18n } = useTranslation();
    if (!i18n.isInitialized) return null;
  const isRTL = i18n.dir() === "rtl";
  const iconSpacing = isRTL ? "ml-2" : "mr-2";
  const iconTextClass = `flex items-center gap-2 ${isRTL ? "flex-row-reverse text-right" : "text-left"}`;

  return (
    <footer className="bg-gray-200 text-gray-800 py-10 font-[Arial]" dir={i18n.dir()}>
      <div className="max-w-7xl mx-auto px-6 lg:px-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">

        {/* Logo & About */}
        <div>
          <h2 className="text-xl font-bold uppercase mb-4">{t("footer.brand")}</h2>
          <p className="text-sm font-normal text-gray-700">
            {t("footer.description")}
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold uppercase mb-4">{t("footer.quickLinks")}</h3>
          <ul className="space-y-2">
            <li className={iconTextClass}>
              <FaHome className={`text-gray-600 text-lg ${iconSpacing}`} />
              <a href="/" className="text-gray-700 font-medium hover:text-gray-900 transition">
                {t("footer.home")}
              </a>
            </li>
            <li className={iconTextClass}>
              <FaShoppingCart className={`text-gray-600 text-lg ${iconSpacing}`} />
              <a href="/products" className="text-gray-700 font-medium hover:text-gray-900 transition">
                {t("footer.products")}
              </a>
            </li>
            <li className={iconTextClass}>
              <FaInfoCircle className={`text-gray-600 text-lg ${iconSpacing}`} />
              <a href="/about" className="text-gray-700 font-medium hover:text-gray-900 transition">
                {t("footer.about")}
              </a>
            </li>
            <li className={iconTextClass}>
              <FaPhoneAlt className={`text-gray-600 text-lg ${iconSpacing}`} />
              <a href="/contact" className="text-gray-700 font-medium hover:text-gray-900 transition">
                {t("footer.contact")}
              </a>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-lg font-semibold uppercase mb-4">{t("footer.contactUs")}</h3>
          <ul className="space-y-2">
            <li className={iconTextClass}>
              <FaGlobe className={`text-gray-600 text-lg ${iconSpacing}`} />
              <span className="text-gray-700 font-medium">
                {t("footer.location")}
              </span>
            </li>
            <li className={iconTextClass}>
              <FaEnvelope className={`text-gray-600 text-lg ${iconSpacing}`} />
              <a href="mailto:emnabes930@gmail.com" className="text-gray-700 font-medium hover:text-gray-900 transition">
                emnabes930@gmail.com
              </a>
            </li>
            <li className={iconTextClass}>
              <FaEnvelope className={`text-gray-600 text-lg ${iconSpacing}`} />
              <a href="mailto:wahretzmensabri521@gmail.com" className="text-gray-700 font-medium hover:text-gray-900 transition">
                wahretzmensabri521@gmail.com
              </a>
            </li>
            <li className={iconTextClass}>
              <FaPhoneAlt className={`text-gray-600 text-lg ${iconSpacing}`} />
              <span className="text-gray-700 font-medium">+216 55 495 816</span>
            </li>
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="text-lg font-semibold uppercase mb-4">{t("footer.followUs")}</h3>
          <div className={`flex items-center mt-2 ${isRTL ? "justify-end gap-4 flex-row-reverse" : "gap-4"}`}>
            <a href="https://www.facebook.com/Wahret.zmen.jebbacaftan" className="text-gray-600 hover:text-blue-600 transition text-xl">
              <FaFacebookF />
            </a>
            <a href="https://www.instagram.com/wahret_zmen_by_sabri/" className="text-gray-600 hover:text-pink-500 transition text-xl">
              <FaInstagram />
            </a>
            <a href="https://twitter.com" className="text-gray-600 hover:text-blue-400 transition text-xl">
              <FaTwitter />
            </a>
            <a href="https://www.tiktok.com/@wahretzmenbysabri" className="text-gray-600 hover:text-black transition text-xl">
              <FaTiktok />
            </a>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="text-center text-gray-700 font-medium text-sm mt-10 border-t border-gray-400 pt-4">
        © {new Date().getFullYear()} Wahret Zmen. {t("footer.rights")}
      </div>
    </footer>
  );
};

export default Footer;
