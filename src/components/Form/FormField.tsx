// components/FormField/FormField.tsx
import React from "react";

interface FormFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  type?: string;
  placeholder?: string;
  disabled?: boolean;
  readOnly?: boolean;
  className?: string;
  requireField?: boolean;
  isSelect?: boolean;
  options?: { label: string; value: string }[];
}

const RequireField = (text: string): React.ReactNode => {
  return (
    <span>
      {text} <span className="text-red-500">*</span>
    </span>
  );
};

const FormField = ({
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder = "",
  disabled,
  readOnly,
  className,
  requireField = false,
  isSelect = false,
  options = [],
}: FormFieldProps) => {
  const labelContent = requireField ? RequireField(label) : label;

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">
        {labelContent}
      </label>

      {isSelect ? (
        <select
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={`w-full mt-1 px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500
            ${disabled ? "bg-gray-100 cursor-not-allowed" : ""} ${className || ""}`}
        >
          <option value="" disabled>
            {placeholder || "-- Select an option --"}
          </option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          readOnly={readOnly}
          disabled={disabled}
          className={`w-full mt-1 px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500
            ${readOnly || disabled ? "bg-gray-100 cursor-not-allowed" : ""} ${className || ""}`}
          placeholder={placeholder}
        />
      )}
    </div>
  );
};

export default FormField;
