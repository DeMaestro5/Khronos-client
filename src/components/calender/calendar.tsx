import { useState, ReactElement } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import ContentModal from './content-modal';
import EmptyDateModal from './emptyDateModal';
import { Platform } from '@/src/types/modal';
import { ScheduledContent } from '@/src/context/CalendarContext';

export default function CalendarComponent({
  scheduledContent = {},
  onDateSelect,
  onCreateContent,
}: {
  scheduledContent?: ScheduledContent;
  onDateSelect?: (dateKey: string) => void;
  onCreateContent?: () => void;
}) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [hoveredDate, setHoveredDate] = useState<string | null>(null);
  const [isContentModalOpen, setIsContentModalOpen] = useState(false);
  const [isEmptyModalOpen, setIsEmptyModalOpen] = useState(false);
  const [animatingOut, setAnimatingOut] = useState(false);

  // Log the received scheduled content for debugging
  console.log('📅 Calendar Component: Received scheduled content:', {
    totalDates: Object.keys(scheduledContent).length,
    totalItems: Object.values(scheduledContent).flat().length,
    dates: Object.keys(scheduledContent).sort(),
    content: scheduledContent,
  });

  const PlatformIcons: Record<Platform['id'], () => ReactElement> = {
    instagram: () => (
      <div className='w-4 h-4 bg-gradient-to-r from-pink-500 to-orange-500 rounded-full shadow-sm' />
    ),
    youtube: () => (
      <div className='w-4 h-4 bg-red-500 rounded-full shadow-sm' />
    ),
    twitter: () => (
      <div className='w-4 h-4 bg-blue-400 rounded-full shadow-sm' />
    ),
    linkedin: () => (
      <div className='w-4 h-4 bg-blue-600 rounded-full shadow-sm' />
    ),
    tiktok: () => (
      <div className='w-4 h-4 bg-gradient-to-r from-black to-pink-500 rounded-full shadow-sm' />
    ),
    facebook: () => (
      <div className='w-4 h-4 bg-blue-600 rounded-full shadow-sm' />
    ),
  };

  const platformColors: Record<Platform['id'], string> = {
    instagram: 'from-pink-500 to-orange-500',
    linkedin: 'from-blue-600 to-blue-700',
    tiktok: 'from-black to-pink-600',
    twitter: 'from-blue-400 to-blue-600',
    youtube: 'from-red-500 to-red-600',
    facebook: 'from-blue-600 to-blue-700',
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }

    return days;
  };

  const formatDateKey = (year: number, month: number, day: number) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(
      day
    ).padStart(2, '0')}`;
  };

  const getContentForDate = (day: number) => {
    if (!day) return [];
    const dateKey = formatDateKey(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );
    const content = scheduledContent[dateKey] || [];

    // Log content for debugging
    if (content.length > 0) {
      console.log(`📅 Content for ${dateKey}:`, content);
    }

    return content;
  };

  const isToday = (day: number) => {
    if (!day) return false;
    const today = new Date();
    return (
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    );
  };

  const isPastDate = (day: number) => {
    if (!day) return false;
    const today = new Date();
    const dateToCheck = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );

    // Set time to beginning of day for accurate comparison
    today.setHours(0, 0, 0, 0);
    dateToCheck.setHours(0, 0, 0, 0);

    return dateToCheck < today;
  };

  const canCreateContent = (day: number) => {
    return !isPastDate(day);
  };

  const navigateMonth = (direction: number) => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-emerald-500';
      case 'draft':
        return 'bg-gray-500';
      case 'published':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  const handleDateClick = (day: number) => {
    if (!day) return;

    const dateKey = formatDateKey(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );

    const content = getContentForDate(day);
    const isContentCreationAllowed = canCreateContent(day);
    setSelectedDate(dateKey);

    console.log(
      `📅 Date clicked: ${dateKey}, Content count: ${content.length}`
    );

    if (content.length > 0) {
      // Always show existing content, regardless of date
      setIsContentModalOpen(true);
    } else if (isContentCreationAllowed) {
      // Only allow content creation for present/future dates
      setIsEmptyModalOpen(true);
    } else {
      // Show a message for past dates with no content
      setIsEmptyModalOpen(true);
    }

    setAnimatingOut(false);
    onDateSelect?.(dateKey);
  };

  const closeModals = () => {
    setAnimatingOut(true);
    setTimeout(() => {
      setIsContentModalOpen(false);
      setIsEmptyModalOpen(false);
      setSelectedDate(null);
      setAnimatingOut(false);
    }, 200);
  };

  const days = getDaysInMonth(currentDate);
  const monthYear = currentDate.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  // Calculate stats from the scheduled content provided by context
  const totalPosts = Object.values(scheduledContent).flat().length;
  const scheduledPosts = Object.values(scheduledContent)
    .flat()
    .filter((item) => item.status === 'scheduled').length;
  const draftPosts = Object.values(scheduledContent)
    .flat()
    .filter((item) => item.status === 'draft').length;
  const publishedPosts = Object.values(scheduledContent)
    .flat()
    .filter((item) => item.status === 'published').length;
  const activeDays = Object.keys(scheduledContent).length;

  console.log('📅 Calendar Stats:', {
    totalPosts,
    scheduledPosts,
    draftPosts,
    publishedPosts,
    activeDays,
  });

  return (
    <>
      <div className='relative bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl'>
        {/* Header */}
        <div className='p-4 sm:p-6 bg-gradient-to-r from-purple-600/20 to-pink-600/20 border-b border-white/10'>
          <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6'>
            <h2 className='text-2xl sm:text-3xl font-bold text-white flex items-center space-x-2 sm:space-x-3 mb-4 sm:mb-0'>
              <div className='p-2 sm:p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg sm:rounded-xl shadow-lg'>
                <Calendar className='w-5 h-5 sm:w-7 sm:h-7' />
              </div>
              <div>
                <span>Content Calendar</span>
                <p className='text-xs sm:text-sm font-normal text-slate-300 mt-1'>
                  Manage your social media schedule
                </p>
              </div>
            </h2>

            <div className='flex items-center space-x-2 sm:space-x-4 w-full sm:w-auto'>
              <div className='flex items-center space-x-1 sm:space-x-2 bg-white/10 rounded-xl sm:rounded-2xl px-3 sm:px-6 py-2 sm:py-3 backdrop-blur-sm border border-white/20'>
                <button
                  onClick={() => navigateMonth(-1)}
                  className='p-1 sm:p-2 hover:bg-white/20 rounded-lg sm:rounded-xl transition-all text-white hover:scale-110 active:scale-95'
                >
                  <ChevronLeft className='w-4 h-4 sm:w-5 sm:h-5' />
                </button>

                <h3 className='text-base sm:text-xl font-semibold text-white min-w-[120px] sm:min-w-[180px] text-center'>
                  {monthYear}
                </h3>

                <button
                  onClick={() => navigateMonth(1)}
                  className='p-1 sm:p-2 hover:bg-white/20 rounded-lg sm:rounded-xl transition-all text-white hover:scale-110 active:scale-95'
                >
                  <ChevronRight className='w-4 h-4 sm:w-5 sm:h-5' />
                </button>
              </div>
            </div>
          </div>

          {/* Enhanced Legend */}
          <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0'>
            <div className='flex flex-wrap items-center gap-4 sm:gap-8 text-xs sm:text-sm'>
              <div className='flex items-center space-x-2 group cursor-pointer'>
                <div className='w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-emerald-500 group-hover:animate-pulse shadow-lg'></div>
                <span className='text-slate-300 group-hover:text-white transition-colors'>
                  Scheduled
                </span>
              </div>
              <div className='flex items-center space-x-2 group cursor-pointer'>
                <div className='w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-amber-500 group-hover:animate-pulse shadow-lg'></div>
                <span className='text-slate-300 group-hover:text-white transition-colors'>
                  Draft
                </span>
              </div>
              <div className='flex items-center space-x-2 group cursor-pointer'>
                <div className='w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-blue-500 group-hover:animate-pulse shadow-lg'></div>
                <span className='text-slate-300 group-hover:text-white transition-colors'>
                  Published
                </span>
              </div>
            </div>
            <div className='text-[10px] sm:text-xs text-slate-400 bg-white/5 px-2 sm:px-3 py-1 rounded-lg'>
              Click on any date to view or add content
            </div>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className='p-4 sm:p-6 md:p-8'>
          {/* Day Headers */}
          <div className='grid grid-cols-7 gap-1 sm:gap-2 md:gap-3 mb-4 sm:mb-6'>
            {[
              'Sunday',
              'Monday',
              'Tuesday',
              'Wednesday',
              'Thursday',
              'Friday',
              'Saturday',
            ].map((day) => (
              <div
                key={day}
                className='text-center text-slate-300 font-semibold py-2 sm:py-4 text-xs sm:text-sm uppercase tracking-wider bg-white/5 rounded-lg sm:rounded-xl'
              >
                {day.slice(0, 3)}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className='grid grid-cols-7 gap-1 sm:gap-2 md:gap-3'>
            {days.map((day, index) => {
              const content = getContentForDate(day as number);
              const dateKey = day
                ? formatDateKey(
                    currentDate.getFullYear(),
                    currentDate.getMonth(),
                    day
                  )
                : null;

              return (
                <div
                  key={index}
                  className={`relative group aspect-square flex flex-col rounded-lg sm:rounded-2xl cursor-pointer transition-all duration-300 border-2 ${
                    !day
                      ? 'border-transparent opacity-40'
                      : isToday(day)
                      ? 'border-purple-500 bg-gradient-to-br from-purple-600/40 to-pink-600/40 shadow-lg shadow-purple-500/25 ring-2 ring-purple-400/30'
                      : isPastDate(day)
                      ? content.length > 0
                        ? 'border-white/20 bg-white/5 opacity-70 hover:opacity-90 hover:border-white/30 cursor-pointer'
                        : 'border-white/10 bg-white/5 opacity-50 cursor-not-allowed'
                      : content.length > 0
                      ? 'border-white/30 bg-white/10 hover:bg-white/20 hover:border-white/50 hover:scale-105 hover:shadow-xl hover:shadow-white/10 cursor-pointer'
                      : 'border-white/10 hover:border-white/20 hover:bg-white/5 hover:scale-102'
                  }`}
                  onMouseEnter={() => day && setHoveredDate(dateKey)}
                  onMouseLeave={() => setHoveredDate(null)}
                  onClick={() => handleDateClick(day as number)}
                >
                  {day && (
                    <>
                      {/* Day Number */}
                      <div className='flex-1 flex items-center justify-center p-1 sm:p-2'>
                        <span
                          className={`text-base sm:text-xl font-bold transition-all duration-200 ${
                            isToday(day)
                              ? 'text-white text-lg sm:text-2xl drop-shadow-lg'
                              : isPastDate(day)
                              ? content.length > 0
                                ? 'text-slate-300 group-hover:text-white'
                                : 'text-slate-500'
                              : content.length > 0
                              ? 'text-white group-hover:text-lg sm:group-hover:text-2xl group-hover:drop-shadow-lg'
                              : 'text-slate-400 group-hover:text-white group-hover:text-base sm:group-hover:text-xl'
                          }`}
                        >
                          {day}
                        </span>
                      </div>

                      {/* Content Indicators */}
                      {content.length > 0 && (
                        <div className='absolute bottom-1 sm:bottom-3 left-1/2 transform -translate-x-1/2 space-y-1 sm:space-y-2'>
                          {/* Platform Icons Row */}
                          <div className='flex items-center justify-center space-x-0.5 sm:space-x-1'>
                            {content.slice(0, 4).map((item, idx) => {
                              const IconComponent =
                                PlatformIcons[item.platform as Platform['id']];
                              return (
                                <div
                                  key={idx}
                                  className={`w-4 h-4 sm:w-6 sm:h-6 rounded-md sm:rounded-lg bg-gradient-to-r ${
                                    platformColors[
                                      item.platform as Platform['id']
                                    ] || 'from-gray-500 to-gray-600'
                                  } flex items-center justify-center shadow-lg border border-white/30 transition-all duration-200 hover:scale-125 group-hover:shadow-xl`}
                                >
                                  {IconComponent && <IconComponent />}
                                </div>
                              );
                            })}
                            {content.length > 4 && (
                              <div className='w-4 h-4 sm:w-6 sm:h-6 rounded-md sm:rounded-lg bg-white/30 backdrop-blur-sm flex items-center justify-center border border-white/30 shadow-lg'>
                                <span className='text-[8px] sm:text-xs text-white font-bold'>
                                  +{content.length - 4}
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Status indicators */}
                          <div className='flex justify-center space-x-0.5 sm:space-x-1'>
                            {content.slice(0, 6).map((item, idx) => (
                              <div
                                key={idx}
                                className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${getStatusColor(
                                  item.status
                                )} shadow-sm border border-white/30 group-hover:animate-pulse`}
                              ></div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Hover Effect Overlay */}
                      {hoveredDate === dateKey && (
                        <div className='absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg sm:rounded-2xl border-2 border-purple-400/50 animate-pulse' />
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Enhanced Stats Footer */}
        <div className='p-4 sm:p-6 md:p-8 bg-gradient-to-r from-white/5 to-white/10 border-t border-white/10'>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6'>
            <div className='text-center group cursor-pointer transition-all duration-300 hover:scale-110 bg-white/5 rounded-xl sm:rounded-2xl p-3 sm:p-4 hover:bg-white/10'>
              <div className='text-2xl sm:text-3xl md:text-4xl font-bold text-white group-hover:text-purple-400 transition-colors mb-1 sm:mb-2 drop-shadow-lg'>
                {totalPosts}
              </div>
              <div className='text-xs sm:text-sm text-slate-400 group-hover:text-slate-300 font-medium'>
                Total Posts
              </div>
            </div>
            <div className='text-center group cursor-pointer transition-all duration-300 hover:scale-110 bg-white/5 rounded-xl sm:rounded-2xl p-3 sm:p-4 hover:bg-white/10'>
              <div className='text-2xl sm:text-3xl md:text-4xl font-bold text-emerald-400 group-hover:text-emerald-300 transition-colors mb-1 sm:mb-2 drop-shadow-lg'>
                {scheduledPosts}
              </div>
              <div className='text-xs sm:text-sm text-slate-400 group-hover:text-slate-300 font-medium'>
                Scheduled
              </div>
            </div>
            <div className='text-center group cursor-pointer transition-all duration-300 hover:scale-110 bg-white/5 rounded-xl sm:rounded-2xl p-3 sm:p-4 hover:bg-white/10'>
              <div className='text-2xl sm:text-3xl md:text-4xl font-bold text-amber-400 group-hover:text-amber-300 transition-colors mb-1 sm:mb-2 drop-shadow-lg'>
                {draftPosts}
              </div>
              <div className='text-xs sm:text-sm text-slate-400 group-hover:text-slate-300 font-medium'>
                Drafts
              </div>
            </div>
            <div className='text-center group cursor-pointer transition-all duration-300 hover:scale-110 bg-white/5 rounded-xl sm:rounded-2xl p-3 sm:p-4 hover:bg-white/10'>
              <div className='text-2xl sm:text-3xl md:text-4xl font-bold text-purple-400 group-hover:text-purple-300 transition-colors mb-1 sm:mb-2 drop-shadow-lg'>
                {activeDays}
              </div>
              <div className='text-xs sm:text-sm text-slate-400 group-hover:text-slate-300 font-medium'>
                Active Days
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Details Modal */}
      <ContentModal
        isOpen={isContentModalOpen}
        onClose={closeModals}
        selectedDate={selectedDate}
        content={selectedDate ? scheduledContent[selectedDate] || [] : []}
        onCreateContent={onCreateContent}
        animatingOut={animatingOut}
      />

      {/* Empty Date Modal */}
      <EmptyDateModal
        isOpen={isEmptyModalOpen}
        onClose={closeModals}
        selectedDate={selectedDate}
        onCreateContent={onCreateContent}
        animatingOut={animatingOut}
      />
    </>
  );
}
