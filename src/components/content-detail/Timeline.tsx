import React from 'react';
import { Clock, Calendar, Eye } from 'lucide-react';
import { ContentData } from '@/src/types/content';
import { formatDate } from './utils';

interface TimelineProps {
  content: ContentData;
}

export const Timeline: React.FC<TimelineProps> = ({ content }) => {
  return (
    <div className='bg-theme-card rounded-2xl shadow-sm border border-theme-tertiary p-6 md:p-8 backdrop-blur-sm'>
      <h3 className='font-bold text-theme-primary mb-6 flex items-center gap-3 text-base md:text-lg'>
        <Clock className='w-5 h-5 md:w-6 md:h-6 text-accent-primary' />
        Timeline
      </h3>
      <div className='space-y-4 md:space-y-5'>
        <div className='flex items-start gap-4'>
          <Calendar className='w-5 h-5 text-theme-secondary mt-1 flex-shrink-0' />
          <div className='min-w-0 flex-1'>
            <div className='text-sm md:text-base font-medium text-theme-primary'>
              Created
            </div>
            <div className='text-sm md:text-base text-theme-secondary'>
              {formatDate(content.createdAt)}
            </div>
          </div>
        </div>
        {content.metadata.publishedDate && (
          <div className='flex items-start gap-4'>
            <Eye className='w-5 h-5 text-accent-primary mt-1 flex-shrink-0' />
            <div className='min-w-0 flex-1'>
              <div className='text-sm md:text-base font-medium text-theme-primary'>
                Published
              </div>
              <div className='text-sm md:text-base text-theme-secondary'>
                {formatDate(content.metadata.publishedDate)}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
