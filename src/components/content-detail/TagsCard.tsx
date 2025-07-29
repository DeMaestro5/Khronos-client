import React from 'react';
import { Tag } from 'lucide-react';

interface TagsCardProps {
  tags: string[];
}

export const TagsCard: React.FC<TagsCardProps> = ({ tags }) => {
  if (!tags.length) return null;

  return (
    <div className='bg-theme-card rounded-2xl shadow-sm border border-theme-tertiary p-6 md:p-8 backdrop-blur-sm'>
      <h3 className='font-bold text-theme-primary mb-6 flex items-center gap-3 text-base md:text-lg'>
        <Tag className='w-5 h-5 md:w-6 md:h-6 text-accent-primary' />
        Tags
      </h3>
      <div className='flex flex-wrap gap-3'>
        {tags.map((tag: string, index: number) => (
          <span
            key={index}
            className='px-3 py-2 md:px-4 md:py-2.5 bg-accent-primary/10 text-accent-primary rounded-lg text-sm md:text-base font-medium border border-accent-primary/20 hover:bg-accent-primary/20 transition-all duration-200 backdrop-blur-sm break-words'
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
};
