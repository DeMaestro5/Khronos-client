'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, ArrowUp, ArrowDown } from 'lucide-react';
import { PlatformMetrics } from '@/src/types/analytics';

interface PlatformPerformanceProps {
  platformMetrics: PlatformMetrics[];
}

export default function PlatformPerformance({
  platformMetrics,
}: PlatformPerformanceProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2 }}
      className='bg-white/60 backdrop-blur-lg border border-white/20 rounded-2xl p-6 shadow-lg'
    >
      <div className='flex items-center justify-between mb-6'>
        <div>
          <h3 className='text-xl font-bold text-slate-900'>
            Platform Performance
          </h3>
          <p className='text-slate-600 text-sm'>Engagement across platforms</p>
        </div>
        <div className='p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg'>
          <BarChart3 className='h-5 w-5 text-white' />
        </div>
      </div>

      <div className='space-y-4'>
        {platformMetrics.map((platform, index) => (
          <motion.div
            key={platform.platform}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
            className='group'
          >
            <div className='flex items-center justify-between mb-2'>
              <div className='flex items-center gap-3'>
                <div
                  className={`w-3 h-3 rounded-full bg-gradient-to-r ${platform.color}`}
                />
                <span className='font-medium text-slate-900'>
                  {platform.platform}
                </span>
              </div>
              <div className='flex items-center gap-4 text-sm'>
                <span className='text-slate-600'>
                  {platform.views.toLocaleString()} views
                </span>
                <span
                  className={`flex items-center gap-1 ${
                    platform.growth > 0 ? 'text-emerald-600' : 'text-red-600'
                  }`}
                >
                  {platform.growth > 0 ? (
                    <ArrowUp className='h-3 w-3' />
                  ) : (
                    <ArrowDown className='h-3 w-3' />
                  )}
                  {platform.growth}%
                </span>
              </div>
            </div>
            <div className='w-full bg-slate-200 rounded-full h-2 overflow-hidden'>
              <motion.div
                className={`h-full bg-gradient-to-r ${platform.color} rounded-full`}
                initial={{ width: '0%' }}
                animate={{
                  width: `${Math.min(
                    (platform.engagement / 6000) * 100,
                    100
                  )}%`,
                }}
                transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
