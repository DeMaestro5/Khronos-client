'use client';

import { useTheme } from 'next-themes';
import { useState, useEffect } from 'react';
import { ThemeToggle } from '../ui/theme-toggle';

export function ThemeTest() {
  const { theme, resolvedTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className='fixed bottom-4 right-4 z-50 max-w-sm'>
      <div className='bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg shadow-lg p-4 space-y-4'>
        <h3 className='font-semibold text-gray-900 dark:text-slate-100'>
          🎨 Dark Mode Test Panel
        </h3>

        <div className='space-y-2 text-sm'>
          <div className='flex justify-between'>
            <span className='text-gray-600 dark:text-slate-400'>Theme:</span>
            <span className='font-mono text-gray-900 dark:text-slate-100'>
              {theme}
            </span>
          </div>
          <div className='flex justify-between'>
            <span className='text-gray-600 dark:text-slate-400'>Resolved:</span>
            <span className='font-mono text-gray-900 dark:text-slate-100'>
              {resolvedTheme}
            </span>
          </div>
          <div className='flex justify-between'>
            <span className='text-gray-600 dark:text-slate-400'>System:</span>
            <span className='font-mono text-gray-900 dark:text-slate-100'>
              {systemTheme}
            </span>
          </div>
          <div className='flex justify-between'>
            <span className='text-gray-600 dark:text-slate-400'>
              HTML class:
            </span>
            <span className='font-mono text-gray-900 dark:text-slate-100 text-xs'>
              {document.documentElement.className || 'none'}
            </span>
          </div>
        </div>

        <div className='space-y-3'>
          <ThemeToggle variant='tabs' size='sm' />

          {/* Color Test Grid */}
          <div className='grid grid-cols-4 gap-2'>
            <div
              className='h-8 bg-gray-100 dark:bg-slate-700 rounded border'
              title='Background'
            />
            <div
              className='h-8 bg-gray-200 dark:bg-slate-600 rounded border'
              title='Surface'
            />
            <div
              className='h-8 bg-gray-300 dark:bg-slate-500 rounded border'
              title='Border'
            />
            <div
              className='h-8 bg-indigo-500 dark:bg-blue-600 rounded border'
              title='Primary'
            />
          </div>

          {/* Text Test */}
          <div className='space-y-1'>
            <p className='text-gray-900 dark:text-slate-100 text-sm font-medium'>
              Primary text
            </p>
            <p className='text-gray-600 dark:text-slate-400 text-xs'>
              Secondary text
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
