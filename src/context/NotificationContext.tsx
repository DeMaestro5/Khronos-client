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
import { notificationAPI } from '@/src/lib/api/notification';
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
  const [error, setError] = useState<string | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = useCallback(
    async (filters?: NotificationFilters, page = 1) => {
      if (!user) return;

      setLoading(true);
      setError(null);

      try {
        const response = await notificationAPI.getNotifications(filters, page);
        const data = response.data?.data as NotificationResponse;

        if (data) {
          setNotifications(data.notifications);
          setUnreadCount(
            data.notifications.filter(
              (n) => n.status === NotificationStatus.UNREAD
            ).length
          );
        }
      } catch (err) {
        setError('Failed to fetch notifications');
        console.error('Error fetching notifications:', err);
      } finally {
        setLoading(false);
      }
    },
    [user]
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
    await fetchNotifications();
  }, [fetchNotifications]);

  // Initial fetch
  useEffect(() => {
    if (user) {
      fetchNotifications();
      fetchSettings();
    }
  }, [user, fetchNotifications, fetchSettings]);

  // Poll for new notifications every minute
  useEffect(() => {
    if (!user) return;

    const interval = setInterval(() => {
      refreshNotifications();
    }, 60000);

    return () => clearInterval(interval);
  }, [user, refreshNotifications]);

  const value = {
    notifications,
    unreadCount,
    settings,
    loading,
    error,
    fetchNotifications,
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
