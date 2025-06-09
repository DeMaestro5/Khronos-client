import React from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  Users,
  Eye,
  Heart,
  ArrowUp,
  ArrowDown,
  Calendar,
} from 'lucide-react';

interface GrowthMetric {
  title: string;
  current: number;
  previous: number;
  change: number;
  icon: React.ReactNode;
  color: string;
  format: 'number' | 'percentage';
  description: string;
}

export default function GrowthMetrics() {
  const metrics: GrowthMetric[] = [
    {
      title: 'Follower Growth',
      current: 8547,
      previous: 7231,
      change: 18.2,
      icon: <Users className='h-5 w-5' />,
      color: 'from-blue-500 to-cyan-500',
      format: 'number',
      description: 'New followers this month',
    },
    {
      title: 'Content Reach',
      current: 127430,
      previous: 98320,
      change: 29.6,
      icon: <Eye className='h-5 w-5' />,
      color: 'from-purple-500 to-pink-500',
      format: 'number',
      description: 'Total content impressions',
    },
    {
      title: 'Engagement Rate',
      current: 12.5,
      previous: 10.8,
      change: 15.7,
      icon: <Heart className='h-5 w-5' />,
      color: 'from-emerald-500 to-green-500',
      format: 'percentage',
      description: 'Average engagement across platforms',
    },
    {
      title: 'Monthly Growth',
      current: 24.3,
      previous: 18.9,
      change: 28.6,
      icon: <TrendingUp className='h-5 w-5' />,
      color: 'from-orange-500 to-red-500',
      format: 'percentage',
      description: 'Overall account growth rate',
    },
  ];

  const formatValue = (value: number, format: 'number' | 'percentage') => {
    if (format === 'percentage') {
      return `${value}%`;
    }
    return value.toLocaleString();
  };

  return (
    <div className='bg-white/60 backdrop-blur-lg border border-white/20 rounded-2xl p-6 shadow-lg'>
      <div className='flex items-center justify-between mb-6'>
        <div>
          <h3 className='text-xl font-bold text-slate-900 flex items-center gap-2'>
            <div className='p-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg'>
              <Calendar className='h-5 w-5 text-white' />
            </div>
            Growth Metrics
          </h3>
          <p className='text-slate-600 text-sm mt-1'>
            Monthly performance comparison
          </p>
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className='group relative bg-white/40 border border-white/30 rounded-xl p-4 hover:bg-white/60 transition-all duration-200'
          >
            <div className='flex items-start justify-between mb-3'>
              <div
                className={`p-2 rounded-lg bg-gradient-to-r ${metric.color} shadow-lg`}
              >
                <div className='text-white'>{metric.icon}</div>
              </div>

              <div
                className={`flex items-center gap-1 text-sm font-medium px-2 py-1 rounded-full ${
                  metric.change > 0
                    ? 'text-emerald-600 bg-emerald-100'
                    : 'text-red-600 bg-red-100'
                }`}
              >
                {metric.change > 0 ? (
                  <ArrowUp className='h-3 w-3' />
                ) : (
                  <ArrowDown className='h-3 w-3' />
                )}
                {Math.abs(metric.change)}%
              </div>
            </div>

            <div className='space-y-2'>
              <h4 className='text-slate-600 text-sm font-medium'>
                {metric.title}
              </h4>
              <div className='flex items-baseline gap-2'>
                <span className='text-2xl font-bold text-slate-900'>
                  {formatValue(metric.current, metric.format)}
                </span>
                <span className='text-sm text-slate-500'>
                  from {formatValue(metric.previous, metric.format)}
                </span>
              </div>
              <p className='text-xs text-slate-500'>{metric.description}</p>
            </div>

            {/* Progress bar */}
            <div className='mt-4 bg-slate-200 rounded-full h-1.5 overflow-hidden'>
              <motion.div
                className={`h-full bg-gradient-to-r ${metric.color} rounded-full`}
                initial={{ width: '0%' }}
                animate={{ width: `${Math.min(metric.change, 100)}%` }}
                transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
