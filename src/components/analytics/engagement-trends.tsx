'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';

export default function EngagementTrends() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2 }}
      className='bg-white/60 backdrop-blur-lg border border-white/20 rounded-2xl p-6 shadow-lg'
    >
      <div className='flex items-center justify-between mb-6'>
        <div>
          <h3 className='text-xl font-bold text-slate-900'>
            Engagement Trends
          </h3>
          <p className='text-slate-600 text-sm'>Daily engagement over time</p>
        </div>
        <div className='p-2 bg-gradient-to-r from-emerald-500 to-green-500 rounded-lg'>
          <TrendingUp className='h-5 w-5 text-white' />
        </div>
      </div>

      {/* Mock Chart Area */}
      <div className='relative h-64 bg-gradient-to-t from-emerald-50 to-transparent rounded-xl p-4'>
        <div className='absolute inset-4 flex items-end justify-between'>
          {Array.from({ length: 7 }, (_, i) => (
            <motion.div
              key={i}
              className='bg-gradient-to-t from-emerald-500 to-emerald-400 rounded-t-lg shadow-lg'
              style={{ width: '12%' }}
              initial={{ height: '0%' }}
              animate={{ height: `${Math.random() * 80 + 20}%` }}
              transition={{ duration: 1, delay: 0.7 + i * 0.1 }}
            />
          ))}
        </div>

        {/* Chart Labels */}
        <div className='absolute bottom-0 left-4 right-4 flex justify-between text-xs text-slate-500'>
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
            <span key={day}>{day}</span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
