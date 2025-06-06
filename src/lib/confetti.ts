/**
 * Global Confetti Celebration System
 *
 * This module provides various confetti celebration effects that can be used
 * throughout the application. Use the ConfettiProvider and useGlobalConfetti
 * hook for easy access in components.
 *
 * Available celebrations:
 * - celebrateWithConfetti: Full celebration with multiple bursts (for major events like content creation)
 * - celebrateSuccess: Simple success celebration (for quick wins)
 * - celebrateAchievement: Golden celebration for special achievements
 *
 * Usage:
 * ```tsx
 * import { useGlobalConfetti } from '@/src/context/ConfettiContext';
 *
 * const MyComponent = () => {
 *   const { triggerContentCreationCelebration } = useGlobalConfetti();
 *
 *   const handleSuccess = () => {
 *     triggerContentCreationCelebration();
 *   };
 * };
 * ```
 */

import confetti from 'canvas-confetti';

// Global confetti celebration utility
export const celebrateWithConfetti = () => {
  // First burst - colorful confetti from center
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
    colors: ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#00f2fe'],
  });

  // Second burst - stars from left
  setTimeout(() => {
    confetti({
      particleCount: 50,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.8 },
      colors: ['#ffd700', '#ffed4e', '#ff6b6b', '#4ecdc4'],
      shapes: ['star'],
    });
  }, 250);

  // Third burst - stars from right
  setTimeout(() => {
    confetti({
      particleCount: 50,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.8 },
      colors: ['#ffd700', '#ffed4e', '#ff6b6b', '#4ecdc4'],
      shapes: ['star'],
    });
  }, 400);

  // Fourth burst - glitter rain
  setTimeout(() => {
    confetti({
      particleCount: 150,
      spread: 180,
      startVelocity: 45,
      scalar: 0.8,
      origin: { y: 0.1 },
      colors: [
        '#667eea',
        '#764ba2',
        '#f093fb',
        '#f5576c',
        '#ffd700',
        '#4facfe',
      ],
    });
  }, 600);
};

// Alternative celebration styles for different occasions
export const celebrateSuccess = () => {
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
    colors: ['#00f2fe', '#4facfe', '#667eea'],
  });
};

export const celebrateAchievement = () => {
  // Golden celebration
  confetti({
    particleCount: 200,
    spread: 160,
    origin: { y: 0.7 },
    colors: ['#ffd700', '#ffed4e', '#ffa500'],
    shapes: ['star'],
  });
};
