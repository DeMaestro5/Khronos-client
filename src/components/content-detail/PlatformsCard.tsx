import React from 'react';
import { ExternalLink } from 'lucide-react';
import { ContentPlatform } from '@/src/types/content';

interface PlatformsCardProps {
  platforms: ContentPlatform[] | undefined;
}

export const PlatformsCard: React.FC<PlatformsCardProps> = ({ platforms }) => {
  if (!platforms?.length) return null;

  return (
    <div className='bg-theme-card rounded-2xl shadow-sm border border-theme-tertiary p-6 md:p-8 backdrop-blur-sm'>
      <h3 className='font-bold text-theme-primary mb-6 text-base md:text-lg'>
        Publishing Platforms
      </h3>
      <div className='space-y-4'>
        {platforms.map((platform: ContentPlatform, index: number) => (
          <div
            key={index}
            className='flex items-center gap-4 p-4 bg-theme-secondary/10 hover:bg-theme-secondary/20 rounded-xl transition-colors backdrop-blur-sm'
          >
            <div
              className={`w-10 h-10 md:w-12 md:h-12 ${platform.color} rounded-lg flex items-center justify-center text-white font-bold text-base md:text-lg flex-shrink-0`}
            >
              {platform.name.charAt(0)}
            </div>
            <div className='flex-1 min-w-0'>
              <div className='font-medium text-theme-primary text-base md:text-lg truncate'>
                {platform.name}
              </div>
            </div>
            <ExternalLink className='w-5 h-5 text-theme-secondary flex-shrink-0' />
          </div>
        ))}
      </div>
    </div>
  );
};
