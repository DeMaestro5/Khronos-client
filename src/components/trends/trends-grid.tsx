'use client';

import React from 'react';
import {
  TrendingUp,
  TrendingDownIcon,
  Minus as MinusIcon,
  CheckCircle,
  XCircle,
  Users,
  Globe,
  Activity,
} from 'lucide-react';
import { Card, CardContent } from '@/src/components/ui/card';
import { Trend, TrendAnalysis } from '@/src/types/trends';

interface TrendsGridProps {
  trends: TrendAnalysis['trends'];
  onTrendClick: (trend: Trend) => void;
}

const TrendsGrid: React.FC<TrendsGridProps> = ({ trends, onTrendClick }) => {
  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return <CheckCircle className='w-4 h-4 text-emerald-500' />;
      case 'negative':
        return <XCircle className='w-4 h-4 text-red-500' />;
      default:
        return <MinusIcon className='w-4 h-4 text-gray-500' />;
    }
  };

  const getGrowthIcon = (growth: number) => {
    if (growth > 0) {
      return <TrendingUp className='w-4 h-4 text-emerald-500' />;
    } else if (growth < 0) {
      return <TrendingDownIcon className='w-4 h-4 text-red-500' />;
    } else {
      return <MinusIcon className='w-4 h-4 text-gray-500' />;
    }
  };

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

  if (!trends || trends.length === 0) {
    return (
      <div className='text-center py-16'>
        <div className='text-gray-400 mb-6'>
          <TrendingUp className='w-20 h-20 mx-auto' />
        </div>
        <h3 className='text-xl font-bold text-gray-900 mb-3'>
          No trends found
        </h3>
        <p className='text-gray-600 max-w-md mx-auto'>
          Try adjusting your filters or search for specific keywords to discover
          trending topics.
        </p>
      </div>
    );
  }

  return (
    <div className='mb-8'>
      <div className='flex items-center justify-between mb-6'>
        <h2 className='text-2xl font-bold text-gray-900'>Current Trends</h2>
        <div className='flex items-center space-x-2 text-sm text-gray-600 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-xl'>
          <Activity className='w-4 h-4' />
          <span>Showing {trends.length} trends</span>
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {trends.map((trend) => (
          <Card
            key={trend._id}
            className='bg-white/90 backdrop-blur-sm border border-gray-200 hover:shadow-xl transition-all duration-300 cursor-pointer group transform hover:-translate-y-2'
            onClick={() => onTrendClick(trend)}
          >
            <CardContent className='p-6'>
              <div className='flex items-start justify-between mb-4'>
                <div className='flex-1'>
                  <h3 className='font-bold text-gray-900 group-hover:text-blue-600 transition-colors text-lg'>
                    #{trend.keyword}
                  </h3>
                  <p className='text-sm text-gray-600 capitalize mt-1'>
                    {trend.category}
                  </p>
                </div>
                <div className='flex items-center space-x-2'>
                  {getSentimentIcon(trend.sentiment)}
                  {getGrowthIcon(trend.growth)}
                </div>
              </div>

              <div className='space-y-4'>
                <div className='flex items-center justify-between p-3 bg-gray-50 rounded-xl'>
                  <div className='flex items-center space-x-2'>
                    <Users className='w-4 h-4 text-gray-500' />
                    <span className='text-sm text-gray-600'>Volume</span>
                  </div>
                  <span className='font-bold text-gray-900'>
                    {formatNumber(trend.volume)}
                  </span>
                </div>

                <div className='flex items-center justify-between p-3 bg-gray-50 rounded-xl'>
                  <div className='flex items-center space-x-2'>
                    <TrendingUp className='w-4 h-4 text-gray-500' />
                    <span className='text-sm text-gray-600'>Growth</span>
                  </div>
                  <span
                    className={`font-bold ${
                      trend.growth > 0
                        ? 'text-emerald-600'
                        : trend.growth < 0
                        ? 'text-red-600'
                        : 'text-gray-600'
                    }`}
                  >
                    {formatPercentage(trend.growth)}
                  </span>
                </div>

                <div className='flex items-center justify-between p-3 bg-gray-50 rounded-xl'>
                  <div className='flex items-center space-x-2'>
                    <Globe className='w-4 h-4 text-gray-500' />
                    <span className='text-sm text-gray-600'>Platform</span>
                  </div>
                  <span className='text-sm font-medium text-gray-900 capitalize'>
                    {trend.platform}
                  </span>
                </div>
              </div>

              {trend.relatedTopics && trend.relatedTopics.length > 0 && (
                <div className='mt-4 pt-4 border-t border-gray-100'>
                  <p className='text-xs text-gray-500 mb-2 font-medium'>
                    Related Topics
                  </p>
                  <div className='flex flex-wrap gap-1'>
                    {trend.relatedTopics.slice(0, 3).map((topic, index) => (
                      <span
                        key={index}
                        className='px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium'
                      >
                        {topic}
                      </span>
                    ))}
                    {trend.relatedTopics.length > 3 && (
                      <span className='px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full font-medium'>
                        +{trend.relatedTopics.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TrendsGrid;
