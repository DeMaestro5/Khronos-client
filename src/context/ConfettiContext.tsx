'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import {
  celebrateWithConfetti,
  celebrateSuccess,
  celebrateAchievement,
} from '@/src/lib/confetti';

interface ConfettiContextType {
  celebrate: () => void;
  celebrateSimple: () => void;
  celebrateGold: () => void;
  triggerContentCreationCelebration: () => void;
  triggerSuccessCelebration: () => void;
  triggerAchievementCelebration: () => void;
}

const ConfettiContext = createContext<ConfettiContextType | undefined>(
  undefined
);

interface ConfettiProviderProps {
  children: ReactNode;
}

export const ConfettiProvider = ({ children }: ConfettiProviderProps) => {
  const celebrate = () => {
    celebrateWithConfetti();
  };

  const celebrateSimple = () => {
    celebrateSuccess();
  };

  const celebrateGold = () => {
    celebrateAchievement();
  };

  // Semantic celebration functions for specific events
  const triggerContentCreationCelebration = () => {
    celebrateWithConfetti();
  };

  const triggerSuccessCelebration = () => {
    celebrateSuccess();
  };

  const triggerAchievementCelebration = () => {
    celebrateAchievement();
  };

  const value: ConfettiContextType = {
    celebrate,
    celebrateSimple,
    celebrateGold,
    triggerContentCreationCelebration,
    triggerSuccessCelebration,
    triggerAchievementCelebration,
  };

  return (
    <ConfettiContext.Provider value={value}>
      {children}
    </ConfettiContext.Provider>
  );
};

export const useGlobalConfetti = () => {
  const context = useContext(ConfettiContext);
  if (context === undefined) {
    throw new Error('useGlobalConfetti must be used within a ConfettiProvider');
  }
  return context;
};
