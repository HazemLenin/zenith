import React from "react";

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  className?: string;
}

export const Switch: React.FC<SwitchProps> = ({
  checked,
  onChange,
  label,
  className = "",
}) => {
  return (
    <label className={`inline-flex items-center cursor-pointer ${className}`}>
      <div className="relative">
        <input
          type="checkbox"
          className="sr-only"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
        <div
          className={`block w-14 h-8 rounded-full transition-colors duration-200 ease-in-out ${
            checked ? "bg-primary" : "bg-gray-300"
          }`}
        ></div>
        <div
          className={`absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform duration-200 ease-in-out ${
            checked ? "transform translate-x-6" : ""
          }`}
        ></div>
      </div>
      {label && <span className="ml-3 text-gray-700">{label}</span>}
    </label>
  );
};
