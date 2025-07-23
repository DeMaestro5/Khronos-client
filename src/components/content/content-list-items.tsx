'use client';

import React from 'react';
import { Calendar, Tag, Eye } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Content, ContentStatus, ContentType } from '@/src/types/content';
import { Card, CardContent } from '@/src/components/ui/card';
import {
  getStatusIcon,
  getStatusColor,
  getTypeColor,
  formatDate,
} from './content-helpers';

interface ContentListItemProps {
  content: Content;
}

export const ContentListItem = ({ content }: ContentListItemProps) => (
  <motion.div
    layout
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: 20 }}
    transition={{ duration: 0.2 }}
  >
    <Link href={`/content/${content._id}`}>
      <Card className='mb-4 hover:shadow-md transition-all duration-200 cursor-pointer group'>
        <CardContent className='p-4'>
          <div className='flex items-center justify-between'>
            <div className='flex-1'>
              <div className='flex items-center gap-3 mb-2'>
                {getStatusIcon(content.status as ContentStatus)}
                <h3 className='font-semibold text-lg group-hover:text-blue-600 text-gray-400 transition-colors'>
                  {content.title}
                </h3>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                    content.status as ContentStatus
                  )}`}
                >
                  {content.status.replace('_', ' ').toUpperCase()}
                </span>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(
                    content.type as ContentType
                  )}`}
                >
                  {content.type.replace('_', ' ')}
                </span>
              </div>
              <p className='text-gray-200 text-sm mb-3 line-clamp-2'>
                {content.description}
              </p>
              <div className='flex items-center gap-4 text-xs text-gray-500'>
                <div className='flex items-center gap-1'>
                  <Calendar className='w-3 h-3' />
                  {content.metadata?.publishedDate
                    ? formatDate(content.metadata.publishedDate)
                    : formatDate(content.createdAt)}
                </div>
                <div className='flex items-center gap-1'>
                  <Tag className='w-3 h-3' />
                  {content.tags.length} tags
                </div>
                <span>
                  {(content.platforms || content.platform || []).length}{' '}
                  platforms
                </span>
              </div>
            </div>
            <button className='opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-2 hover:bg-gray-50 rounded'>
              <Eye className='w-4 h-4 text-gray-500' />
            </button>
          </div>
        </CardContent>
      </Card>
    </Link>
  </motion.div>
);

export default ContentListItem;
