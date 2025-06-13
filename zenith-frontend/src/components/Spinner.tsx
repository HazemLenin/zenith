import React from "react";

interface SpinnerProps {
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  variant?: "primary" | "secondary" | "accent" | "white";
  className?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({
  size = "md",
  variant = "primary",
  className = "",
}) => {
  const sizeClasses = {
    xs: "w-3 h-3",
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
    xl: "w-16 h-16",
  };

  const variantClasses = {
    primary: "border-primary border-t-transparent",
    secondary: "border-secondary border-t-transparent",
    accent: "border-accent-purple border-t-transparent",
    white: "border-white border-t-transparent",
  };

  return (
    <div className={`inline-block ${sizeClasses[size]} ${className}`}>
      <div
        className={`w-full h-full border-4 rounded-full animate-spin ${variantClasses[variant]}`}
        style={{
          animationTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
          animationDuration: "0.8s",
        }}
      >
        <div className="w-full h-full rounded-full animate-pulse-gentle opacity-50"></div>
      </div>
    </div>
  );
};
