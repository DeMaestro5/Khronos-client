'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Sparkles, X } from 'lucide-react';
import { useContentCreation } from '@/src/context/ContentCreationContext';

const GlobalCreationIndicator: React.FC = () => {
  const { isCreating, creatingContentTitle, clearCreationState } =
    useContentCreation();
  const [elapsedTime, setElapsedTime] = useState(0);

  // Update elapsed time every second
  useEffect(() => {
    if (!isCreating) {
      setElapsedTime(0);
      return;
    }

    const interval = setInterval(() => {
      setElapsedTime((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isCreating]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCancel = () => {
    if (window.confirm('Are you sure you want to cancel content creation?')) {
      clearCreationState();
    }
  };

  return (
    <AnimatePresence>
      {isCreating && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          className='fixed bottom-6 right-6 z-[99999]'
        >
          <div className='flex items-center gap-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-3 rounded-2xl shadow-lg backdrop-blur-sm border border-white/10 max-w-sm'>
            <div className='relative'>
              <Loader2 className='w-5 h-5 animate-spin' />
              <Sparkles className='w-3 h-3 absolute -top-1 -right-1 text-yellow-300 animate-pulse' />
            </div>
            <div className='flex flex-col min-w-0 flex-1'>
              <span className='text-sm font-medium truncate'>
                Creating &ldquo;{creatingContentTitle}&rdquo;
              </span>
              <div className='flex items-center justify-between'>
                <span className='text-xs opacity-80'>
                  AI is working its magic! ✨
                </span>
                <span className='text-xs opacity-60 font-mono'>
                  {formatTime(elapsedTime)}
                </span>
              </div>
            </div>
            <button
              onClick={handleCancel}
              className='flex-shrink-0 p-1 hover:bg-white/20 rounded-full transition-colors duration-200'
              title='Cancel content creation'
            >
              <X className='w-4 h-4' />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default GlobalCreationIndicator;
