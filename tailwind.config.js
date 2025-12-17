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
        serif: ['Playfair Display', 'serif'],
      },
      colors: {
        'brand-primary': '#8B5CF6', // Purple
        'brand-secondary': '#DC2626', // Red
        'brand-dark': '#0F172A', // Slate 900
        'brand-light': '#FFFFFF', // White
        'brand-accent': '#F8FAFC', // Slate 50 (Page Background)
        'neutral-50': '#F8FAFC',
        'neutral-100': '#F1F5F9',
        'neutral-200': '#E2E8F0',
        'neutral-300': '#CBD5E1',
        'neutral-600': '#475569',
        'neutral-700': '#334155',
        'neutral-900': '#0F172A',
        'success-green': '#10B981',
        'warning-yellow': '#F59E0B',
        'accent-orange': '#FF6B35',
        'social-google': '#4285F4',
        'social-facebook': '#1877F2',
      },
      boxShadow: {
        card: '0 1px 3px 0 rgba(15, 23, 42, 0.1)',
        'card-hover': '0 4px 12px 0 rgba(15, 23, 42, 0.15)',
        button: '0 1px 2px 0 rgba(15, 23, 42, 0.08)',
      },
      backgroundImage: {
        'gradient-hero': 'linear-gradient(135deg, #8B5CF6 0%, #EF4444 100%)',
      },
    },
  },
  plugins: [],
};
