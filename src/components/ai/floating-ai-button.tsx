'use client';

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, MessageCircle, Zap } from 'lucide-react';
import { useAIChat } from '@/src/context/AIChatContext';

interface FloatingAIButtonProps {
  contentId?: string;
  contentTitle?: string;
}

const FloatingAIButton: React.FC<FloatingAIButtonProps> = ({
  contentId,
  contentTitle,
}) => {
  const { openChat, isOpen } = useAIChat();
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = useCallback(() => {
    // Immediate response - no delay
    openChat(contentId, contentTitle);
  }, [openChat, contentId, contentTitle]);

  if (isOpen) return null;

  return (
    <motion.div
      className='fixed bottom-20 right-4 z-[99999] sm:hidden'
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{
        type: 'spring',
        stiffness: 400,
        damping: 30,
        mass: 0.6,
      }}
      style={{
        willChange: 'transform, opacity',
        transform: 'translateZ(0)',
        backfaceVisibility: 'hidden',
      }}
    >
      <motion.button
        onClick={handleClick}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        className='group relative flex items-center justify-center w-12 h-12 md:w-auto md:h-auto md:gap-2 md:gap-3 bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 hover:from-purple-500 hover:via-violet-500 hover:to-indigo-500 text-white rounded-full md:rounded-2xl shadow-2xl hover:shadow-purple-500/25 transition-all duration-200 overflow-hidden'
        whileHover={{
          scale: 1.05,
          y: -2,
          transition: { duration: 0.15 },
        }}
        whileTap={{
          scale: 0.95,
          transition: { duration: 0.08 },
        }}
        style={{
          willChange: 'transform',
          transform: 'translateZ(0)',
          backfaceVisibility: 'hidden',
        }}
      >
        {/* Sparkle Animation Background - Simplified */}
        <div className='absolute inset-0 opacity-20'>
          <div className='absolute top-1 left-2 w-1 h-1 bg-white rounded-full animate-ping'></div>
          <div className='absolute top-3 right-3 w-0.5 h-0.5 bg-white rounded-full animate-pulse delay-300'></div>
          <div className='absolute bottom-2 left-3 w-0.5 h-0.5 bg-white rounded-full animate-pulse delay-700'></div>
        </div>

        {/* Main Content */}
        <div className='relative z-10 flex items-center justify-center md:gap-2 md:gap-3'>
          <div className='relative'>
            <motion.div
              animate={{
                rotate: isHovered ? 360 : 0,
              }}
              transition={{
                duration: 0.6,
                ease: 'easeInOut',
              }}
            >
              <Sparkles className='w-5 h-5 md:w-5 md:h-5' />
            </motion.div>

            {/* Pulse Ring - Simplified */}
            <motion.div
              className='absolute inset-0 border-2 border-white rounded-full'
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 0, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          </div>

          <AnimatePresence mode='wait'>
            {isHovered ? (
              <motion.div
                key='expanded'
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 'auto', opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className='overflow-hidden whitespace-nowrap hidden md:block'
              >
                <span className='text-sm font-medium flex items-center gap-2'>
                  <Zap className='w-4 h-4' />
                  Chat with AI
                  {contentTitle && (
                    <span className='text-xs opacity-80 max-w-32 truncate'>
                      about &ldquo;{contentTitle}&rdquo;
                    </span>
                  )}
                </span>
              </motion.div>
            ) : (
              <motion.div
                key='collapsed'
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                transition={{ duration: 0.2 }}
                className='hidden md:block'
              >
                <MessageCircle className='w-4 h-4 md:w-5 md:h-5' />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Gradient Overlay */}
        <div className='absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out' />
      </motion.button>

      {/* Tooltip for content-specific chat - Only show on desktop */}
      {contentTitle && !isHovered && (
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className='absolute left-full ml-3 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded-lg whitespace-nowrap pointer-events-none hidden md:block'
        >
          Ask AI about this content
          <div className='absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-900' />
        </motion.div>
      )}
    </motion.div>
  );
};

export default FloatingAIButton;
