import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import React, { useState } from 'react';

export default function ToggleView() {
  const [view, setView] = useState('month');
  return (
    <div className='flex items-center justify-between mb-8'>
      <div className='flex items-center bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-2'>
        {['month', 'week', 'day'].map((viewOption) => (
          <button
            key={viewOption}
            onClick={() => setView(viewOption)}
            className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
              view === viewOption
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg scale-105'
                : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <Calendar className='h-4 w-4' />
            <span className='capitalize'>{viewOption}</span>
          </button>
        ))}
      </div>

      <div className='flex items-center space-x-4'>
        <button className='p-3 bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl text-white hover:bg-white/20 transition-all duration-300 hover:scale-105'>
          <ChevronLeft className='h-5 w-5' />
        </button>
        <div className='text-white font-semibold text-lg'>May 2025</div>
        <button className='p-3 bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl text-white hover:bg-white/20 transition-all duration-300 hover:scale-105'>
          <ChevronRight className='h-5 w-5' />
        </button>
      </div>
    </div>
  );
}
