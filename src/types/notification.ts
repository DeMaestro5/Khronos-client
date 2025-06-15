export enum NotificationType {
  SYSTEM = 'SYSTEM',
  CONTENT = 'CONTENT',
  PERFORMANCE = 'PERFORMANCE',
  TREND = 'TREND',
  SCHEDULE = 'SCHEDULE',
}

export enum NotificationPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
}

export enum NotificationStatus {
  UNREAD = 'UNREAD',
  READ = 'READ',
}

export interface Notification {
  _id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  priority: NotificationPriority;
  status: NotificationStatus;
  metadata?: {
    contentId?: string;
    link?: string;
    [key: string]: unknown;
  };
  createdAt: string;
  updatedAt: string;
}

export interface NotificationSettings {
  _id: string;
  userId: string;
  email: boolean;
  push: boolean;
  inApp: boolean;
  scheduleNotifications: boolean;
  performanceAlerts: boolean;
  trendUpdates: boolean;
  systemUpdates: boolean;
  quietHours: {
    start: string;
    end: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface NotificationFilters {
  type?: NotificationType;
  status?: NotificationStatus;
  priority?: NotificationPriority;
}

export interface NotificationResponse {
  notifications: Notification[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}
