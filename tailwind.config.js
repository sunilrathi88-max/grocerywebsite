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
        sans: ['Manrope', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#8D6E63', // Earthy Brown
          dark: '#3E2723',
          light: '#A1887F',
        },
        background: {
          light: '#FFFCF7', // Warm Paper
          dark: '#1C1917',
        },
        accent: {
          green: '#556B2F', // Olive
          charcoal: '#2D2622',
          cream: '#F5F1E8',
          beige: '#E3DCCF',
          footer: '#26201D',
        },
        // Backward compatibility mappings (gradual migration)
        brand: {
          primary: '#8D6E63',
          dark: '#3E2723',
          light: '#FFF9E6',
        },
        neutral: {
          900: '#1F2121',
          700: '#6F7577',
          400: '#E5E7EB',
          100: '#F5F5F0',
          50: '#F9FAFB',
        },
        'brand-primary': '#8D6E63',
        'brand-dark': '#3E2723',
        'brand-accent': '#FFFCF7',
      },
      borderRadius: {
        DEFAULT: '0px',
        lg: '0.25rem',
        xl: '0.5rem',
        '2xl': '1rem',
      },
      boxShadow: {
        soft: '0 4px 20px -2px rgba(45, 38, 34, 0.04)',
        card: '0 10px 40px -10px rgba(45, 38, 34, 0.08)',
      },
      backgroundImage: {
        'gradient-hero': 'linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.4))',
      },
    },
  },
  plugins: [],
};
