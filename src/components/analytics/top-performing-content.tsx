'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Share2, Eye, Heart, MessageCircle } from 'lucide-react';
import { Content } from '@/src/types/content';

interface TopPerformingContentProps {
  contents: Content[];
  timeFilter: '7d' | '30d' | '90d' | '1y';
}

export default function TopPerformingContent({
  contents,
  timeFilter,
}: TopPerformingContentProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className='bg-white/60 backdrop-blur-lg border border-white/20 rounded-2xl p-6 shadow-lg'
    >
      <div className='flex items-center justify-between mb-6'>
        <div>
          <h3 className='text-xl font-bold text-slate-900'>
            Top Performing Content
          </h3>
          <p className='text-slate-600 text-sm'>
            Your best content from the last {timeFilter}
          </p>
        </div>
        <button className='flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200'>
          <Share2 className='h-4 w-4' />
          Share Report
        </button>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        {contents.slice(0, 6).map((content, index) => (
          <motion.div
            key={content._id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + index * 0.1 }}
            className='group bg-white/40 border border-white/30 rounded-xl p-4 hover:bg-white/60 transition-all duration-200'
          >
            <div className='flex items-start justify-between mb-3'>
              <div
                className={`px-2 py-1 rounded-lg text-xs font-medium ${
                  content.type === 'video'
                    ? 'bg-red-100 text-red-700'
                    : content.type === 'social'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-green-100 text-green-700'
                }`}
              >
                {content.type}
              </div>
              <div className='flex items-center gap-1 text-xs text-slate-500'>
                <Eye className='h-3 w-3' />
                {Math.floor(Math.random() * 5000 + 1000).toLocaleString()}
              </div>
            </div>

            <h4 className='font-medium text-slate-900 mb-2 line-clamp-2 group-hover:text-purple-600 transition-colors'>
              {content.title}
            </h4>

            <div className='flex items-center justify-between text-xs text-slate-500'>
              <div className='flex items-center gap-3'>
                <div className='flex items-center gap-1'>
                  <Heart className='h-3 w-3' />
                  {Math.floor(Math.random() * 500 + 50)}
                </div>
                <div className='flex items-center gap-1'>
                  <MessageCircle className='h-3 w-3' />
                  {Math.floor(Math.random() * 100 + 10)}
                </div>
              </div>
              <span>{new Date(content.createdAt).toLocaleDateString()}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
