import { useState, ReactElement } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import ContentModal from './content-modal';
import EmptyDateModal from './emptyDateModal';
import { Platform } from '@/src/types/modal';
import {
  ScheduledContent,
  ScheduledContentItem,
} from '@/src/context/CalendarContext';
import RescheduleModal from './reschedule-modal';
import { contentAPI } from '@/src/lib/api';
import { useCalendar } from '@/src/context/CalendarContext';
import { useUserData } from '@/src/context/UserDataContext';
import { useNotifications } from '@/src/context/NotificationContext';
import {
  NotificationPriority,
  NotificationType,
} from '@/src/types/notification';
import toast from 'react-hot-toast';
import DeleteConfirmationModal from '../content/delete-confirmation-modal';
import ContentEditModal from '../content/content-edit-modal';

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

  // Delete and Edit modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [contentToDelete, setContentToDelete] =
    useState<ScheduledContentItem | null>(null);
  const [editingContent, setEditingContent] =
    useState<ScheduledContentItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Drag state
  const [dragSourceDate, setDragSourceDate] = useState<string | null>(null);
  const [pendingTargetDate, setPendingTargetDate] = useState<string | null>(
    null
  );
  const [rescheduleOpen, setRescheduleOpen] = useState(false);
  const [pastDateModalOpen, setPastDateModalOpen] = useState(false);
  const [pastDateTarget, setPastDateTarget] = useState<string>('');
  const [originalDateISO, setOriginalDateISO] = useState<string>('');

  const {
    moveScheduledContentOptimistic,
    restoreScheduledContent,
    loadScheduledContent,
    deleteScheduledContent,
  } = useCalendar();
  const { addLocalNotification } = useNotifications();
  const { removeContent, updateContent } = useUserData();

  const PlatformIcons: Record<Platform['id'], () => ReactElement> = {
    instagram: () => (
      <div className='w-3 h-3 sm:w-4 sm:h-4 bg-gradient-to-r from-pink-500 to-orange-500 rounded-full shadow-sm' />
    ),
    youtube: () => (
      <div className='w-3 h-3 sm:w-4 sm:h-4 bg-red-500 rounded-full shadow-sm' />
    ),
    twitter: () => (
      <div className='w-3 h-3 sm:w-4 sm:h-4 bg-blue-400 rounded-full shadow-sm' />
    ),
    linkedin: () => (
      <div className='w-3 h-3 sm:w-4 sm:h-4 bg-blue-600 rounded-full shadow-sm' />
    ),
    tiktok: () => (
      <div className='w-3 h-3 sm:w-4 sm:h-4 bg-gradient-to-r from-black to-pink-500 rounded-full shadow-sm' />
    ),
    facebook: () => (
      <div className='w-3 h-3 sm:w-4 sm:h-4 bg-blue-600 rounded-full shadow-sm' />
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
    const content = (scheduledContent[dateKey] || []).filter(
      (item) => item.status === 'scheduled'
    );

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
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    if (currentYear < today.getFullYear()) return true;
    if (currentYear > today.getFullYear()) return false;

    if (currentMonth < today.getMonth()) return true;
    if (currentMonth > today.getMonth()) return false;

    return day < today.getDate();
  };

  const navigateMonth = (direction: number) => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + direction, 1)
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-emerald-500';
      case 'draft':
        return 'bg-amber-500';
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

    console.log('📅 Date clicked:', dateKey);
    setSelectedDate(dateKey);

    const content = getContentForDate(day);

    if (content.length > 0) {
      console.log('📅 Opening content modal for:', dateKey);
      setIsContentModalOpen(true);
      if (onDateSelect) {
        onDateSelect(dateKey);
      }
    } else {
      console.log('📅 Opening empty date modal for:', dateKey);
      setIsEmptyModalOpen(true);
    }
  };

  const closeModals = () => {
    setIsContentModalOpen(false);
    setIsEmptyModalOpen(false);
    setSelectedDate(null);
  };

  // Delete and Edit handlers
  const handleDeleteClick = (item: ScheduledContentItem) => {
    setContentToDelete(item);
    setDeleteModalOpen(true);
    setIsContentModalOpen(false); // Close content modal
  };

  const handleEditClick = (item: ScheduledContentItem) => {
    setEditingContent(item);
    setEditModalOpen(true);
    setIsContentModalOpen(false); // Close content modal
  };

  const handleDeleteConfirm = async () => {
    if (!contentToDelete) return;

    setIsDeleting(true);
    try {
      // Optimistic: remove from calendar and global cache immediately
      const id = contentToDelete._id || contentToDelete.id;
      const dateKey = selectedDate || '';
      deleteScheduledContent(id, dateKey);
      removeContent(id);

      await contentAPI.delete(id);
      toast.success('Content deleted successfully');
      setDeleteModalOpen(false);
      setContentToDelete(null);
      // Rebuild calendar from cache to ensure consistency
      await loadScheduledContent();
    } catch (error) {
      console.error('Failed to delete content:', error);
      toast.error('Failed to delete content');
      // Rollback calendar state if needed
      try {
        // If needed, trigger a full reload from cache
        await loadScheduledContent();
      } catch {}
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
    setContentToDelete(null);
  };

  const handleEditSuccess = async () => {
    // Rebuild calendar from latest global cache to drop items that are no longer scheduled
    await loadScheduledContent();
    setEditModalOpen(false);
    setEditingContent(null);
    toast.success('Content updated successfully');
  };

  const handleEditCancel = () => {
    setEditModalOpen(false);
    setEditingContent(null);
  };

  // Wrapper function to close content modal and open content creation modal
  const handleCreateContent = () => {
    setIsContentModalOpen(false); // Close the content modal
    if (onCreateContent) {
      onCreateContent(); // Call the original onCreateContent function
    }
  };

  const onDragStart = (dateKey: string) => {
    setDragSourceDate(dateKey);
    // pick first item time as baseline for rescheduling dialog
    const first = (scheduledContent[dateKey] || [])[0];
    if (first?.scheduledDate) setOriginalDateISO(first.scheduledDate);
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const onDrop = (targetDateKey: string) => {
    if (!dragSourceDate || dragSourceDate === targetDateKey) return;

    // Check if target date is in the past
    const isTargetDateInPast = () => {
      const today = new Date();
      const targetDate = new Date(targetDateKey);

      // Set time to beginning of day for accurate comparison
      today.setHours(0, 0, 0, 0);
      targetDate.setHours(0, 0, 0, 0);

      return targetDate < today;
    };

    if (isTargetDateInPast()) {
      // Show past date modal instead of reschedule modal
      setPastDateTarget(targetDateKey);
      setPastDateModalOpen(true);
      // Clear drag state
      setDragSourceDate(null);
      setPendingTargetDate(null);
      return;
    }

    setPendingTargetDate(targetDateKey);
    setRescheduleOpen(true);
  };

  const performReschedule = async (newISO: string) => {
    const sourceDateKey = dragSourceDate || '';
    const targetDateKey = pendingTargetDate || '';
    if (!sourceDateKey || !targetDateKey) return;

    // Optimistic update first - also reflect status as scheduled in global cache
    const snapshot = moveScheduledContentOptimistic(
      sourceDateKey,
      targetDateKey,
      newISO
    );
    const sourceItems = scheduledContent[sourceDateKey] || [];
    sourceItems.forEach((item) => {
      const id = item._id || item.id;
      if (!id) return;
      updateContent(id, {
        status: 'scheduled',
        metadata: {
          scheduledDate: newISO,
        } as unknown as import('@/src/types/content').Content['metadata'],
      });
    });

    try {
      const sourceItems = scheduledContent[sourceDateKey] || [];
      const calls = sourceItems.map((item) =>
        contentAPI.updateSchedule(item._id || item.id, {
          scheduledDate: newISO,
        })
      );
      await Promise.all(calls);

      // Sync global cache so other pages reflect immediately
      sourceItems.forEach((item) => {
        const id = item._id || item.id;
        if (!id) return;
        updateContent(id, {
          status: 'scheduled',
          metadata: {
            scheduledDate: newISO,
          } as unknown as import('@/src/types/content').Content['metadata'],
        });
      });

      // Add a local notification for the reschedule (aggregated toast will handle UX)
      if (addLocalNotification && sourceItems.length > 0) {
        const titles = sourceItems
          .map((i) => i.title)
          .slice(0, 2)
          .join(', ');
        const more =
          sourceItems.length > 2 ? ` and ${sourceItems.length - 2} more` : '';
        addLocalNotification({
          type: NotificationType.SCHEDULE,
          title: 'Content rescheduled',
          message: `${titles}${more} moved to ${new Date(
            newISO
          ).toLocaleString()}`,
          priority: NotificationPriority.MEDIUM,
          data: {
            scheduledDate: newISO,
            contentIds: sourceItems.map((i) => i._id || i.id),
            fromDate: sourceDateKey,
            toDate: targetDateKey,
          },
        });
      }
      // Optionally refresh from cache source if needed
      // await loadScheduledContent();
    } catch (err) {
      console.error('Failed to persist reschedule, restoring snapshot', err);
      if (snapshot) restoreScheduledContent(snapshot);
    } finally {
      setRescheduleOpen(false);
      setDragSourceDate(null);
      setPendingTargetDate(null);
    }
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
      <div className='relative bg-theme-card backdrop-blur-lg border border-theme-primary rounded-xl sm:rounded-2xl lg:rounded-3xl overflow-hidden shadow-xl sm:shadow-2xl'>
        {/* Header */}
        <div className='p-4 sm:p-6 lg:p-8 bg-gradient-to-r from-accent-primary/10 to-accent-secondary/10 border-b border-theme-primary'>
          {/* Mobile Header Layout */}
          <div className='block sm:hidden mb-4'>
            <div className='flex items-center justify-between mb-4'>
              <h2 className='text-xl font-bold text-theme-primary flex items-center space-x-2'>
                <div className='p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg shadow-lg'>
                  <Calendar className='w-5 h-5 text-white' />
                </div>
                <span>Calendar</span>
              </h2>

              <div className='flex items-center space-x-2 bg-theme-tertiary rounded-xl px-3 py-2 backdrop-blur-sm border border-theme-primary'>
                <button
                  onClick={() => navigateMonth(-1)}
                  className='p-1 hover:bg-theme-hover rounded-lg transition-all text-theme-secondary hover:text-theme-primary hover:scale-110 active:scale-95'
                >
                  <ChevronLeft className='w-4 h-4' />
                </button>

                <h3 className='text-sm font-semibold text-theme-primary min-w-[100px] text-center'>
                  {monthYear}
                </h3>

                <button
                  onClick={() => navigateMonth(1)}
                  className='p-1 hover:bg-theme-hover rounded-lg transition-all text-theme-secondary hover:text-theme-primary hover:scale-110 active:scale-95'
                >
                  <ChevronRight className='w-4 h-4' />
                </button>
              </div>
            </div>

            <p className='text-xs text-theme-secondary'>
              Manage your social media schedule
            </p>
          </div>

          {/* Desktop Header Layout */}
          <div className='hidden sm:flex flex-col lg:flex-row items-start lg:items-center justify-between mb-4 lg:mb-6'>
            <h2 className='text-2xl lg:text-3xl font-bold text-theme-primary flex items-center space-x-3 mb-4 lg:mb-0'>
              <div className='p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl shadow-lg'>
                <Calendar className='w-7 h-7 text-white' />
              </div>
              <div>
                <span>Content Calendar</span>
                <p className='text-sm font-normal text-theme-secondary mt-1'>
                  Manage your social media schedule
                </p>
              </div>
            </h2>

            <div className='flex items-center space-x-4'>
              <div className='flex items-center space-x-2 bg-theme-tertiary rounded-2xl px-6 py-3 backdrop-blur-sm border border-theme-primary'>
                <button
                  onClick={() => navigateMonth(-1)}
                  className='p-2 hover:bg-theme-hover rounded-xl transition-all text-theme-secondary hover:text-theme-primary hover:scale-110 active:scale-95'
                >
                  <ChevronLeft className='w-5 h-5' />
                </button>

                <h3 className='text-xl font-semibold text-theme-primary min-w-[180px] text-center'>
                  {monthYear}
                </h3>

                <button
                  onClick={() => navigateMonth(1)}
                  className='p-2 hover:bg-theme-hover rounded-xl transition-all text-theme-secondary hover:text-theme-primary hover:scale-110 active:scale-95'
                >
                  <ChevronRight className='w-5 h-5' />
                </button>
              </div>
            </div>
          </div>

          {/* Enhanced Legend */}
          <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-3 sm:space-y-0'>
            <div className='flex flex-wrap items-center gap-3 sm:gap-6 text-xs sm:text-sm'>
              <div className='flex items-center space-x-2 group cursor-pointer'>
                <div className='w-3 h-3 rounded-full bg-emerald-500 group-hover:animate-pulse shadow-lg'></div>
                <span className='text-theme-secondary group-hover:text-theme-primary transition-colors'>
                  Scheduled
                </span>
              </div>
              <div className='flex items-center space-x-2 group cursor-pointer'>
                <div className='w-3 h-3 rounded-full bg-amber-500 group-hover:animate-pulse shadow-lg'></div>
                <span className='text-theme-secondary group-hover:text-theme-primary transition-colors'>
                  Draft
                </span>
              </div>
              <div className='flex items-center space-x-2 group cursor-pointer'>
                <div className='w-3 h-3 rounded-full bg-blue-500 group-hover:animate-pulse shadow-lg'></div>
                <span className='text-theme-secondary group-hover:text-theme-primary transition-colors'>
                  Published
                </span>
              </div>
            </div>
            <div className='text-xs text-theme-muted bg-theme-tertiary px-3 py-1 rounded-lg'>
              Click on any date to view or add content
            </div>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className='p-3 sm:p-6 lg:p-8'>
          {/* Day Headers */}
          <div className='grid grid-cols-7 gap-2 sm:gap-3 lg:gap-4 mb-4 sm:mb-6'>
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
                className='text-center text-theme-secondary font-semibold py-2 sm:py-3 lg:py-4 text-xs sm:text-sm lg:text-base uppercase tracking-wider bg-theme-tertiary rounded-lg sm:rounded-xl'
              >
                {day.slice(0, 3)}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className='grid grid-cols-7 gap-2 sm:gap-3 lg:gap-4'>
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
                  className={`relative group min-h-[60px] sm:min-h-[80px] lg:min-h-[100px] flex flex-col rounded-lg sm:rounded-xl lg:rounded-2xl cursor-pointer transition-all duration-300 border-2 ${
                    !day
                      ? 'border-transparent opacity-40'
                      : isToday(day)
                      ? 'border-purple-600 bg-gradient-to-br from-purple-700 to-pink-700 shadow-xl shadow-purple-500/40 ring-4 ring-purple-400/50'
                      : isPastDate(day)
                      ? content.length > 0
                        ? 'border-theme-primary bg-theme-tertiary opacity-70 hover:opacity-90 hover:border-theme-primary cursor-pointer'
                        : 'border-theme-secondary bg-theme-tertiary opacity-50 cursor-not-allowed'
                      : content.length > 0
                      ? 'border-theme-primary bg-theme-tertiary hover:bg-theme-hover hover:border-theme-primary hover:scale-105 hover:shadow-xl hover:shadow-theme-lg cursor-pointer'
                      : 'border-theme-secondary hover:border-theme-primary hover:bg-theme-tertiary hover:scale-102'
                  }`}
                  onMouseEnter={() => day && setHoveredDate(dateKey)}
                  onMouseLeave={() => setHoveredDate(null)}
                  onClick={() => handleDateClick(day as number)}
                  draggable={Boolean(day && content.length > 0)}
                  onDragStart={() => dateKey && onDragStart(dateKey)}
                  onDragOver={onDragOver}
                  onDrop={() => dateKey && onDrop(dateKey)}
                >
                  {day && (
                    <>
                      {/* Day Number */}
                      <div className='flex-1 flex items-center justify-center p-2 sm:p-3'>
                        <span
                          className={`text-lg sm:text-xl lg:text-2xl font-bold transition-all duration-200 ${
                            isToday(day)
                              ? 'text-white text-xl sm:text-2xl lg:text-3xl drop-shadow-lg font-black'
                              : isPastDate(day)
                              ? content.length > 0
                                ? 'text-theme-secondary group-hover:text-theme-primary'
                                : 'text-theme-muted'
                              : content.length > 0
                              ? 'text-theme-primary group-hover:text-lg sm:group-hover:text-2xl lg:group-hover:text-3xl group-hover:drop-shadow-lg'
                              : 'text-theme-secondary group-hover:text-theme-primary group-hover:text-lg sm:group-hover:text-xl lg:group-hover:text-2xl'
                          }`}
                        >
                          {day}
                        </span>
                      </div>

                      {/* Content Indicators */}
                      {content.length > 0 && (
                        <div className='absolute bottom-2 sm:bottom-3 lg:bottom-4 left-1/2 transform -translate-x-1/2 space-y-1 sm:space-y-2'>
                          {/* Platform Icons Row */}
                          <div className='flex items-center justify-center space-x-1 sm:space-x-1.5'>
                            {content.slice(0, 3).map((item, idx) => {
                              const IconComponent =
                                PlatformIcons[item.platform as Platform['id']];
                              return (
                                <div
                                  key={idx}
                                  className={`w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 rounded-md sm:rounded-lg bg-gradient-to-r ${
                                    platformColors[
                                      item.platform as Platform['id']
                                    ] || 'from-gray-500 to-gray-600'
                                  } flex items-center justify-center shadow-lg border border-theme-inverse/30 transition-all duration-200 hover:scale-125 group-hover:shadow-xl`}
                                >
                                  {IconComponent && <IconComponent />}
                                </div>
                              );
                            })}
                            {content.length > 3 && (
                              <div className='w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 rounded-md sm:rounded-lg bg-theme-tertiary backdrop-blur-sm flex items-center justify-center border border-theme-primary shadow-lg'>
                                <span className='text-[10px] sm:text-xs lg:text-sm text-theme-primary font-bold'>
                                  +{content.length - 3}
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Status indicators */}
                          <div className='flex justify-center space-x-1 sm:space-x-1.5'>
                            {content.slice(0, 4).map((item, idx) => (
                              <div
                                key={idx}
                                className={`w-2 h-2 sm:w-2.5 sm:h-2.5 lg:w-3 lg:h-3 rounded-full ${getStatusColor(
                                  item.status
                                )} shadow-sm border border-theme-inverse/30 group-hover:animate-pulse`}
                              ></div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Hover Effect Overlay */}
                      {hoveredDate === dateKey && (
                        <div className='absolute inset-0 bg-gradient-to-br from-accent-primary/20 to-accent-secondary/20 rounded-lg sm:rounded-xl lg:rounded-2xl border-2 border-accent-primary/50 animate-pulse' />
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Enhanced Stats Footer */}
        <div className='p-4 sm:p-6 lg:p-8 bg-gradient-to-r from-theme-tertiary to-theme-secondary border-t border-theme-primary'>
          <div className='grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6'>
            <div className='text-center group cursor-pointer transition-all duration-300 hover:scale-110 bg-theme-card rounded-xl sm:rounded-2xl p-3 sm:p-4 hover:bg-theme-hover'>
              <div className='text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-theme-primary group-hover:text-accent-primary transition-colors mb-1 sm:mb-2 drop-shadow-lg'>
                {totalPosts}
              </div>
              <div className='text-xs sm:text-sm lg:text-base text-theme-secondary group-hover:text-theme-primary font-medium'>
                Total Posts
              </div>
            </div>
            <div className='text-center group cursor-pointer transition-all duration-300 hover:scale-110 bg-theme-card rounded-xl sm:rounded-2xl p-3 sm:p-4 hover:bg-theme-hover'>
              <div className='text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-accent-success group-hover:text-accent-success transition-colors mb-1 sm:mb-2 drop-shadow-lg'>
                {scheduledPosts}
              </div>
              <div className='text-xs sm:text-sm lg:text-base text-theme-secondary group-hover:text-theme-primary font-medium'>
                Scheduled
              </div>
            </div>
            <div className='text-center group cursor-pointer transition-all duration-300 hover:scale-110 bg-theme-card rounded-xl sm:rounded-2xl p-3 sm:p-4 hover:bg-theme-hover'>
              <div className='text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-accent-warning group-hover:text-accent-warning transition-colors mb-1 sm:mb-2 drop-shadow-lg'>
                {draftPosts}
              </div>
              <div className='text-xs sm:text-sm lg:text-base text-theme-secondary group-hover:text-theme-primary font-medium'>
                Drafts
              </div>
            </div>
            <div className='text-center group cursor-pointer transition-all duration-300 hover:scale-110 bg-theme-card rounded-xl sm:rounded-2xl p-3 sm:p-4 hover:bg-theme-hover'>
              <div className='text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-accent-primary group-hover:text-accent-primary transition-colors mb-1 sm:mb-2 drop-shadow-lg'>
                {activeDays}
              </div>
              <div className='text-xs sm:text-sm lg:text-base text-theme-secondary group-hover:text-theme-primary font-medium'>
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
        onCreateContent={handleCreateContent}
        onDeleteClick={handleDeleteClick}
        onEditClick={handleEditClick}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        contentTitle={contentToDelete?.title || ''}
        isDeleting={isDeleting}
      />

      {/* Edit Modal */}
      {editingContent && (
        <ContentEditModal
          isOpen={editModalOpen}
          onClose={handleEditCancel}
          contentId={editingContent.id}
          currentStatus={editingContent.status}
          currentPriority='medium'
          currentScheduledDate={
            selectedDate ? `${selectedDate}T${editingContent.time}:00.000Z` : ''
          }
          contentTitle={editingContent.title}
          onSuccess={handleEditSuccess}
        />
      )}

      {/* Empty Date Modal */}
      <EmptyDateModal
        isOpen={isEmptyModalOpen}
        onClose={closeModals}
        selectedDate={selectedDate}
        onCreateContent={onCreateContent}
      />

      {/* Reschedule Modal */}
      {rescheduleOpen && dragSourceDate && pendingTargetDate && (
        <RescheduleModal
          open={rescheduleOpen}
          onClose={() => {
            setRescheduleOpen(false);
            setDragSourceDate(null);
            setPendingTargetDate(null);
          }}
          fromDateKey={dragSourceDate}
          toDateKey={pendingTargetDate}
          originalDateISO={originalDateISO}
          onConfirm={performReschedule}
        />
      )}

      {/* Past Date Modal */}
      <EmptyDateModal
        isOpen={pastDateModalOpen}
        onClose={() => {
          setPastDateModalOpen(false);
          setPastDateTarget('');
        }}
        selectedDate={pastDateTarget}
      />
    </>
  );
}
