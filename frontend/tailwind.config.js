/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        purple: '#8E34FB',   // 원하는 이름: 컬러코드
        gray: '#DBDADA',
        lightPurple: '#F5ECFF',
      },

    },
  },
  plugins: [
    require('tailwind-scrollbar-hide'),
  ],
}

