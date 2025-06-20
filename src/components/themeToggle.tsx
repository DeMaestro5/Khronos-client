'use client';

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { Sun, Moon, Monitor } from 'lucide-react';

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { setTheme, theme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className='flex items-center bg-gray-100 dark:bg-slate-700 rounded-lg p-1 animate-pulse'>
        <div className='w-16 h-8 bg-gray-200 dark:bg-slate-600 rounded-md' />
      </div>
    );
  }

  return (
    <div className='flex items-center bg-gray-100 dark:bg-slate-800 rounded-lg p-1 border border-gray-200 dark:border-slate-700 shadow-sm'>
      <button
        onClick={() => setTheme('light')}
        className={`flex items-center gap-1 px-3 py-2 rounded-md text-xs font-medium transition-all duration-200 ${
          theme === 'light'
            ? 'bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 shadow-sm border border-gray-200 dark:border-slate-600'
            : 'text-gray-600 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-700 hover:text-gray-900 dark:hover:text-slate-200'
        }`}
        aria-label='Switch to light mode'
      >
        <Sun className='h-3 w-3' />
        Light
      </button>

      <button
        onClick={() => setTheme('dark')}
        className={`flex items-center gap-1 px-3 py-2 rounded-md text-xs font-medium transition-all duration-200 ${
          theme === 'dark'
            ? 'bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 shadow-sm border border-gray-200 dark:border-slate-600'
            : 'text-gray-600 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-700 hover:text-gray-900 dark:hover:text-slate-200'
        }`}
        aria-label='Switch to dark mode'
      >
        <Moon className='h-3 w-3' />
        Dark
      </button>

      <button
        onClick={() => setTheme('system')}
        className={`flex items-center gap-1 px-3 py-2 rounded-md text-xs font-medium transition-all duration-200 ${
          theme === 'system'
            ? 'bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 shadow-sm border border-gray-200 dark:border-slate-600'
            : 'text-gray-600 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-700 hover:text-gray-900 dark:hover:text-slate-200'
        }`}
        aria-label='Switch to system mode'
      >
        <Monitor className='h-3 w-3' />
        System
      </button>
    </div>
  );
}
