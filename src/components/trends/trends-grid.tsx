'use client';

import React from 'react';
import { TrendAnalysis, Trend } from '@/src/types/trends';
import TrendCard from './trend-card';
import { Activity, TrendingUp } from 'lucide-react';

interface TrendsGridProps {
  currentTrends: TrendAnalysis | null;
  onTrendClick: (trend: Trend) => void;
}

const TrendsGrid: React.FC<TrendsGridProps> = ({
  currentTrends,
  onTrendClick,
}) => {
  if (!currentTrends) return null;

  const hasTrends = currentTrends.trends && currentTrends.trends.length > 0;

  if (!hasTrends) {
    return (
      <div className='text-center py-16'>
        <div className='text-theme-muted mb-6'>
          <TrendingUp className='w-20 h-20 mx-auto' />
        </div>
        <h3 className='text-xl font-bold text-theme-primary mb-3'>
          No trends found
        </h3>
        <p className='text-theme-secondary max-w-md mx-auto'>
          Try adjusting your filters or search for specific keywords to discover
          trending topics.
        </p>
      </div>
    );
  }

  return (
    <div className='mb-8'>
      <div className='flex items-center justify-between mb-6'>
        <h2 className='text-2xl font-bold text-theme-primary'>
          Current Trends
        </h2>
        <div className='flex items-center space-x-2 text-sm text-theme-secondary bg-theme-card/80 backdrop-blur-sm px-4 py-2 rounded-xl'>
          <Activity className='w-4 h-4' />
          <span>Showing {currentTrends.trends.length} trends</span>
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {currentTrends.trends.map((trend) => (
          <TrendCard key={trend._id} trend={trend} onClick={onTrendClick} />
        ))}
      </div>
    </div>
  );
};

export default TrendsGrid;
