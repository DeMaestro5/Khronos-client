'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
import { useAuth } from './AuthContext';
import {
  Notification,
  NotificationFilters,
  NotificationResponse,
  NotificationSettings,
  NotificationStatus,
} from '@/src/types/notification';
import { notificationAPI } from '@/src/lib/api';
import { toast } from 'react-hot-toast';

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  settings: NotificationSettings | null;
  loading: boolean;
  error: string | null;
  fetchNotifications: (
    filters?: NotificationFilters,
    page?: number
  ) => Promise<void>;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  updateSettings: (settings: Partial<NotificationSettings>) => Promise<void>;
  refreshNotifications: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export function NotificationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [settings, setSettings] = useState<NotificationSettings | null>(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = useCallback(
    async (
      filters?: NotificationFilters,
      page = 1,
      isBackgroundRefresh = false
    ) => {
      if (!user) return;

      // Only show loading state for initial load or manual refresh, not background polling
      if (!isBackgroundRefresh) {
        setLoading(true);
      }
      setError(null);

      try {
        const response = await notificationAPI.getNotifications(filters, page);
        const data = response.data?.data as NotificationResponse;

        if (data) {
          const newNotifications = data.notifications;
          const newUnreadCount = newNotifications.filter(
            (n) => n.status === NotificationStatus.UNREAD
          ).length;

          // Check if there are new notifications (only for background refresh)
          if (isBackgroundRefresh && notifications.length > 0) {
            const existingIds = new Set(notifications.map((n) => n._id));
            const reallyNewNotifications = newNotifications.filter(
              (n) => !existingIds.has(n._id)
            );

            // Show toast for new notifications (limit to avoid spam)
            if (
              reallyNewNotifications.length > 0 &&
              reallyNewNotifications.length <= 3
            ) {
              reallyNewNotifications.forEach((notification) => {
                toast.success(`New notification: ${notification.title}`, {
                  duration: 4000,
                  icon: '🔔',
                });
              });
            } else if (reallyNewNotifications.length > 3) {
              toast.success(
                `${reallyNewNotifications.length} new notifications`,
                {
                  duration: 4000,
                  icon: '🔔',
                }
              );
            }
          }

          setNotifications(newNotifications);
          setUnreadCount(newUnreadCount);
        }
      } catch (err) {
        // Only show error to user if it's not a background refresh
        if (!isBackgroundRefresh) {
          setError('Failed to fetch notifications');
          console.error('Error fetching notifications:', err);
        } else {
          // Silently log background fetch errors
          console.warn('Background notification fetch failed:', err);
        }
      } finally {
        if (!isBackgroundRefresh) {
          setLoading(false);
        }
        setInitialLoading(false);
      }
    },
    [user, notifications]
  );

  const fetchSettings = useCallback(async () => {
    if (!user) return;

    try {
      const response = await notificationAPI.getSettings();
      if (response.data?.data) {
        setSettings(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching notification settings:', err);
    }
  }, [user]);

  const markAsRead = async (notificationId: string) => {
    try {
      await notificationAPI.markAsRead(notificationId);
      setNotifications((prev) =>
        prev.map((notification) =>
          notification._id === notificationId
            ? { ...notification, status: NotificationStatus.READ }
            : notification
        )
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      toast.error('Failed to mark notification as read');
      console.error('Error marking notification as read:', err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationAPI.markAllAsRead();
      setNotifications((prev) =>
        prev.map((notification) => ({
          ...notification,
          status: NotificationStatus.READ,
        }))
      );
      setUnreadCount(0);
      toast.success('All notifications marked as read');
    } catch (err) {
      toast.error('Failed to mark all notifications as read');
      console.error('Error marking all notifications as read:', err);
    }
  };

  const updateSettings = async (newSettings: Partial<NotificationSettings>) => {
    try {
      const response = await notificationAPI.updateSettings(newSettings);
      if (response.data?.data) {
        setSettings(response.data.data);
        toast.success('Notification settings updated');
      }
    } catch (err) {
      toast.error('Failed to update notification settings');
      console.error('Error updating notification settings:', err);
    }
  };

  const refreshNotifications = useCallback(async () => {
    await fetchNotifications(undefined, 1, false);
  }, [fetchNotifications]);

  // Initial fetch
  useEffect(() => {
    if (user) {
      fetchNotifications(undefined, 1, false);
      fetchSettings();
    }
  }, [user, fetchSettings]);

  // Background polling for new notifications every 5 minutes
  useEffect(() => {
    if (!user) return;

    const interval = setInterval(() => {
      // Background refresh - silent, no loading states shown to user
      fetchNotifications(undefined, 1, true);
    }, 300000); // 5 minutes (300,000ms) - realistic polling interval

    return () => clearInterval(interval);
  }, [user, fetchNotifications]);

  const value = {
    notifications,
    unreadCount,
    settings,
    loading: initialLoading || loading, // Show loading only on initial load or manual refresh
    error,
    fetchNotifications: (filters?: NotificationFilters, page?: number) =>
      fetchNotifications(filters, page, false), // Manual fetches are not background
    markAsRead,
    markAllAsRead,
    updateSettings,
    refreshNotifications,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      'useNotifications must be used within a NotificationProvider'
    );
  }
  return context;
}
