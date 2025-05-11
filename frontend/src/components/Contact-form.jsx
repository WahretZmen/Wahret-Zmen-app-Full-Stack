import React, { useState } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

const ContactForm = ({ onSuccess }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await axios.post('http://localhost:5000/api/contact', formData);
      onSuccess(t("contact.success_message"));
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      setError(t("contact.error_message"));
    }
    setLoading(false);
  };

  return (
    <div className="contact-form-container">
      <h3 className="contact-title">{t("contact.title")}</h3>
      <p className="contact-description">{t("contact.description")}</p>

      <form onSubmit={handleSubmit} className="contact-form">
        <input
          type="text"
          name="name"
          placeholder={t("contact.name_placeholder")}
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder={t("contact.email_placeholder")}
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="subject"
          placeholder={t("contact.subject_placeholder")}
          value={formData.subject}
          onChange={handleChange}
          required
        />
        <textarea
          name="message"
          placeholder={t("contact.message_placeholder")}
          value={formData.message}
          onChange={handleChange}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? t("contact.sending") : t("contact.send_message")}
        </button>
        {error && <p className="error-message">{error}</p>}
      </form>
    </div>
  );
};

export default ContactForm;
