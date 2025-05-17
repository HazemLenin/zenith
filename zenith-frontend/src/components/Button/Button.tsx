interface ButtonProps {
  children: React.ReactNode;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  variant?: "primary" | "secondary";
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  className?: string;
}

export default function Button({
  children,
  onClick,
  variant = "primary",
  disabled,
  type = "button",
  className = "",
}: ButtonProps) {
  const baseStyles =
    "w-full py-3 px-3 rounded-lg flex items-center justify-center transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2";

  const variantStyles = {
    primary:
      "bg-primary text-white hover:bg-primary-active hover:text-white focus:ring-primary",
    secondary:
      "bg-secondary text-white hover:bg-white hover:text-black focus:ring-secondary",
  };

  return (
    <button
      onClick={onClick}
      className={`${baseStyles} ${variantStyles[variant]} hover:cursor-pointer disabled:bg-primary-disabled ${className}`}
      disabled={disabled}
      type={type}
    >
      {children}
    </button>
  );
}
