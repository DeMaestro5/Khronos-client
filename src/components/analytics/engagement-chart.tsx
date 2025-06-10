import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, ArrowUp, ArrowDown } from 'lucide-react';
import { TimeSeriesData } from '@/src/types/analytics';

interface EngagementData {
  day: string;
  likes: number;
  comments: number;
  shares: number;
  total: number;
}

interface EngagementChartProps {
  data?: EngagementData[];
  timeSeriesData?: TimeSeriesData[] | null;
}

export default function EngagementChart({
  data,
  timeSeriesData,
}: EngagementChartProps) {
  // Transform time series data to chart format when available
  const transformedData = React.useMemo(() => {
    if (timeSeriesData && timeSeriesData.length > 0) {
      return timeSeriesData.slice(-7).map((item) => {
        const date = new Date(item.date);
        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        return {
          day: dayNames[date.getDay()],
          likes: Math.floor(item.engagement * 0.6), // Estimate likes as 60% of engagement
          comments: Math.floor(item.engagement * 0.25), // Estimate comments as 25% of engagement
          shares: Math.floor(item.engagement * 0.15), // Estimate shares as 15% of engagement
          total: item.engagement,
        };
      });
    }
    return null;
  }, [timeSeriesData]);

  // Mock data for demonstration when no real data is available
  const mockData: EngagementData[] = [
    { day: 'Mon', likes: 245, comments: 45, shares: 23, total: 313 },
    { day: 'Tue', likes: 312, comments: 67, shares: 34, total: 413 },
    { day: 'Wed', likes: 198, comments: 32, shares: 18, total: 248 },
    { day: 'Thu', likes: 456, comments: 89, shares: 56, total: 601 },
    { day: 'Fri', likes: 387, comments: 78, shares: 42, total: 507 },
    { day: 'Sat', likes: 523, comments: 98, shares: 67, total: 688 },
    { day: 'Sun', likes: 298, comments: 54, shares: 31, total: 383 },
  ];

  const chartData = data || transformedData || mockData;
  const maxValue = Math.max(...chartData.map((d) => d.total));
  const totalEngagement = chartData.reduce((sum, d) => sum + d.total, 0);
  const averageEngagement = Math.round(totalEngagement / chartData.length);
  const growthRate = 12.4; // Mock growth rate

  return (
    <div className='bg-white/60 backdrop-blur-lg border border-white/20 rounded-2xl p-6 shadow-lg'>
      <div className='flex items-center justify-between mb-6'>
        <div>
          <h3 className='text-xl font-bold text-slate-900 flex items-center gap-2'>
            <div className='p-2 bg-gradient-to-r from-emerald-500 to-green-500 rounded-lg'>
              <TrendingUp className='h-5 w-5 text-white' />
            </div>
            Engagement Overview
          </h3>
          <p className='text-slate-600 text-sm mt-1'>
            Daily engagement breakdown
          </p>
        </div>

        <div className='text-right'>
          <div className='text-2xl font-bold text-slate-900'>
            {averageEngagement}
          </div>
          <div className='flex items-center gap-1 text-sm'>
            <span className='text-slate-600'>Avg. daily</span>
            <span
              className={`flex items-center gap-1 ${
                growthRate > 0 ? 'text-emerald-600' : 'text-red-600'
              }`}
            >
              {growthRate > 0 ? (
                <ArrowUp className='h-3 w-3' />
              ) : (
                <ArrowDown className='h-3 w-3' />
              )}
              {Math.abs(growthRate)}%
            </span>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className='relative h-64 mb-6'>
        <div className='absolute inset-0 bg-gradient-to-t from-emerald-50/50 to-transparent rounded-xl' />

        {/* Grid Lines */}
        <div className='absolute inset-0 flex flex-col justify-between py-4'>
          {[100, 75, 50, 25, 0].map((percent) => (
            <div
              key={percent}
              className='border-t border-slate-200/50 flex items-center'
            >
              <span className='text-xs text-slate-400 -mt-2 ml-2'>
                {Math.round((maxValue * percent) / 100)}
              </span>
            </div>
          ))}
        </div>

        {/* Bars */}
        <div className='absolute inset-4 flex items-end justify-between gap-2'>
          {chartData.map((item, index) => (
            <div
              key={item.day}
              className='flex-1 flex flex-col items-center gap-1'
            >
              {/* Stacked Bar */}
              <div className='w-full flex flex-col items-center relative'>
                <motion.div
                  className='w-full bg-gradient-to-t from-emerald-400 to-emerald-300 rounded-t-lg shadow-lg relative overflow-hidden'
                  initial={{ height: '0%' }}
                  animate={{ height: `${(item.total / maxValue) * 100}%` }}
                  transition={{ duration: 1, delay: index * 0.1 }}
                >
                  {/* Likes section */}
                  <motion.div
                    className='absolute bottom-0 left-0 right-0 bg-gradient-to-t from-blue-500 to-blue-400'
                    initial={{ height: '0%' }}
                    animate={{ height: `${(item.likes / item.total) * 100}%` }}
                    transition={{ duration: 0.8, delay: 0.5 + index * 0.1 }}
                  />

                  {/* Comments section */}
                  <motion.div
                    className='absolute bottom-0 left-0 right-0 bg-gradient-to-t from-purple-500 to-purple-400'
                    initial={{ height: '0%' }}
                    animate={{
                      height: `${
                        ((item.likes + item.comments) / item.total) * 100
                      }%`,
                    }}
                    transition={{ duration: 0.8, delay: 0.7 + index * 0.1 }}
                  />
                </motion.div>

                {/* Hover tooltip */}
                <div className='absolute -top-16 left-1/2 transform -translate-x-1/2 bg-slate-900 text-white text-xs px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none'>
                  <div className='space-y-1'>
                    <div>Total: {item.total}</div>
                    <div>Likes: {item.likes}</div>
                    <div>Comments: {item.comments}</div>
                    <div>Shares: {item.shares}</div>
                  </div>
                  <div className='absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-slate-900'></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Day Labels */}
        <div className='absolute bottom-0 left-4 right-4 flex justify-between'>
          {chartData.map((item) => (
            <span key={item.day} className='text-xs text-slate-500 font-medium'>
              {item.day}
            </span>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className='flex items-center justify-center gap-6 text-sm'>
        <div className='flex items-center gap-2'>
          <div className='w-3 h-3 bg-gradient-to-r from-blue-500 to-blue-400 rounded-full' />
          <span className='text-slate-600'>Likes</span>
        </div>
        <div className='flex items-center gap-2'>
          <div className='w-3 h-3 bg-gradient-to-r from-purple-500 to-purple-400 rounded-full' />
          <span className='text-slate-600'>Comments</span>
        </div>
        <div className='flex items-center gap-2'>
          <div className='w-3 h-3 bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full' />
          <span className='text-slate-600'>Shares</span>
        </div>
      </div>
    </div>
  );
}
