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
        sans: ['Inter', 'sans-serif'],
        serif: ['Playfair Display', 'serif'], // Keeping Playfair for "Premium" feel as per existing design, though guide focuses on Sans.
      },
      colors: {
        brand: {
          primary: '#D4A017', // Gold
          dark: '#B8860B', // Gold Dark
          light: '#FFF9E6', // Gold Light
        },
        neutral: {
          900: '#1F2121', // Charcoal (Primary Text)
          700: '#6F7577', // Slate (Secondary Text)
          400: '#E5E7EB', // Gray Light (Borders)
          100: '#F5F5F0', // Background Light
          50: '#F9FAFB',
        },
        semantic: {
          success: '#2D8F5E',
          error: '#EF4444',
          info: '#3B82F6',
        },
        accent: {
          brown: '#5F5238',
          red: '#C01F2F', // Spice Red
        },
        // Mapping existing class names to new palette for backward compatibility/smooth transition
        'brand-primary': '#D4A017',
        'brand-secondary': '#B8860B',
        'brand-dark': '#1F2121',
        'brand-light': '#FFFFFF',
        'brand-accent': '#F5F5F0',
        'success-green': '#2D8F5E',
        'warning-yellow': '#EF4444', // Mapping warning to error color or similar warm tone if needed, or keeping generic.
        'accent-orange': '#C01F2F', // Mapping old orange to new Spice Red
        'gray-light': '#E5E7EB',
      },
      boxShadow: {
        card: '0 1px 3px 0 rgba(15, 23, 42, 0.1)',
        'card-hover': '0 4px 12px 0 rgba(15, 23, 42, 0.15)',
        button: '0 1px 2px 0 rgba(15, 23, 42, 0.08)',
      },
      backgroundImage: {
        'gradient-hero': 'linear-gradient(135deg, #FAF5E6 0%, #FFF9E6 100%)', // Lighter, premium gradient
      },
    },
  },
  plugins: [],
};
