// src/components/ContactForm.jsx
import React, { useState } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";

/**
 * 📩 ContactForm
 * ----------------------------
 * A multilingual contact form with:
 * - name, email, subject, and message inputs
 * - POST request to backend /api/contact
 * - Loading + error handling
 * - Callback (onSuccess) for parent component integration
 *
 * Props:
 * - onSuccess: function → called with a success message when the form submits successfully
 */
const ContactForm = ({ onSuccess }) => {
  const { t } = useTranslation();

  /* --------------------------------
   * State
   * -------------------------------- */
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /* --------------------------------
   * Handlers
   * -------------------------------- */
  // Update form fields
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // 🔗 Adjust URL for production vs local if needed
      await axios.post("http://localhost:5000/api/contact", formData);

      // Success callback + reset form
      onSuccess(t("contact.success_message"));
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      setError(t("contact.error_message"));
    }

    setLoading(false);
  };

  /* --------------------------------
   * Render
   * -------------------------------- */
  return (
    <div className="contact-form-container">
      <h3 className="contact-title">{t("contact.title")}</h3>
      <p className="contact-description">{t("contact.description")}</p>

      <form onSubmit={handleSubmit} className="contact-form">
        {/* Name */}
        <input
          type="text"
          name="name"
          placeholder={t("contact.name_placeholder")}
          value={formData.name}
          onChange={handleChange}
          required
        />

        {/* Email */}
        <input
          type="email"
          name="email"
          placeholder={t("contact.email_placeholder")}
          value={formData.email}
          onChange={handleChange}
          required
        />

        {/* Subject */}
        <input
          type="text"
          name="subject"
          placeholder={t("contact.subject_placeholder")}
          value={formData.subject}
          onChange={handleChange}
          required
        />

        {/* Message */}
        <textarea
          name="message"
          placeholder={t("contact.message_placeholder")}
          value={formData.message}
          onChange={handleChange}
          required
        />

        {/* Submit Button */}
        <button type="submit" disabled={loading}>
          {loading ? t("contact.sending") : t("contact.send_message")}
        </button>

        {/* Error Message */}
        {error && <p className="error-message">{error}</p>}
      </form>
    </div>
  );
};

export default ContactForm;
