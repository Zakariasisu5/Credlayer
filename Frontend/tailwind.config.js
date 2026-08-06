/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          DEFAULT: "#fbbf24",
          dark: "#f59e0b",
        },
        blue: {
          DEFAULT: "#3b82f6",
          dark: "#2563eb",
        },
        navy: {
          DEFAULT: "#0f172a",
          light: "#1e293b",
        },
      },
      animation: {
        fadeIn: "fadeIn 0.3s ease-in-out",
        fadeInUp: "fadeInUp 0.6s ease-out forwards",
        pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        fadeInUp: {
          from: {
            opacity: "0",
            transform: "translateY(30px)",
          },
          to: {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
      },
    },
  },
  plugins: [],
};
