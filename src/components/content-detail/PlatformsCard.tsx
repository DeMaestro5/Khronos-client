import React from 'react';
import { ExternalLink } from 'lucide-react';
import { ContentPlatform } from '@/src/types/content';

interface PlatformsCardProps {
  platforms: ContentPlatform[] | undefined;
}

export const PlatformsCard: React.FC<PlatformsCardProps> = ({ platforms }) => {
  if (!platforms?.length) return null;

  // Helper function to get platform color
  const getPlatformColor = (platformName: string): string => {
    const colors: Record<string, string> = {
      youtube: 'bg-red-500',
      tiktok: 'bg-black',
      instagram: 'bg-gradient-to-r from-purple-500 to-pink-500',
      linkedin: 'bg-blue-600',
      twitter: 'bg-blue-400',
      facebook: 'bg-blue-700',
      pinterest: 'bg-red-600',
      snapchat: 'bg-yellow-400',
      default: 'bg-gray-500',
    };

    return colors[platformName.toLowerCase()] || colors.default;
  };

  // Helper function to get platform icon
  const getPlatformIcon = (platformName: string): string => {
    const icons: Record<string, string> = {
      youtube: 'YT',
      tiktok: 'TT',
      instagram: 'IG',
      linkedin: 'LI',
      twitter: 'TW',
      facebook: 'FB',
      pinterest: 'PI',
      snapchat: 'SC',
      default: 'PL',
    };

    return (
      icons[platformName.toLowerCase()] || platformName.charAt(0).toUpperCase()
    );
  };

  return (
    <div className='bg-theme-card rounded-xl shadow-sm border border-theme-tertiary p-4 backdrop-blur-sm'>
      <h3 className='font-bold text-theme-primary mb-3 text-sm'>
        Publishing Platforms
      </h3>
      <div className='space-y-2'>
        {platforms.map((platform: ContentPlatform, index: number) => (
          <div
            key={platform.id || index}
            className='flex items-center gap-3 p-2.5 bg-theme-secondary/10 hover:bg-theme-secondary/20 rounded-lg transition-colors backdrop-blur-sm'
          >
            <div
              className={`w-8 h-8 ${getPlatformColor(
                platform.name
              )} rounded-lg flex items-center justify-center text-white font-bold text-xs flex-shrink-0`}
            >
              {getPlatformIcon(platform.name)}
            </div>
            <div className='flex-1 min-w-0'>
              <div className='font-medium text-theme-primary text-sm truncate'>
                {platform.name}
              </div>
            </div>
            <ExternalLink className='w-4 h-4 text-theme-secondary flex-shrink-0' />
          </div>
        ))}
      </div>
    </div>
  );
};
