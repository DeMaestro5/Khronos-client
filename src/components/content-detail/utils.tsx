import React from 'react';
import {
  Play,
  Mic,
  Mail,
  Hash,
  FileText,
  CheckCircle,
  Clock,
  Edit,
  Archive,
  AlertCircle,
} from 'lucide-react';

export const getContentTypeIcon = (type: string): React.JSX.Element => {
  switch (type) {
    case 'video':
      return <Play className='w-5 h-5' />;
    case 'podcast':
      return <Mic className='w-5 h-5' />;
    case 'newsletter':
      return <Mail className='w-5 h-5' />;
    case 'social':
      return <Hash className='w-5 h-5' />;
    case 'article':
    case 'blog_post':
    default:
      return <FileText className='w-5 h-5' />;
  }
};

export const getContentTypeGradient = (type: string): string => {
  switch (type) {
    case 'video':
      return 'from-red-600 via-pink-600 to-purple-600';
    case 'podcast':
      return 'from-green-600 via-teal-600 to-blue-600';
    case 'newsletter':
      return 'from-orange-600 via-red-600 to-pink-600';
    case 'social':
      return 'from-purple-600 via-pink-600 to-indigo-600';
    case 'article':
    case 'blog_post':
    default:
      return 'from-blue-600 via-purple-600 to-indigo-600';
  }
};

export const getStatusIcon = (status: string): React.JSX.Element => {
  switch (status.toLowerCase()) {
    case 'published':
      return <CheckCircle className='w-5 h-5 text-emerald-500' />;
    case 'scheduled':
      return <Clock className='w-5 h-5 text-blue-500' />;
    case 'draft':
      return <Edit className='w-5 h-5 text-amber-500' />;
    case 'archived':
      return <Archive className='w-5 h-5 text-gray-500' />;
    default:
      return <AlertCircle className='w-5 h-5 text-gray-400' />;
  }
};

export const getStatusStyle = (status: string): string => {
  switch (status.toLowerCase()) {
    case 'published':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    case 'scheduled':
      return 'bg-blue-50 text-blue-700 border-blue-200';
    case 'draft':
      return 'bg-gray-500 text-amber-300 border-gray-600';
    case 'archived':
      return 'bg-gray-50 text-gray-700 border-gray-200';
    default:
      return 'bg-gray-50 text-gray-700 border-gray-200';
  }
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};
