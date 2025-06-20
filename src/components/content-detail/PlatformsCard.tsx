import React from 'react';
import { ExternalLink } from 'lucide-react';
import { ContentPlatform } from '@/src/types/content';

interface PlatformsCardProps {
  platforms: ContentPlatform[] | undefined;
}

export const PlatformsCard: React.FC<PlatformsCardProps> = ({ platforms }) => {
  if (!platforms?.length) return null;

  return (
    <div className='bg-white/95 dark:bg-slate-800/90 rounded-2xl shadow-sm border border-white/20 dark:border-slate-700/60 p-6 backdrop-blur-sm'>
      <h3 className='font-bold text-gray-900 dark:text-slate-100 mb-4'>
        Publishing Platforms
      </h3>
      <div className='space-y-3'>
        {platforms.map((platform: ContentPlatform, index: number) => (
          <div
            key={index}
            className='flex items-center gap-3 p-3 bg-gray-50 dark:bg-slate-700/50 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-600/60 transition-colors backdrop-blur-sm'
          >
            <div
              className={`w-10 h-10 ${platform.color} rounded-lg flex items-center justify-center text-white font-bold`}
            >
              {platform.name.charAt(0)}
            </div>
            <div className='flex-1'>
              <div className='font-medium text-gray-900 dark:text-slate-100'>
                {platform.name}
              </div>
            </div>
            <ExternalLink className='w-4 h-4 text-gray-400 dark:text-slate-500' />
          </div>
        ))}
      </div>
    </div>
  );
};
