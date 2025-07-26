import React from 'react';
import { Sparkles } from 'lucide-react';
import { ContentData } from '@/src/types/content';
import {
  getContentTypeIcon,
  getContentTypeGradient,
  getStatusIcon,
  getStatusStyle,
} from './utils';

interface HeroSectionProps {
  content: ContentData;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ content }) => {
  return (
    <div className='bg-theme-card rounded-2xl shadow-sm border border-theme-primary/20 backdrop-blur-sm mb-6 overflow-hidden'>
      <div
        className={`bg-gradient-to-br ${getContentTypeGradient(
          content.type
        )} p-6 md:p-8 text-white`}
      >
        {/* Status and Type Badges - Mobile Optimized */}
        <div className='flex flex-wrap items-center gap-2 mb-4'>
          <div className='flex items-center gap-2'>
            {getStatusIcon(content.status)}
            <span
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${getStatusStyle(
                content.status
              )}`}
            >
              {content.status.replace('_', ' ')}
            </span>
          </div>

          <span className='px-3 py-1.5 bg-white/20 text-white rounded-full text-xs font-semibold backdrop-blur-sm flex items-center gap-1.5'>
            {getContentTypeIcon(content.type)}
            <span className='hidden sm:inline'>
              {content.type.replace('_', ' ')}
            </span>
            <span className='sm:hidden'>{content.type.split('_')[0]}</span>
          </span>

          {content.aiGenerated && (
            <span className='px-3 py-1.5 bg-purple-500/30 text-white rounded-full text-xs font-semibold backdrop-blur-sm flex items-center gap-1.5'>
              <Sparkles className='w-3 h-3' />
              <span className='hidden sm:inline'>AI Generated</span>
              <span className='sm:hidden'>AI</span>
            </span>
          )}
        </div>

        {/* Title - Mobile Optimized */}
        <h1 className='text-2xl md:text-3xl lg:text-4xl font-bold mb-4 leading-tight break-words'>
          {content.title}
        </h1>

        {/* Excerpt - Mobile Optimized */}
        {content.excerpt && (
          <p className='text-base md:text-lg lg:text-xl text-blue-100 leading-relaxed break-words'>
            {content.excerpt}
          </p>
        )}
      </div>
    </div>
  );
};
