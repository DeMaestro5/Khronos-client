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
    <div className='bg-white/95 dark:bg-slate-800/90 rounded-2xl shadow-sm border border-white/20 dark:border-slate-700/60 p-6 backdrop-blur-sm'>
      <h3 className='font-bold text-gray-900 dark:text-slate-100 mb-4 flex items-center gap-2'>
        <User className='w-5 h-5 text-blue-600 dark:text-blue-400' />
        Author
      </h3>
      <div className='flex items-center gap-4'>
        <Image
          src={author.avatar || '/default-avatar.png'}
          alt={author.name}
          className='w-14 h-14 rounded-full object-cover ring-2 ring-blue-100 dark:ring-blue-800/50'
          width={56}
          height={56}
        />
        <div>
          <div className='font-semibold text-gray-900 dark:text-slate-100'>
            {author.name}
          </div>
          <div className='text-sm text-gray-600 dark:text-slate-400'>
            {author.role}
          </div>
        </div>
      </div>
    </div>
  );
};
