'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export function DebugTheme() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [htmlClass, setHtmlClass] = useState('');

  useEffect(() => {
    setMounted(true);

    const updateHtmlClass = () => {
      setHtmlClass(document.documentElement.className);
    };
    updateHtmlClass();

    const observer = new MutationObserver(updateHtmlClass);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  if (!mounted) return null;

  return (
    <div className='fixed top-4 right-4 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 p-4 rounded-lg shadow-lg text-sm z-50'>
      <h3 className='font-bold mb-2 text-gray-900 dark:text-slate-100'>
        Theme Debug
      </h3>
      <p className='text-gray-700 dark:text-slate-300'>
        Current theme: <strong>{theme}</strong>
      </p>
      <p className='text-gray-700 dark:text-slate-300'>
        Resolved theme: <strong>{resolvedTheme}</strong>
      </p>
      <p className='text-gray-700 dark:text-slate-300'>
        HTML class: <strong>&quot;{htmlClass}&quot;</strong>
      </p>

      <div className='mt-2 space-x-2'>
        <button
          onClick={() => setTheme('light')}
          className='px-2 py-1 bg-blue-500 text-white rounded text-xs'
        >
          Light
        </button>
        <button
          onClick={() => setTheme('dark')}
          className='px-2 py-1 bg-blue-500 text-white rounded text-xs'
        >
          Dark
        </button>
        <button
          onClick={() => setTheme('system')}
          className='px-2 py-1 bg-blue-500 text-white rounded text-xs'
        >
          System
        </button>
      </div>

      <div className='mt-2 p-2 bg-gray-100 dark:bg-slate-700 rounded'>
        <p className='text-gray-900 dark:text-slate-100 text-xs'>
          This box should change color
        </p>
      </div>
    </div>
  );
}
