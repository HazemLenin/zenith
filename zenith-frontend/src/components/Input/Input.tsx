import { ReactNode, ChangeEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface InputProps {
  label?: string;
  value: string;
  placeholder?: string;
  type?: string;
  onChangeFun: (e: ChangeEvent<HTMLInputElement>) => void;
  icon?: ReactNode;
  required?: boolean;
  min?: number;
  max?: number;
  error?: string;
  className?: string;
  disabled?: boolean;
}

export default function Input({
  type,
  placeholder,
  label,
  value,
  onChangeFun,
  icon,
  required,
  min,
  max,
  error,
  className = "",
  disabled = false,
}: InputProps) {
  return (
    <div className="w-full">
      <AnimatePresence>
        {label && (
          <motion.label
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="block text-lg mb-2 font-semibold text-text-dark"
          >
            {label}
            {required && <span className="text-danger ml-1">*</span>}
          </motion.label>
        )}
      </AnimatePresence>
      <div className="relative">
        {icon && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-light"
          >
            {icon}
          </motion.div>
        )}
        <motion.input
          type={type}
          className={`w-full px-4 py-3 rounded-xl border transition-all duration-300
            ${
              error
                ? "border-danger focus:ring-danger/50"
                : "border-primary/30 focus:ring-primary/50"
            }
            ${icon ? "pl-10" : ""}
            bg-white placeholder:text-text-light/60
            focus:outline-none focus:ring-2 focus:border-transparent
            disabled:bg-background-light disabled:cursor-not-allowed
            ${className}`}
          placeholder={placeholder}
          value={value}
          onChange={onChangeFun}
          required={required}
          min={min}
          max={max}
          disabled={disabled}
          whileFocus={{ scale: 1.01 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        />
      </div>
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-1 text-sm text-danger"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
