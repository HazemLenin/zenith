import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";

type Option = {
  label: string;
  value: string;
  icon?: React.ReactNode;
  description?: string;
};

type DropdownProps = {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  variant?: "default" | "primary" | "secondary";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  error?: string;
  searchable?: boolean;
  maxHeight?: string;
  className?: string;
};

const Dropdown: React.FC<DropdownProps> = ({
  options,
  value,
  onChange,
  placeholder = "Select an option",
  label,
  variant = "default",
  size = "md",
  disabled = false,
  error,
  searchable = false,
  maxHeight = "max-h-60",
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((option) => option.value === value);
  const filteredOptions = searchable
    ? options.filter((option) =>
        option.label.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : options;

  const sizeClasses = {
    sm: "text-sm py-1.5",
    md: "text-base py-2",
    lg: "text-lg py-2.5",
  };

  const variantClasses = {
    default: {
      button: "border-primary/30 focus:ring-primary/50",
      option: "hover:bg-primary/5 active:bg-primary/10",
      selected: "bg-primary/10 text-primary",
      search: "border-primary/20 focus:border-primary",
    },
    primary: {
      button: "border-primary focus:ring-primary/50 bg-primary/5",
      option: "hover:bg-primary/10 active:bg-primary/20",
      selected: "bg-primary/20 text-primary",
      search: "border-primary/30 focus:border-primary",
    },
    secondary: {
      button: "border-secondary/30 focus:ring-secondary/50",
      option: "hover:bg-secondary/5 active:bg-secondary/10",
      selected: "bg-secondary/10 text-secondary",
      search: "border-secondary/20 focus:border-secondary",
    },
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {label && (
        <motion.label
          initial={false}
          animate={{
            y: isFocused || value ? -8 : 0,
            scale: isFocused || value ? 0.85 : 1,
            color:
              isFocused || value
                ? "var(--color-primary)"
                : "var(--color-text-light)",
          }}
          className="absolute left-3 transition-all duration-200 pointer-events-none z-10 bg-white px-1"
        >
          {label}
        </motion.label>
      )}
      <motion.button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        onFocus={() => !disabled && setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        disabled={disabled}
        whileHover={!disabled ? { scale: 1.01 } : undefined}
        whileTap={!disabled ? { scale: 0.99 } : undefined}
        className={`w-full px-4 ${
          sizeClasses[size]
        } text-left bg-white border rounded-xl
          focus:outline-none focus:ring-2 focus:border-transparent
          transition-all duration-200 flex items-center justify-between
          ${variantClasses[variant].button}
          ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
          ${error ? "border-danger focus:ring-danger/50" : ""}
          ${label ? "pt-6" : ""}`}
      >
        <span className="block truncate text-text-dark">
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <FontAwesomeIcon
            icon={faChevronDown}
            className="w-3 h-3 text-text-light"
          />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{
              type: "spring",
              stiffness: 500,
              damping: 30,
              duration: 0.2,
            }}
            className={`absolute z-10 w-full mt-1 bg-white border border-gray-200/50 rounded-xl shadow-hover ${maxHeight} overflow-auto backdrop-blur-sm`}
          >
            {searchable && (
              <div className="sticky top-0 p-2 bg-white/80 backdrop-blur-sm border-b border-gray-200/50">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search..."
                  className={`w-full px-3 py-1.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 ${variantClasses[variant].search}`}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            )}
            {filteredOptions.map((option, index) => (
              <motion.div
                key={option.value}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`px-4 ${
                  sizeClasses[size]
                } cursor-pointer transition-colors duration-200 text-text-dark flex items-center gap-2
                  ${variantClasses[variant].option}
                  ${
                    option.value === value
                      ? variantClasses[variant].selected
                      : ""
                  }`}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                  setSearchQuery("");
                }}
                whileHover={{ x: 4 }}
              >
                {option.icon && (
                  <span className="flex-shrink-0">{option.icon}</span>
                )}
                <div className="flex-1">
                  <div className="font-medium">{option.label}</div>
                  {option.description && (
                    <div className="text-sm text-text-light">
                      {option.description}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
            {filteredOptions.length === 0 && (
              <div className="px-4 py-2 text-sm text-text-light text-center">
                No options found
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-1 text-sm text-danger"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
};

export default Dropdown;
