/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Lato', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      },
      colors: {
        'brand-primary': '#FFB7C1', // Light Pink
        'brand-secondary': '#F8E3D9', // Light Peach
        'brand-light': '#FFFFFF', // White
        'brand-dark': '#333333', // Dark Gray for text
        'brand-accent': '#F5F5F5', // Light gray background
      },
    },
  },
  plugins: [],
};
