'use client';

import React from 'react';
import { Calendar, Tag, Users, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Content, ContentStatus } from '@/src/types/content';
import { Card, CardContent } from '@/src/components/ui/card';
import { getStatusColor, formatDate } from './content-helpers';

interface ContentListItemProps {
  content: Content;
}

const getTypeIcon = (contentType: string) => {
  switch (contentType) {
    case 'blog_post':
      return '📝';
    case 'social':
      return '📱';
    case 'video':
      return '🎥';
    case 'podcast':
      return '🎧';
    case 'newsletter':
      return '📧';
    case 'article':
      return '📄';
    default:
      return '📋';
  }
};

const getTypeName = (contentType: string) => {
  switch (contentType) {
    case 'blog_post':
      return 'Blog';
    case 'social':
      return 'Social';
    case 'video':
      return 'Video';
    case 'podcast':
      return 'Podcast';
    case 'newsletter':
      return 'Newsletter';
    case 'article':
      return 'Article';
    default:
      return 'Other';
  }
};

export const ContentListItem = ({ content }: ContentListItemProps) => {
  const safeContent = {
    title: content.title || 'Untitled Content',
    description: content.description || 'No description available',
    tags: content.tags || [],
    platforms: content.platforms || content.platform || [],
    status: content.status || 'draft',
    type: content.type || 'article',
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, ease: [0.4, 0.0, 0.2, 1] }}
    >
      <Link href={`/content/${content._id}`}>
        <Card className='group hover:shadow-lg transition-all duration-300 cursor-pointer bg-theme-card border border-theme-primary hover:border-accent-primary/30 hover:scale-[1.02] active:scale-[0.98]'>
          <CardContent className='p-4 sm:p-6'>
            {/* Header Section */}
            <div className='flex items-start justify-between mb-4'>
              {/* Left side - Type icon and title */}
              <div className='flex items-start gap-3 flex-1 min-w-0'>
                {/* Type Icon */}
                <div className='flex-shrink-0 w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg'>
                  <span className='text-lg'>
                    {getTypeIcon(safeContent.type)}
                  </span>
                </div>

                {/* Title and Type */}
                <div className='flex-1 min-w-0'>
                  <h3 className='font-bold text-lg text-theme-primary group-hover:text-accent-primary transition-colors duration-200 line-clamp-2 leading-tight mb-1'>
                    {safeContent.title}
                  </h3>
                  <div className='flex items-center gap-2 mb-2'>
                    <span className='text-sm text-theme-secondary font-medium'>
                      {getTypeName(safeContent.type)}
                    </span>
                    <span className='w-1 h-1 bg-theme-secondary rounded-full'></span>
                    <span className='text-sm text-theme-secondary'>
                      {safeContent.platforms.length} platforms
                    </span>
                  </div>
                </div>
              </div>

              {/* Right side - Status and action */}
              <div className='flex items-start gap-2 flex-shrink-0'>
                {/* Status Badge */}
                <div className='flex flex-col items-end gap-2'>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                      safeContent.status as ContentStatus
                    )}`}
                  >
                    {safeContent.status.replace('_', ' ').toUpperCase()}
                  </span>

                  {/* Action Button */}
                  <button className='opacity-0 group-hover:opacity-100 transition-all duration-200 p-2 bg-accent-primary/10 hover:bg-accent-primary/20 rounded-lg text-accent-primary hover:scale-110'>
                    <ArrowRight className='w-4 h-4' />
                  </button>
                </div>
              </div>
            </div>

            {/* Description */}
            <p className='text-theme-secondary text-sm leading-relaxed mb-4 line-clamp-2'>
              {safeContent.description}
            </p>

            {/* Metadata Row */}
            <div className='flex items-center justify-between'>
              {/* Left side - Date and tags */}
              <div className='flex items-center gap-4 text-xs text-theme-secondary'>
                <div className='flex items-center gap-1.5'>
                  <Calendar className='w-3.5 h-3.5' />
                  <span className='font-medium'>
                    {content.metadata?.publishedDate
                      ? formatDate(content.metadata.publishedDate)
                      : formatDate(content.createdAt)}
                  </span>
                </div>
                <div className='flex items-center gap-1.5'>
                  <Tag className='w-3.5 h-3.5' />
                  <span className='font-medium'>
                    {safeContent.tags.length} tags
                  </span>
                </div>
              </div>

              {/* Right side - Platform count */}
              <div className='flex items-center gap-1.5 text-xs text-theme-secondary'>
                <Users className='w-3.5 h-3.5' />
                <span className='font-medium'>
                  {safeContent.platforms.length} platforms
                </span>
              </div>
            </div>

            {/* Tags Preview */}
            {safeContent.tags.length > 0 && (
              <div className='flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-theme-primary/20'>
                {safeContent.tags.slice(0, 3).map((tag, index) => (
                  <span
                    key={index}
                    className='px-2 py-1 bg-accent-primary/10 text-accent-primary text-xs rounded-md font-medium'
                  >
                    {tag}
                  </span>
                ))}
                {safeContent.tags.length > 3 && (
                  <span className='px-2 py-1 bg-theme-secondary/20 text-theme-secondary text-xs rounded-md font-medium'>
                    +{safeContent.tags.length - 3} more
                  </span>
                )}
              </div>
            )}

            {/* Progress indicator for scheduled content */}
            {safeContent.status === 'scheduled' && (
              <div className='mt-3 pt-3 border-t border-theme-primary/20'>
                <div className='flex items-center justify-between text-xs text-theme-secondary mb-1'>
                  <span>Scheduled to publish</span>
                  <span className='text-emerald-500 font-medium'>Ready</span>
                </div>
                <div className='w-full bg-theme-secondary/20 rounded-full h-1.5'>
                  <div className='bg-gradient-to-r from-emerald-500 to-emerald-400 h-1.5 rounded-full w-full'></div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
};

export default ContentListItem;
