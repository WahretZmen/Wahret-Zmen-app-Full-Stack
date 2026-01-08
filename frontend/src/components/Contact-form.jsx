// src/components/Contact-form.jsx
// -----------------------------------------------------------------------------
// Simple contact form: name, email, subject, message.
// Sends data to /api/contact and shows success or error messages.
// -----------------------------------------------------------------------------

import React, { useState } from "react";
import axios from "axios";
import getBaseUrl from "../utils/baseURL.js";

const ContactForm = ({ onSuccess }) => {
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // API base URL (dev/prod)
  const API_BASE = getBaseUrl();

  // Update a field when user types
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Submit form to backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await axios.post(
        `${API_BASE}/api/contact`,
        formData,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
          timeout: 15000,
        }
      );

      // Notify parent + reset form on success
      onSuccess?.("تم إرسال رسالتك بنجاح! سنقوم بالرد عليك في أقرب وقت.");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      const serverMsg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        null;
      setError(
        serverMsg ||
          "حدث خطأ أثناء إرسال الرسالة، يرجى المحاولة مرة أخرى."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-form-container">
      <h3 className="contact-title">راسلنا الآن</h3>
      <p className="contact-description">
        املأ النموذج التالي وسنقوم بالرد عليك في أقرب وقت ممكن.
      </p>

      <form onSubmit={handleSubmit} className="contact-form">
        {/* Name */}
        <input
          type="text"
          name="name"
          placeholder="الاسم الكامل"
          value={formData.name}
          onChange={handleChange}
          required
          disabled={loading}
        />

        {/* Email */}
        <input
          type="email"
          name="email"
          placeholder="البريد الإلكتروني"
          value={formData.email}
          onChange={handleChange}
          required
          disabled={loading}
        />

        {/* Subject */}
        <input
          type="text"
          name="subject"
          placeholder="موضوع الرسالة"
          value={formData.subject}
          onChange={handleChange}
          required
          disabled={loading}
        />

        {/* Message */}
        <textarea
          name="message"
          placeholder="اكتب رسالتك هنا..."
          value={formData.message}
          onChange={handleChange}
          required
          disabled={loading}
        />

        {/* Submit button */}
        <button type="submit" disabled={loading}>
          {loading ? "جاري الإرسال..." : "إرسال الرسالة"}
        </button>

        {/* Error message */}
        {error && <p className="error-message">{error}</p>}
      </form>
    </div>
  );
};

export default ContactForm;
