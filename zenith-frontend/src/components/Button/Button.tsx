import React from "react";
import { motion } from "framer-motion";
import Spinner from "../shared/Spinner";

interface ButtonProps {
  children: React.ReactNode;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  variant?: "primary" | "secondary" | "danger" | "accent" | "outline" | "ghost";
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  className?: string;
  shape?: "default" | "square" | "pill";
  isLoading?: boolean;
  loadingText?: string;
  ariaLabel?: string;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
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
  icon,
  iconPosition = "left",
}: ButtonProps) {
  const baseStyles =
    "relative flex items-center justify-center transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 font-semibold shadow-soft hover:shadow-hover transform active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed group overflow-hidden";

  const shapeStyles = {
    default: "w-full py-3 px-6 rounded-xl",
    square: "w-12 h-12 p-3 rounded-xl",
    pill: "w-full py-3 px-6 rounded-full",
  };

  const variantStyles = {
    primary:
      "bg-primary text-white hover:bg-primary-active focus:ring-primary/50",
    secondary:
      "bg-secondary text-white hover:bg-secondary-dark focus:ring-secondary/50",
    danger: "bg-danger text-white hover:bg-danger/90 focus:ring-danger/50",
    accent:
      "bg-accent-purple text-white hover:bg-accent-purple/90 focus:ring-accent-purple/50",
    outline:
      "bg-transparent border-2 border-primary text-primary hover:bg-primary/10 focus:ring-primary/30",
    ghost:
      "bg-transparent text-primary hover:bg-primary/10 focus:ring-primary/20",
  };

  // Ripple effect animation
  const [ripple, setRipple] = React.useState<{ x: number; y: number } | null>(
    null
  );
  const buttonRef = React.useRef<HTMLButtonElement>(null);

  const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setRipple({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
      setTimeout(() => setRipple(null), 500);
    }
    if (onClick) onClick(e);
  };

  return (
    <motion.button
      ref={buttonRef}
      onClick={handleButtonClick}
      className={`${baseStyles} ${shapeStyles[shape]} ${variantStyles[variant]} ${className}`}
      disabled={disabled || isLoading}
      type={type}
      aria-label={ariaLabel}
      aria-busy={isLoading}
      whileTap={{ scale: 0.96 }}
      whileHover={{ scale: 1.03 }}
    >
      {/* Ripple animation */}
      {ripple && (
        <motion.span
          className="absolute pointer-events-none rounded-full bg-white/30"
          style={{
            left: ripple.x - 50,
            top: ripple.y - 50,
            width: 100,
            height: 100,
          }}
          initial={{ scale: 0, opacity: 0.7 }}
          animate={{ scale: 2, opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      )}
      {isLoading ? (
        <div className="flex items-center justify-center gap-2 animate-pulse-gentle">
          <Spinner
            size="sm"
            color={
              variant === "outline" || variant === "ghost"
                ? "text-primary"
                : "text-white"
            }
          />
          {loadingText && <span>{loadingText}</span>}
        </div>
      ) : (
        <>
          {icon && iconPosition === "left" && (
            <motion.span
              className="mr-2 flex items-center"
              initial={{ x: -8, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              {icon}
            </motion.span>
          )}
          <span>{children}</span>
          {icon && iconPosition === "right" && (
            <motion.span
              className="ml-2 flex items-center"
              initial={{ x: 8, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              {icon}
            </motion.span>
          )}
        </>
      )}
    </motion.button>
  );
}
