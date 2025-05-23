import { ArrowUp } from 'lucide-react';
import { Calendar } from 'lucide-react';
import { Heart } from 'lucide-react';
import { Eye } from 'lucide-react';
import { Target } from 'lucide-react';
import React from 'react';

const stats = [
  { label: 'Scheduled Posts', value: 28, change: '+12%', icon: Calendar },
  { label: 'Total Engagement', value: '2.4M', change: '+18%', icon: Heart },
  { label: 'Reach This Week', value: '892K', change: '+24%', icon: Eye },
  { label: 'Active Campaigns', value: 7, change: '+3', icon: Target },
];
export default function StatsCard({ animateStats }: { animateStats: boolean }) {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
      {stats.map((stat, index) => (
        <div
          key={stat.label}
          className={`group relative bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-6 hover:bg-white/20 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25 ${
            animateStats ? 'animate-fade-in' : 'opacity-0'
          }`}
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <div className='flex items-center justify-between mb-4'>
            <div
              className={`p-3 rounded-2xl bg-gradient-to-r ${
                index % 2 === 0
                  ? 'from-purple-500/20 to-pink-500/20'
                  : 'from-blue-500/20 to-cyan-500/20'
              } group-hover:scale-110 transition-transform duration-300`}
            >
              <stat.icon className='h-6 w-6 text-white' />
            </div>
            <div className='flex items-center text-green-400 text-sm font-medium'>
              <ArrowUp className='h-4 w-4 mr-1' />
              {stat.change}
            </div>
          </div>
          <div className='text-3xl font-bold text-white mb-1'>{stat.value}</div>
          <div className='text-slate-300 text-sm'>{stat.label}</div>
        </div>
      ))}
    </div>
  );
}
