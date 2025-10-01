// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}" // ✅ ครอบโฟลเดอร์ components ที่อยู่นอก src
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Abel', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
