'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Activity, TrendingUp, Target, AlertCircle } from 'lucide-react';
import { PerformanceAnalyticsResponse } from '@/src/types/analytics';

interface PerformanceInsightsProps {
  performance: PerformanceAnalyticsResponse['data'] | null;
  isLoading?: boolean;
}

export default function PerformanceInsights({
  performance,
  isLoading = false,
}: PerformanceInsightsProps) {
  if (isLoading) {
    return (
      <div className='bg-white/95 dark:bg-slate-800/90 backdrop-blur-lg border border-white/20 dark:border-slate-700/60 rounded-2xl p-6 shadow-lg'>
        <div className='animate-pulse'>
          <div className='h-6 bg-slate-200 dark:bg-slate-700 rounded w-40 mb-6'></div>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className='bg-white/40 dark:bg-slate-700/40 border border-white/30 dark:border-slate-600/40 rounded-xl p-4'
              >
                <div className='h-4 bg-slate-200 dark:bg-slate-700 rounded w-24 mb-2'></div>
                <div className='h-6 bg-slate-200 dark:bg-slate-700 rounded w-16 mb-1'></div>
                <div className='h-3 bg-slate-200 dark:bg-slate-700 rounded w-20'></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!performance) {
    return null;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent':
        return 'text-green-600 dark:text-green-400';
      case 'good':
        return 'text-blue-600 dark:text-blue-400';
      case 'needs_improvement':
        return 'text-amber-900 dark:text-amber-400';
      default:
        return 'text-slate-600 dark:text-slate-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'excellent':
        return (
          <TrendingUp className='h-4 w-4 text-green-600 dark:text-green-400' />
        );
      case 'good':
        return <Target className='h-4 w-4 text-blue-600 dark:text-blue-400' />;
      case 'needs_improvement':
        return (
          <AlertCircle className='h-4 w-4 text-amber-600 dark:text-amber-400' />
        );
      default:
        return (
          <Activity className='h-4 w-4 text-slate-600 dark:text-slate-400' />
        );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7 }}
      className='bg-theme-card backdrop-blur-lg border border-theme-tertiary rounded-2xl p-6 shadow-lg'
    >
      <h3 className='text-xl font-bold text-theme-primary mb-6 flex items-center gap-2'>
        <div className='p-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg'>
          <Activity className='h-5 w-5 text-white' />
        </div>
        Performance Insights
      </h3>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-6'>
        {/* Top Growth Metric */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8 }}
          className='bg-theme-secondary/10 border border-theme-tertiary rounded-xl p-4 hover:bg-theme-secondary/20 transition-all duration-200 backdrop-blur-sm'
        >
          <div className='flex items-center gap-2 mb-2'>
            <TrendingUp className='h-4 w-4 text-emerald-600 dark:text-emerald-400' />
            <h4 className='font-semibold text-theme-primary'>Growth Metric</h4>
          </div>
          <p className='text-2xl font-bold text-theme-primary capitalize'>
            {performance.insights.topGrowthMetric}
          </p>
          <p className='text-xs text-theme-secondary'>Top performing area</p>
        </motion.div>

        {/* Performance Status */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.85 }}
          className='bg-theme-secondary/10 border border-theme-tertiary rounded-xl p-4 hover:bg-theme-secondary/20 transition-all duration-200 backdrop-blur-sm'
        >
          <div className='flex items-center gap-2 mb-2'>
            {getStatusIcon(performance.insights.performanceStatus)}
            <h4 className='font-semibold text-theme-primary'>Status</h4>
          </div>
          <p
            className={`text-2xl font-bold capitalize ${getStatusColor(
              performance.insights.performanceStatus
            )}`}
          >
            {performance.insights.performanceStatus}
          </p>
          <p className='text-xs text-theme-secondary'>Overall performance</p>
        </motion.div>

        {/* Recommendation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.9 }}
          className='bg-theme-secondary/10 border border-theme-tertiary rounded-xl p-4 hover:bg-theme-secondary/20 transition-all duration-200 backdrop-blur-sm'
        >
          <div className='flex items-center gap-2 mb-2'>
            <Target className='h-4 w-4 text-purple-600 dark:text-purple-400' />
            <h4 className='font-semibold text-theme-primary'>Recommendation</h4>
          </div>
          <p className='text-sm font-medium text-theme-primary capitalize'>
            {performance.insights.contentRecommendation.replace('_', ' ')}
          </p>
          <p className='text-xs text-theme-secondary'>Next action</p>
        </motion.div>
      </div>

      {/* Detailed Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.95 }}
        className='bg-theme-secondary/10 border border-theme-tertiary rounded-xl p-4 backdrop-blur-sm'
      >
        <h4 className='font-semibold text-theme-primary mb-3'>Key Metrics</h4>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4 text-sm'>
          <div className='flex justify-between items-center'>
            <span className='text-theme-secondary'>Engagement Rate:</span>
            <span className='font-medium text-theme-primary'>
              {performance.analytics.metrics.averageEngagementRate.toFixed(1)}%
            </span>
          </div>
          <div className='flex justify-between items-center'>
            <span className='text-theme-secondary'>Total Reach:</span>
            <span className='font-medium text-theme-primary'>
              {performance.analytics.metrics.totalReach.toLocaleString()}
            </span>
          </div>
          <div className='flex justify-between items-center'>
            <span className='text-theme-secondary'>Total Content:</span>
            <span className='font-medium text-theme-primary'>
              {performance.analytics.totalContent}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Growth Trends */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0 }}
        className='mt-4 bg-theme-secondary/10 border border-theme-tertiary rounded-xl p-4 backdrop-blur-sm'
      >
        <h4 className='font-semibold text-theme-primary mb-3'>Growth Trends</h4>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 text-sm'>
          <div className='flex justify-between items-center'>
            <span className='text-theme-secondary'>Engagement Growth:</span>
            <span
              className={`font-medium flex items-center gap-1 ${
                performance.analytics.trends.engagement > 0
                  ? 'text-green-600 dark:text-green-400'
                  : performance.analytics.trends.engagement < 0
                  ? 'text-red-600 dark:text-red-400'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              {performance.analytics.trends.engagement > 0 && '+'}
              {performance.analytics.trends.engagement.toFixed(1)}%
              {performance.analytics.trends.engagement > 0 ? (
                <TrendingUp className='h-3 w-3' />
              ) : performance.analytics.trends.engagement < 0 ? (
                <TrendingUp className='h-3 w-3 rotate-180' />
              ) : null}
            </span>
          </div>
          <div className='flex justify-between items-center'>
            <span className='text-theme-secondary'>Reach Growth:</span>
            <span
              className={`font-medium flex items-center gap-1 ${
                performance.analytics.trends.reach > 0
                  ? 'text-green-600 dark:text-green-400'
                  : performance.analytics.trends.reach < 0
                  ? 'text-red-600 dark:text-red-400'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              {performance.analytics.trends.reach > 0 && '+'}
              {performance.analytics.trends.reach.toFixed(1)}%
              {performance.analytics.trends.reach > 0 ? (
                <TrendingUp className='h-3 w-3' />
              ) : performance.analytics.trends.reach < 0 ? (
                <TrendingUp className='h-3 w-3 rotate-180' />
              ) : null}
            </span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
