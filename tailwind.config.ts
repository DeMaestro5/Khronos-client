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
        // Light theme colors
        light: {
          bg: {
            primary: 'var(--bg-primary)',
            secondary: 'var(--bg-secondary)',
            tertiary: 'var(--bg-tertiary)',
            card: 'var(--bg-card)',
            overlay: 'var(--bg-overlay)',
            backdrop: 'var(--bg-backdrop)',
          },
          text: {
            primary: 'var(--text-primary)',
            secondary: 'var(--text-secondary)',
            tertiary: 'var(--text-tertiary)',
            muted: 'var(--text-muted)',
            inverse: 'var(--text-inverse)',
          },
          border: {
            primary: 'var(--border-primary)',
            secondary: 'var(--border-secondary)',
            tertiary: 'var(--border-tertiary)',
            focus: 'var(--border-focus)',
          },
          accent: {
            primary: 'var(--accent-primary)',
            secondary: 'var(--accent-secondary)',
            success: 'var(--accent-success)',
            warning: 'var(--accent-warning)',
            error: 'var(--accent-error)',
            info: 'var(--accent-info)',
          },
          interactive: {
            hover: 'var(--interactive-hover)',
            active: 'var(--interactive-active)',
            disabled: 'var(--interactive-disabled)',
          },
          status: {
            online: 'var(--status-online)',
            offline: 'var(--status-offline)',
            away: 'var(--status-away)',
            busy: 'var(--status-busy)',
          },
        },
        // Dark theme colors (same structure, different values)
        dark: {
          bg: {
            primary: 'var(--bg-primary)',
            secondary: 'var(--bg-secondary)',
            tertiary: 'var(--bg-tertiary)',
            card: 'var(--bg-card)',
            overlay: 'var(--bg-overlay)',
            backdrop: 'var(--bg-backdrop)',
          },
          text: {
            primary: 'var(--text-primary)',
            secondary: 'var(--text-secondary)',
            tertiary: 'var(--text-tertiary)',
            muted: 'var(--text-muted)',
            inverse: 'var(--text-inverse)',
          },
          border: {
            primary: 'var(--border-primary)',
            secondary: 'var(--border-secondary)',
            tertiary: 'var(--border-tertiary)',
            focus: 'var(--border-focus)',
          },
          accent: {
            primary: 'var(--accent-primary)',
            secondary: 'var(--accent-secondary)',
            success: 'var(--accent-success)',
            warning: 'var(--accent-warning)',
            error: 'var(--accent-error)',
            info: 'var(--accent-info)',
          },
          interactive: {
            hover: 'var(--interactive-hover)',
            active: 'var(--interactive-active)',
            disabled: 'var(--interactive-disabled)',
          },
          status: {
            online: 'var(--status-online)',
            offline: 'var(--status-offline)',
            away: 'var(--status-away)',
            busy: 'var(--status-busy)',
          },
        },
        // Legacy colors for backward compatibility
        slate: {
          850: '#1a202c',
          950: '#0f1419',
        },
      },
      boxShadow: {
        'theme-sm': 'var(--shadow-sm)',
        'theme-md': 'var(--shadow-md)',
        'theme-lg': 'var(--shadow-lg)',
        'theme-xl': 'var(--shadow-xl)',
      },
      backgroundImage: {
        'gradient-primary': 'var(--gradient-primary)',
        'gradient-secondary': 'var(--gradient-secondary)',
        'gradient-success': 'var(--gradient-success)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-in': 'slideIn 0.3s ease-in-out',
        'theme-transition': 'themeTransition 0.2s ease-in-out',
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
        themeTransition: {
          '0%': { opacity: '0.8' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
