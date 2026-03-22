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
        ink: 'var(--color-bg-dark)',
        char: 'var(--color-text-secondary)',
        ember: 'var(--color-primary-dark)',
        saffron: 'var(--color-primary)',
        turmeric: 'var(--color-accent-gold)',
        gold: 'var(--color-accent-gold)',
        cream: 'var(--color-accent-cream)',
        dust: 'var(--color-text-muted)',
        mist: 'var(--color-text-light)',
        rouge: 'var(--color-error)',

        primary: {
          DEFAULT: 'var(--color-primary)',
          dark: 'var(--color-primary-dark)',
          light: 'var(--color-primary-light)',
        },
        background: {
          light: 'var(--color-bg-secondary)',
          dark: 'var(--color-bg-dark)',
        },
        accent: {
          green: 'var(--color-success)',
          charcoal: 'var(--color-bg-dark)',
          cream: 'var(--color-accent-cream)',
          beige: 'var(--color-bg-tertiary)',
          footer: 'var(--color-text-secondary)',
        },
        neutral: {
          900: 'var(--color-bg-dark)',
          700: 'var(--color-text-secondary)',
          400: 'var(--color-text-muted)',
          100: 'var(--color-bg-tertiary)',
          50: 'var(--color-bg-primary)',
        },
        'brand-primary': 'var(--color-primary)',
        'brand-dark': 'var(--color-primary-dark)',
        'brand-accent': 'var(--color-accent-gold)',
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
