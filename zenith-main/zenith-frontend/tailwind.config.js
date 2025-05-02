/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#2a5c8a",
          disabled: "#94adc4",
        },
        warning: "#ff9800",
        background: "#e3f2fd",
        secondary: {
          title: "#2f327d",
        },
        footer: {
          bg: "#252641",
          title: "#69698",
        },
        black: "#333333",
        white: "#ffffff",
        danger: "#ff6b6b",
      },
    },
  },
  plugins: [],
};
