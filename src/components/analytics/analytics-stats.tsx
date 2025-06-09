'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Eye,
  Heart,
  Users,
  Target,
  BarChart3,
  Calendar,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';
import { Content } from '@/src/types/content';
import { AnalyticsData } from '@/src/types/analytics';

interface AnalyticsStatsProps {
  analyticsData: AnalyticsData;
  contents: Content[];
}

export default function AnalyticsStats({
  analyticsData,
  contents,
}: AnalyticsStatsProps) {
  const stats = [
    {
      title: 'Total Views',
      value: analyticsData.totalViews.toLocaleString(),
      change: `+${analyticsData.weeklyGrowth}%`,
      positive: true,
      icon: <Eye className='h-6 w-6' />,
      gradient: 'from-blue-500 to-cyan-500',
      description: 'Across all platforms',
    },
    {
      title: 'Engagement',
      value: analyticsData.totalEngagement.toLocaleString(),
      change: `+${analyticsData.monthlyGrowth}%`,
      positive: true,
      icon: <Heart className='h-6 w-6' />,
      gradient: 'from-pink-500 to-rose-500',
      description: 'Total interactions',
    },
    {
      title: 'Followers',
      value: analyticsData.totalFollowers.toLocaleString(),
      change: `+${analyticsData.growthRate}%`,
      positive: true,
      icon: <Users className='h-6 w-6' />,
      gradient: 'from-purple-500 to-indigo-500',
      description: 'Cross-platform following',
    },
    {
      title: 'Avg. Engagement Rate',
      value: `${analyticsData.avgEngagementRate}%`,
      change: '+2.1%',
      positive: true,
      icon: <Target className='h-6 w-6' />,
      gradient: 'from-emerald-500 to-green-500',
      description: 'Industry benchmark: 8.5%',
    },
    {
      title: 'Content Created',
      value: contents.length.toString(),
      change: '+12%',
      positive: true,
      icon: <BarChart3 className='h-6 w-6' />,
      gradient: 'from-orange-500 to-red-500',
      description: 'This month',
    },
    {
      title: 'Scheduled Posts',
      value: contents.filter((c) => c.status === 'scheduled').length.toString(),
      change: '+5%',
      positive: true,
      icon: <Calendar className='h-6 w-6' />,
      gradient: 'from-violet-500 to-purple-500',
      description: 'Ready to publish',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
    >
      {stats.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
          className='group relative overflow-hidden bg-white/60 backdrop-blur-lg border border-white/20 rounded-2xl p-6 hover:bg-white/80 transition-all duration-300 shadow-lg hover:shadow-xl'
        >
          {/* Background Gradient */}
          <div
            className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
          />

          <div className='relative'>
            <div className='flex items-start justify-between mb-4'>
              <div
                className={`p-3 rounded-xl bg-gradient-to-r ${stat.gradient} shadow-lg`}
              >
                <div className='text-white'>{stat.icon}</div>
              </div>
              <div
                className={`flex items-center gap-1 text-sm font-medium px-2 py-1 rounded-full ${
                  stat.positive
                    ? 'text-emerald-600 bg-emerald-100'
                    : 'text-red-600 bg-red-100'
                }`}
              >
                {stat.positive ? (
                  <ArrowUp className='h-3 w-3' />
                ) : (
                  <ArrowDown className='h-3 w-3' />
                )}
                {stat.change}
              </div>
            </div>

            <div className='space-y-2'>
              <h3 className='text-slate-600 text-sm font-medium'>
                {stat.title}
              </h3>
              <p className='text-3xl font-bold text-slate-900'>{stat.value}</p>
              <p className='text-xs text-slate-500'>{stat.description}</p>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
