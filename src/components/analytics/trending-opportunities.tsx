'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Target, Clock } from 'lucide-react';
import { TrendingOpportunity } from '@/src/types/analytics';

interface TrendingOpportunitiesProps {
  opportunities: TrendingOpportunity[];
  isLoading?: boolean;
  maxItems?: number;
}

export default function TrendingOpportunities({
  opportunities,
  isLoading = false,
  maxItems = 3,
}: TrendingOpportunitiesProps) {
  if (isLoading) {
    return (
      <div className='bg-white/95 dark:bg-slate-800/90 backdrop-blur-lg border border-white/20 dark:border-slate-700/60 rounded-xl p-4 shadow-sm h-fit'>
        <div className='animate-pulse'>
          <div className='h-5 bg-slate-200 dark:bg-slate-700 rounded w-32 mb-4'></div>
          <div className='space-y-3'>
            {[1, 2, 3].map((i) => (
              <div key={i} className='space-y-2'>
                <div className='h-3 bg-slate-200 dark:bg-slate-700 rounded w-full'></div>
                <div className='h-2 bg-slate-200 dark:bg-slate-700 rounded w-3/4'></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!opportunities.length) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className='bg-white/95 dark:bg-slate-800/90 backdrop-blur-lg border border-white/20 dark:border-slate-700/60 rounded-xl p-4 shadow-sm h-fit'
      >
        <h3 className='text-lg font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2'>
          <div className='p-1.5 bg-gradient-to-r from-emerald-500 to-green-500 rounded-lg'>
            <TrendingUp className='h-4 w-4 text-white' />
          </div>
          <span className='text-sm'>Trending Opportunities</span>
        </h3>

        <div className='text-center py-4'>
          <div className='mx-auto h-10 w-10 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center mb-3'>
            <Target className='h-5 w-5 text-emerald-600 dark:text-emerald-400' />
          </div>
          <h4 className='text-sm font-medium text-slate-900 dark:text-slate-100 mb-1'>
            No Opportunities Yet
          </h4>
          <p className='text-xs text-slate-600 dark:text-slate-400'>
            Create more content to discover trending opportunities!
          </p>
        </div>
      </motion.div>
    );
  }

  const displayOpportunities = opportunities.slice(0, maxItems);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className='bg-white/95 dark:bg-slate-800/90 backdrop-blur-lg border border-white/20 dark:border-slate-700/60 rounded-xl p-4 shadow-sm h-fit'
    >
      <h3 className='text-lg font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2'>
        <div className='p-1.5 bg-gradient-to-r from-emerald-500 to-green-500 rounded-lg'>
          <TrendingUp className='h-4 w-4 text-white' />
        </div>
        <span className='text-sm'>Trending Opportunities</span>
        {opportunities.length > maxItems && (
          <span className='ml-auto text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded-full'>
            +{opportunities.length - maxItems}
          </span>
        )}
      </h3>

      <div className='space-y-3'>
        {displayOpportunities.map((opportunity, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 + index * 0.1 }}
            className='bg-white/60 dark:bg-slate-700/60 border border-white/40 dark:border-slate-600/40 rounded-lg p-3 hover:bg-white/80 dark:hover:bg-slate-600/70 transition-all duration-200 backdrop-blur-sm'
          >
            <div className='flex items-start justify-between mb-2'>
              <div className='flex-1 min-w-0 pr-2'>
                <h4 className='font-medium text-slate-900 dark:text-slate-100 text-xs line-clamp-1'>
                  {opportunity.trend.topic}
                </h4>
                <div className='flex items-center gap-1 mt-1 text-xs text-slate-600 dark:text-slate-400'>
                  <Clock className='h-3 w-3' />
                  <span className='text-xs'>
                    {opportunity.opportunity.timeWindow}
                  </span>
                </div>
              </div>
              <div className='flex flex-col items-end gap-1'>
                <span
                  className={`px-1.5 py-0.5 rounded text-xs font-medium ${
                    opportunity.opportunity.difficulty === 'easy'
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                      : opportunity.opportunity.difficulty === 'medium'
                      ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300'
                      : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                  }`}
                >
                  {opportunity.opportunity.difficulty}
                </span>
                <span className='text-xs font-bold text-slate-900 dark:text-slate-100'>
                  {opportunity.opportunity.score}%
                </span>
              </div>
            </div>

            {/* Ultra Compact Progress Bar */}
            <div className='w-full bg-slate-200 dark:bg-slate-600 rounded-full h-1'>
              <div
                className={`h-1 rounded-full transition-all duration-300 ${
                  opportunity.opportunity.score >= 80
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                    : opportunity.opportunity.score >= 60
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-500'
                    : opportunity.opportunity.score >= 40
                    ? 'bg-gradient-to-r from-yellow-500 to-orange-500'
                    : 'bg-gradient-to-r from-red-500 to-pink-500'
                }`}
                style={{
                  width: `${Math.min(opportunity.opportunity.score, 100)}%`,
                }}
              ></div>
            </div>
          </motion.div>
        ))}
      </div>

      {opportunities.length > maxItems && (
        <div className='mt-3 text-center'>
          <button className='text-xs text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 dark:hover:text-emerald-300 font-medium transition-colors'>
            View all {opportunities.length} opportunities →
          </button>
        </div>
      )}
    </motion.div>
  );
}
