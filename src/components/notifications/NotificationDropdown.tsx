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
      return <FiAlertCircle className='h-5 w-5 text-blue-500' />;
    case NotificationType.CONTENT:
      return <FiZap className='h-5 w-5 text-purple-500' />;
    case NotificationType.PERFORMANCE:
      return <FiTrendingUp className='h-5 w-5 text-green-500' />;
    case NotificationType.TREND:
      return <FiTrendingUp className='h-5 w-5 text-orange-500' />;
    case NotificationType.SCHEDULE:
      return <FiCalendar className='h-5 w-5 text-indigo-500' />;
    default:
      return <FiBell className='h-5 w-5 text-gray-500' />;
  }
};

const getPriorityColor = (priority: NotificationPriority) => {
  switch (priority) {
    case NotificationPriority.HIGH:
      return 'bg-red-100 text-red-700 border-red-200';
    case NotificationPriority.MEDIUM:
      return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    case NotificationPriority.LOW:
      return 'bg-blue-100 text-blue-700 border-blue-200';
    default:
      return 'bg-gray-100 text-gray-700 border-gray-200';
  }
};

const getNotificationStyle = (
  type: NotificationType,
  priority: NotificationPriority
) => {
  const baseStyle =
    'p-4 hover:bg-gradient-to-r transition-all duration-200 border-b border-slate-200/40 last:border-b-0 group cursor-pointer';

  if (priority === NotificationPriority.HIGH) {
    return `${baseStyle} bg-red-50/30 hover:from-red-50/50 hover:to-red-50/30`;
  }

  switch (type) {
    case NotificationType.SCHEDULE:
      return `${baseStyle} bg-indigo-50/30 hover:from-indigo-50/50 hover:to-indigo-50/30`;
    case NotificationType.CONTENT:
      return `${baseStyle} bg-purple-50/30 hover:from-purple-50/50 hover:to-purple-50/30`;
    case NotificationType.PERFORMANCE:
      return `${baseStyle} bg-green-50/30 hover:from-green-50/50 hover:to-green-50/30`;
    default:
      return `${baseStyle} hover:from-slate-50 hover:to-indigo-50/50`;
  }
};

export default function NotificationDropdown({
  isOpen,
  onClose,
}: NotificationDropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { notifications, unreadCount, loading, markAsRead, markAllAsRead } =
    useNotifications();

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
          className='absolute right-0 mt-3 w-96 rounded-2xl shadow-2xl bg-white/95 backdrop-blur-2xl ring-1 ring-black ring-opacity-5 z-50 border border-slate-200/60 overflow-hidden'
        >
          {/* Header */}
          <div className='p-6 bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-slate-200/60'>
            <div className='flex items-center justify-between'>
              <h3 className='text-lg font-bold text-gray-900'>Notifications</h3>
              {unreadCount > 0 && (
                <span className='px-2 py-1 bg-indigo-100 text-indigo-700 text-xs font-medium rounded-full'>
                  {unreadCount} new
                </span>
              )}
            </div>
          </div>

          {/* Notifications List */}
          <div className='max-h-96 overflow-y-auto'>
            {loading ? (
              <div className='p-4 text-center text-gray-500'>
                Loading notifications...
              </div>
            ) : notifications.length === 0 ? (
              <div className='p-8 text-center'>
                <FiBell className='h-8 w-8 text-gray-400 mx-auto mb-3' />
                <p className='text-gray-500'>No notifications yet</p>
              </div>
            ) : (
              Object.entries(groupedNotifications).map(
                ([type, typeNotifications]) => (
                  <div
                    key={type}
                    className='border-b border-slate-200/40 last:border-b-0'
                  >
                    <div className='px-4 py-2 bg-slate-50/50'>
                      <h4 className='text-xs font-semibold text-gray-500 uppercase tracking-wider'>
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
                              <p className='text-sm font-semibold text-gray-900 group-hover:text-indigo-700 transition-colors duration-200'>
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
                            <p className='text-sm text-gray-600 mt-1'>
                              {notification.message}
                            </p>
                            <div className='flex items-center justify-between mt-2'>
                              <div className='flex items-center space-x-2'>
                                <FiClock className='h-3 w-3 text-gray-400' />
                                <p className='text-xs text-gray-500'>
                                  {formatDistanceToNow(
                                    new Date(notification.createdAt),
                                    { addSuffix: true }
                                  )}
                                </p>
                              </div>
                              {notification.status === 'UNREAD' && (
                                <span className='w-2 h-2 bg-indigo-500 rounded-full'></span>
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
          <div className='p-4 bg-gradient-to-r from-slate-50 to-indigo-50/50 border-t border-slate-200/60'>
            <div className='flex items-center justify-between'>
              <button
                onClick={markAllAsRead}
                className='flex items-center text-sm text-indigo-600 hover:text-indigo-700 font-medium'
              >
                <FiCheck className='h-4 w-4 mr-1' />
                Mark all as read
              </button>
              <Link
                href='/notifications'
                className='flex items-center text-sm text-indigo-600 hover:text-indigo-700 font-medium'
                onClick={onClose}
              >
                View all
                <FiSettings className='h-4 w-4 ml-1' />
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
