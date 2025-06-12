import React from "react";
import Spinner from "../shared/Spinner";

interface ButtonProps {
  children: React.ReactNode;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  variant?: "primary" | "secondary" | "danger";
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  className?: string;
  shape?: "default" | "square";
  isLoading?: boolean;
  loadingText?: string;
  ariaLabel?: string;
}

export default function Button({
  children,
  onClick,
  variant = "primary",
  disabled,
  type = "button",
  className = "",
  shape = "default",
  isLoading = false,
  loadingText,
  ariaLabel,
}: ButtonProps) {
  const baseStyles =
    "flex items-center justify-center transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2";

  const shapeStyles = {
    default: "w-full py-3 px-3 rounded-lg",
    square: "w-10 h-10 p-2 rounded",
  };

  const variantStyles = {
    primary:
      "bg-primary text-white hover:bg-primary-active hover:text-white focus:ring-primary",
    secondary:
      "bg-secondary text-white hover:bg-white hover:text-black focus:ring-secondary",
    danger:
      "bg-red-700 text-white hover:bg-red-800 hover:text-white focus:ring-red-600",
  };

  return (
    <button
      onClick={onClick}
      className={`${baseStyles} ${shapeStyles[shape]} ${variantStyles[variant]} hover:cursor-pointer disabled:bg-primary-disabled ${className}`}
      disabled={disabled || isLoading}
      type={type}
      aria-label={ariaLabel}
      aria-busy={isLoading}
    >
      {isLoading ? (
        <div className="flex items-center justify-center gap-2">
          <Spinner size="sm" color="text-white" />
          {loadingText && <span>{loadingText}</span>}
        </div>
      ) : (
        children
      )}
    </button>
  );
}
