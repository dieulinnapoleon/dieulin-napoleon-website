import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#0A1628',
          50: '#E8EBF0',
          100: '#C5CBD6',
          200: '#8A95AB',
          300: '#4F5F80',
          400: '#1E3055',
          500: '#0A1628',
          600: '#081220',
          700: '#060E18',
          800: '#040A10',
          900: '#020508',
        },
        gold: {
          DEFAULT: '#C4953A',
          50: '#FBF6ED',
          100: '#F4E7CC',
          200: '#E9CF99',
          300: '#DEB766',
          400: '#C4953A',
          500: '#A67C2E',
          600: '#886422',
          700: '#6A4D16',
          800: '#4C370A',
          900: '#2E2104',
          muted: '#F5EFE0',
        },
        charcoal: {
          DEFAULT: '#1A1A2E',
          50: '#F0F0F3',
          100: '#D1D1DA',
          200: '#A3A3B5',
          300: '#757590',
          400: '#47476B',
          500: '#1A1A2E',
          600: '#151525',
          700: '#10101C',
          800: '#0B0B13',
          900: '#05050A',
        },
        emerald: {
          DEFAULT: '#0F6B3E',
        },
      },
      fontFamily: {
        display: ['Playfair Display', 'Georgia', 'serif'],
        body: ['DM Sans', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        hero: ['clamp(2.5rem, 6vw, 4.5rem)', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'section-title': ['clamp(2rem, 4vw, 3rem)', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease-out forwards',
        'fade-in': 'fadeIn 0.4s ease-out forwards',
        'slide-in': 'slideIn 0.5s ease-out forwards',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateX(-10px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
      spacing: {
        section: '6rem',
        'section-sm': '4rem',
      },
      maxWidth: {
        content: '72rem',
        article: '45rem',
      },
    },
  },
  plugins: [],
};

export default config;
