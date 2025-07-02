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

  const handleAIAction = (actionType?: string) => {
    let initialPrompt = '';

    switch (actionType) {
      case 'optimize':
        initialPrompt = `How can I optimize "${contentTitle}" for better engagement and performance?`;
        break;
      case 'ideas':
        initialPrompt = `What are some creative ideas to expand on "${contentTitle}" and create more engaging content?`;
        break;
      case 'strategy':
        initialPrompt = `What content strategy would you recommend for "${contentTitle}" to maximize its reach and impact?`;
        break;
      case 'analyze':
        initialPrompt = `Can you analyze "${contentTitle}" and provide insights on how to improve it?`;
        break;
      default:
        initialPrompt = '';
    }

    openChat(contentId, contentTitle, initialPrompt);
  };

  if (variant === 'compact') {
    return (
      <div
        className={`bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-xl shadow-sm border border-purple-200 dark:border-purple-700/50 p-4 backdrop-blur-sm ${className}`}
      >
        <div className='flex items-center gap-3 mb-3'>
          <div className='w-8 h-8 bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-500 dark:to-indigo-600 rounded-full flex items-center justify-center shadow-lg'>
            <Bot className='w-4 h-4 text-white' />
          </div>
          <div>
            <h3 className='font-semibold text-gray-900 dark:text-slate-100 text-sm'>
              AI Assistant
            </h3>
            <p className='text-xs text-gray-600 dark:text-slate-400'>
              Get help with this content
            </p>
          </div>
        </div>

        <button
          onClick={() => handleAIAction()}
          className='w-full flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-500 dark:to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 dark:hover:from-purple-600 dark:hover:to-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg'
        >
          <MessageCircle className='w-4 h-4' />
          <span className='text-sm font-medium'>Open AI Chat</span>
        </button>
      </div>
    );
  }

  return (
    <div
      className={`bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-2xl shadow-lg border border-purple-200 dark:border-purple-700/50 p-6 backdrop-blur-sm ${className}`}
    >
      <div className='flex items-center gap-3 mb-4'>
        <div className='w-10 h-10 bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-500 dark:to-indigo-600 rounded-full flex items-center justify-center shadow-lg'>
          <Bot className='w-5 h-5 text-white' />
        </div>
        <div>
          <h3 className='font-bold text-gray-900 dark:text-slate-100'>
            AI Assistant
          </h3>
          <p className='text-xs text-gray-600 dark:text-slate-400'>
            Get help with this content
          </p>
        </div>
      </div>

      <div className='grid grid-cols-2 gap-2 mb-4'>
        <button
          onClick={() => handleAIAction('optimize')}
          className='flex items-center gap-2 p-3 bg-white/80 dark:bg-slate-700/50 hover:bg-white dark:hover:bg-slate-600 rounded-xl transition-all duration-200 hover:shadow-md group border border-white/50 dark:border-slate-600/50'
        >
          <Zap className='w-4 h-4 text-purple-600 dark:text-purple-400 group-hover:text-purple-700 dark:group-hover:text-purple-300' />
          <span className='text-xs font-medium text-gray-700 dark:text-slate-300 group-hover:text-gray-900 dark:group-hover:text-slate-100'>
            Optimize
          </span>
        </button>

        <button
          onClick={() => handleAIAction('ideas')}
          className='flex items-center gap-2 p-3 bg-white/80 dark:bg-slate-700/50 hover:bg-white dark:hover:bg-slate-600 rounded-xl transition-all duration-200 hover:shadow-md group border border-white/50 dark:border-slate-600/50'
        >
          <Sparkles className='w-4 h-4 text-purple-600 dark:text-purple-400 group-hover:text-purple-700 dark:group-hover:text-purple-300' />
          <span className='text-xs font-medium text-gray-700 dark:text-slate-300 group-hover:text-gray-900 dark:group-hover:text-slate-100'>
            Ideas
          </span>
        </button>

        <button
          onClick={() => handleAIAction('strategy')}
          className='flex items-center gap-2 p-3 bg-white/80 dark:bg-slate-700/50 hover:bg-white dark:hover:bg-slate-600 rounded-xl transition-all duration-200 hover:shadow-md group border border-white/50 dark:border-slate-600/50'
        >
          <Target className='w-4 h-4 text-purple-600 dark:text-purple-400 group-hover:text-purple-700 dark:group-hover:text-purple-300' />
          <span className='text-xs font-medium text-gray-700 dark:text-slate-300 group-hover:text-gray-900 dark:group-hover:text-slate-100'>
            Strategy
          </span>
        </button>

        <button
          onClick={() => handleAIAction('analyze')}
          className='flex items-center gap-2 p-3 bg-white/80 dark:bg-slate-700/50 hover:bg-white dark:hover:bg-slate-600 rounded-xl transition-all duration-200 hover:shadow-md group border border-white/50 dark:border-slate-600/50'
        >
          <Sparkles className='w-4 h-4 text-purple-600 dark:text-purple-400 group-hover:text-purple-700 dark:group-hover:text-purple-300' />
          <span className='text-xs font-medium text-gray-700 dark:text-slate-300 group-hover:text-gray-900 dark:group-hover:text-slate-100'>
            Analyze
          </span>
        </button>
      </div>

      <button
        onClick={() => handleAIAction()}
        className='w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-500 dark:to-indigo-600 text-white rounded-xl hover:from-purple-700 hover:to-indigo-700 dark:hover:from-purple-600 dark:hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl font-medium'
      >
        <MessageCircle className='w-4 h-4' />
        <span>Open AI Chat</span>
      </button>
    </div>
  );
};
