import React from 'react';
import { Clock, Calendar, Eye } from 'lucide-react';
import { ContentData } from '@/src/types/content';
import { formatDate } from './utils';

interface TimelineProps {
  content: ContentData;
}

export const Timeline: React.FC<TimelineProps> = ({ content }) => {
  return (
    <div className='bg-theme-card rounded-xl shadow-sm border border-theme-tertiary p-4 backdrop-blur-sm'>
      <h3 className='font-bold text-theme-primary mb-3 flex items-center gap-2 text-sm'>
        <Clock className='w-4 h-4 text-accent-primary' />
        Timeline
      </h3>
      <div className='space-y-2'>
        <div className='flex items-start gap-3'>
          <Calendar className='w-4 h-4 text-theme-secondary mt-0.5 flex-shrink-0' />
          <div className='min-w-0 flex-1'>
            <div className='text-xs font-medium text-theme-primary'>
              Created
            </div>
            <div className='text-xs text-theme-secondary'>
              {formatDate(content.createdAt)}
            </div>
          </div>
        </div>
        {content.metadata.publishedDate && (
          <div className='flex items-start gap-3'>
            <Eye className='w-4 h-4 text-accent-primary mt-0.5 flex-shrink-0' />
            <div className='min-w-0 flex-1'>
              <div className='text-xs font-medium text-theme-primary'>
                Published
              </div>
              <div className='text-xs text-theme-secondary'>
                {formatDate(content.metadata.publishedDate)}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
