import React from 'react';
import { ExternalLink } from 'lucide-react';
import { ContentPlatform } from '@/src/types/content';

interface PlatformsCardProps {
  platforms: ContentPlatform[] | undefined;
}

export const PlatformsCard: React.FC<PlatformsCardProps> = ({ platforms }) => {
  if (!platforms?.length) return null;

  return (
    <div className='bg-theme-card rounded-2xl shadow-sm border border-theme-tertiary p-6 backdrop-blur-sm'>
      <h3 className='font-bold text-theme-primary mb-4'>
        Publishing Platforms
      </h3>
      <div className='space-y-3'>
        {platforms.map((platform: ContentPlatform, index: number) => (
          <div
            key={index}
            className='flex items-center gap-3 p-3 bg-theme-secondary/10 hover:bg-theme-secondary/20 rounded-xl transition-colors backdrop-blur-sm'
          >
            <div
              className={`w-10 h-10 ${platform.color} rounded-lg flex items-center justify-center text-white font-bold`}
            >
              {platform.name.charAt(0)}
            </div>
            <div className='flex-1'>
              <div className='font-medium text-theme-primary'>
                {platform.name}
              </div>
            </div>
            <ExternalLink className='w-4 h-4 text-theme-secondary' />
          </div>
        ))}
      </div>
    </div>
  );
};
