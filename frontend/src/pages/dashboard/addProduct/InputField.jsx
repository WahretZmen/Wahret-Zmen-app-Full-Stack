// src/components/InputField.jsx
import React from "react";

/**
 * InputField Component
 * - Reusable form input with label + react-hook-form register
 *
 * @param {Object} props
 * @param {string} props.label - Label text
 * @param {string} props.name - Field name for react-hook-form
 * @param {string} [props.type="text"] - Input type (text, email, password…)
 * @param {Function} props.register - react-hook-form register function
 * @param {string} [props.placeholder] - Input placeholder text
 * @param {boolean} [props.required=true] - Whether the field is required
 */
const InputField = ({
  label,
  name,
  type = "text",
  register,
  placeholder,
  required = true,
}) => {
  const inputId = `input-${name}`;

  return (
    <div className="mb-4">
      {/* Label linked with input for accessibility */}
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
        </label>
      )}

      {/* Input */}
      <input
        id={inputId}
        type={type}
        {...register(name, { required })}
        placeholder={placeholder}
        className="w-full px-3 py-2 border border-gray-300 rounded-md 
                   text-gray-800 placeholder-gray-400
                   focus:outline-none focus:ring-2 focus:ring-[#8B5C3E] focus:border-[#8B5C3E]
                   transition duration-200"
      />
    </div>
  );
};

export default InputField;
