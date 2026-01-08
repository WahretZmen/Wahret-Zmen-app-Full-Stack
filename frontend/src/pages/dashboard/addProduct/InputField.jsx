// src/components/InputField.jsx
// -----------------------------------------------------------------------------
// Reusable InputField
// -----------------------------------------------------------------------------
// Purpose:
//   A small, accessible form input with an optional label that plugs directly
//   into react-hook-form via the provided `register` function.
//
// Usage:
//   <InputField
//     label="Email"
//     name="email"
//     type="email"
//     register={register}
//     placeholder="you@example.com"
//   />
//
// Notes:
//   - Keeps styling utility-first (Tailwind classes).
//   - Does not manage local state; leaves value/validation to react-hook-form.
//   - Adds basic accessibility via a <label htmlFor=...> and a stable input id.
//   - No runtime behavior changes from your original component.
// -----------------------------------------------------------------------------

import React from "react";

/**
 * @param {Object}   props
 * @param {string}   props.label        - Optional label text shown above input
 * @param {string}   props.name         - Field name used by react-hook-form
 * @param {string}  [props.type="text"] - Input type (text, email, password, etc.)
 * @param {Function} props.register     - react-hook-form `register` function
 * @param {string}  [props.placeholder] - Optional placeholder
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
  // Stable id so the label is associated with the input for screen readers
  const inputId = `input-${name}`;

  return (
    <div className="mb-4">
      {/* -------- Label (optional) -------- */}
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
        </label>
      )}

      {/* -------- Input control -------- */}
      <input
        id={inputId}
        type={type}
        // react-hook-form registration + built-in required rule
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
