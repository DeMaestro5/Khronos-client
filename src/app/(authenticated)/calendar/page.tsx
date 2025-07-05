'use client';

import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import StatsCard from '@/src/components/stats-card';
import Calendar from '@/src/components/calender/calendar';
import CreateContentModal from '@/src/components/content/content-creation-modal';
import { useCalendar } from '@/src/context/CalendarContext';
import { useUserData } from '@/src/context/UserDataContext';
import { useGlobalConfetti } from '@/src/context/ConfettiContext';
import { CreatedContent } from '@/src/types/modal';

const CalendarPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [animateStats, setAnimateStats] = useState(false);

  // Get calendar data and user data
  const {
    scheduledContent,
    loadScheduledContent,
    isLoading: calendarLoading,
  } = useCalendar();

  // Get user data for stats in the top cards
  const { userStats, loading: userDataLoading } = useUserData();

  const { triggerContentCreationCelebration } = useGlobalConfetti();

  // Animation trigger on mount
  React.useEffect(() => {
    setAnimateStats(true);
  }, []);

  // Handle content creation completion (called after modal handles API call)
  // Handle content creation completion (called after modal handles API call)
  const handleContentCreated = (createdContent?: CreatedContent) => {
    console.log('📅 Calendar Page: Content created:', createdContent);

    // Trigger confetti celebration
    setTimeout(() => {
      triggerContentCreationCelebration();
    }, 100);

    // Refresh the calendar to show the new content
    loadScheduledContent();
  };

  const handleDateSelect = (dateKey: string) => {
    console.log('Selected date:', dateKey);
    // You can implement date selection logic here
  };

  // Show loading state while calendar data is being fetched
  if (calendarLoading || userDataLoading) {
    return (
      <div className='h-full bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 dark:from-slate-950 dark:via-purple-950 dark:to-slate-950 relative overflow-y-auto transition-colors duration-300'>
        {/* Animated Background Elements */}
        <div className='absolute inset-0 overflow-hidden pointer-events-none'>
          <div className='absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse'></div>
          <div className='absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000'></div>
          <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-500'></div>
        </div>

        <div className='relative z-10 min-h-full w-full'>
          <div className='w-full'>
            <div className='w-full bg-[#1a1333] shadow-2xl p-4 sm:p-6 md:p-8 border-0'>
              {/* Loading State */}
              <div className='text-center py-12'>
                <div className='max-w-md mx-auto space-y-6'>
                  {/* Animated Loading Icon */}
                  <div className='relative mx-auto w-20 h-20'>
                    <div className='absolute inset-0 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 opacity-20 animate-ping'></div>
                    <div className='absolute inset-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 opacity-40 animate-ping animation-delay-200'></div>
                    <div className='absolute inset-4 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 opacity-60 animate-ping animation-delay-400'></div>
                    <div className='absolute inset-6 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 animate-spin'></div>
                    <div className='absolute inset-7 rounded-full bg-white flex items-center justify-center shadow-lg'>
                      <div className='w-3 h-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full animate-spin'></div>
                    </div>
                  </div>

                  {/* Loading Text */}
                  <div className='space-y-2'>
                    <h3 className='text-2xl font-semibold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent'>
                      Loading Your Khronos Calendar
                    </h3>
                    <p className='text-slate-300'>
                      We&apos;re fetching your scheduled content...
                    </p>

                    {/* Animated Dots */}
                    <div className='flex justify-center space-x-2 pt-2'>
                      {[0, 1, 2].map((i) => (
                        <div
                          key={i}
                          className='w-2 h-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full animate-pulse'
                          style={{
                            animationDelay: `${i * 0.2}s`,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Use user stats for the top cards (from UserDataContext)
  const calendarStatsForTopCards = {
    totalContent: userStats?.totalContent || 0,
    scheduledPosts: userStats?.scheduledContent || 0, // scheduledContent from UserStats is the count
    activeDays: Object.keys(scheduledContent).length, // Use calendar context for active days
    engagementRate: userStats?.engagementRate || 0,
  };

  console.log('📅 Calendar Page: Using stats:', {
    fromUserStats: userStats,
    fromCalendarContext: {
      totalDates: Object.keys(scheduledContent).length,
      totalItems: Object.values(scheduledContent).flat().length,
    },
    finalStats: calendarStatsForTopCards,
  });

  return (
    <div className='h-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-y-auto'>
      {/* Animated Background Elements */}
      <div className='absolute inset-0 overflow-hidden pointer-events-none'>
        <div className='absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse'></div>
        <div className='absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000'></div>
        <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-500'></div>
      </div>

      <div className='relative z-10 min-h-full w-full'>
        <div className='w-full'>
          <div className='w-full bg-[#1a1333] shadow-2xl p-4 sm:p-6 md:p-8 border-0'>
            {/* Header Section */}
            <div className='flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 md:mb-12'>
              <div className='mb-6 lg:mb-0'>
                <h1 className='text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent mb-2'>
                  KHRONOS CALENDAR
                </h1>
                <p className='text-slate-300 text-base sm:text-lg'>
                  Orchestrate your content strategy across all platforms
                </p>
              </div>

              <div className='flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 w-full sm:w-auto'>
                <button
                  onClick={() => setShowModal(true)}
                  className='group flex items-center justify-center space-x-2 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-xl sm:rounded-2xl text-white font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/50'
                >
                  <Plus className='h-4 w-4 sm:h-5 sm:w-5 group-hover:rotate-90 transition-transform duration-300' />
                  <span className='text-sm sm:text-base'>Create Content</span>
                </button>
              </div>
            </div>

            {/* Stats Cards - Using user data for top cards */}
            <StatsCard
              animateStats={animateStats}
              userStats={calendarStatsForTopCards}
            />

            {/* Enhanced Calendar - Uses calendar context internally */}
            <Calendar
              scheduledContent={scheduledContent}
              onDateSelect={handleDateSelect}
              onCreateContent={() => setShowModal(true)}
            />
          </div>
        </div>
      </div>

      {/* Create Content Modal */}
      <CreateContentModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleContentCreated}
      />

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
