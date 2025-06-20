'use client';

import React from 'react';
import { Card, CardContent } from '@/src/components/ui/card';
import { TrendAnalysis } from '@/src/types/trends';
import { TrendingUp, BarChart3, Hash, Globe } from 'lucide-react';

interface TrendsSummaryCardsProps {
  currentTrends: TrendAnalysis | null;
}

const TrendsSummaryCards: React.FC<TrendsSummaryCardsProps> = ({
  currentTrends,
}) => {
  const formatPercentage = (num: number): string => {
    return `${num > 0 ? '+' : ''}${num.toFixed(1)}%`;
  };

  if (!currentTrends || !currentTrends.summary) {
    return null;
  }

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
      <Card className='bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-800 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1'>
        <CardContent className='p-6'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-blue-100 dark:text-blue-200 text-sm font-medium mb-1'>
                Total Trends
              </p>
              <p className='text-3xl font-bold'>
                {currentTrends.summary.totalTrends}
              </p>
            </div>
            <div className='p-3 bg-blue-400/20 dark:bg-blue-300/20 rounded-2xl'>
              <TrendingUp className='w-8 h-8 text-blue-100 dark:text-blue-200' />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className='bg-gradient-to-br from-emerald-500 to-emerald-600 dark:from-emerald-600 dark:to-emerald-800 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1'>
        <CardContent className='p-6'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-emerald-100 dark:text-emerald-200 text-sm font-medium mb-1'>
                Avg Growth
              </p>
              <p className='text-3xl font-bold'>
                {formatPercentage(currentTrends.summary.averageGrowth)}
              </p>
            </div>
            <div className='p-3 bg-emerald-400/20 dark:bg-emerald-300/20 rounded-2xl'>
              <BarChart3 className='w-8 h-8 text-emerald-100 dark:text-emerald-200' />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className='bg-gradient-to-br from-purple-500 to-purple-600 dark:from-indigo-600 dark:to-indigo-800 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1'>
        <CardContent className='p-6'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-purple-100 dark:text-indigo-200 text-sm font-medium mb-1'>
                Top Category
              </p>
              <p className='text-xl font-bold capitalize'>
                {currentTrends.summary.topCategory}
              </p>
            </div>
            <div className='p-3 bg-purple-400/20 dark:bg-indigo-300/20 rounded-2xl'>
              <Hash className='w-8 h-8 text-purple-100 dark:text-indigo-200' />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className='bg-gradient-to-br from-orange-500 to-orange-600 dark:from-amber-600 dark:to-amber-800 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1'>
        <CardContent className='p-6'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-orange-100 dark:text-amber-200 text-sm font-medium mb-1'>
                Top Platform
              </p>
              <p className='text-xl font-bold capitalize'>
                {currentTrends.summary.topPlatform}
              </p>
            </div>
            <div className='p-3 bg-orange-400/20 dark:bg-amber-300/20 rounded-2xl'>
              <Globe className='w-8 h-8 text-orange-100 dark:text-amber-200' />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TrendsSummaryCards;
