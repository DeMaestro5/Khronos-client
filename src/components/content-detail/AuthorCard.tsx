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
    <div className='bg-theme-card/95 rounded-2xl shadow-sm border border-theme-tertiary p-6 md:p-8 backdrop-blur-sm'>
      <h3 className='font-bold text-theme-primary mb-6 flex items-center gap-3 text-base md:text-lg'>
        <User className='w-5 h-5 md:w-6 md:h-6 text-accent-primary' />
        Author
      </h3>
      <div className='flex items-center gap-4 md:gap-5'>
        <Image
          src={author.avatar || '/default-avatar.png'}
          alt={author.name}
          className='w-16 h-16 md:w-18 md:h-18 rounded-full object-cover ring-2 ring-blue-100 dark:ring-blue-800/50 flex-shrink-0'
          width={72}
          height={72}
        />
        <div className='min-w-0 flex-1'>
          <div className='font-semibold text-theme-primary text-base md:text-lg truncate'>
            {author.name}
          </div>
          <div className='text-sm md:text-base text-theme-secondary truncate'>
            {author.role}
          </div>
        </div>
      </div>
    </div>
  );
};
