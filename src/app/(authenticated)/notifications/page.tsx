'use client';

import React, { useState, useEffect } from 'react';
import { useNotifications } from '@/src/context/NotificationContext';
import {
  Notification,
  NotificationType,
  NotificationPriority,
  NotificationStatus,
  NotificationFilters,
} from '@/src/types/notification';
import {
  FiBell,
  FiAlertCircle,
  FiTrendingUp,
  FiCalendar,
  FiClock,
  FiRefreshCw,
  FiFilter,
  FiX,
} from 'react-icons/fi';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'react-hot-toast';
import router from 'next/router';

const getNotificationIcon = (type: NotificationType) => {
  switch (type) {
    case NotificationType.SYSTEM:
      return (
        <FiAlertCircle className='h-5 w-5 text-blue-500 dark:text-blue-400' />
      );
    case NotificationType.PERFORMANCE:
      return (
        <FiTrendingUp className='h-5 w-5 text-green-500 dark:text-green-400' />
      );
    case NotificationType.TREND:
      return (
        <FiTrendingUp className='h-5 w-5 text-orange-500 dark:text-orange-400' />
      );
    case NotificationType.SCHEDULE:
      return (
        <FiCalendar className='h-5 w-5 text-indigo-500 dark:text-indigo-400' />
      );
    default:
      return <FiBell className='h-5 w-5 text-gray-500 dark:text-slate-400' />;
  }
};

const getPriorityColor = (priority: NotificationPriority) => {
  switch (priority) {
    case NotificationPriority.HIGH:
      return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-200 dark:border-red-700';
    case NotificationPriority.MEDIUM:
      return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-700';
    case NotificationPriority.LOW:
      return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-700';
    default:
      return 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-300 border-gray-200 dark:border-slate-600';
  }
};

const getNotificationStyle = (
  type: NotificationType,
  priority: NotificationPriority,
  status: NotificationStatus
) => {
  const baseStyle =
    'p-4 hover:bg-gradient-to-r transition-all duration-200 border-b border-theme-primary/40 last:border-b-0 group cursor-pointer';

  if (status === NotificationStatus.UNREAD) {
    return `${baseStyle} bg-blue-50/30 dark:bg-blue-900/10`;
  }

  if (priority === NotificationPriority.HIGH) {
    return `${baseStyle} bg-red-50/30 dark:bg-red-900/10 hover:from-red-50/50 hover:to-red-50/30 dark:hover:from-red-900/20 dark:hover:to-red-900/10`;
  }

  switch (type) {
    case NotificationType.SCHEDULE:
      return `${baseStyle} bg-indigo-50/30 dark:bg-indigo-900/10 hover:from-indigo-50/50 hover:to-indigo-50/30 dark:hover:from-indigo-900/20 dark:hover:to-indigo-900/10`;
    case NotificationType.PERFORMANCE:
      return `${baseStyle} bg-green-50/30 dark:bg-green-900/10 hover:from-green-50/50 hover:to-green-50/30 dark:hover:from-green-900/20 dark:hover:to-green-900/10`;
    default:
      return `${baseStyle} hover:from-theme-hover hover:to-theme-secondary/50`;
  }
};

export default function NotificationsPage() {
  const {
    notifications,
    unreadCount,
    loading,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    refreshNotifications,
  } = useNotifications();

  const [filters, setFilters] = useState<NotificationFilters>({});
  const [showFilters, setShowFilters] = useState(false);
  const [selectedNotifications, setSelectedNotifications] = useState<
    Set<string>
  >(new Set());

  // Only fetch on initial load, not on every filter/page change
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    fetchNotifications();
  }, []); // run once on mount

  const handleNotificationClick = async (notification: Notification) => {
    if (notification.status === NotificationStatus.UNREAD) {
      await markAsRead(notification._id);
    }

    const data = notification.data as Record<string, unknown> | undefined;

    const rawContentId = data?.['contentId'];
    const contentId =
      typeof rawContentId === 'string'
        ? rawContentId
        : typeof rawContentId === 'object' &&
          rawContentId &&
          '_id' in rawContentId
        ? String((rawContentId as { _id?: unknown })._id ?? '')
        : undefined;

    if (contentId) {
      router.push(`/content/${contentId}`);
      return;
    }

    const linkValue = data ? data['link'] : undefined;
    if (typeof linkValue === 'string') {
      const link = linkValue;
      if (link.startsWith('/')) {
        router.push(link);
      } else {
        window.open(link, '_blank');
      }
    }
  };

  const handleRefresh = async () => {
    await refreshNotifications();
    toast.success('Notifications refreshed');
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
    setSelectedNotifications(new Set());
  };

  const handleSelectNotification = (notificationId: string) => {
    const newSelected = new Set(selectedNotifications);
    if (newSelected.has(notificationId)) {
      newSelected.delete(notificationId);
    } else {
      newSelected.add(notificationId);
    }
    setSelectedNotifications(newSelected);
  };

  const handleMarkSelectedAsRead = async () => {
    try {
      await Promise.all(
        Array.from(selectedNotifications).map((id) => markAsRead(id))
      );
      setSelectedNotifications(new Set());
      toast.success('Selected notifications marked as read');
    } catch (error: unknown) {
      console.error('Failed to mark selected notifications as read', error);
      toast.error('Failed to mark selected notifications as read');
    }
  };

  // Client-side filtering instead of server-side
  const filteredNotifications = notifications.filter((notification) => {
    if (filters.type && notification.type !== filters.type) return false;
    if (filters.status && notification.status !== filters.status) return false;
    if (filters.priority && notification.priority !== filters.priority)
      return false;
    return true;
  });

  const groupedNotifications = filteredNotifications.reduce(
    (acc, notification) => {
      const type = notification.type;
      if (!acc[type]) {
        acc[type] = [];
      }
      acc[type].push(notification);
      return acc;
    },
    {} as Record<NotificationType, Notification[]>
  );

  return (
    <div className='min-h-screen bg-theme-background'>
      <div className='max-w-6xl mx-auto px-4 py-6 sm:py-8'>
        {/* Header */}
        <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-6 sm:mb-8'>
          <div>
            <h1 className='text-2xl sm:text-3xl font-bold text-theme-primary mb-1 sm:mb-2'>
              Notifications
            </h1>
            <p className='text-theme-secondary text-sm sm:text-base'>
              {unreadCount > 0
                ? `${unreadCount} unread notification${
                    unreadCount !== 1 ? 's' : ''
                  }`
                : 'All caught up!'}
            </p>
          </div>
          <div className='flex flex-wrap items-center gap-2'>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className='flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 bg-theme-card hover:bg-theme-hover rounded-lg border border-theme-primary transition-colors duration-200 text-sm'
            >
              <FiFilter className='h-4 w-4' />
              <span>Filters</span>
            </button>
            <button
              onClick={handleRefresh}
              className='flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 bg-theme-card hover:bg-theme-hover rounded-lg border border-theme-primary transition-colors duration-200 text-sm'
            >
              <FiRefreshCw
                className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`}
              />
              <span>Refresh</span>
            </button>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className='px-3 py-2 sm:px-4 sm:py-2 bg-accent-primary hover:bg-accent-secondary text-white rounded-lg transition-colors duration-200 text-sm'
              >
                Mark all as read
              </button>
            )}
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className='mb-6 p-4 bg-theme-card rounded-lg border border-theme-primary'>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              <div>
                <label className='block text-sm font-medium text-theme-primary mb-2'>
                  Type
                </label>
                <select
                  value={filters.type || ''}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      type: (e.target.value as NotificationType) || undefined,
                    }))
                  }
                  className='w-full px-3 py-2 bg-theme-background border border-theme-primary rounded-lg focus:ring-2 focus:ring-accent-primary focus:border-transparent'
                >
                  <option value=''>All types</option>
                  {Object.values(NotificationType).map((type) => (
                    <option key={type} value={type}>
                      {type.replace('_', ' ')}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className='block text-sm font-medium text-theme-primary mb-2'>
                  Status
                </label>
                <select
                  value={filters.status || ''}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      status:
                        (e.target.value as NotificationStatus) || undefined,
                    }))
                  }
                  className='w-full px-3 py-2 bg-theme-background border border-theme-primary rounded-lg focus:ring-2 focus:ring-accent-primary focus:border-transparent'
                >
                  <option value=''>All statuses</option>
                  <option value={NotificationStatus.UNREAD}>Unread</option>
                  <option value={NotificationStatus.READ}>Read</option>
                </select>
              </div>
              <div>
                <label className='block text-sm font-medium text-theme-primary mb-2'>
                  Priority
                </label>
                <select
                  value={filters.priority || ''}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      priority:
                        (e.target.value as NotificationPriority) || undefined,
                    }))
                  }
                  className='w-full px-3 py-2 bg-theme-background border border-theme-primary rounded-lg focus:ring-2 focus:ring-accent-primary focus:border-transparent'
                >
                  <option value=''>All priorities</option>
                  {Object.values(NotificationPriority).map((priority) => (
                    <option key={priority} value={priority}>
                      {priority}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className='flex justify-end mt-4'>
              <button
                onClick={() => setFilters({})}
                className='px-3 py-2 text-theme-secondary hover:text-theme-primary transition-colors duration-200 text-sm'
              >
                Clear filters
              </button>
            </div>
          </div>
        )}

        {/* Bulk Actions */}
        {selectedNotifications.size > 0 && (
          <div className='mb-4 p-3 bg-accent-primary/10 border border-accent-primary/20 rounded-lg'>
            <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2'>
              <span className='text-sm text-theme-primary'>
                {selectedNotifications.size} notification
                {selectedNotifications.size !== 1 ? 's' : ''} selected
              </span>
              <div className='flex items-center gap-2'>
                <button
                  onClick={handleMarkSelectedAsRead}
                  className='px-3 py-1.5 bg-accent-primary hover:bg-accent-secondary text-white text-sm rounded transition-colors duration-200'
                >
                  Mark as read
                </button>
                <button
                  onClick={() => setSelectedNotifications(new Set())}
                  className='p-1.5 text-theme-secondary hover:text-theme-primary transition-colors duration-200'
                >
                  <FiX className='h-4 w-4' />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Notifications List */}
        <div className='bg-theme-card rounded-lg border border-theme-primary overflow-hidden'>
          {loading && notifications.length === 0 ? (
            <div className='p-8 text-center'>
              <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-accent-primary mx-auto mb-4'></div>
              <p className='text-theme-secondary'>Loading notifications...</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className='p-8 text-center'>
              <FiBell className='h-16 w-16 text-theme-muted mx-auto mb-4' />
              <h3 className='text-lg font-semibold text-theme-primary mb-2'>
                No notifications yet
              </h3>
              <p className='text-theme-secondary'>
                We&apos;ll notify you when something important happens.
              </p>
            </div>
          ) : (
            <div className='divide-y divide-theme-primary/40'>
              {Object.entries(groupedNotifications).map(
                ([type, typeNotifications]) => (
                  <div key={type}>
                    <div className='px-6 py-3 bg-theme-secondary/30'>
                      <h3 className='text-sm font-semibold text-theme-secondary uppercase tracking-wider'>
                        {type.toLowerCase().replace('_', ' ')}
                      </h3>
                    </div>
                    {typeNotifications.map((notification) => (
                      <div
                        key={notification._id}
                        className={getNotificationStyle(
                          notification.type,
                          notification.priority,
                          notification.status
                        )}
                        onClick={() => handleNotificationClick(notification)}
                      >
                        <div className='flex items-start space-x-3'>
                          <div className='flex-shrink-0 mt-1'>
                            <input
                              type='checkbox'
                              checked={selectedNotifications.has(
                                notification._id
                              )}
                              onChange={(e) => {
                                e.stopPropagation();
                                handleSelectNotification(notification._id);
                              }}
                              className='h-4 w-4 text-accent-primary border-theme-primary rounded focus:ring-accent-primary'
                            />
                          </div>
                          <div className='flex-shrink-0 mt-1'>
                            {getNotificationIcon(notification.type)}
                          </div>
                          <div className='flex-1 min-w-0'>
                            <div className='flex items-start justify-between gap-2'>
                              <p className='text-sm font-semibold text-theme-primary group-hover:text-accent-primary transition-colors duration-200 line-clamp-2 flex-1'>
                                {notification.title}
                              </p>
                              <div className='flex items-center space-x-2'>
                                <span
                                  className={`px-2 py-0.5 rounded-full text-xs font-medium border flex-shrink-0 ${getPriorityColor(
                                    notification.priority
                                  )}`}
                                >
                                  {notification.priority}
                                </span>
                                {notification.status ===
                                  NotificationStatus.UNREAD && (
                                  <span className='w-2 h-2 bg-blue-500 rounded-full flex-shrink-0'></span>
                                )}
                              </div>
                            </div>
                            <p className='text-sm text-theme-secondary mt-1 line-clamp-2'>
                              {notification.message}
                            </p>
                            <div className='flex items-center justify-between mt-2'>
                              <div className='flex items-center space-x-2'>
                                <FiClock className='h-3 w-3 text-theme-muted' />
                                <p className='text-xs text-theme-secondary'>
                                  {formatDistanceToNow(
                                    new Date(notification.createdAt),
                                    { addSuffix: true }
                                  )}
                                </p>
                              </div>
                              {notification.status ===
                                NotificationStatus.UNREAD && (
                                <span className='text-xs text-blue-500 font-medium'>
                                  New
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )
              )}
            </div>
          )}
        </div>

        {/* Summary */}
        {notifications.length > 0 && (
          <div className='mt-4 sm:mt-6 text-sm text-theme-secondary'>
            Showing {filteredNotifications.length} notification
            {filteredNotifications.length !== 1 ? 's' : ''}
            {filters.type || filters.status || filters.priority
              ? ' (filtered)'
              : ''}
          </div>
        )}
      </div>
    </div>
  );
}
