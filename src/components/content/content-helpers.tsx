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
      return <Archive className='w-4 h-4 text-gray-500' />;
    default:
      return <AlertCircle className='w-4 h-4 text-gray-400' />;
  }
};

export const getStatusColor = (status: ContentStatus) => {
  switch (status) {
    case ContentStatus.PUBLISHED:
      return 'bg-green-100 text-green-800 border-green-200';
    case ContentStatus.SCHEDULED:
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case ContentStatus.DRAFT:
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case ContentStatus.ARCHIVED:
      return 'bg-gray-100 text-gray-800 border-gray-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

export const getTypeColor = (type: ContentType) => {
  switch (type) {
    case ContentType.BLOG_POST:
      return 'bg-purple-100 text-purple-800';
    case ContentType.SOCIAL_POST:
      return 'bg-pink-100 text-pink-800';
    case ContentType.EMAIL:
      return 'bg-indigo-100 text-indigo-800';
    case ContentType.VIDEO:
      return 'bg-red-100 text-red-800';
    case ContentType.PODCAST:
      return 'bg-orange-100 text-orange-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};
