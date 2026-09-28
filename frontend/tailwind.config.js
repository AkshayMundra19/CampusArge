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
          light: 'rgba(16, 42, 67, 0.12)', // Tint for backgrounds
        },
        blue: {
          DEFAULT: '#1F4E79',
          light: 'rgba(31, 78, 121, 0.12)',
        },
        burgundy: {
          DEFAULT: '#8B3A3A',
          light: 'rgba(139, 58, 58, 0.12)',
        },
        gold: {
          DEFAULT: '#B08D57',
          light: 'rgba(176, 141, 87, 0.12)',
        },
        brand: {
          bg: '#FBFAF7',
          border: '#E5E9EF',
          text: '#334155',
          muted: '#475569',
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'fade-in-up': 'fadeInUp 0.8s ease-out',
        float: 'float 6s ease-in-out infinite',
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
      },
    },
  },
  plugins: [],
};
