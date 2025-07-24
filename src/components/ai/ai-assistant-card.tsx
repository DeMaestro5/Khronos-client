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
        className={`bg-accent-primary/5 rounded-xl shadow-sm border border-theme-tertiary p-4 backdrop-blur-sm ${className}`}
      >
        <div className='flex items-center gap-3 mb-3'>
          <div className='w-8 h-8 bg-accent-primary rounded-full flex items-center justify-center shadow-lg'>
            <Bot className='w-4 h-4 text-white' />
          </div>
          <div>
            <h3 className='font-semibold text-theme-primary text-sm'>
              AI Assistant
            </h3>
            <p className='text-xs text-theme-secondary'>
              Get help with this content
            </p>
          </div>
        </div>

        <button
          onClick={() => handleAIAction()}
          className='w-full flex items-center justify-center gap-2 px-4 py-2 bg-accent-primary text-white rounded-lg hover:bg-accent-secondary transition-all duration-200 shadow-md hover:shadow-lg'
        >
          <MessageCircle className='w-4 h-4' />
          <span className='text-sm font-medium'>Open AI Chat</span>
        </button>
      </div>
    );
  }

  return (
    <div
      className={`bg-accent-primary/5 rounded-2xl shadow-lg border border-theme-tertiary p-6 backdrop-blur-sm ${className}`}
    >
      <div className='flex items-center gap-3 mb-4'>
        <div className='w-10 h-10 bg-accent-primary rounded-full flex items-center justify-center shadow-lg'>
          <Bot className='w-5 h-5 text-white' />
        </div>
        <div>
          <h3 className='font-bold text-theme-primary'>AI Assistant</h3>
          <p className='text-xs text-theme-secondary'>
            Get help with this content
          </p>
        </div>
      </div>

      <div className='grid grid-cols-2 gap-2 mb-4'>
        <button
          onClick={() => handleAIAction('optimize')}
          className='flex items-center gap-2 p-3 bg-theme-card hover:bg-theme-hover rounded-xl transition-all duration-200 hover:shadow-md group border border-theme-tertiary'
        >
          <Zap className='w-4 h-4 text-accent-primary group-hover:text-accent-secondary' />
          <span className='text-xs font-medium text-theme-secondary group-hover:text-theme-primary'>
            Optimize
          </span>
        </button>

        <button
          onClick={() => handleAIAction('ideas')}
          className='flex items-center gap-2 p-3 bg-theme-card hover:bg-theme-hover rounded-xl transition-all duration-200 hover:shadow-md group border border-theme-tertiary'
        >
          <Sparkles className='w-4 h-4 text-accent-primary group-hover:text-accent-secondary' />
          <span className='text-xs font-medium text-theme-secondary group-hover:text-theme-primary'>
            Ideas
          </span>
        </button>

        <button
          onClick={() => handleAIAction('strategy')}
          className='flex items-center gap-2 p-3 bg-theme-card hover:bg-theme-hover rounded-xl transition-all duration-200 hover:shadow-md group border border-theme-tertiary'
        >
          <Target className='w-4 h-4 text-accent-primary group-hover:text-accent-secondary' />
          <span className='text-xs font-medium text-theme-secondary group-hover:text-theme-primary'>
            Strategy
          </span>
        </button>

        <button
          onClick={() => handleAIAction('analyze')}
          className='flex items-center gap-2 p-3 bg-theme-card hover:bg-theme-hover rounded-xl transition-all duration-200 hover:shadow-md group border border-theme-tertiary'
        >
          <Sparkles className='w-4 h-4 text-accent-primary group-hover:text-accent-secondary' />
          <span className='text-xs font-medium text-theme-secondary group-hover:text-theme-primary'>
            Analyze
          </span>
        </button>
      </div>

      <button
        onClick={() => handleAIAction()}
        className='w-full flex items-center justify-center gap-2 px-4 py-3 bg-accent-primary text-white rounded-xl hover:bg-accent-secondary transition-all duration-200 shadow-lg hover:shadow-xl font-medium'
      >
        <MessageCircle className='w-4 h-4' />
        <span>Open AI Chat</span>
      </button>
    </div>
  );
};
