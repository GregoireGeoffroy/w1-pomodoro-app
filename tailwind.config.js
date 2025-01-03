/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}"
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        'pomodoro': {
          work: '#FF6B6B',
          break: '#4ECDC4',
          longBreak: '#95E1D3',
        }
      }
    },
  },
  darkMode: 'class',
  plugins: [],
}