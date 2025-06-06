import { useCallback } from 'react';
import {
  celebrateWithConfetti,
  celebrateSuccess,
  celebrateAchievement,
} from '@/src/lib/confetti';

export const useConfetti = () => {
  const celebrate = useCallback(() => {
    celebrateWithConfetti();
  }, []);

  const celebrateSimple = useCallback(() => {
    celebrateSuccess();
  }, []);

  const celebrateGold = useCallback(() => {
    celebrateAchievement();
  }, []);

  return {
    celebrate,
    celebrateSimple,
    celebrateGold,
    // Direct access to individual functions
    celebrateWithConfetti,
    celebrateSuccess,
    celebrateAchievement,
  };
};
