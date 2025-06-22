'use client';

import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotifications } from '@/src/context/NotificationContext';
import {
  Notification,
  NotificationType,
  NotificationPriority,
} from '@/src/types/notification';
import {
  FiBell,
  FiCheck,
  FiSettings,
  FiAlertCircle,
  FiTrendingUp,
  FiCalendar,
  FiZap,
  FiClock,
  FiRefreshCw,
} from 'react-icons/fi';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';

interface NotificationDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

const getNotificationIcon = (type: NotificationType) => {
  switch (type) {
    case NotificationType.SYSTEM:
      return (
        <FiAlertCircle className='h-5 w-5 text-blue-500 dark:text-blue-400' />
      );
    case NotificationType.CONTENT:
      return <FiZap className='h-5 w-5 text-purple-500 dark:text-purple-400' />;
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
  priority: NotificationPriority
) => {
  const baseStyle =
    'p-4 hover:bg-gradient-to-r transition-all duration-200 border-b border-slate-200/40 dark:border-slate-600/40 last:border-b-0 group cursor-pointer';

  if (priority === NotificationPriority.HIGH) {
    return `${baseStyle} bg-red-50/30 dark:bg-red-900/10 hover:from-red-50/50 hover:to-red-50/30 dark:hover:from-red-900/20 dark:hover:to-red-900/10`;
  }

  switch (type) {
    case NotificationType.SCHEDULE:
      return `${baseStyle} bg-indigo-50/30 dark:bg-indigo-900/10 hover:from-indigo-50/50 hover:to-indigo-50/30 dark:hover:from-indigo-900/20 dark:hover:to-indigo-900/10`;
    case NotificationType.CONTENT:
      return `${baseStyle} bg-purple-50/30 dark:bg-purple-900/10 hover:from-purple-50/50 hover:to-purple-50/30 dark:hover:from-purple-900/20 dark:hover:to-purple-900/10`;
    case NotificationType.PERFORMANCE:
      return `${baseStyle} bg-green-50/30 dark:bg-green-900/10 hover:from-green-50/50 hover:to-green-50/30 dark:hover:from-green-900/20 dark:hover:to-green-900/10`;
    default:
      return `${baseStyle} hover:from-slate-50 hover:to-indigo-50/50 dark:hover:from-slate-800 dark:hover:to-slate-700`;
  }
};

export default function NotificationDropdown({
  isOpen,
  onClose,
}: NotificationDropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    refreshNotifications,
  } = useNotifications();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleNotificationClick = async (notification: Notification) => {
    if (notification.status === 'UNREAD') {
      await markAsRead(notification._id);
    }
    if (notification.metadata?.link) {
      window.location.href = notification.metadata.link;
    }
  };

  const handleRefresh = async () => {
    await refreshNotifications();
  };

  // Group notifications by type
  const groupedNotifications = notifications.reduce((acc, notification) => {
    const type = notification.type;
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push(notification);
    return acc;
  }, {} as Record<NotificationType, Notification[]>);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={dropdownRef}
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          transition={{ duration: 0.15 }}
          className='absolute right-0 mt-3 w-96 rounded-2xl shadow-2xl bg-white/95 dark:bg-slate-800/95 backdrop-blur-2xl ring-1 ring-black ring-opacity-5 dark:ring-slate-600 z-50 border border-slate-200/60 dark:border-slate-600/60 overflow-hidden'
        >
          {/* Header */}
          <div className='p-6 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-slate-800 dark:to-slate-700 border-b border-slate-200/60 dark:border-slate-600/60'>
            <div className='flex items-center justify-between'>
              <h3 className='text-lg font-bold text-gray-900 dark:text-slate-100'>
                Notifications
              </h3>
              <div className='flex items-center space-x-2'>
                {unreadCount > 0 && (
                  <span className='px-2 py-1 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 text-xs font-medium rounded-full'>
                    {unreadCount} new
                  </span>
                )}
                <button
                  onClick={handleRefresh}
                  className='p-1.5 text-gray-400 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-50 dark:hover:bg-slate-700 rounded-lg transition-all duration-200'
                  title='Refresh notifications'
                >
                  <FiRefreshCw
                    className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Notifications List */}
          <div className='max-h-96 overflow-y-auto'>
            {loading && notifications.length === 0 ? (
              <div className='p-8 text-center'>
                <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500 dark:border-blue-400 mx-auto mb-3'></div>
                <p className='text-gray-500 dark:text-slate-400'>
                  Loading your notifications...
                </p>
              </div>
            ) : notifications.length === 0 ? (
              <div className='p-8 text-center'>
                <FiBell className='h-12 w-12 text-gray-300 dark:text-slate-600 mx-auto mb-4' />
                <h4 className='text-sm font-semibold text-gray-900 dark:text-slate-100 mb-2'>
                  You&apos;re all caught up!
                </h4>
                <p className='text-sm text-gray-500 dark:text-slate-400'>
                  No new notifications at the moment. We&apos;ll let you know
                  when something important happens.
                </p>
              </div>
            ) : (
              Object.entries(groupedNotifications).map(
                ([type, typeNotifications]) => (
                  <div
                    key={type}
                    className='border-b border-slate-200/40 dark:border-slate-600/40 last:border-b-0'
                  >
                    <div className='px-4 py-2 bg-slate-50/50 dark:bg-slate-700/30'>
                      <h4 className='text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider'>
                        {type.toLowerCase().replace('_', ' ')}
                      </h4>
                    </div>
                    {typeNotifications.map((notification) => (
                      <motion.div
                        key={notification._id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={getNotificationStyle(
                          notification.type,
                          notification.priority
                        )}
                        onClick={() => handleNotificationClick(notification)}
                      >
                        <div className='flex items-start space-x-3'>
                          <div className='flex-shrink-0 mt-1'>
                            {getNotificationIcon(notification.type)}
                          </div>
                          <div className='flex-1 min-w-0'>
                            <div className='flex items-center justify-between'>
                              <p className='text-sm font-semibold text-gray-900 dark:text-slate-100 group-hover:text-indigo-700 dark:group-hover:text-indigo-400 transition-colors duration-200'>
                                {notification.title}
                              </p>
                              <span
                                className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getPriorityColor(
                                  notification.priority
                                )}`}
                              >
                                {notification.priority.toLowerCase()}
                              </span>
                            </div>
                            <p className='text-sm text-gray-600 dark:text-slate-300 mt-1'>
                              {notification.message}
                            </p>
                            <div className='flex items-center justify-between mt-2'>
                              <div className='flex items-center space-x-2'>
                                <FiClock className='h-3 w-3 text-gray-400 dark:text-slate-500' />
                                <p className='text-xs text-gray-500 dark:text-slate-400'>
                                  {formatDistanceToNow(
                                    new Date(notification.createdAt),
                                    { addSuffix: true }
                                  )}
                                </p>
                              </div>
                              {notification.status === 'UNREAD' && (
                                <span className='w-2 h-2 bg-indigo-500 dark:bg-blue-400 rounded-full'></span>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )
              )
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className='p-4 bg-gradient-to-r from-slate-50 to-indigo-50/50 dark:from-slate-800 dark:to-slate-700 border-t border-slate-200/60 dark:border-slate-600/60'>
              <div className='flex items-center justify-between'>
                {unreadCount > 0 ? (
                  <button
                    onClick={markAllAsRead}
                    className='flex items-center text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium transition-colors duration-200'
                  >
                    <FiCheck className='h-4 w-4 mr-1' />
                    Mark all as read
                  </button>
                ) : (
                  <span className='text-sm text-gray-500 dark:text-slate-400'>
                    All caught up!
                  </span>
                )}
                <Link
                  href='/notifications'
                  className='flex items-center text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium transition-colors duration-200'
                  onClick={onClose}
                >
                  View all
                  <FiSettings className='h-4 w-4 ml-1' />
                </Link>
              </div>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
