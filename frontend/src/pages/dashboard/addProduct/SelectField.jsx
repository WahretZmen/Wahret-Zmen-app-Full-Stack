// src/components/SelectField.jsx
import React from "react";

/**
 * SelectField Component
 * - Reusable select dropdown with label + react-hook-form register
 *
 * @param {Object} props
 * @param {string} props.label - Label text
 * @param {string} props.name - Field name for react-hook-form
 * @param {Array<{ value: string, label: string }>} props.options - Dropdown options
 * @param {Function} props.register - react-hook-form register function
 * @param {boolean} [props.required=true] - Whether the field is required
 */
const SelectField = ({ label, name, options = [], register, required = true }) => {
  const selectId = `select-${name}`;

  return (
    <div className="mb-4">
      {/* Label */}
      {label && (
        <label
          htmlFor={selectId}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
        </label>
      )}

      {/* Select dropdown */}
      <select
        id={selectId}
        {...register(name, { required })}
        className="w-full px-3 py-2 border border-gray-300 rounded-md 
                   text-gray-800 placeholder-gray-400
                   focus:outline-none focus:ring-2 focus:ring-[#8B5C3E] focus:border-[#8B5C3E]
                   transition duration-200"
      >
        {/* Default placeholder option */}
        <option value="" disabled selected>
          -- Select {label} --
        </option>

        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectField;
