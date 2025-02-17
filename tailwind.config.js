/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,jsx,ts,tsx}",
    "./src/components/**/*.{js,jsx,ts,tsx}"
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "rgb(var(--color-primary) / <alpha-value>)",
        secondary: "rgb(var(--color-secondary) / <alpha-value>)",
        background: "rgb(var(--color-background) / <alpha-value>)",
        text: "rgb(var(--color-text) / <alpha-value>)",
        work: "rgb(var(--color-work) / <alpha-value>)",
        break: "rgb(var(--color-break) / <alpha-value>)",
      }
    },
  },
  darkMode: 'class',
  plugins: [
    ({ addBase }) => {
      addBase({
        ":root": {
          "--color-primary": "255 0 0",    // Red
          "--color-secondary": "76 175 80", // Green
          "--color-background": "255 255 255", // White
          "--color-text": "0 0 0",         // Black
          "--color-work": "255 107 107",   // Your work color
          "--color-break": "76 175 80",    // Your break color
        },
      });
    },
  ],
}