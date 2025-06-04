import React from 'react';
import { Tag } from 'lucide-react';

interface TagsCardProps {
  tags: string[];
}

export const TagsCard: React.FC<TagsCardProps> = ({ tags }) => {
  if (!tags.length) return null;

  return (
    <div className='bg-white rounded-2xl shadow-sm border border-white/20 p-6'>
      <h3 className='font-bold text-gray-900 mb-4 flex items-center gap-2'>
        <Tag className='w-5 h-5 text-purple-600' />
        Tags
      </h3>
      <div className='flex flex-wrap gap-2'>
        {tags.map((tag: string, index: number) => (
          <span
            key={index}
            className='px-3 py-2 bg-gradient-to-r from-blue-50 to-purple-50 text-blue-800 rounded-lg text-sm font-medium border border-blue-100 hover:from-blue-100 hover:to-purple-100 transition-all duration-200'
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
};
