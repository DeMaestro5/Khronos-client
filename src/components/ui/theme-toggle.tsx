'use client';

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { Sun, Moon, Monitor, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ThemeToggleProps {
  variant?: 'compact' | 'dropdown' | 'tabs';
  showLabels?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function ThemeToggle({
  variant = 'tabs',
  showLabels = true,
  size = 'md',
}: ThemeToggleProps) {
  const [mounted, setMounted] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { setTheme, theme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        className={`
        ${variant === 'compact' ? 'w-10 h-10' : 'w-32 h-10'} 
        bg-gray-200 dark:bg-slate-700 rounded-lg animate-pulse
      `}
      />
    );
  }

  const themes = [
    { key: 'light', icon: Sun, label: 'Light' },
    { key: 'dark', icon: Moon, label: 'Dark' },
    { key: 'system', icon: Monitor, label: 'System' },
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

  if (variant === 'compact') {
    return (
      <button
        onClick={() => {
          const nextTheme =
            theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light';
          setTheme(nextTheme);
        }}
        className={`
          flex items-center justify-center ${sizeClasses[size]}
          text-gray-600 dark:text-slate-400 
          hover:text-indigo-600 dark:hover:text-indigo-400 
          hover:bg-gray-100 dark:hover:bg-slate-800 
          rounded-lg transition-all duration-200 
          focus:outline-none focus:ring-2 focus:ring-indigo-500/20
        `}
        title={`Current: ${currentTheme?.label}. Click to cycle themes.`}
      >
        <motion.div
          key={theme}
          initial={{ rotate: -90, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          <Icon className={iconSizes[size]} />
        </motion.div>
      </button>
    );
  }

  if (variant === 'dropdown') {
    return (
      <div className='relative'>
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className={`
            flex items-center gap-2 ${sizeClasses[size]}
            text-gray-600 dark:text-slate-400 
            hover:text-indigo-600 dark:hover:text-indigo-400 
            hover:bg-gray-100 dark:hover:bg-slate-800 
            rounded-lg transition-all duration-200 
            focus:outline-none focus:ring-2 focus:ring-indigo-500/20
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
              className='absolute top-full mt-2 right-0 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-gray-200 dark:border-slate-700 py-1 z-50'
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
                    hover:bg-gray-100 dark:hover:bg-slate-700
                    transition-colors duration-150
                    ${
                      theme === key
                        ? 'text-indigo-600 dark:text-indigo-400'
                        : 'text-gray-700 dark:text-slate-300'
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

  // Tabs variant (default)
  return (
    <div className='flex items-center bg-gray-100 dark:bg-slate-800 rounded-lg p-1 border border-gray-200 dark:border-slate-700 shadow-sm'>
      {themes.map(({ key, icon: ThemeIcon, label }) => (
        <motion.button
          key={key}
          onClick={() => setTheme(key)}
          className={`
            flex items-center gap-1.5 px-3 py-2 rounded-md ${sizeClasses[size]}
            font-medium transition-all duration-200
            ${
              theme === key
                ? 'bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 shadow-sm border border-gray-200 dark:border-slate-600'
                : 'text-gray-600 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-700 hover:text-gray-900 dark:hover:text-slate-200'
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

export default ThemeToggle;
