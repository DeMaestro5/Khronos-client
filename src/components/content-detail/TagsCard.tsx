import React from 'react';
import { Tag } from 'lucide-react';

interface TagsCardProps {
  tags: string[];
}

export const TagsCard: React.FC<TagsCardProps> = ({ tags }) => {
  if (!tags.length) return null;

  return (
    <div className='bg-theme-card rounded-2xl shadow-sm border border-theme-tertiary p-4 md:p-6 backdrop-blur-sm'>
      <h3 className='font-bold text-theme-primary mb-4 flex items-center gap-2 text-sm md:text-base'>
        <Tag className='w-4 h-4 md:w-5 md:h-5 text-accent-primary' />
        Tags
      </h3>
      <div className='flex flex-wrap gap-2'>
        {tags.map((tag: string, index: number) => (
          <span
            key={index}
            className='px-2 py-1.5 md:px-3 md:py-2 bg-accent-primary/10 text-accent-primary rounded-lg text-xs md:text-sm font-medium border border-accent-primary/20 hover:bg-accent-primary/20 transition-all duration-200 backdrop-blur-sm break-words'
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
};
