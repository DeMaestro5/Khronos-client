'use client';

import React, { useState } from 'react';
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

  const handleClick = () => {
    openChat(contentId, contentTitle);
  };

  if (isOpen) return null;

  return (
    <motion.div
      className='fixed bottom-6 left-6 z-50'
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
    >
      <motion.button
        onClick={handleClick}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        className='group relative flex items-center gap-3 bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 hover:from-purple-500 hover:via-violet-500 hover:to-indigo-500 text-white px-4 py-3 rounded-2xl shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 overflow-hidden'
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.95 }}
      >
        {/* Sparkle Animation Background */}
        <div className='absolute inset-0 opacity-20'>
          <div className='absolute top-1 left-2 w-1 h-1 bg-white rounded-full animate-ping'></div>
          <div className='absolute top-3 right-3 w-0.5 h-0.5 bg-white rounded-full animate-pulse delay-300'></div>
          <div className='absolute bottom-2 left-3 w-0.5 h-0.5 bg-white rounded-full animate-pulse delay-700'></div>
        </div>

        {/* Main Content */}
        <div className='relative z-10 flex items-center gap-3'>
          <div className='relative'>
            <motion.div
              animate={{
                rotate: isHovered ? 360 : 0,
              }}
              transition={{ duration: 0.6, ease: 'easeInOut' }}
            >
              <Sparkles className='w-5 h-5' />
            </motion.div>

            {/* Pulse Ring */}
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
                className='overflow-hidden whitespace-nowrap'
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
              >
                <MessageCircle className='w-5 h-5' />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Gradient Overlay */}
        <div className='absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out' />
      </motion.button>

      {/* Tooltip for content-specific chat */}
      {contentTitle && !isHovered && (
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className='absolute left-full ml-3 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded-lg whitespace-nowrap pointer-events-none'
        >
          Ask AI about this content
          <div className='absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-900' />
        </motion.div>
      )}
    </motion.div>
  );
};

export default FloatingAIButton;
