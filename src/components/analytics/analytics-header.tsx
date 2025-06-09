'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Download, RefreshCw } from 'lucide-react';

interface AnalyticsHeaderProps {
  timeFilter: '7d' | '30d' | '90d' | '1y';
  setTimeFilter: (filter: '7d' | '30d' | '90d' | '1y') => void;
  onRefresh: () => void;
  refreshing: boolean;
}

export default function AnalyticsHeader({
  timeFilter,
  setTimeFilter,
  onRefresh,
  refreshing,
}: AnalyticsHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4'
    >
      <div>
        <h1 className='text-3xl lg:text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent'>
          Analytics Dashboard
        </h1>
        <p className='text-slate-600 mt-2'>
          Track your content performance and audience engagement
        </p>
      </div>

      <div className='flex items-center gap-3'>
        {/* Time Filter */}
        <div className='flex items-center bg-white/60 backdrop-blur-lg border border-white/20 rounded-xl p-1 shadow-lg'>
          {(['7d', '30d', '90d', '1y'] as const).map((period) => (
            <button
              key={period}
              onClick={() => setTimeFilter(period)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                timeFilter === period
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              {period === '7d'
                ? '7 Days'
                : period === '30d'
                ? '30 Days'
                : period === '90d'
                ? '90 Days'
                : '1 Year'}
            </button>
          ))}
        </div>

        {/* Action Buttons */}
        <div className='flex items-center gap-2'>
          <button
            onClick={onRefresh}
            disabled={refreshing}
            className='p-3 bg-white/60 backdrop-blur-lg border border-white/20 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-white/80 transition-all duration-200 shadow-lg disabled:opacity-50'
          >
            <RefreshCw
              className={`h-5 w-5 ${refreshing ? 'animate-spin' : ''}`}
            />
          </button>
          <button className='p-3 bg-white/60 backdrop-blur-lg border border-white/20 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-white/80 transition-all duration-200 shadow-lg'>
            <Download className='h-5 w-5' />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
