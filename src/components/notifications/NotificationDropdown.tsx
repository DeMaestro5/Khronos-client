'use client';

import React, { useEffect } from 'react';
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
  FiChevronLeft,
} from 'react-icons/fi';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';

interface NotificationDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  dropdownRef: React.RefObject<HTMLDivElement | null>;
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
    'p-4 hover:bg-gradient-to-r transition-all duration-200 border-b border-theme-primary/40 last:border-b-0 group cursor-pointer';

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
      return `${baseStyle} hover:from-theme-hover hover:to-theme-secondary/50`;
  }
};

// Mobile-specific notification component
const MobileNotificationItem = ({
  notification,
  onClick,
  index,
}: {
  notification: Notification;
  onClick: (notification: Notification) => void;
  index: number;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10, y: 5 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{
        duration: 0.15,
        delay: index * 0.01,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      className={`p-4 border-b border-theme-primary/20 last:border-b-0 active:bg-theme-hover transition-all duration-200 ${
        notification.status === 'UNREAD'
          ? 'bg-blue-50/50 dark:bg-blue-900/10'
          : ''
      }`}
      onClick={() => onClick(notification)}
    >
      <div className='flex items-start space-x-3'>
        <div className='flex-shrink-0 mt-1'>
          {getNotificationIcon(notification.type)}
        </div>
        <div className='flex-1 min-w-0'>
          <div className='flex items-start justify-between gap-2 mb-2'>
            <p className='text-sm font-semibold text-theme-primary line-clamp-2 flex-1'>
              {notification.title}
            </p>
            {notification.status === 'UNREAD' && (
              <span className='w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1'></span>
            )}
          </div>
          <p className='text-sm text-theme-secondary line-clamp-2 mb-2'>
            {notification.message}
          </p>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-2'>
              <FiClock className='h-3 w-3 text-theme-muted' />
              <p className='text-xs text-theme-secondary'>
                {formatDistanceToNow(new Date(notification.createdAt), {
                  addSuffix: true,
                })}
              </p>
            </div>
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getPriorityColor(
                notification.priority
              )}`}
            >
              {notification.priority.toLowerCase()}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default function NotificationDropdown({
  isOpen,
  onClose,
  dropdownRef,
}: NotificationDropdownProps) {
  const {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    refreshNotifications,
  } = useNotifications();

  useEffect(() => {
    // Remove the click outside handler from here since NavBar handles it
    // This prevents conflicts with the notification button toggle
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
        <>
          {/* Mobile Full-Screen Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 0.15,
              ease: [0.25, 0.1, 0.25, 1],
            }}
            className='fixed inset-0 bg-black/50 backdrop-blur-sm z-50 sm:hidden'
            onClick={onClose}
          />

          {/* Mobile Notification Panel */}
          <motion.div
            ref={dropdownRef}
            initial={{ x: '100%', scale: 0.95, rotateY: 5 }}
            animate={{ x: 0, scale: 1, rotateY: 0 }}
            exit={{ x: '100%', scale: 0.95, rotateY: 5 }}
            transition={{
              type: 'spring',
              damping: 20,
              stiffness: 300,
              mass: 0.5,
              duration: 0.2,
            }}
            className='fixed top-0 right-0 h-full w-full max-w-sm bg-theme-card shadow-2xl z-50 sm:hidden flex flex-col'
          >
            {/* Mobile Header */}
            <div className='flex items-center justify-between p-4 border-b border-theme-primary/20 bg-theme-card'>
              <div className='flex items-center space-x-3'>
                <button
                  onClick={onClose}
                  className='p-2 rounded-lg text-theme-secondary hover:text-theme-primary hover:bg-theme-hover transition-all duration-200'
                >
                  <FiChevronLeft className='h-5 w-5' />
                </button>
                <div>
                  <h3 className='text-lg font-bold text-theme-primary'>
                    Notifications
                  </h3>
                  {unreadCount > 0 && (
                    <p className='text-sm text-theme-secondary'>
                      {unreadCount} unread
                    </p>
                  )}
                </div>
              </div>
              <div className='flex items-center space-x-2'>
                <button
                  onClick={handleRefresh}
                  className='p-2 text-theme-secondary hover:text-theme-primary hover:bg-theme-hover rounded-lg transition-all duration-200'
                  title='Refresh notifications'
                >
                  <FiRefreshCw
                    className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`}
                  />
                </button>
              </div>
            </div>

            {/* Mobile Notifications List */}
            <div className='flex-1 overflow-y-auto'>
              {loading && notifications.length === 0 ? (
                <div className='flex flex-col items-center justify-center h-full p-6'>
                  <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-accent-primary mb-4'></div>
                  <p className='text-theme-secondary text-center'>
                    Loading notifications...
                  </p>
                </div>
              ) : notifications.length === 0 ? (
                <div className='flex flex-col items-center justify-center h-full p-6'>
                  <div className='w-16 h-16 bg-theme-secondary rounded-full flex items-center justify-center mb-4'>
                    <FiBell className='h-8 w-8 text-theme-muted' />
                  </div>
                  <h4 className='text-lg font-semibold text-theme-primary mb-2 text-center'>
                    All caught up!
                  </h4>
                  <p className='text-theme-secondary text-center text-sm leading-relaxed'>
                    No new notifications at the moment. We&apos;ll let you know
                    when something important happens.
                  </p>
                </div>
              ) : (
                <div className='divide-y divide-theme-primary/20'>
                  {Object.entries(groupedNotifications).map(
                    ([type, typeNotifications]) => (
                      <div key={type}>
                        <div className='px-4 py-3 bg-theme-secondary/30'>
                          <h4 className='text-xs font-semibold text-theme-secondary uppercase tracking-wider'>
                            {type.toLowerCase().replace('_', ' ')}
                          </h4>
                        </div>
                        {typeNotifications.map((notification, index) => (
                          <MobileNotificationItem
                            key={notification._id}
                            notification={notification}
                            onClick={handleNotificationClick}
                            index={index}
                          />
                        ))}
                      </div>
                    )
                  )}
                </div>
              )}
            </div>

            {/* Mobile Footer */}
            {notifications.length > 0 && (
              <div className='p-4 border-t border-theme-primary/20 bg-theme-card'>
                <div className='flex items-center justify-between'>
                  {unreadCount > 0 ? (
                    <button
                      onClick={markAllAsRead}
                      className='flex items-center text-sm text-accent-primary hover:text-accent-secondary font-medium transition-colors duration-200'
                    >
                      <FiCheck className='h-4 w-4 mr-2' />
                      Mark all read
                    </button>
                  ) : (
                    <span className='text-sm text-theme-secondary'>
                      All caught up!
                    </span>
                  )}
                  <Link
                    href='/notifications'
                    className='flex items-center text-sm text-accent-primary hover:text-accent-secondary font-medium transition-colors duration-200'
                    onClick={onClose}
                  >
                    View all
                    <FiSettings className='h-4 w-4 ml-2' />
                  </Link>
                </div>
              </div>
            )}
          </motion.div>

          {/* Desktop Dropdown (Original Design) */}
          <motion.div
            ref={dropdownRef}
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.15 }}
            className='absolute right-0 mt-3 w-96 rounded-2xl shadow-theme-xl bg-theme-card backdrop-blur-2xl ring-1 ring-black ring-opacity-5 dark:ring-slate-600 z-50 border border-theme-primary/60 overflow-hidden max-h-[70vh] hidden sm:block'
          >
            {/* Desktop Header */}
            <div className='p-4 bg-gradient-to-r from-theme-secondary to-theme-tertiary border-b border-theme-primary/60'>
              <div className='flex items-center justify-between'>
                <h3 className='text-lg font-bold text-theme-primary'>
                  Notifications
                </h3>
                <div className='flex items-center space-x-2'>
                  {unreadCount > 0 && (
                    <span className='px-2 py-1 bg-accent-primary/10 text-accent-primary text-xs font-medium rounded-full'>
                      {unreadCount} new
                    </span>
                  )}
                  <button
                    onClick={handleRefresh}
                    className='p-1.5 text-theme-secondary hover:text-accent-primary hover:bg-theme-hover rounded-lg transition-all duration-200'
                    title='Refresh notifications'
                  >
                    <FiRefreshCw
                      className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Desktop Notifications List */}
            <div className='max-h-64 sm:max-h-80 overflow-y-auto'>
              {loading && notifications.length === 0 ? (
                <div className='p-6 text-center'>
                  <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-accent-primary mx-auto mb-3'></div>
                  <p className='text-sm text-theme-secondary'>
                    Loading your notifications...
                  </p>
                </div>
              ) : notifications.length === 0 ? (
                <div className='p-6 text-center'>
                  <FiBell className='h-12 w-12 text-theme-muted mx-auto mb-4' />
                  <h4 className='text-sm font-semibold text-theme-primary mb-2'>
                    You&apos;re all caught up!
                  </h4>
                  <p className='text-sm text-theme-secondary'>
                    No new notifications at the moment. We&apos;ll let you know
                    when something important happens.
                  </p>
                </div>
              ) : (
                Object.entries(groupedNotifications).map(
                  ([type, typeNotifications]) => (
                    <div
                      key={type}
                      className='border-b border-theme-primary/40 last:border-b-0'
                    >
                      <div className='px-4 py-2 bg-theme-secondary/50'>
                        <h4 className='text-xs font-semibold text-theme-secondary uppercase tracking-wider'>
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
                              <div className='flex items-start justify-between gap-2'>
                                <p className='text-sm font-semibold text-theme-primary group-hover:text-accent-primary transition-colors duration-200 line-clamp-2 flex-1'>
                                  {notification.title}
                                </p>
                                <span
                                  className={`px-2 py-0.5 rounded-full text-xs font-medium border flex-shrink-0 ${getPriorityColor(
                                    notification.priority
                                  )}`}
                                >
                                  {notification.priority.toLowerCase()}
                                </span>
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
                                {notification.status === 'UNREAD' && (
                                  <span className='w-2 h-2 bg-accent-primary rounded-full flex-shrink-0'></span>
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

            {/* Desktop Footer */}
            {notifications.length > 0 && (
              <div className='p-4 bg-gradient-to-r from-theme-secondary to-theme-tertiary border-t border-theme-primary/60'>
                <div className='flex items-center justify-between'>
                  {unreadCount > 0 ? (
                    <button
                      onClick={markAllAsRead}
                      className='flex items-center text-sm text-accent-primary hover:text-accent-secondary font-medium transition-colors duration-200'
                    >
                      <FiCheck className='h-4 w-4 mr-1' />
                      Mark all as read
                    </button>
                  ) : (
                    <span className='text-sm text-theme-secondary'>
                      All caught up!
                    </span>
                  )}
                  <Link
                    href='/notifications'
                    className='flex items-center text-sm text-accent-primary hover:text-accent-secondary font-medium transition-colors duration-200'
                    onClick={onClose}
                  >
                    View all
                    <FiSettings className='h-4 w-4 ml-1' />
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
