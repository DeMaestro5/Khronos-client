'use client';

import React from 'react';
import { Calendar, MoreHorizontal } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Content } from '@/src/types/content';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/src/components/ui/card';
import {
  getStatusIcon,
  getStatusColor,
  getTypeColor,
  formatDate,
} from './content-helpers';

interface ContentCardProps {
  content: Content;
}

export const ContentCard = ({ content }: ContentCardProps) => (
  <motion.div
    layout
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    whileHover={{ y: -4 }}
    transition={{ duration: 0.2 }}
  >
    <Card className='h-full hover:shadow-lg transition-all duration-200 cursor-pointer group'>
      <Link href={`/content/${content.id}`}>
        <CardHeader className='pb-3'>
          <div className='flex items-start justify-between'>
            <div className='flex items-center gap-2 mb-2'>
              {getStatusIcon(content.status)}
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                  content.status
                )}`}
              >
                {content.status.replace('_', ' ').toUpperCase()}
              </span>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(
                  content.type
                )}`}
              >
                {content.type.replace('_', ' ')}
              </span>
            </div>
            <button className='opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1 hover:bg-gray-100 rounded'>
              <MoreHorizontal className='w-4 h-4 text-gray-500' />
            </button>
          </div>
          <CardTitle className='text-lg font-semibold line-clamp-2 group-hover:text-blue-600 text-gray-900 transition-colors'>
            {content.title}
          </CardTitle>
        </CardHeader>
        <CardContent className='pt-0'>
          <p className='text-sm text-gray-600 line-clamp-3 mb-4'>
            {content.description}
          </p>

          {/* Tags */}
          <div className='flex flex-wrap gap-1 mb-4'>
            {content.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className='px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md'
              >
                {tag}
              </span>
            ))}
            {content.tags.length > 3 && (
              <span className='px-2 py-1 bg-gray-50 text-gray-500 text-xs rounded-md'>
                +{content.tags.length - 3} more
              </span>
            )}
          </div>

          {/* Platforms */}
          <div className='flex items-center gap-2 mb-4'>
            <span className='text-xs text-gray-500'>Platforms:</span>
            <div className='flex gap-1'>
              {content.platforms.slice(0, 3).map((platform, index) => (
                <div
                  key={index}
                  className='w-6 h-6 bg-gray-100 rounded flex items-center justify-center'
                  title={platform.name}
                >
                  <span className='text-[10px] font-medium text-gray-600'>
                    {platform.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              ))}
              {content.platforms.length > 3 && (
                <div className='w-6 h-6 bg-gray-50 rounded flex items-center justify-center'>
                  <span className='text-[10px] text-gray-500'>
                    +{content.platforms.length - 3}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className='flex items-center justify-between pt-2 border-t'>
            <div className='flex items-center gap-2'>
              {content.author.avatar && (
                <Image
                  src={content.author.avatar}
                  alt={content.author.name}
                  className='w-6 h-6 rounded-full'
                  width={24}
                  height={24}
                />
              )}
              <span className='text-xs text-gray-500'>
                {content.author.name}
              </span>
            </div>
            <div className='flex items-center gap-2 text-xs text-gray-500'>
              <Calendar className='w-3 h-3' />
              {content.publishedDate
                ? formatDate(content.publishedDate)
                : formatDate(content.createdAt)}
            </div>
          </div>
        </CardContent>
      </Link>
    </Card>
  </motion.div>
);

export default ContentCard;
