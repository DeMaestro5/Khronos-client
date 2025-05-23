import React from 'react';
import CalendarSidebar from './calendar-sidebar';
import PlatformPerformance from '../platform-performance';

const platformColors = {
  Instagram: 'from-pink-500 to-orange-500',
  LinkedIn: 'from-blue-600 to-blue-700',
  TikTok: 'from-black to-pink-600',
  Twitter: 'from-blue-400 to-blue-600',
  YouTube: 'from-red-500 to-red-600',
};
export default function Calendar() {
  return (
    <div className='grid grid-cols-1 xl:grid-cols-4 gap-6 mt-4 mb-4'>
      {/* Calendar Section */}
      <div className='xl:col-span-3'>
        <div className='bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-8 hover:bg-white/15 transition-all duration-500'>
          <div className='grid grid-cols-7 gap-4 mb-6'>
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div
                key={day}
                className='text-center text-slate-300 font-medium py-3'
              >
                {day}
              </div>
            ))}
          </div>

          <div className='grid grid-cols-7 gap-4'>
            {Array.from({ length: 35 }, (_, i) => {
              const dayNumber =
                i - 6 + (Math.floor(Math.random() * 31) % 31) + 1;
              const hasContent = Math.random() > 0.7;
              const isToday = dayNumber === 22;

              return (
                <div
                  key={i}
                  className={`group aspect-square flex flex-col items-center justify-center rounded-2xl cursor-pointer transition-all duration-300 hover:scale-105 ${
                    isToday
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                      : hasContent
                      ? 'bg-white/20 text-white hover:bg-white/30'
                      : 'text-slate-400 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <span className='font-medium'>{dayNumber}</span>
                  {hasContent && (
                    <div className='flex space-x-1 mt-1'>
                      {Array.from(
                        { length: Math.floor(Math.random() * 3) + 1 },
                        (_, j) => (
                          <div
                            key={j}
                            className={`w-1.5 h-1.5 rounded-full ${
                              isToday ? 'bg-white/60' : 'bg-purple-400'
                            }`}
                          ></div>
                        )
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        <div className='mt-4'>
          <PlatformPerformance platformColors={platformColors} />
        </div>
      </div>

      {/* Sidebar */}
      <CalendarSidebar platformColors={platformColors} />
    </div>
  );
}
