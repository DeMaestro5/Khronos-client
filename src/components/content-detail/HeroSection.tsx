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
    <div className='bg-white rounded-2xl shadow-sm border border-white/20 backdrop-blur-sm mb-8 overflow-hidden'>
      <div
        className={`bg-gradient-to-r ${getContentTypeGradient(
          content.type
        )} p-8 text-white`}
      >
        <div className='flex items-start justify-between mb-6'>
          <div className='flex items-center gap-3'>
            {getStatusIcon(content.status)}
            <span
              className={`px-4 py-2 rounded-full text-sm font-semibold border ${getStatusStyle(
                content.status
              )} bg-white/90`}
            >
              {content.status.replace('_', ' ')}
            </span>
            <span className='px-4 py-2 bg-white/20 text-white rounded-full text-sm font-semibold backdrop-blur-sm flex items-center gap-2'>
              {getContentTypeIcon(content.type)}
              {content.type.replace('_', ' ')}
            </span>
            {content.aiGenerated && (
              <span className='px-4 py-2 bg-purple-500/30 text-white rounded-full text-sm font-semibold backdrop-blur-sm flex items-center gap-2'>
                <Sparkles className='w-4 h-4' />
                AI Generated
              </span>
            )}
          </div>
        </div>
        <h1 className='text-4xl font-bold mb-4 leading-tight'>
          {content.title}
        </h1>
        <p className='text-xl text-blue-100 leading-relaxed max-w-4xl'>
          {content.excerpt}
        </p>
      </div>
    </div>
  );
};
