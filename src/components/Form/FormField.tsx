// components/FormField/FormField.tsx (Updated)
import React from "react";

interface FormFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  placeholder?: string;
  disabled?: boolean; // Add disabled prop
  readOnly?: boolean; // Add readOnly prop
  className?: string; // To allow external classNames
}

const FormField = ({ label, name, value, onChange, type = "text", placeholder = "", disabled, readOnly, className }: FormFieldProps) => (
  <div>
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      // Apply readOnly and disabled here
      readOnly={readOnly}
      disabled={disabled}
      className={`w-full mt-1 px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500
        ${readOnly || disabled ? 'bg-gray-100 cursor-not-allowed' : ''} ${className || ''}` // Apply classes based on readOnly/disabled
      }
      placeholder={placeholder}
    />
  </div>
);

export default FormField;