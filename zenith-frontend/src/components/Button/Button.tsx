interface ButtonProps {
  children: React.ReactNode;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  variant?: "primary" | "secondary";
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
        <>
          <svg
            className="animate-spin h-5 w-5 text-white mx-auto"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          {loadingText && <span className="ml-2">{loadingText}</span>}
        </>
      ) : (
        children
      )}
    </button>
  );
}
