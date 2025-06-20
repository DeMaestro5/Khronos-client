'use client';

import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import StatsCard from '@/src/components/stats-card';
import Calendar from '@/src/components/calender/calendar';
import CreateContentModal from '@/src/components/content/content-creation-modal';
import { ContentFormData } from '@/src/types/modal';
import { useCalendar } from '@/src/context/CalendarContext';
import { useGlobalConfetti } from '@/src/context/ConfettiContext';
import { contentAPI } from '@/src/lib/api';
import toast from 'react-hot-toast';

const CalendarPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [animateStats, setAnimateStats] = useState(false);

  const {
    scheduledContent,
    loadScheduledContent,

    isLoading,
  } = useCalendar();

  const { triggerContentCreationCelebration } = useGlobalConfetti();

  // Animation trigger on mount
  React.useEffect(() => {
    setAnimateStats(true);
  }, []);

  const handleCreateContent = async (contentData: ContentFormData) => {
    // Validate required fields first
    if (!contentData.title.trim()) {
      toast.error('Content title is required');
      return;
    }

    if (contentData.platforms.length === 0) {
      toast.error('Please select at least one platform');
      return;
    }

    // Close modal immediately
    setShowModal(false);

    // Show creating toast with loading indicator
    const creatingToastId = toast.loading(
      '🚀 Creating your content... AI is working its magic!',
      {
        style: {
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          border: 'none',
          fontWeight: '500',
        },
      }
    );

    try {
      // Determine status based on whether scheduled date/time is provided
      const hasScheduledDate = !!(
        contentData.scheduledDate && contentData.scheduledTime
      );

      // Prepare the payload for API
      const newContentPayload: {
        title: string;
        type: string;
        platform: string[];
        description?: string;
        tags?: string[];
        scheduledDate?: string;
      } = {
        title: contentData.title.trim(),
        type: contentData.contentType,
        platform: contentData.platforms,
        description: contentData.description?.trim() || undefined,
        tags:
          contentData.tags.length > 0
            ? contentData.tags.filter((tag) => tag.trim())
            : undefined,
      };

      // Add scheduled date if provided
      if (hasScheduledDate) {
        const scheduledDateTime = `${contentData.scheduledDate}T${contentData.scheduledTime}:00.000Z`;
        newContentPayload.scheduledDate = scheduledDateTime;
      }

      console.log('Creating content with payload:', newContentPayload);

      // ALWAYS call the API to create content
      const response = await contentAPI.create(newContentPayload);

      console.log('Content creation response:', response.data);

      // Check if the creation was successful
      if (
        response.data?.statusCode === '10000' ||
        response.status === 200 ||
        response.status === 201
      ) {
        // Dismiss the creating toast
        toast.dismiss(creatingToastId);

        // If content has a scheduled date, it will automatically appear in calendar
        // after we reload the scheduled content
        if (hasScheduledDate) {
          toast.success(
            '🎉 Content created and scheduled successfully! Check your calendar!',
            {
              duration: 5000,
              style: {
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                fontWeight: '500',
                fontSize: '16px',
              },
              icon: '📅',
            }
          );
          // Celebrate with confetti after successful scheduled content creation
          setTimeout(() => {
            triggerContentCreationCelebration();
          }, 100);
        } else {
          toast.success('🎉 Content created as draft successfully!', {
            duration: 5000,
            style: {
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              fontWeight: '500',
              fontSize: '16px',
            },
            icon: '📝',
          });
          // Celebrate with confetti after successful draft content creation
          setTimeout(() => {
            triggerContentCreationCelebration();
          }, 100);
        }

        // Refresh the calendar to show the new content
        await loadScheduledContent();
      } else {
        throw new Error(response.data?.message || 'Failed to create content');
      }
    } catch (error: unknown) {
      console.error('Failed to create content:', error);

      // Dismiss the creating toast
      toast.dismiss(creatingToastId);

      // Show error notification with specific message
      let errorMessage = 'Failed to create content. Please try again.';

      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (
        typeof error === 'object' &&
        error !== null &&
        'response' in error
      ) {
        const axiosError = error as {
          response?: { data?: { message?: string } };
        };
        errorMessage = axiosError.response?.data?.message || errorMessage;
      }

      toast.error(`❌ ${errorMessage}`, {
        duration: 6000,
        style: {
          background: '#ef4444',
          color: 'white',
          border: 'none',
          fontWeight: '500',
        },
      });
    }
  };

  const handleDateSelect = (dateKey: string) => {
    console.log('Selected date:', dateKey);
    // You can implement date selection logic here
  };

  // Show loading state while calendar data is being fetched
  if (isLoading) {
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

                {/* Force Refresh Button for fixing old data */}
              </div>
            </div>

            {/* Stats Cards */}
            <StatsCard
              animateStats={animateStats}
              scheduledContent={scheduledContent}
            />

            {/* Enhanced Calendar */}
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
        onSubmit={handleCreateContent}
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
