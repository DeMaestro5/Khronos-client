'use client';

import { useState } from 'react';
import { Sun, Moon, Monitor, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/src/hooks/useTheme';

interface ThemeToggleProps {
  variant?: 'compact' | 'dropdown' | 'tabs' | 'button';
  showLabels?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function ThemeToggle({
  variant = 'compact',
  showLabels = false,
  size = 'sm',
  className = '',
}: ThemeToggleProps) {
  const { theme, setTheme, mounted } = useTheme();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <div
        className={`
          ${
            variant === 'compact'
              ? 'w-10 h-10'
              : variant === 'button'
              ? 'w-10 h-10'
              : 'w-32 h-10'
          } 
          bg-theme-tertiary rounded-lg animate-pulse ${className}
        `}
      />
    );
  }

  const themes = [
    { key: 'light' as const, icon: Sun, label: 'Light' },
    { key: 'dark' as const, icon: Moon, label: 'Dark' },
    { key: 'system' as const, icon: Monitor, label: 'System' },
  ];

  const currentTheme = themes.find((t) => t.key === theme);
  const Icon = currentTheme?.icon || Sun;

  const sizeClasses = {
    sm: 'text-xs p-1.5',
    md: 'text-sm p-2',
    lg: 'text-base p-3',
  };

  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  };

  // Compact variant - cycles through all 3 themes
  if (variant === 'compact') {
    const cycleTheme = () => {
      if (theme === 'light') {
        setTheme('dark');
      } else if (theme === 'dark') {
        setTheme('system');
      } else {
        setTheme('light');
      }
    };

    return (
      <button
        onClick={cycleTheme}
        disabled={false}
        className={`
          flex items-center justify-center ${sizeClasses[size]}
          text-theme-secondary
          hover:text-theme-primary hover:bg-theme-hover
          rounded-lg transition-all duration-200 
          focus:outline-none focus:ring-2 focus:ring-accent-primary/20
          disabled:opacity-50 disabled:cursor-not-allowed
          ${className}
        `}
        title={`Current: ${currentTheme?.label}. Click to cycle themes.`}
      >
        <Icon className={iconSizes[size]} />
      </button>
    );
  }

  // Button variant - single button with icon and optional label
  if (variant === 'button') {
    return (
      <div className={`relative ${className}`}>
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          disabled={false}
          className={`
            flex items-center justify-center ${sizeClasses[size]}
            text-theme-secondary
            hover:text-theme-primary hover:bg-theme-hover
            rounded-lg transition-all duration-200 
            focus:outline-none focus:ring-2 focus:ring-accent-primary/20
            disabled:opacity-50 disabled:cursor-not-allowed
          `}
          title={`Current: ${currentTheme?.label}. Click to change theme.`}
        >
          <Icon className={iconSizes[size]} />
        </button>

        <AnimatePresence>
          {dropdownOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.15 }}
              className='absolute right-0 top-full mt-2 w-48 bg-theme-card border border-theme-primary rounded-lg shadow-theme-lg py-1 z-50'
            >
              {themes.map(({ key, icon: ThemeIcon, label }) => (
                <button
                  key={key}
                  onClick={() => {
                    setTheme(key);
                    setDropdownOpen(false);
                  }}
                  className={`
                    flex items-center gap-2 w-full px-3 py-2 text-sm
                    hover:bg-theme-hover
                    transition-colors duration-150
                    ${
                      theme === key
                        ? 'text-accent-primary'
                        : 'text-theme-secondary'
                    }
                  `}
                >
                  <ThemeIcon className='h-4 w-4' />
                  <span className='flex-1 text-left'>{label}</span>
                  {theme === key && <Check className='h-3 w-3' />}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {dropdownOpen && (
          <div
            className='fixed inset-0 z-40'
            onClick={() => setDropdownOpen(false)}
          />
        )}
      </div>
    );
  }

  // Dropdown variant - button with dropdown
  if (variant === 'dropdown') {
    return (
      <div className={`relative ${className}`}>
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          disabled={false}
          className={`
            flex items-center gap-2 px-3 py-2 rounded-lg
            text-theme-primary
            hover:bg-theme-hover
            transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-accent-primary/20
            disabled:opacity-50 disabled:cursor-not-allowed
            border border-theme-primary
          `}
        >
          <Icon className={iconSizes[size]} />
          {showLabels && <span>{currentTheme?.label}</span>}
        </button>

        <AnimatePresence>
          {dropdownOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.15 }}
              className='absolute right-0 top-full mt-2 w-48 bg-theme-card border border-theme-primary rounded-lg shadow-theme-lg py-1 z-50'
            >
              {themes.map(({ key, icon: ThemeIcon, label }) => (
                <button
                  key={key}
                  onClick={() => {
                    setTheme(key);
                    setDropdownOpen(false);
                  }}
                  className={`
                    flex items-center gap-2 w-full px-3 py-2 text-sm
                    hover:bg-theme-hover
                    transition-colors duration-150
                    ${
                      theme === key
                        ? 'text-accent-primary'
                        : 'text-theme-secondary'
                    }
                  `}
                >
                  <ThemeIcon className='h-4 w-4' />
                  <span className='flex-1 text-left'>{label}</span>
                  {theme === key && <Check className='h-3 w-3' />}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {dropdownOpen && (
          <div
            className='fixed inset-0 z-40'
            onClick={() => setDropdownOpen(false)}
          />
        )}
      </div>
    );
  }

  // Tabs variant (default) - three buttons side by side
  return (
    <div
      className={`flex items-center bg-theme-secondary rounded-lg p-1 border border-theme-primary shadow-theme-sm ${className}`}
    >
      {themes.map(({ key, icon: ThemeIcon, label }) => (
        <motion.button
          key={key}
          onClick={() => setTheme(key)}
          disabled={false}
          className={`
            flex items-center gap-1.5 px-3 py-2 rounded-md ${sizeClasses[size]}
            font-medium transition-all duration-200
            disabled:opacity-50 disabled:cursor-not-allowed
            ${
              theme === key
                ? 'bg-theme-card text-theme-primary shadow-theme-sm border border-theme-primary'
                : 'text-theme-secondary hover:bg-theme-hover hover:text-theme-primary'
            }
          `}
          whileTap={{ scale: 0.95 }}
          aria-label={`Switch to ${label.toLowerCase()} mode`}
        >
          <ThemeIcon className={iconSizes[size]} />
          {showLabels && <span>{label}</span>}
        </motion.button>
      ))}
    </div>
  );
}
