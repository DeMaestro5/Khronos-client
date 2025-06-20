'use client';

import React from 'react';
import { Card, CardContent } from '@/src/components/ui/card';
import { Trend } from '@/src/types/trends';
import {
  TrendingUp,
  TrendingDown,
  Users,
  Globe,
  CheckCircle,
  XCircle,
  Minus as MinusIcon,
} from 'lucide-react';

interface TrendCardProps {
  trend: Trend;
  onClick: (trend: Trend) => void;
}

const TrendCard: React.FC<TrendCardProps> = ({ trend, onClick }) => {
  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  const formatPercentage = (num: number): string => {
    return `${num > 0 ? '+' : ''}${num.toFixed(1)}%`;
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return (
          <CheckCircle className='w-4 h-4 text-emerald-500 dark:text-emerald-400' />
        );
      case 'negative':
        return <XCircle className='w-4 h-4 text-red-500 dark:text-red-400' />;
      default:
        return (
          <MinusIcon className='w-4 h-4 text-gray-500 dark:text-slate-400' />
        );
    }
  };

  const getGrowthIcon = (growth: number) => {
    if (growth > 0) {
      return (
        <TrendingUp className='w-4 h-4 text-emerald-500 dark:text-emerald-400' />
      );
    } else if (growth < 0) {
      return (
        <TrendingDown className='w-4 h-4 text-red-500 dark:text-red-400' />
      );
    } else {
      return (
        <MinusIcon className='w-4 h-4 text-gray-500 dark:text-slate-400' />
      );
    }
  };

  return (
    <Card
      className='bg-white/95 dark:bg-slate-800/90 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/60 hover:shadow-xl dark:hover:shadow-slate-900/40 transition-all duration-300 cursor-pointer group transform hover:-translate-y-2'
      onClick={() => onClick(trend)}
    >
      <CardContent className='p-6'>
        <div className='flex items-start justify-between mb-4'>
          <div className='flex-1'>
            <h3 className='font-bold text-gray-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors text-lg'>
              #{trend.keyword}
            </h3>
            <p className='text-sm text-gray-600 dark:text-slate-400 capitalize mt-1'>
              {trend.category}
            </p>
          </div>
          <div className='flex items-center space-x-2'>
            {getSentimentIcon(trend.sentiment)}
            {getGrowthIcon(trend.growth)}
          </div>
        </div>

        <div className='grid grid-cols-2 gap-4 mb-4'>
          <div className='bg-slate-50 dark:bg-slate-700/50 rounded-lg p-3 backdrop-blur-sm'>
            <div className='flex items-center space-x-2 mb-1'>
              <Users className='w-4 h-4 text-blue-500 dark:text-blue-400' />
              <span className='text-xs text-gray-500 dark:text-slate-400'>
                Volume
              </span>
            </div>
            <p className='text-lg font-bold text-gray-900 dark:text-slate-100'>
              {formatNumber(trend.volume)}
            </p>
          </div>

          <div className='bg-slate-50 dark:bg-slate-700/50 rounded-lg p-3 backdrop-blur-sm'>
            <div className='flex items-center space-x-2 mb-1'>
              {getGrowthIcon(trend.growth)}
              <span className='text-xs text-gray-500 dark:text-slate-400'>
                Growth
              </span>
            </div>
            <p
              className={`text-lg font-bold ${
                trend.growth > 0
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : trend.growth < 0
                  ? 'text-red-600 dark:text-red-400'
                  : 'text-gray-600 dark:text-slate-400'
              }`}
            >
              {formatPercentage(trend.growth)}
            </p>
          </div>
        </div>

        <div className='flex items-center justify-between pt-3 border-t border-gray-200 dark:border-slate-600'>
          <div className='flex items-center space-x-2'>
            <Globe className='w-4 h-4 text-gray-500 dark:text-slate-400' />
            <span className='text-sm text-gray-600 dark:text-slate-400 capitalize'>
              {trend.platform || 'All Platforms'}
            </span>
          </div>
          <div className='flex items-center space-x-1'>
            {getSentimentIcon(trend.sentiment)}
            <span className='text-sm text-gray-600 dark:text-slate-400 capitalize'>
              {trend.sentiment}
            </span>
          </div>
        </div>

        {trend.relatedTopics && trend.relatedTopics.length > 0 && (
          <div className='mt-4 pt-3 border-t border-gray-200 dark:border-slate-600'>
            <span className='text-xs text-gray-500 dark:text-slate-400 mb-2 block'>
              Related Topics:
            </span>
            <div className='flex flex-wrap gap-1'>
              {trend.relatedTopics.slice(0, 3).map((topic, index) => (
                <span
                  key={index}
                  className='px-2 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded-md border border-blue-200 dark:border-blue-700'
                >
                  {topic}
                </span>
              ))}
              {trend.relatedTopics.length > 3 && (
                <span className='px-2 py-1 bg-gray-50 dark:bg-slate-700/50 text-gray-600 dark:text-slate-400 text-xs rounded-md'>
                  +{trend.relatedTopics.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TrendCard;
