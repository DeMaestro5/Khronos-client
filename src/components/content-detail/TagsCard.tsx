import React from 'react';
import { Tag } from 'lucide-react';

interface TagsCardProps {
  tags: string[];
}

export const TagsCard: React.FC<TagsCardProps> = ({ tags }) => {
  if (!tags.length) return null;

  return (
    <div className='bg-theme-card rounded-2xl shadow-sm border border-theme-tertiary p-6 backdrop-blur-sm'>
      <h3 className='font-bold text-theme-primary mb-4 flex items-center gap-2'>
        <Tag className='w-5 h-5 text-accent-primary' />
        Tags
      </h3>
      <div className='flex flex-wrap gap-2'>
        {tags.map((tag: string, index: number) => (
          <span
            key={index}
            className='px-3 py-2 bg-accent-primary/10 text-accent-primary rounded-lg text-sm font-medium border border-accent-primary/20 hover:bg-accent-primary/20 transition-all duration-200 backdrop-blur-sm'
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
};
