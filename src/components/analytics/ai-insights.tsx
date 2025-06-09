'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';

export default function AIInsights() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className='bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-6 text-white shadow-lg'
    >
      <div className='flex items-center gap-3 mb-4'>
        <div className='p-2 bg-white/20 rounded-lg'>
          <Zap className='h-6 w-6' />
        </div>
        <div>
          <h3 className='text-xl font-bold'>AI-Powered Insights</h3>
          <p className='text-white/80 text-sm'>
            Personalized recommendations for your content
          </p>
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        <div className='bg-white/10 backdrop-blur-sm rounded-xl p-4'>
          <h4 className='font-medium mb-2'>🎯 Best Posting Time</h4>
          <p className='text-sm text-white/80'>
            Tuesday at 2:00 PM gets 34% more engagement
          </p>
        </div>
        <div className='bg-white/10 backdrop-blur-sm rounded-xl p-4'>
          <h4 className='font-medium mb-2'>📈 Trending Topic</h4>
          <p className='text-sm text-white/80'>
            Content about &quot;AI Tools&quot; is performing +67% better
          </p>
        </div>
        <div className='bg-white/10 backdrop-blur-sm rounded-xl p-4'>
          <h4 className='font-medium mb-2'>🎨 Content Type</h4>
          <p className='text-sm text-white/80'>
            Carousel posts drive 2.3x more engagement
          </p>
        </div>
      </div>
    </motion.div>
  );
}
