// Performance optimization utilities for AI Chat Modal

// Debounce function for performance optimization
export const debounce = <T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Throttle function for performance optimization
export const throttle = <T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

// Optimized requestAnimationFrame wrapper
export const optimizedRAF = (callback: () => void): void => {
  if (typeof window !== 'undefined' && 'requestAnimationFrame' in window) {
    requestAnimationFrame(callback);
  } else {
    setTimeout(callback, 16); // ~60fps fallback
  }
};

// Optimized requestIdleCallback wrapper
export const optimizedRIC = (callback: () => void): void => {
  if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
    (
      window as { requestIdleCallback?: (callback: () => void) => void }
    ).requestIdleCallback?.(callback);
  } else {
    setTimeout(callback, 0);
  }
};

// Performance monitoring utility
export const measurePerformance = (name: string, fn: () => void): void => {
  if (process.env.NODE_ENV === 'development') {
    const start = performance.now();
    fn();
    const end = performance.now();
    console.log(`${name} took ${end - start}ms`);
  } else {
    fn();
  }
};

// Optimized scroll handling
export const smoothScrollTo = (
  element: HTMLElement | null,
  behavior: ScrollBehavior = 'smooth'
): void => {
  if (!element) return;

  optimizedRAF(() => {
    element.scrollIntoView({ behavior });
  });
};

// Optimized focus handling
export const optimizedFocus = (element: HTMLElement | null): void => {
  if (!element) return;

  optimizedRAF(() => {
    element.focus();
  });
};

// Optimized localStorage operations
export const optimizedStorage = {
  get: (key: string): unknown => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Failed to get from localStorage:', error);
      return null;
    }
  },

  set: (key: string, value: unknown): void => {
    optimizedRIC(() => {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch (error) {
        console.error('Failed to set localStorage:', error);
      }
    });
  },

  remove: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Failed to remove from localStorage:', error);
    }
  },
};

// CSS optimization helpers
export const cssOptimizations = {
  // Force hardware acceleration
  hardwareAcceleration: {
    transform: 'translateZ(0)',
    backfaceVisibility: 'hidden',
    perspective: '1000px',
    willChange: 'transform, opacity',
  },

  // Smooth transitions
  smoothTransition: {
    transition: 'all 0.2s ease-out',
  },

  // Fast animations
  fastAnimation: {
    transition: 'all 0.1s ease-out',
  },
};

// Memory management utilities
export const memoryUtils = {
  // Clear unused references
  clearUnusedRefs: (refs: Record<string, unknown>): void => {
    Object.keys(refs).forEach((key) => {
      const ref = refs[key];
      if (ref && typeof ref === 'object' && 'current' in ref && ref.current) {
        (ref as { current: unknown }).current = null;
      }
    });
  },

  // Batch state updates
  batchStateUpdates: <T>(
    setState: React.Dispatch<React.SetStateAction<T>>,
    updates: Array<(prev: T) => T>
  ): void => {
    setState((prev) => {
      return updates.reduce((acc, update) => update(acc), prev);
    });
  },
};

// Animation performance helpers
export const animationUtils = {
  // Simplified spring animation
  simpleSpring: {
    type: 'spring',
    stiffness: 400,
    damping: 30,
    mass: 0.8,
  },

  // Fast spring animation
  fastSpring: {
    type: 'spring',
    stiffness: 500,
    damping: 25,
    mass: 0.6,
  },

  // Smooth ease animation
  smoothEase: {
    duration: 0.2,
    ease: 'easeOut',
  },

  // Fast ease animation
  fastEase: {
    duration: 0.1,
    ease: 'easeOut',
  },
};

// Mobile performance optimizations
export const mobileOptimizations = {
  // Reduce animations on mobile
  shouldReduceAnimations: (): boolean => {
    if (typeof window === 'undefined') return false;

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    // Check for mobile device
    const isMobile =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );

    // Check for low-end device (basic heuristic)
    const isLowEndDevice = navigator.hardwareConcurrency <= 4;

    return prefersReducedMotion || isMobile || isLowEndDevice;
  },

  // Get optimized animation settings
  getOptimizedAnimationSettings: () => {
    const shouldReduce = mobileOptimizations.shouldReduceAnimations();

    return {
      spring: shouldReduce
        ? animationUtils.fastSpring
        : animationUtils.simpleSpring,
      ease: shouldReduce ? animationUtils.fastEase : animationUtils.smoothEase,
      duration: shouldReduce ? 0.1 : 0.2,
    };
  },
};
