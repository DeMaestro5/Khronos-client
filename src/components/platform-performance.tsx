import { BarChart3 } from 'lucide-react';
import React from 'react';

const platforms = ['Instagram', 'LinkedIn', 'TikTok', 'Twitter', 'YouTube'];
export default function PlatformPerformance({
  platformColors,
}: {
  platformColors: { [key: string]: string };
}) {
  return (
    <div className='bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-6 hover:bg-white/15 transition-all duration-500'>
      <div className='flex items-center justify-between mb-6'>
        <h3 className='text-xl font-bold text-white'>Platform Performance</h3>
        <BarChart3 className='h-5 w-5 text-purple-300' />
      </div>

      <div className='space-y-4'>
        {platforms.map((platform, index) => {
          const performance = Math.floor(Math.random() * 40) + 60;
          return (
            <div key={platform} className='group'>
              <div className='flex items-center justify-between mb-2'>
                <span className='text-white font-medium'>{platform}</span>
                <span className='text-sm text-slate-300'>{performance}%</span>
              </div>
              <div className='w-full bg-white/10 rounded-full h-2 overflow-hidden'>
                <div
                  className={`h-full bg-gradient-to-r ${platformColors[platform]} rounded-full transition-all duration-1000 group-hover:scale-x-105 origin-left`}
                  style={{
                    width: `${performance}%`,
                    animationDelay: `${index * 200}ms`,
                  }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
