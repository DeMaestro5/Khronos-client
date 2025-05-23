import { BarChart3 } from 'lucide-react';
import { Share2 } from 'lucide-react';
import { Users } from 'lucide-react';
import { Zap } from 'lucide-react';
import React from 'react';

export default function QuickAction() {
  return (
    <div className='bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-6 hover:bg-white/15 transition-all duration-500'>
      <h3 className='text-xl font-bold text-white mb-4'>Quick Actions</h3>
      <div className='grid grid-cols-2 gap-3'>
        {[
          {
            icon: Users,
            label: 'Team',
            color: 'from-blue-500 to-cyan-500',
          },
          {
            icon: Zap,
            label: 'AI Assist',
            color: 'from-yellow-500 to-orange-500',
          },
          {
            icon: BarChart3,
            label: 'Analytics',
            color: 'from-green-500 to-emerald-500',
          },
          {
            icon: Share2,
            label: 'Share',
            color: 'from-purple-500 to-pink-500',
          },
        ].map((action) => (
          <button
            key={action.label}
            className={`group flex flex-col items-center justify-center p-4 bg-gradient-to-r ${action.color} rounded-2xl hover:scale-105 transition-all duration-300 hover:shadow-lg`}
          >
            <action.icon className='h-6 w-6 text-white mb-2 group-hover:scale-110 transition-transform duration-300' />
            <span className='text-white text-sm font-medium'>
              {action.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
