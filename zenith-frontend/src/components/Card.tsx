import React from "react";
import { motion } from "framer-motion";

interface CardProps {
  children: React.ReactNode;
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
  variant?: "default" | "primary" | "secondary" | "accent";
  className?: string;
  interactive?: boolean;
  hoverEffect?: "scale" | "lift" | "glow";
  delay?: number;
}

const Card = ({
  children,
  onClick,
  variant = "default",
  className = "",
  interactive = true,
  hoverEffect = "lift",
  delay = 0,
}: CardProps) => {
  const baseStyles =
    "flex items-center justify-between w-full mb-4 bg-white rounded-xl shadow-soft transition-all duration-300 p-6";

  const variantStyles = {
    default: "border-l-4 border-primary",
    primary: "border-l-4 border-primary bg-primary-light",
    secondary: "border-l-4 border-secondary bg-secondary-light",
    accent: "border-l-4 border-accent-purple bg-accent-purple/5",
  };

  const hoverEffects = {
    scale: {
      whileHover: { scale: 1.02 },
      whileTap: { scale: 0.98 },
    },
    lift: {
      whileHover: { y: -4, boxShadow: "0 10px 30px -10px rgba(0, 0, 0, 0.1)" },
      whileTap: { y: 0 },
    },
    glow: {
      whileHover: {
        boxShadow: "0 0 20px rgba(0, 0, 0, 0.1)",
        scale: 1.01,
      },
      whileTap: { scale: 0.99 },
    },
  };

  return (
    <motion.div
      onClick={onClick}
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3, type: "spring", bounce: 0.2 }}
      whileHover={
        interactive ? hoverEffects[hoverEffect].whileHover : undefined
      }
      whileTap={interactive ? hoverEffects[hoverEffect].whileTap : undefined}
      style={{ cursor: interactive ? "pointer" : "default" }}
    >
      {children}
    </motion.div>
  );
};

export default Card;
