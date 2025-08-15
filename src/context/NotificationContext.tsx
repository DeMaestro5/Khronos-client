'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
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
import { io, Socket } from 'socket.io-client';
import { AuthUtils } from '@/src/lib/auth-utils';

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
  const socketRef = useRef<Socket | null>(null);
  const notificationsRef = useRef<Notification[]>([]);

  const fetchNotifications = useCallback(
    async (
      filters?: NotificationFilters,
      page = 1,
      isBackgroundRefresh = false
    ) => {
      if (!user) return;

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

          if (isBackgroundRefresh && notificationsRef.current.length > 0) {
            const existingIds = new Set(
              notificationsRef.current.map((n) => n._id)
            );
            const reallyNewNotifications = newNotifications.filter(
              (n) => !existingIds.has(n._id)
            );

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
          notificationsRef.current = newNotifications;
          setUnreadCount(newUnreadCount);
        }
      } catch (err) {
        if (!isBackgroundRefresh) {
          setError('Failed to fetch notifications');
          console.error('Error fetching notifications:', err);
        } else {
          console.warn('Background notification fetch failed:', err);
        }
      } finally {
        if (!isBackgroundRefresh) {
          setLoading(false);
        }
        setInitialLoading(false);
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
    } catch (err: unknown) {
      const maybeMessage =
        typeof err === 'object' && err && 'message' in err
          ? String((err as { message?: unknown }).message)
          : '';
      if (maybeMessage && /aborted|canceled|cancelled/i.test(maybeMessage)) {
        return;
      }
      console.warn('Notification settings fetch failed:', err);
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

  // Setup websocket for real-time notifications
  useEffect(() => {
    if (!user) {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      return;
    }

    const baseUrl =
      process.env.NEXT_PUBLIC_API_URL ||
      'https://khronos-api-bp71.onrender.com';

    const socket = io(baseUrl, {
      transports: ['websocket', 'polling'],
      withCredentials: true,
      autoConnect: true,
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      const userId = AuthUtils.getUserId();
      const token = AuthUtils.getAccessToken();
      if (userId && token) {
        socket.emit('authenticate', { userId, token });
      }
    });

    socket.on('authenticated', () => {
      // no-op
    });

    socket.on('authentication_error', () => {
      console.warn('Socket authentication failed');
    });

    socket.on('notification', (incoming: Notification) => {
      setNotifications((prev) => {
        const exists = prev.some((n) => n._id === incoming._id);
        const updated = exists ? prev : [incoming, ...prev];
        notificationsRef.current = updated;
        const newUnread = updated.filter(
          (n) => n.status === NotificationStatus.UNREAD
        ).length;
        setUnreadCount(newUnread);
        return updated;
      });

      toast.custom(() => (
        <div className='px-4 py-3 rounded-lg shadow-lg bg-theme-card border border-theme-primary max-w-sm'>
          <div className='text-sm font-semibold text-theme-primary'>
            {incoming.title}
          </div>
          <div className='text-sm text-theme-secondary'>{incoming.message}</div>
        </div>
      ));
    });

    socket.on('disconnect', () => {
      // no-op
    });

    return () => {
      socket.removeAllListeners();
      socket.disconnect();
      socketRef.current = null;
    };
  }, [user]);

  // Initial fetch only
  useEffect(() => {
    if (user) {
      fetchNotifications(undefined, 1, false);
      fetchSettings();
    }
  }, [user, fetchSettings, fetchNotifications]);

  const value = {
    notifications,
    unreadCount,
    settings,
    loading: initialLoading || loading,
    error,
    fetchNotifications: (filters?: NotificationFilters, page?: number) =>
      fetchNotifications(filters, page, false),
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
