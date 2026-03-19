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
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
        serif: ['Cormorant Garamond', 'Georgia', 'serif'],
        label: ['Syne', 'system-ui', 'sans-serif'],
      },
      colors: {
        ink: 'var(--ink)',
        char: 'var(--char)',
        ember: 'var(--ember)',
        saffron: 'var(--saffron)',
        turmeric: 'var(--turmeric)',
        gold: 'var(--gold)',
        cream: 'var(--cream)',
        dust: 'var(--dust)',
        mist: 'var(--mist)',
        rouge: 'var(--rouge)',

        primary: {
          DEFAULT: 'var(--saffron)',
          dark: 'var(--ember)',
          light: 'var(--turmeric)',
        },
        background: {
          light: 'var(--cream)',
          dark: 'var(--ink)',
        },
        accent: {
          green: '#556B2F',
          charcoal: 'var(--ink)',
          cream: 'var(--cream)',
          beige: 'var(--dust)',
          footer: 'var(--char)',
        },
        neutral: {
          900: 'var(--ink)',
          700: 'var(--char)',
          400: 'var(--dust)',
          100: 'var(--cream)',
          50: '#F9FAFB',
        },
        'brand-primary': 'var(--saffron)',
        'brand-dark': 'var(--ember)',
        'brand-accent': 'var(--cream)',
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
