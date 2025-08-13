'use client';

import React, { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import StatsCard from '@/src/components/stats-card';
import Calendar from '@/src/components/calender/calendar';
import CreateContentModal from '@/src/components/content/content-creation-modal';
import { useCalendar } from '@/src/context/CalendarContext';
import { useUserData } from '@/src/context/UserDataContext';
import { useGlobalConfetti } from '@/src/context/ConfettiContext';
import { CreatedContent } from '@/src/types/modal';
import { KhronosLogo } from '@/src/components/ui/khronos-logo';

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
  useEffect(() => {
    setAnimateStats(true);
  }, []);

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
      <div className='h-full bg-theme-secondary relative overflow-y-auto transition-colors duration-300'>
        {/* Animated Background Elements */}
        <div className='absolute inset-0 overflow-hidden pointer-events-none'>
          <div className='absolute top-0 right-0 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse'></div>
          <div className='absolute bottom-0 left-0 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000'></div>
          <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-500'></div>
        </div>

        <div className='relative z-10 min-h-full w-full'>
          <div className='w-full'>
            <div className='w-full bg-theme-card shadow-2xl p-4 sm:p-6 md:p-8 border-0 backdrop-blur-lg'>
              {/* Loading State */}
              <div className='text-center py-12'>
                <div className='max-w-md mx-auto space-y-6'>
                  {/* Animated Loading Icon */}
                  <div className='relative mx-auto w-20 h-20'>
                    <div className='absolute inset-0 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 opacity-20 animate-ping'></div>
                    <div className='absolute inset-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 opacity-40 animate-ping animation-delay-200'></div>
                    <div className='absolute inset-4 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 opacity-60 animate-ping animation-delay-400'></div>
                    <div className='absolute inset-6 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 animate-spin'></div>
                    <div className='absolute inset-7 rounded-full bg-theme-inverse flex items-center justify-center shadow-lg'>
                      <div className='w-3 h-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full animate-spin'></div>
                    </div>
                  </div>

                  {/* Loading Text */}
                  <div className='space-y-2'>
                    <h3 className='text-2xl font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent'>
                      Loading Your Khronos Calendar
                    </h3>
                    <p className='text-theme-secondary'>
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

  return (
    <div className='h-full bg-theme-secondary relative overflow-y-auto transition-colors duration-300'>
      {/* Animated Background Elements */}
      <div className='absolute inset-0 overflow-hidden pointer-events-none'>
        <div className='absolute top-0 right-0 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse'></div>
        <div className='absolute bottom-0 left-0 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000'></div>
        <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-500'></div>
      </div>

      <div className='relative z-10 min-h-full w-full'>
        <div className='w-full'>
          <div className='w-full bg-theme-card shadow-2xl p-3 sm:p-6 lg:p-8 border-0 backdrop-blur-lg'>
            {/* Redesigned Header Section */}
            <div className='mb-6 sm:mb-8 lg:mb-10'>
              {/* Mobile Layout */}
              <div className='block sm:hidden'>
                <div className='flex items-center justify-between mb-4'>
                  {/* Mobile Header */}
                  <div className='flex items-center space-x-3'>
                    <KhronosLogo size='md' showText={false} />
                    <div>
                      <h1 className='text-xl font-black text-theme-primary'>
                        KHRONOS
                      </h1>
                      <p className='text-xs text-theme-secondary -mt-1'>
                        Calendar
                      </p>
                    </div>
                  </div>

                  {/* Mobile Create Button */}
                  <button
                    onClick={() => setShowModal(true)}
                    className='flex items-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-xl text-white font-semibold text-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105'
                  >
                    <Plus className='h-4 w-4' />
                    <span>Create</span>
                  </button>
                </div>
              </div>

              {/* Desktop Layout - Clean and Simplified */}
              <div className='hidden sm:block'>
                <div className='relative bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 rounded-2xl p-6 lg:p-8 border border-purple-200/30 dark:border-purple-800/20 shadow-lg'>
                  {/* Content */}
                  <div className='relative z-10'>
                    {/* Header Row */}
                    <div className='flex items-center justify-between mb-6'>
                      {/* Left: Logo and Title */}
                      <div className='flex items-center space-x-4'>
                        <KhronosLogo size='lg' showText={false} />
                        <div>
                          <h1 className='text-2xl lg:text-3xl xl:text-4xl font-black bg-gradient-to-r from-purple-800 via-purple-600 to-pink-600 dark:from-purple-400 dark:via-purple-300 dark:to-pink-400 bg-clip-text text-transparent'>
                            KHRONOS
                          </h1>
                          <div className='px-3 py-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-semibold rounded-full shadow-sm mt-1'>
                            CALENDAR
                          </div>
                        </div>
                      </div>

                      {/* Right: Create Button */}
                      <button
                        onClick={() => setShowModal(true)}
                        className='group flex items-center space-x-2 px-6 lg:px-7 py-3 lg:py-3.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-xl text-white font-semibold text-sm lg:text-base shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105'
                      >
                        <Plus className='h-4 w-4 lg:h-5 lg:w-5 group-hover:rotate-90 transition-transform duration-200' />
                        <span>Create Content</span>
                      </button>
                    </div>

                    {/* Subtitle */}
                    <div className='text-center'>
                      <p className='text-theme-secondary text-base lg:text-lg font-medium max-w-3xl mx-auto'>
                        Orchestrate your content strategy across all platforms
                        with{' '}
                        <span className='bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent font-semibold'>
                          AI-powered insights
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
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
