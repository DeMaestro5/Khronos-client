'use client';

import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import StatsCard from '@/src/components/stats-card';
import Calendar from '@/src/components/calender/calendar';
import CreateContentModal from '@/src/components/content/content-creation-modal';
import { ContentFormData, Platform } from '@/src/types/modal';

type ScheduledContent = {
  [key: string]: {
    id: number;
    title: string;
    platform: Platform['id'];
    time: string;
    type: string;
    status: 'draft' | 'scheduled' | 'published';
    description?: string;
  }[];
};

const CalendarPage = () => {
  const [showModal, setShowModal] = useState(false);

  const [animateStats, setAnimateStats] = useState(false);
  const [scheduledContent, setScheduledContent] = useState<ScheduledContent>(
    {}
  );

  useEffect(() => {
    setAnimateStats(true);

    // Initialize with sample data
    const sampleContent: ScheduledContent = {
      '2025-05-22': [
        {
          id: 1,
          title: 'Morning Motivation Post',
          platform: 'instagram',
          time: '09:00',
          type: 'Image',
          status: 'scheduled',
        },
        {
          id: 2,
          title: 'Tech Tutorial Video',
          platform: 'youtube',
          time: '14:30',
          type: 'Video',
          status: 'draft',
        },
      ],
      '2025-05-25': [
        {
          id: 3,
          title: 'Industry Insights',
          platform: 'linkedin',
          time: '10:00',
          type: 'Article',
          status: 'scheduled',
        },
      ],
      '2025-05-28': [
        {
          id: 4,
          title: 'Quick Tips Thread',
          platform: 'twitter',
          time: '16:00',
          type: 'Text',
          status: 'scheduled',
        },
        {
          id: 5,
          title: 'Behind the Scenes',
          platform: 'tiktok',
          time: '19:00',
          type: 'Video',
          status: 'draft',
        },
        {
          id: 6,
          title: 'Product Showcase',
          platform: 'instagram',
          time: '20:30',
          type: 'Reel',
          status: 'scheduled',
        },
      ],
    };
    setScheduledContent(sampleContent);
  }, []);

  const handleCreateContent = (contentData: ContentFormData) => {
    const newContent = {
      id: Date.now(),
      title: contentData.title,
      platform: contentData.platforms[0], // Take the first platform for now
      time: contentData.scheduledTime,
      type: contentData.contentType,
      status: contentData.status,
      description: contentData.description,
    };

    const dateKey = contentData.scheduledDate;

    setScheduledContent((prev) => ({
      ...prev,
      [dateKey]: prev[dateKey] ? [...prev[dateKey], newContent] : [newContent],
    }));

    console.log('New content created:', newContent);
  };

  const handleDateSelect = (dateKey: string) => {
    console.log('Selected date:', dateKey);
    // You can implement date selection logic here
  };

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
