'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTheme as useNextTheme } from 'next-themes';

export type ThemeMode = 'light' | 'dark' | 'system';

interface UseThemeReturn {
  theme: ThemeMode;
  resolvedTheme: 'light' | 'dark';
  setTheme: (theme: ThemeMode) => void;
  mounted: boolean;
  isSystem: boolean;
  toggleTheme: () => void;
  cycleTheme: () => void;
}

export function useTheme(): UseThemeReturn {
  const {
    theme,
    setTheme: setNextTheme,
    resolvedTheme,
    systemTheme,
  } = useNextTheme();
  const [mounted, setMounted] = useState(false);

  // Handle mounting to prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Instant theme switching - no API calls, no delays
  const setTheme = useCallback(
    (newTheme: ThemeMode) => {
      // Immediately update the theme for instant response
      setNextTheme(newTheme);

      // Store in localStorage for persistence (optional)
      if (typeof window !== 'undefined') {
        localStorage.setItem('khronos-theme', newTheme);
      }
    },
    [setNextTheme]
  );

  // Toggle between light and dark (skip system)
  const toggleTheme = useCallback(() => {
    const currentTheme = theme || 'system';
    if (currentTheme === 'light') {
      setTheme('dark');
    } else if (currentTheme === 'dark') {
      setTheme('light');
    } else {
      // If system, toggle based on resolved theme
      setTheme(resolvedTheme === 'light' ? 'dark' : 'light');
    }
  }, [theme, resolvedTheme, setTheme]);

  // Cycle through all themes: light -> dark -> system -> light
  const cycleTheme = useCallback(() => {
    const currentTheme = theme || 'system';
    if (currentTheme === 'light') {
      setTheme('dark');
    } else if (currentTheme === 'dark') {
      setTheme('system');
    } else {
      setTheme('light');
    }
  }, [theme, setTheme]);

  // Determine if current theme is system
  const isSystem = theme === 'system';

  // Get the actual resolved theme (what the user sees)
  const actualResolvedTheme: 'light' | 'dark' =
    (resolvedTheme as 'light' | 'dark') ||
    (systemTheme as 'light' | 'dark') ||
    'light';

  return {
    theme: (theme as ThemeMode) || 'system',
    resolvedTheme: actualResolvedTheme,
    setTheme,
    mounted,
    isSystem,
    toggleTheme,
    cycleTheme,
  };
}
