import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, TrendingUp } from 'lucide-react';

interface HeatmapData {
  date: string;
  value: number;
  posts: number;
}

export default function ContentHeatmap() {
  // Generate mock heatmap data for the last 12 weeks
  const generateHeatmapData = (): HeatmapData[] => {
    const data: HeatmapData[] = [];
    const today = new Date();

    for (let week = 0; week < 12; week++) {
      for (let day = 0; day < 7; day++) {
        const date = new Date(today);
        date.setDate(date.getDate() - (week * 7 + day));

        const posts = Math.floor(Math.random() * 4);
        const value = posts > 0 ? Math.random() * 100 : 0;

        data.push({
          date: date.toISOString().split('T')[0],
          value: Math.round(value),
          posts,
        });
      }
    }

    return data.reverse();
  };

  const heatmapData = generateHeatmapData();
  const maxValue = Math.max(...heatmapData.map((d) => d.value));

  const getIntensity = (value: number): string => {
    if (value === 0) return 'bg-slate-100';
    const intensity = value / maxValue;
    if (intensity < 0.25) return 'bg-emerald-200';
    if (intensity < 0.5) return 'bg-emerald-400';
    if (intensity < 0.75) return 'bg-emerald-600';
    return 'bg-emerald-800';
  };

  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  return (
    <div className='bg-white/60 backdrop-blur-lg border border-white/20 rounded-2xl p-6 shadow-lg'>
      <div className='flex items-center justify-between mb-6'>
        <div>
          <h3 className='text-xl font-bold text-slate-900 flex items-center gap-2'>
            <div className='p-2 bg-gradient-to-r from-emerald-500 to-green-500 rounded-lg'>
              <Calendar className='h-5 w-5 text-white' />
            </div>
            Content Activity
          </h3>
          <p className='text-slate-600 text-sm mt-1'>
            Publishing frequency over the last 12 weeks
          </p>
        </div>

        <div className='flex items-center gap-2 text-sm text-slate-600'>
          <span>Less</span>
          <div className='flex gap-1'>
            <div className='w-3 h-3 bg-slate-100 rounded-sm'></div>
            <div className='w-3 h-3 bg-emerald-200 rounded-sm'></div>
            <div className='w-3 h-3 bg-emerald-400 rounded-sm'></div>
            <div className='w-3 h-3 bg-emerald-600 rounded-sm'></div>
            <div className='w-3 h-3 bg-emerald-800 rounded-sm'></div>
          </div>
          <span>More</span>
        </div>
      </div>

      {/* Heatmap Grid */}
      <div className='space-y-4'>
        {/* Month labels */}
        <div className='flex justify-between text-xs text-slate-500 px-8'>
          {Array.from({ length: 3 }, (_, i) => {
            const monthIndex = (new Date().getMonth() - 2 + i + 12) % 12;
            return (
              <span key={i} className='flex-1 text-center'>
                {months[monthIndex]}
              </span>
            );
          })}
        </div>

        {/* Weekday labels and grid */}
        <div className='flex gap-2'>
          {/* Weekday labels */}
          <div className='flex flex-col gap-1 text-xs text-slate-500 justify-between py-1'>
            {weekdays.map((day, index) => (
              <div key={day} className='h-4 flex items-center'>
                {index % 2 === 1 && <span>{day}</span>}
              </div>
            ))}
          </div>

          {/* Heatmap grid */}
          <div className='flex-1 grid grid-cols-12 gap-1'>
            {Array.from({ length: 12 }, (_, weekIndex) => (
              <div key={weekIndex} className='flex flex-col gap-1'>
                {Array.from({ length: 7 }, (_, dayIndex) => {
                  const dataIndex = weekIndex * 7 + dayIndex;
                  const data = heatmapData[dataIndex];

                  if (!data) return <div key={dayIndex} className='w-4 h-4' />;

                  return (
                    <motion.div
                      key={dayIndex}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{
                        duration: 0.2,
                        delay: (weekIndex * 7 + dayIndex) * 0.01,
                      }}
                      className={`w-4 h-4 rounded-sm cursor-pointer transition-all duration-200 hover:scale-110 hover:shadow-lg group relative ${getIntensity(
                        data.value
                      )}`}
                      title={`${data.date}: ${data.posts} posts, ${data.value}% engagement`}
                    >
                      {/* Tooltip */}
                      <div className='absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-slate-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none'>
                        <div className='space-y-1'>
                          <div>{new Date(data.date).toLocaleDateString()}</div>
                          <div>{data.posts} posts</div>
                          <div>{data.value}% engagement</div>
                        </div>
                        <div className='absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-slate-900'></div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className='mt-6 pt-6 border-t border-slate-200/50'>
        <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
          <div className='text-center'>
            <div className='text-2xl font-bold text-slate-900'>
              {heatmapData.reduce((sum, d) => sum + d.posts, 0)}
            </div>
            <div className='text-sm text-slate-600'>Total Posts</div>
          </div>
          <div className='text-center'>
            <div className='text-2xl font-bold text-slate-900'>
              {Math.round(
                heatmapData.reduce((sum, d) => sum + d.value, 0) /
                  heatmapData.filter((d) => d.value > 0).length
              ) || 0}
              %
            </div>
            <div className='text-sm text-slate-600'>Avg Engagement</div>
          </div>
          <div className='text-center'>
            <div className='text-2xl font-bold text-slate-900'>
              {heatmapData.filter((d) => d.posts > 0).length}
            </div>
            <div className='text-sm text-slate-600'>Active Days</div>
          </div>
          <div className='text-center'>
            <div className='text-2xl font-bold text-emerald-600 flex items-center justify-center gap-1'>
              <TrendingUp className='h-4 w-4' />
              +12%
            </div>
            <div className='text-sm text-slate-600'>Growth</div>
          </div>
        </div>
      </div>
    </div>
  );
}
