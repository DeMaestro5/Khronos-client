'use client';

import React from 'react';
import { Sparkles, MessageCircle, Bot, Zap, Target } from 'lucide-react';
import { useAIChat } from '@/src/context/AIChatContext';

interface AIAssistantCardProps {
  contentId: string;
  contentTitle: string;
  className?: string;
  variant?: 'default' | 'compact';
}

export const AIAssistantCard: React.FC<AIAssistantCardProps> = ({
  contentId,
  contentTitle,
  className = '',
  variant = 'default',
}) => {
  const { openChat } = useAIChat();

  const handleAIAction = () => {
    openChat(contentId, contentTitle);
  };

  if (variant === 'compact') {
    return (
      <div
        className={`bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl shadow-sm border border-purple-200 p-4 ${className}`}
      >
        <div className='flex items-center gap-3 mb-3'>
          <div className='w-8 h-8 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full flex items-center justify-center'>
            <Bot className='w-4 h-4 text-white' />
          </div>
          <div>
            <h3 className='font-semibold text-gray-900 text-sm'>
              AI Assistant
            </h3>
            <p className='text-xs text-gray-600'>Get help with this content</p>
          </div>
        </div>

        <button
          onClick={handleAIAction}
          className='w-full flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg'
        >
          <MessageCircle className='w-4 h-4' />
          <span className='text-sm font-medium'>Open AI Chat</span>
        </button>
      </div>
    );
  }

  return (
    <div
      className={`bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl shadow-sm border border-purple-200 p-6 ${className}`}
    >
      <div className='flex items-center gap-3 mb-4'>
        <div className='w-10 h-10 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full flex items-center justify-center'>
          <Bot className='w-5 h-5 text-white' />
        </div>
        <div>
          <h3 className='font-bold text-gray-900'>AI Assistant</h3>
          <p className='text-xs text-gray-600'>Get help with this content</p>
        </div>
      </div>

      <div className='grid grid-cols-2 gap-2 mb-4'>
        <button
          onClick={handleAIAction}
          className='flex items-center gap-2 p-3 bg-white/80 hover:bg-white rounded-xl transition-all duration-200 hover:shadow-md group'
        >
          <Zap className='w-4 h-4 text-purple-600 group-hover:text-purple-700' />
          <span className='text-xs font-medium text-gray-700 group-hover:text-gray-900'>
            Optimize
          </span>
        </button>

        <button
          onClick={handleAIAction}
          className='flex items-center gap-2 p-3 bg-white/80 hover:bg-white rounded-xl transition-all duration-200 hover:shadow-md group'
        >
          <Sparkles className='w-4 h-4 text-purple-600 group-hover:text-purple-700' />
          <span className='text-xs font-medium text-gray-700 group-hover:text-gray-900'>
            Ideas
          </span>
        </button>

        <button
          onClick={handleAIAction}
          className='flex items-center gap-2 p-3 bg-white/80 hover:bg-white rounded-xl transition-all duration-200 hover:shadow-md group'
        >
          <Target className='w-4 h-4 text-purple-600 group-hover:text-purple-700' />
          <span className='text-xs font-medium text-gray-700 group-hover:text-gray-900'>
            Strategy
          </span>
        </button>

        <button
          onClick={handleAIAction}
          className='flex items-center gap-2 p-3 bg-white/80 hover:bg-white rounded-xl transition-all duration-200 hover:shadow-md group'
        >
          <MessageCircle className='w-4 h-4 text-purple-600 group-hover:text-purple-700' />
          <span className='text-xs font-medium text-gray-700 group-hover:text-gray-900'>
            Analyze
          </span>
        </button>
      </div>

      <button
        onClick={handleAIAction}
        className='w-full flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl'
      >
        <MessageCircle className='w-4 h-4' />
        <span className='text-sm font-medium'>Open AI Chat</span>
      </button>
    </div>
  );
};
