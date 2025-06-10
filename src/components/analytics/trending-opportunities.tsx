'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';
import { TrendingOpportunity } from '@/src/types/analytics';

interface TrendingOpportunitiesProps {
  opportunities: TrendingOpportunity[];
  isLoading?: boolean;
  maxItems?: number;
}

export default function TrendingOpportunities({
  opportunities,
  isLoading = false,
  maxItems = 6,
}: TrendingOpportunitiesProps) {
  if (isLoading) {
    return (
      <div className='bg-white/60 backdrop-blur-lg border border-white/20 rounded-2xl p-6 shadow-lg'>
        <div className='animate-pulse'>
          <div className='h-6 bg-slate-200 rounded w-48 mb-6'></div>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className='bg-white/40 border border-white/30 rounded-xl p-4'
              >
                <div className='h-4 bg-slate-200 rounded w-32 mb-3'></div>
                <div className='space-y-2'>
                  <div className='h-3 bg-slate-200 rounded'></div>
                  <div className='h-3 bg-slate-200 rounded'></div>
                  <div className='h-3 bg-slate-200 rounded w-3/4'></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!opportunities.length) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className='bg-white/60 backdrop-blur-lg border border-white/20 rounded-2xl p-6 shadow-lg'
    >
      <h3 className='text-xl font-bold text-slate-900 mb-6 flex items-center gap-2'>
        <div className='p-2 bg-gradient-to-r from-emerald-500 to-green-500 rounded-lg'>
          <TrendingUp className='h-5 w-5 text-white' />
        </div>
        Trending Opportunities
      </h3>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        {opportunities.slice(0, maxItems).map((opportunity, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 + index * 0.1 }}
            className='bg-white/40 border border-white/30 rounded-xl p-4 hover:bg-white/60 transition-all duration-200'
          >
            <div className='flex items-start justify-between mb-3'>
              <h4 className='font-semibold text-slate-900 line-clamp-2'>
                {opportunity.trend.topic}
              </h4>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium shrink-0 ml-2 ${
                  opportunity.opportunity.difficulty === 'easy'
                    ? 'bg-green-100 text-green-700'
                    : opportunity.opportunity.difficulty === 'medium'
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-red-100 text-red-700'
                }`}
              >
                {opportunity.opportunity.difficulty}
              </span>
            </div>

            <div className='space-y-2 text-sm'>
              <div className='flex justify-between'>
                <span className='text-slate-600'>Opportunity Score:</span>
                <span className='font-medium text-slate-900'>
                  {opportunity.opportunity.score}%
                </span>
              </div>
              <div className='flex justify-between'>
                <span className='text-slate-600'>Time Window:</span>
                <span className='font-medium text-slate-900'>
                  {opportunity.opportunity.timeWindow}
                </span>
              </div>
              <div className='text-slate-600'>
                <span>Platforms: </span>
                <span className='font-medium text-slate-500'>
                  {opportunity.trend.platforms.join(', ')}
                </span>
              </div>

              {/* Opportunity Score Progress Bar */}
              <div className='mt-3'>
                <div className='flex justify-between text-xs text-slate-500 mb-1'>
                  <span>Opportunity</span>
                  <span>{opportunity.opportunity.score}%</span>
                </div>
                <div className='w-full bg-slate-200 rounded-full h-2'>
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
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
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {opportunities.length > maxItems && (
        <div className='mt-4 text-center'>
          <span className='text-sm text-slate-500'>
            Showing {maxItems} of {opportunities.length} opportunities
          </span>
        </div>
      )}
    </motion.div>
  );
}
