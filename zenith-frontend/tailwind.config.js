/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#2a5c8a",
          disabled: "#94adc4",
          active: "#1e4263",
        },
        warning: "#ff9800",
        background: "#e3f2fd",
        secondary: {
          DEFAULT: "#6B7280", // A neutral gray as base secondary color
          light: "#9CA3AF", // Lighter variant
          dark: "#4B5563", // Darker variant
          title: "#2f327d", // Keeping existing title color
        },
        footer: {
          bg: "#252641",
          title: "#69698",
        },
        black: "#333333",
        white: "#ffffff",
        danger: "#ff6b6b",
        success: "#22c55e",
        gray: {
          200: "#e5e7eb",
          700: "#374151",
        },
        blue: {
          500: "#3b82f6",
          600: "#2563eb",
        },
      },
      keyframes: {
        "fade-in-up": {
          "0%": {
            opacity: "0",
            transform: "translateY(20px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
      },
      animation: {
        "fade-in-up": "fade-in-up 0.3s ease-out",
      },
    },
  },
  plugins: [],
};
