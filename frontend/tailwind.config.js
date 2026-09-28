/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Playfair Display', 'serif'],
      },
      colors: {
        navy: {
          DEFAULT: '#102A43',
          light: '#E9EEF4',
          dark: '#0B1E30',
        },
        oxford: {
          DEFAULT: '#1F4E79',
          light: '#E8F0F7',
          dark: '#17395A',
        },
        burgundy: {
          DEFAULT: '#8B3A3A',
          light: '#F6ECEC',
          dark: '#6E2D2D',
        },
        gold: {
          DEFAULT: '#B08D57',
          light: '#F6EFE3',
          dark: '#8F7245',
        },
        primary: {
          50: '#F5F7FA',
          100: '#E7EAEE',
          200: '#C1C9D4',
          300: '#94A6B8',
          400: '#1F4E79',   // Oxford
          500: '#1A4266',
          600: '#102A43',   // Navy
          700: '#0C2033',
          800: '#081521',
          900: '#040B11',
        },
        accent: {
          50: '#FBF9F6',
          100: '#F7F3ED',
          200: '#EADBC1',
          300: '#DEC295',
          400: '#B08D57',   // Gold
          500: '#9B3F3F',
          600: '#8B3A3A',   // Burgundy
          700: '#6C2D2D',
          800: '#4E2020',
          900: '#2F1313',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'fade-in-up': 'fadeInUp 0.8s ease-out',
        float: 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px -5px rgba(16, 42, 67, 0.3)' },
          '50%': { boxShadow: '0 0 40px -5px rgba(16, 42, 67, 0.5)' },
        },
      },
    },
  },
  plugins: [],
};

