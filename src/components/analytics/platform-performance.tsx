'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3 } from 'lucide-react';
import { PlatformPerformance as PlatformPerformanceType } from '@/src/types/analytics';

interface PlatformPerformanceProps {
  platforms: PlatformPerformanceType[];
  isLoading?: boolean;
}

export default function PlatformPerformance({
  platforms,
  isLoading = false,
}: PlatformPerformanceProps) {
  if (isLoading) {
    return (
      <div className='bg-white/60 dark:bg-slate-800/60 backdrop-blur-lg border border-white/20 dark:border-slate-600/20 rounded-2xl p-6 shadow-lg'>
        <div className='animate-pulse'>
          <div className='h-6 bg-slate-200 dark:bg-slate-700 rounded w-48 mb-6'></div>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className='bg-white/40 dark:bg-slate-700/40 border border-white/30 dark:border-slate-600/30 rounded-xl p-4'
              >
                <div className='h-4 bg-slate-200 dark:bg-slate-600 rounded w-24 mb-3'></div>
                <div className='space-y-2'>
                  <div className='h-3 bg-slate-200 dark:bg-slate-600 rounded'></div>
                  <div className='h-3 bg-slate-200 dark:bg-slate-600 rounded'></div>
                  <div className='h-3 bg-slate-200 dark:bg-slate-600 rounded'></div>
                  <div className='h-3 bg-slate-200 dark:bg-slate-600 rounded'></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!platforms.length) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className='bg-white/60 dark:bg-slate-800/60 backdrop-blur-lg border border-white/20 dark:border-slate-600/20 rounded-2xl p-6 shadow-lg'
    >
      <h3 className='text-xl font-bold text-slate-900 dark:text-slate-100 mb-6 flex items-center gap-2'>
        <div className='p-2 bg-gradient-to-r from-purple-500 to-pink-500 dark:from-blue-600 dark:to-indigo-700 rounded-lg'>
          <BarChart3 className='h-5 w-5 text-white' />
        </div>
        Platform Performance
      </h3>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        {platforms.map((platform, index) => (
          <motion.div
            key={platform.platform}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 + index * 0.1 }}
            className='bg-white/40 dark:bg-slate-700/40 border border-white/30 dark:border-slate-600/30 rounded-xl p-4 hover:bg-white/60 dark:hover:bg-slate-700/60 transition-all duration-200'
          >
            <div className='flex items-center justify-between mb-3'>
              <h4 className='font-semibold text-slate-900 dark:text-slate-100 capitalize'>
                {platform.platform}
              </h4>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  platform.status === 'excellent'
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                    : platform.status === 'good'
                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                    : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
                }`}
              >
                {platform.status}
              </span>
            </div>

            <div className='space-y-2 text-sm'>
              <div className='flex justify-between'>
                <span className='text-slate-600 dark:text-slate-400'>
                  Content:
                </span>
                <span className='font-medium text-slate-900 dark:text-slate-100'>
                  {platform.metrics.content}
                </span>
              </div>
              <div className='flex justify-between'>
                <span className='text-slate-600 dark:text-slate-400'>
                  Engagement:
                </span>
                <span className='font-medium text-slate-900 dark:text-slate-100'>
                  {platform.metrics.engagement.toLocaleString()}
                </span>
              </div>
              <div className='flex justify-between'>
                <span className='text-slate-600 dark:text-slate-400'>
                  Reach:
                </span>
                <span className='font-medium text-slate-900 dark:text-slate-100'>
                  {platform.metrics.reach.toLocaleString()}
                </span>
              </div>
              <div className='flex justify-between'>
                <span className='text-slate-600 dark:text-slate-400'>
                  Rate:
                </span>
                <span className='font-medium text-slate-900 dark:text-slate-100'>
                  {platform.metrics.engagementRate.toFixed(1)}%
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
