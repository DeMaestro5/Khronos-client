import React from 'react';
import { Eye, TrendingUp, Share2 } from 'lucide-react';
import { ContentStats } from '@/src/types/content';

interface StatsBarProps {
  stats: ContentStats | undefined;
}

export const StatsBar: React.FC<StatsBarProps> = ({ stats }) => {
  if (!stats) return null;

  return (
    <div className='bg-white/50 backdrop-blur-sm border-t border-white/20 px-8 py-6'>
      <div className='grid grid-cols-1 sm:grid-cols-3 gap-6'>
        <div className='flex items-center gap-3'>
          <div className='p-2 bg-blue-100 rounded-lg'>
            <Eye className='w-5 h-5 text-blue-600' />
          </div>
          <div>
            <div className='text-2xl font-bold text-gray-900'>
              {stats.views.toLocaleString()}
            </div>
            <div className='text-sm text-gray-600'>Views</div>
          </div>
        </div>
        <div className='flex items-center gap-3'>
          <div className='p-2 bg-green-100 rounded-lg'>
            <TrendingUp className='w-5 h-5 text-green-600' />
          </div>
          <div>
            <div className='text-2xl font-bold text-gray-900'>
              {stats.engagement}%
            </div>
            <div className='text-sm text-gray-600'>Engagement</div>
          </div>
        </div>
        <div className='flex items-center gap-3'>
          <div className='p-2 bg-purple-100 rounded-lg'>
            <Share2 className='w-5 h-5 text-purple-600' />
          </div>
          <div>
            <div className='text-2xl font-bold text-gray-900'>
              {stats.shares}
            </div>
            <div className='text-sm text-gray-600'>Shares</div>
          </div>
        </div>
      </div>
    </div>
  );
};
