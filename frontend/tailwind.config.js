/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'deep-purple': '#2D1B69',
        'midnight-blue': '#191970',
        'gold': '#FFD700',
        'aqua': '#00CED1',
        'mystic-purple': '#4B0082',
        'cosmic-blue': '#0F0F23'
      },
      fontFamily: {
        'brand': ['Great Vibes', 'cursive'],
        'mystical': ['Cinzel', 'serif'],
        'mystical-hindi': ['Noto Serif Devanagari', 'serif'],
        'body': ['Poppins', 'sans-serif']
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'fadeIn': 'fadeIn 0.5s ease-in-out',
        'fadeInScale': 'fadeInScale 1s ease-out'
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' }
        },
        glow: {
          '0%': { boxShadow: '0 0 5px #FFD700' },
          '100%': { boxShadow: '0 0 20px #FFD700, 0 0 30px #FFD700' }
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        fadeInScale: {
          '0%': { opacity: '0', transform: 'scale(0.95) translateY(10px)' },
          '100%': { opacity: '1', transform: 'scale(1) translateY(0)' }
        }
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '26': '6.5rem',
        '30': '7.5rem'
      },
      maxWidth: {
        '8xl': '88rem',
        '9xl': '96rem'
      },
      fontSize: {
        'xxs': '0.625rem',
        '2.5xl': '1.75rem',
        '3.5xl': '2rem'
      }
    },
  },
  plugins: [],
}