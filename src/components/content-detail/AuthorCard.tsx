import React from 'react';
import { User } from 'lucide-react';
import Image from 'next/image';
import { ContentAuthor } from '@/src/types/content';

interface AuthorCardProps {
  author: ContentAuthor | undefined;
}

export const AuthorCard: React.FC<AuthorCardProps> = ({ author }) => {
  if (!author) return null;

  return (
    <div className='bg-theme-card/95 rounded-2xl shadow-sm border border-theme-tertiary p-4 md:p-6 backdrop-blur-sm'>
      <h3 className='font-bold text-theme-primary mb-4 flex items-center gap-2 text-sm md:text-base'>
        <User className='w-4 h-4 md:w-5 md:h-5 text-accent-primary' />
        Author
      </h3>
      <div className='flex items-center gap-3 md:gap-4'>
        <Image
          src={author.avatar || '/default-avatar.png'}
          alt={author.name}
          className='w-12 h-12 md:w-14 md:h-14 rounded-full object-cover ring-2 ring-blue-100 dark:ring-blue-800/50 flex-shrink-0'
          width={56}
          height={56}
        />
        <div className='min-w-0 flex-1'>
          <div className='font-semibold text-theme-primary text-sm md:text-base truncate'>
            {author.name}
          </div>
          <div className='text-xs md:text-sm text-theme-secondary truncate'>
            {author.role}
          </div>
        </div>
      </div>
    </div>
  );
};
