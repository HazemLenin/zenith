interface CardProps {
  children: React.ReactNode;
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
  variant?: "default" | "primary" | "secondary" | "accent";
  className?: string;
  interactive?: boolean;
}

const Card = ({
  children,
  onClick,
  variant = "default",
  className = "",
  interactive = true,
}: CardProps) => {
  const baseStyles =
    "flex items-center justify-between w-full mb-4 bg-white rounded-xl shadow-soft transition-all duration-300 p-6";

  const variantStyles = {
    default: "border-l-4 border-primary",
    primary: "border-l-4 border-primary bg-primary-light",
    secondary: "border-l-4 border-secondary bg-secondary-light",
    accent: "border-l-4 border-accent-purple bg-accent-purple/5",
  };

  const interactiveStyles = interactive
    ? "hover:shadow-hover hover:-translate-y-1 cursor-pointer active:translate-y-0"
    : "";

  return (
    <div
      onClick={onClick}
      className={`${baseStyles} ${variantStyles[variant]} ${interactiveStyles} ${className}`}
    >
      {children}
    </div>
  );
};

export default Card;
