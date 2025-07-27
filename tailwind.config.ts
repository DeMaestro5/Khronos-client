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
    screens: {
      xs: '475px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
    extend: {
      colors: {
        // Theme-aware background colors
        'theme-primary': 'var(--bg-primary)',
        'theme-secondary': 'var(--bg-secondary)',
        'theme-tertiary': 'var(--bg-tertiary)',
        'theme-card': 'var(--bg-card)',
        'theme-overlay': 'var(--bg-overlay)',
        'theme-backdrop': 'var(--bg-backdrop)',
        'theme-hover': 'var(--interactive-hover)',

        // Background color aliases for compatibility
        'bg-theme-primary': 'var(--bg-primary)',
        'bg-theme-secondary': 'var(--bg-secondary)',
        'bg-theme-tertiary': 'var(--bg-tertiary)',
        'bg-theme-card': 'var(--bg-card)',
        'bg-theme-overlay': 'var(--bg-overlay)',
        'bg-theme-backdrop': 'var(--bg-backdrop)',

        // Text colors
        'text-theme-primary': 'var(--text-primary)',
        'text-theme-secondary': 'var(--text-secondary)',
        'text-theme-tertiary': 'var(--text-tertiary)',
        'text-theme-muted': 'var(--text-muted)',
        'text-theme-inverse': 'var(--text-inverse)',

        // Border colors
        'border-theme-primary': 'var(--border-primary)',
        'border-theme-secondary': 'var(--border-secondary)',
        'border-theme-tertiary': 'var(--border-tertiary)',
        'border-theme-focus': 'var(--border-focus)',

        // Accent colors
        'accent-primary': 'var(--accent-primary)',
        'accent-secondary': 'var(--accent-secondary)',
        'accent-success': 'var(--accent-success)',
        'accent-warning': 'var(--accent-warning)',
        'accent-error': 'var(--accent-error)',
        'accent-info': 'var(--accent-info)',

        // Interactive colors
        'interactive-hover': 'var(--interactive-hover)',
        'interactive-active': 'var(--interactive-active)',
        'interactive-disabled': 'var(--interactive-disabled)',

        // Status colors
        'status-online': 'var(--status-online)',
        'status-offline': 'var(--status-offline)',
        'status-away': 'var(--status-away)',
        'status-busy': 'var(--status-busy)',

        // AI Suggestion colors
        'ai-suggestion': 'var(--ai-suggestion-bg)',
        'ai-suggestion-border': 'var(--ai-suggestion-border)',
        'ai-suggestion-icon': 'var(--ai-suggestion-icon-bg)',
        'ai-suggestion-title': 'var(--ai-suggestion-title)',
        'ai-suggestion-text': 'var(--ai-suggestion-text)',
        'ai-suggestion-hover': 'var(--ai-suggestion-hover)',
        'ai-suggestion-button': 'var(--ai-suggestion-button-bg)',

        // Calendar colors
        'calendar-icon': 'var(--calendar-icon-bg)',
        'calendar-empty': 'var(--calendar-empty-bg)',

        // Stats colors
        'stats-content': 'var(--stats-content-bg)',
        'stats-scheduled': 'var(--stats-scheduled-bg)',
        'stats-published': 'var(--stats-published-bg)',
        'stats-engagement': 'var(--stats-engagement-bg)',
        'stats-views': 'var(--stats-views-bg)',
        'stats-shares': 'var(--stats-shares-bg)',
        'stats-streak': 'var(--stats-streak-bg)',

        // Legacy slate colors for compatibility
        slate: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          850: '#1a202c',
          900: '#0f172a',
          950: '#0f1419',
        },
      },
      backgroundColor: {
        // Theme-aware background utilities
        'theme-primary': 'var(--bg-primary)',
        'theme-secondary': 'var(--bg-secondary)',
        'theme-tertiary': 'var(--bg-tertiary)',
        'theme-card': 'var(--bg-card)',
        'theme-overlay': 'var(--bg-overlay)',
        'theme-backdrop': 'var(--bg-backdrop)',
        'theme-hover': 'var(--interactive-hover)',
        'theme-active': 'var(--interactive-active)',
        'theme-disabled': 'var(--interactive-disabled)',
      },
      textColor: {
        // Theme-aware text utilities
        'theme-primary': 'var(--text-primary)',
        'theme-secondary': 'var(--text-secondary)',
        'theme-tertiary': 'var(--text-tertiary)',
        'theme-muted': 'var(--text-muted)',
        'theme-inverse': 'var(--text-inverse)',
      },
      borderColor: {
        // Theme-aware border utilities
        'theme-primary': 'var(--border-primary)',
        'theme-secondary': 'var(--border-secondary)',
        'theme-tertiary': 'var(--border-tertiary)',
        'theme-focus': 'var(--border-focus)',
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
        'theme-switch': 'themeSwitch 0.3s ease-in-out',
        shimmer: 'shimmer 2s infinite',
        'shimmer-overlay': 'shimmer-overlay 2s infinite',
        'shimmer-slide': 'shimmer-slide 3s infinite',
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
        themeSwitch: {
          '0%': { opacity: '0.8' },
          '100%': { opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'shimmer-overlay': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        'shimmer-slide': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(200%)' },
        },
      },
      transitionProperty: {
        theme:
          'background-color, border-color, color, fill, stroke, opacity, box-shadow, transform',
      },
      transitionDuration: {
        '150': '150ms',
        '200': '200ms',
        '300': '300ms',
        '500': '500ms',
      },
      transitionTimingFunction: {
        'ease-theme': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },
  plugins: [],
};

export default config;
