/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        farah: ['Farah', 'system-ui', 'Segoe UI', 'Tahoma', 'Arial', 'sans-serif'],
        display: ['"Baloo Bhaijaan 2"', 'system-ui', 'Segoe UI', 'Tahoma', 'Arial', 'sans-serif'],
        body: ['Tajawal', 'system-ui', 'Segoe UI', 'Tahoma', 'Arial', 'sans-serif'],
      },
      colors: {
        smoke: {
          950: '#050206',
          900: '#0A050C',
          850: '#110914',
          800: '#1B1020',
          700: '#2A1832',
        },
        accent: {
          500: '#D6B15E',
          400: '#E1C27B',
        },
        fire: {
          900: '#2A0406',
          800: '#45060B',
          700: '#67070F',
          600: '#A10C18',
          500: '#E31225',
          400: '#FF2D2D',
          300: '#FF5B5B',
          200: '#FFB0B0',
        },
      },
      backgroundImage: {
        'fire-mesh':
          'radial-gradient(1200px circle at 15% 10%, rgba(255, 45, 45, 0.22), transparent 58%), radial-gradient(900px circle at 85% 18%, rgba(227, 18, 37, 0.18), transparent 62%), radial-gradient(850px circle at 55% 100%, rgba(103, 7, 15, 0.34), transparent 60%), linear-gradient(135deg, #050206 0%, #0A050C 40%, #2A0406 100%)',
      },
      boxShadow: {
        'glow-fire': '0 0 0 1px rgba(255, 45, 45, 0.22), 0 22px 70px rgba(227, 18, 37, 0.16), 0 10px 35px rgba(161, 12, 24, 0.24)',
        'glow-fire-lg': '0 0 0 1px rgba(255, 45, 45, 0.30), 0 34px 110px rgba(227, 18, 37, 0.20), 0 16px 60px rgba(161, 12, 24, 0.32)',
        'glow-accent': '0 0 0 1px rgba(214, 177, 94, 0.18), 0 20px 70px rgba(214, 177, 94, 0.10), 0 10px 35px rgba(161, 12, 24, 0.18)',
      },
    },
  },
  plugins: [],
};
