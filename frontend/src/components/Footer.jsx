// src/components/Footer.jsx
// -----------------------------------------------------------------------------
// Site footer: brand name, quick links, contact info, socials and phone.
// Pure Arabic UI text. RTL layout. No i18n.
// -----------------------------------------------------------------------------

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

const Footer = () => {
  const isRTL = true;
  const iconSpacing = isRTL ? "ml-2" : "mr-2";
  const iconTextClass = `flex items-center gap-2 ${
    isRTL ? "flex-row-reverse text-right" : "text-left"
  }`;

  return (
    <footer className="bg-gray-200 text-gray-800 py-10 font-[Arial]" dir="rtl">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">

        {/* Brand */}
        <div>
          <h2 className="text-xl font-bold uppercase mb-4">وهرة زمان</h2>
          <p className="text-sm font-normal text-gray-700">
          وهرة زمان بوتيك متخصّصة في الجبّة، القفطان والأزياء التقليدية التونسية
            بلمسة عصرية راقية.
          </p>
        </div>

        {/* Quick links */}
        <div>
          <h3 className="text-lg font-semibold uppercase mb-4">روابط سريعة</h3>
          <ul className="space-y-2">
            <li className={iconTextClass}>
              <FaHome className={`text-gray-600 text-lg ${iconSpacing}`} />
              <a href="/" className="text-gray-700 font-medium hover:text-gray-900 transition">
                الرئيسية
              </a>
            </li>
            <li className={iconTextClass}>
              <FaShoppingCart className={`text-gray-600 text-lg ${iconSpacing}`} />
              <a href="/products" className="text-gray-700 font-medium hover:text-gray-900 transition">
                المنتجات
              </a>
            </li>
            <li className={iconTextClass}>
              <FaInfoCircle className={`text-gray-600 text-lg ${iconSpacing}`} />
              <a href="/about" className="text-gray-700 font-medium hover:text-gray-900 transition">
                من نحن
              </a>
            </li>
            <li className={iconTextClass}>
              <FaPhoneAlt className={`text-gray-600 text-lg ${iconSpacing}`} />
              <a href="/contact" className="text-gray-700 font-medium hover:text-gray-900 transition">
                اتصل بنا
              </a>
            </li>
          </ul>
        </div>

        {/* Contact info */}
        <div>
          <h3 className="text-lg font-semibold uppercase mb-4">تواصل معنا</h3>
          <ul className="space-y-2">
            <li className={iconTextClass}>
              <FaGlobe className={`text-gray-600 text-lg ${iconSpacing}`} />
              <span className="text-gray-700 font-medium">
                تونس – وهرة زمان، أزياء تقليدية وعرائسية
              </span>
            </li>
            <li className={iconTextClass}>
              <FaEnvelope className={`text-gray-600 text-lg ${iconSpacing}`} />
              <a
                href="mailto:emnabes930@gmail.com"
                className="text-gray-700 font-medium hover:text-gray-900 transition"
              >
                emnabes930@gmail.com
              </a>
            </li>
            <li className={iconTextClass}>
              <FaEnvelope className={`text-gray-600 text-lg ${iconSpacing}`} />
              <a
                href="mailto:wahretzmensabri521@gmail.com"
                className="text-gray-700 font-medium hover:text-gray-900 transition"
              >
                wahretzmensabri521@gmail.com
              </a>
            </li>
          </ul>
        </div>

        {/* Social + phone */}
        <div className={`flex flex-col justify-between ${isRTL ? "items-end text-right" : "items-start text-left"}`}>
          <div>
            <h3 className="text-lg font-semibold uppercase mb-4">تابعنا على</h3>
            <div className={`flex items-center mt-2 ${isRTL ? "justify-end gap-4 flex-row-reverse" : "gap-4 justify-start"}`}>
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

          <div className={`mt-6 flex items-center text-gray-800 font-semibold text-base ${isRTL ? "flex-row-reverse" : ""}`}>
            <FaPhoneAlt className={`text-gray-700 text-lg ${iconSpacing}`} />
            <span dir="ltr">+216&nbsp;55&nbsp;495&nbsp;816</span>
          </div>
        </div>
      </div>

      <div className="text-center text-gray-700 font-medium text-sm mt-10 border-t border-gray-400 pt-4">
        © {new Date().getFullYear()} وهرة زمان. جميع الحقوق محفوظة.
      </div>
    </footer>
  );
};

export default Footer;
