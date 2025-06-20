import React from 'react';
import { Tag } from 'lucide-react';

interface TagsCardProps {
  tags: string[];
}

export const TagsCard: React.FC<TagsCardProps> = ({ tags }) => {
  if (!tags.length) return null;

  return (
    <div className='bg-white/95 dark:bg-slate-800/90 rounded-2xl shadow-sm border border-white/20 dark:border-slate-700/60 p-6 backdrop-blur-sm'>
      <h3 className='font-bold text-gray-900 dark:text-slate-100 mb-4 flex items-center gap-2'>
        <Tag className='w-5 h-5 text-purple-600 dark:text-purple-400' />
        Tags
      </h3>
      <div className='flex flex-wrap gap-2'>
        {tags.map((tag: string, index: number) => (
          <span
            key={index}
            className='px-3 py-2 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 text-blue-800 dark:text-blue-200 rounded-lg text-sm font-medium border border-blue-100 dark:border-blue-800/30 hover:from-blue-100 hover:to-purple-100 dark:hover:from-blue-800/30 dark:hover:to-purple-800/30 transition-all duration-200 backdrop-blur-sm'
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
};
