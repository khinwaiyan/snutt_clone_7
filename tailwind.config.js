/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2BCA43',
        },
        red: {
          DEFAULT: '#E54459',
          dark: '#D95F71',
        },
        orange: {
          DEFAULT: '#F58D3D',
          dark: '#DF6E3C',
          hover: '#E07C2C',
        },
        yellow: {
          DEFAULT: '#FFB703',
          dark: '#FFB703',
        },
        lime: {
          DEFAULT: '#A6D930',
          dark: '#95B03E',
          hover: '#00A896',
        },
        green: {
          DEFAULT: '#2BC267',
          dark: '#2BC267',
        },
        mint: {
          DEFAULT: '#1BD0C8',
          dark: '#58C1B7',
        },
        blue: {
          DEFAULT: '#1D99E8',
          dark: '#5BA0D7',
        },
        purple: {
          DEFAULT: '#b249fc',
          dark: '#b249fc',
        },
        pink: {
          DEFAULT: '#fc49db',
          dark: '#fc49db',
        },
        gray: {
          DEFAULT: '#C4C4C4',
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
          950: '#030712',
        },
        line: {
          DEFAULT: '#EBEBED',
          light: '#F5F5F5',
        },
      },
      keyframes: {
        moveUpDown: {
          '0%, 50%': { transform: 'translateY(0)' },
          '25%': { transform: 'translateY(-10px)' },
        },
        slideInUp: {
          '0%': { opacity: 0, transform: 'translateY(20px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        bottonSheetUp: {
          '0%': { transform: 'translateY(0px)' },
          '100%': { transform: 'translateY(100%)' },
        },
        popup: {
          '0%': { opacity: 0, transform: 'scale(0.8)' },
          '100%': { opacity: 1, transform: 'scale(1)' },
        },
        popout: {
          '0%': { opacity: 1, transform: 'scale(1)' },
          '100%': { opacity: 0, transform: 'scale(0.8)' },
        },
      },
      animation: {
        'updown-1': 'moveUpDown 2s infinite ease-in-out 0.1s',
        'updown-2': 'moveUpDown 2s infinite ease-in-out 0.3s',
        'updown-3': 'moveUpDown 2s infinite ease-in-out 0.5s',
        'updown-4': 'moveUpDown 2s infinite ease-in-out 0.7s',
        'updown-5': 'moveUpDown 2s infinite ease-in-out 0.9s',
        slideUp: 'slideInUp 0.5s ease-in-out',
        popup: 'popup 0.3s ease-in-out',
        popout: 'popout 0.3s ease-in-out forwards',
      },
    },
    fontFamily: {
      kor: [
        'Pretendard',
        'system-ui',
        '-apple-system',
        '"Noto Sans"',
        'sans-serif',
      ],
      eng: [
        'San Francisco',
        'Pretendard',
        '-apple-system',
        '"Noto Sans"',
        'sans-serif',
      ],
    },
    maxWidth: {
      375: '480px', // 모바일용
    },
  },
  plugins: [require('tailwind-scrollbar')],
  darkMode: 'class',
};
