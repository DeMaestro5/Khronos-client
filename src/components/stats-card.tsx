import { BarChart3, Clock, TrendingUp } from 'lucide-react';
import { Calendar } from 'lucide-react';

import React from 'react';

export default function StatsCard({
  animateStats,
  scheduledContent,
}: {
  animateStats: boolean;
  scheduledContent: {
    [key: string]: {
      status: string;
    }[];
  };
}) {
  const totalPosts = Object.values(scheduledContent).flat().length;

  const scheduledPosts = Object.values(scheduledContent)
    .flat()
    .filter((item) => item.status === 'scheduled').length;

  const activeDays = Object.keys(scheduledContent).length;

  const stats = [
    {
      title: 'Total Content',
      value: totalPosts,
      change: '+12%',
      positive: true,
      icon: <BarChart3 className='h-8 w-8' />,
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      title: 'Scheduled Posts',
      value: scheduledPosts,
      change: '+8%',
      positive: true,
      icon: <Clock className='h-8 w-8' />,
      gradient: 'from-green-500 to-emerald-500',
    },
    {
      title: 'Active Days',
      value: activeDays,
      change: '+15%',
      positive: true,
      icon: <Calendar className='h-8 w-8' />,
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      title: 'Engagement Rate',
      value: '94.2%',
      change: '+5%',
      positive: true,
      icon: <TrendingUp className='h-8 w-8' />,
      gradient: 'from-orange-500 to-red-500',
    },
  ];

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8'>
      {stats.map((stat, index) => (
        <div
          key={index}
          className={`group relative overflow-hidden bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-6 hover:bg-white/15 transition-all duration-500 hover:scale-105 hover:shadow-xl hover:shadow-purple-500/25 ${
            animateStats ? 'animate-fade-in' : ''
          }`}
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <div className='flex items-center justify-between mb-4'>
            <div
              className={`p-3 rounded-2xl bg-gradient-to-r ${stat.gradient} shadow-lg`}
            >
              <div className='text-white'>{stat.icon}</div>
            </div>
            <div
              className={`text-sm font-medium px-3 py-1 rounded-full ${
                stat.positive
                  ? 'text-green-400 bg-green-400/20'
                  : 'text-red-400 bg-red-400/20'
              }`}
            >
              {stat.change}
            </div>
          </div>

          <div className='space-y-2'>
            <h3 className='text-slate-300 text-sm font-medium'>{stat.title}</h3>
            <p className='text-3xl font-bold text-white'>{stat.value}</p>
          </div>

          <div className='absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 transform translate-x-full group-hover:translate-x-[-200%] transition-transform duration-1000'></div>
        </div>
      ))}
    </div>
  );
}
