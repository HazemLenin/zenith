/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "node_modules/flowbite-react/lib/esm/**/*.js",
  ],
  theme: {
    extend: {},

    colors: {
      primary: {
        DEFAULT: "#2a5c8a",
        disabled: "#94adc4",
        active: "#1e4263",
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
  },
  plugins: [require("flowbite/plugin")],
};
