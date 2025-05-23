'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Filter } from 'lucide-react';
import StatsCard from '@/src/components/stats-card';
import ToggleView from '@/src/components/toggle-view';
import Calendar from '@/src/components/calender/calendar';

const CalendarPage = () => {
  const [showFilters, setShowFilters] = useState(false);
  //   const [selectedDate, setSelectedDate] = useState(new Date());
  const [animateStats, setAnimateStats] = useState(false);

  useEffect(() => {
    setAnimateStats(true);
  }, []);

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden'>
      {/* Animated Background Elements */}
      <div className='absolute inset-0 overflow-hidden pointer-events-none'>
        <div className='absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse'></div>
        <div className='absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000'></div>
        <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-500'></div>
      </div>

      <div className='relative z-10 p-6 lg:p-8'>
        <div className='max-w-7xl mx-auto'>
          {/* Header Section */}
          <div className='flex flex-col lg:flex-row justify-between items-start lg:items-center mb-12'>
            <div className='mb-6 lg:mb-0'>
              <h1 className='text-5xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent mb-2'>
                KHRONOS CALENDER
              </h1>
              <p className='text-slate-300 text-lg'>
                Orchestrate your content strategy across all platforms
              </p>
            </div>

            <div className='flex items-center space-x-4'>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className='group flex items-center space-x-2 px-6 py-3 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl text-white hover:bg-white/20 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25'
              >
                <Filter className='h-5 w-5 group-hover:rotate-12 transition-transform duration-300' />
                <span className='font-medium'>Filters</span>
              </button>

              <button className='group flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-2xl text-white font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/50'>
                <Plus className='h-5 w-5 group-hover:rotate-90 transition-transform duration-300' />
                <span>Create Content</span>
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <StatsCard animateStats={animateStats} />
          {/* View Toggle */}
          <ToggleView />
          {/* Main Content Grid */}
          <Calendar />
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }

        .hover\\:scale-102:hover {
          transform: scale(1.02);
        }

        .backdrop-blur-lg {
          backdrop-filter: blur(16px);
        }
      `}</style>
    </div>
  );
};

export default CalendarPage;
