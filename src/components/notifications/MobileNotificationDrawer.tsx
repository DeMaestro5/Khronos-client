'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import {
  FiBell,
  FiChevronLeft,
  FiClock,
  FiRefreshCw,
  FiSettings,
} from 'react-icons/fi';
import { Notification } from '@/src/types/notification';
import { formatDistanceToNow } from 'date-fns';

interface MobileNotificationDrawerProps {
  open: boolean;
  onClose: () => void;
  dropdownRef: React.RefObject<HTMLDivElement | null>;
  unreadCount: number;
  groupedNotifications: Array<[string, Notification[]]>;
  onRefresh: () => void | Promise<void>;
  onMarkAllAsRead: () => void | Promise<void>;
  onItemClick: (n: Notification) => void | Promise<void>;
}

function useBodyScrollLock(locked: boolean) {
  useEffect(() => {
    if (!locked) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = original;
    };
  }, [locked]);
}

export default function MobileNotificationDrawer({
  open,
  onClose,
  dropdownRef,
  unreadCount,
  groupedNotifications,
  onRefresh,
  onMarkAllAsRead,
  onItemClick,
}: MobileNotificationDrawerProps) {
  const [isMounted, setIsMounted] = useState(open);
  const [isVisible, setIsVisible] = useState(open);

  useBodyScrollLock(open);

  // Toggle a body data attribute so other UI (like floating AI button) can react
  useEffect(() => {
    if (typeof document === 'undefined') return;
    if (open) {
      document.body.setAttribute('data-mobile-notifications-open', 'true');
      return () => {
        document.body.removeAttribute('data-mobile-notifications-open');
      };
    }
    document.body.removeAttribute('data-mobile-notifications-open');
  }, [open]);

  useEffect(() => {
    if (open) {
      setIsMounted(true);
      const id = requestAnimationFrame(() => setIsVisible(true));
      return () => cancelAnimationFrame(id);
    }
    setIsVisible(false);
  }, [open]);

  const handlePanelTransitionEnd = () => {
    if (!open) setIsMounted(false);
  };

  if (typeof document === 'undefined') return null;
  if (!isMounted) return null;

  return createPortal(
    <div className={`fixed inset-0 z-50 sm:hidden pointer-events-auto`}>
      {/* Overlay */}
      <div
        className={`absolute inset-0 bg-black/50 transition-opacity duration-200 ease-out ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        ref={dropdownRef}
        className={`absolute top-0 right-0 h-full w-full max-w-sm bg-theme-card shadow-2xl flex flex-col transform-gpu will-change-transform transition-transform duration-200 ease-out ${
          isVisible ? 'translate-x-0' : 'translate-x-full'
        }`}
        onTransitionEnd={handlePanelTransitionEnd}
        style={{ contentVisibility: 'auto' }}
      >
        {/* Header */}
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
              onClick={onRefresh}
              className='p-2 text-theme-secondary hover:text-theme-primary hover:bg-theme-hover rounded-lg transition-all duration-200'
              title='Refresh notifications'
            >
              <FiRefreshCw className='h-4 w-4' />
            </button>
          </div>
        </div>

        {/* List */}
        <div className='flex-1 overflow-y-auto overscroll-contain touch-pan-y'>
          {groupedNotifications.length === 0 ? (
            <div className='flex flex-col items-center justify-center h-full p-6'>
              <div className='w-16 h-16 bg-theme-secondary rounded-full flex items-center justify-center mb-4'>
                <FiBell className='h-8 w-8 text-theme-muted' />
              </div>
              <h4 className='text-lg font-semibold text-theme-primary mb-2 text-center'>
                All caught up!
              </h4>
              <p className='text-theme-secondary text-center text-sm leading-relaxed'>
                No new notifications at the moment. We&apos;ll let you know when
                something important happens.
              </p>
            </div>
          ) : (
            <div className='divide-y divide-theme-primary/20'>
              {groupedNotifications.map(([type, typeNotifications]) => (
                <div key={type}>
                  <div className='px-4 py-3 bg-theme-secondary/30'>
                    <h4 className='text-xs font-semibold text-theme-secondary uppercase tracking-wider'>
                      {type.toLowerCase().replace('_', ' ')}
                    </h4>
                  </div>
                  {typeNotifications.map((notification) => (
                    <button
                      key={notification._id}
                      onClick={() => onItemClick(notification)}
                      className={`w-full text-left p-4 border-b border-theme-primary/20 last:border-b-0 active:bg-theme-hover transition-all duration-200 ${
                        notification.status === 'unread'
                          ? 'bg-blue-50/50 dark:bg-blue-900/10'
                          : ''
                      }`}
                    >
                      <div className='flex items-start space-x-3'>
                        <div className='flex-shrink-0 mt-1'>
                          <FiBell className='h-5 w-5 text-theme-secondary' />
                        </div>
                        <div className='flex-1 min-w-0'>
                          <div className='flex items-start justify-between gap-2 mb-2'>
                            <p className='text-sm font-semibold text-theme-primary line-clamp-2 flex-1'>
                              {notification.title}
                            </p>
                            {notification.status === 'unread' && (
                              <span className='w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1'></span>
                            )}
                          </div>
                          <p className='text-sm text-theme-secondary line-clamp-2 mb-2'>
                            {notification.message}
                          </p>
                          <div className='flex items-center space-x-2'>
                            <FiClock className='h-3 w-3 text-theme-muted' />
                            <p className='text-xs text-theme-secondary'>
                              {formatDistanceToNow(
                                new Date(notification.createdAt),
                                {
                                  addSuffix: true,
                                }
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className='p-4 border-t border-theme-primary/20 bg-theme-card'>
          <div className='flex items-center justify-between'>
            <button
              onClick={onMarkAllAsRead}
              className='flex items-center text-sm text-accent-primary hover:text-accent-secondary font-medium transition-colors duration-200'
            >
              Mark all read
            </button>
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
      </div>
    </div>,
    document.body
  );
}
