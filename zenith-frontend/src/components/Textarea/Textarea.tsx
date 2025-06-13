import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface TextareaProps {
  label?: string;
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
  error?: string;
  className?: string;
  disabled?: boolean;
  required?: boolean;
  rows?: number;
  maxLength?: number;
}

export const Textarea: React.FC<TextareaProps> = ({
  label,
  value,
  placeholder,
  onChange,
  error,
  className = "",
  disabled = false,
  required = false,
  rows = 4,
  maxLength,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className={`relative ${className}`}>
      <AnimatePresence>
        {label && (
          <motion.label
            className="block text-sm font-medium text-gray-700 mb-1"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </motion.label>
        )}
      </AnimatePresence>

      <motion.div
        className={`relative rounded-lg transition-all duration-200 ${
          error
            ? "ring-2 ring-red-500"
            : isFocused
            ? "ring-2 ring-primary"
            : "ring-1 ring-gray-300"
        } ${disabled ? "bg-gray-100" : "bg-white"}`}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          rows={rows}
          maxLength={maxLength}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`w-full px-4 py-3 rounded-lg outline-none resize-none transition-all duration-200 ${
            disabled ? "cursor-not-allowed text-gray-500" : "text-gray-900"
          }`}
        />
        {maxLength && (
          <div className="absolute bottom-2 right-2 text-xs text-gray-500">
            {value.length}/{maxLength}
          </div>
        )}
      </motion.div>

      <AnimatePresence>
        {error && (
          <motion.p
            className="mt-1 text-sm text-red-500"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};
