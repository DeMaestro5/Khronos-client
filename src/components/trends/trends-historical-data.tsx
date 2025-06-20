'use client';

import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/src/components/ui/card';
import { TrendReport } from '@/src/types/trends';
import { Calendar, Eye, Sparkles } from 'lucide-react';

interface TrendsHistoricalDataProps {
  historicalData: TrendReport | null;
}

const TrendsHistoricalData: React.FC<TrendsHistoricalDataProps> = ({
  historicalData,
}) => {
  if (!historicalData) return null;

  return (
    <div className='mb-8'>
      <h2 className='text-2xl font-bold text-gray-900 dark:text-slate-100 mb-6'>
        Historical Analysis
      </h2>
      <Card className='bg-white/95 dark:bg-slate-800/90 backdrop-blur-sm border-gray-200 dark:border-slate-700/60 shadow-lg'>
        <CardHeader>
          <CardTitle className='flex items-center space-x-2'>
            <div className='p-2 bg-blue-100 dark:bg-blue-900/50 rounded-xl'>
              <Calendar className='w-5 h-5 text-blue-600 dark:text-blue-400' />
            </div>
            <span className='text-gray-900 dark:text-slate-100'>
              {historicalData.period?.days} Day Analysis for{' '}
              {historicalData.platform}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='space-y-8'>
            {historicalData.insights && historicalData.insights.length > 0 && (
              <div>
                <h4 className='font-bold text-gray-900 dark:text-slate-100 mb-4 flex items-center space-x-2'>
                  <Eye className='w-5 h-5 text-blue-600 dark:text-blue-400' />
                  <span>Key Insights</span>
                </h4>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  {historicalData.insights.map((insight, index) => (
                    <div
                      key={index}
                      className='p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-100 dark:border-blue-800/30 backdrop-blur-sm'
                    >
                      <p className='text-sm text-gray-700 dark:text-slate-200'>
                        {insight}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {historicalData.recommendations &&
              historicalData.recommendations.length > 0 && (
                <div>
                  <h4 className='font-bold text-gray-900 dark:text-slate-100 mb-4 flex items-center space-x-2'>
                    <Sparkles className='w-5 h-5 text-purple-600 dark:text-purple-400' />
                    <span>Recommendations</span>
                  </h4>
                  <div className='space-y-3'>
                    {historicalData.recommendations.map(
                      (recommendation, index) => (
                        <div
                          key={index}
                          className='flex items-start space-x-3 p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl border border-purple-100 dark:border-purple-800/30 backdrop-blur-sm'
                        >
                          <div className='p-1 bg-purple-100 dark:bg-purple-900/50 rounded-full'>
                            <Sparkles className='w-4 h-4 text-purple-600 dark:text-purple-400' />
                          </div>
                          <p className='text-sm text-gray-700 dark:text-slate-200'>
                            {recommendation}
                          </p>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TrendsHistoricalData;
