import { CheckCircle, Clock, Edit, Archive, AlertCircle } from 'lucide-react';
import { ContentStatus, ContentType } from '@/src/types/content';

export const getStatusIcon = (status: ContentStatus) => {
  switch (status) {
    case ContentStatus.PUBLISHED:
      return <CheckCircle className='w-4 h-4 text-green-500' />;
    case ContentStatus.SCHEDULED:
      return <Clock className='w-4 h-4 text-blue-500' />;
    case ContentStatus.DRAFT:
      return <Edit className='w-4 h-4 text-yellow-500' />;
    case ContentStatus.ARCHIVED:
      return <Archive className='w-4 h-4 text-theme-secondary' />;
    default:
      return <AlertCircle className='w-4 h-4 text-theme-secondary' />;
  }
};

export const getStatusColor = (status: ContentStatus) => {
  switch (status) {
    case ContentStatus.PUBLISHED:
      return 'bg-green-100 text-green-900 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800';
    case ContentStatus.SCHEDULED:
      return 'bg-blue-100 text-blue-900 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800';
    case ContentStatus.DRAFT:
      return 'bg-gray-500 text-amber-300 border-gray-600 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800';
    case ContentStatus.ARCHIVED:
      return 'bg-theme-secondary/20 text-theme-secondary border-theme-primary/20';
    default:
      return 'bg-theme-secondary/20 text-theme-secondary border-theme-primary/20';
  }
};

export const getTypeColor = (type: ContentType) => {
  switch (type) {
    case ContentType.BLOG_POST:
      return 'bg-purple-100 text-purple-900 dark:bg-purple-900/20 dark:text-purple-400';
    case ContentType.SOCIAL:
      return 'bg-pink-100 text-pink-900 dark:bg-pink-900/20 dark:text-pink-400';
    case ContentType.NEWSLETTER:
      return 'bg-indigo-100 text-indigo-900 dark:bg-indigo-900/20 dark:text-indigo-400';
    case ContentType.VIDEO:
      return 'bg-red-100 text-red-900 dark:bg-red-900/20 dark:text-red-400';
    case ContentType.PODCAST:
      return 'bg-orange-100 text-orange-900 dark:bg-orange-900/20 dark:text-orange-400';
    case ContentType.ARTICLE:
      return 'bg-blue-100 text-blue-900 dark:bg-blue-900/20 dark:text-blue-400';
    default:
      return 'bg-theme-secondary/20 text-theme-secondary';
  }
};

export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};
