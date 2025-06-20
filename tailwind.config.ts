import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Tomorrow Night Blue color scheme
        dark: {
          bg: '#002451', // Deep navy blue
          surface: '#003d82', // Lighter navy blue
          card: '#0052cc', // Medium blue
          border: '#0065ff', // Bright blue border
          text: '#e6f3ff', // Very light blue-white
          muted: '#99ccff', // Muted blue
          accent: '#3399ff', // Bright blue accent
        },
        // Keep existing but update
        slate: {
          850: '#1a202c',
          950: '#0f1419',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-in': 'slideIn 0.3s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
