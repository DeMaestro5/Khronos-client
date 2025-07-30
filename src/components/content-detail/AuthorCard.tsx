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
    <div className='bg-theme-card/95 rounded-xl shadow-sm border border-theme-tertiary p-4 backdrop-blur-sm'>
      <h3 className='font-bold text-theme-primary mb-3 flex items-center gap-2 text-sm'>
        <User className='w-4 h-4 text-accent-primary' />
        Author
      </h3>
      <div className='flex items-center gap-3'>
        <Image
          src={author.avatar || '/default-avatar.png'}
          alt={author.name}
          className='w-10 h-10 rounded-full object-cover ring-2 ring-blue-100 dark:ring-blue-800/50 flex-shrink-0'
          width={40}
          height={40}
        />
        <div className='min-w-0 flex-1'>
          <div className='font-semibold text-theme-primary text-sm truncate'>
            {author.name}
          </div>
          <div className='text-xs text-theme-secondary truncate'>
            {author.role}
          </div>
        </div>
      </div>
    </div>
  );
};
