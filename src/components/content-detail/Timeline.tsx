import React from 'react';
import { Clock, Calendar, Eye } from 'lucide-react';
import { ContentData } from '@/src/types/content';
import { formatDate } from './utils';

interface TimelineProps {
  content: ContentData;
}

export const Timeline: React.FC<TimelineProps> = ({ content }) => {
  return (
    <div className='bg-white rounded-2xl shadow-sm border border-white/20 p-6'>
      <h3 className='font-bold text-gray-900 mb-4 flex items-center gap-2'>
        <Clock className='w-5 h-5 text-green-600' />
        Timeline
      </h3>
      <div className='space-y-4'>
        <div className='flex items-start gap-3'>
          <Calendar className='w-4 h-4 text-gray-400 mt-1 flex-shrink-0' />
          <div>
            <div className='text-sm font-medium text-gray-900'>Created</div>
            <div className='text-sm text-gray-600'>
              {formatDate(content.createdAt)}
            </div>
          </div>
        </div>
        {content.metadata.publishedDate && (
          <div className='flex items-start gap-3'>
            <Eye className='w-4 h-4 text-green-500 mt-1 flex-shrink-0' />
            <div>
              <div className='text-sm font-medium text-gray-900'>Published</div>
              <div className='text-sm text-gray-600'>
                {formatDate(content.metadata.publishedDate)}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
