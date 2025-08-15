export enum NotificationType {
  SYSTEM = 'system',
  PERFORMANCE = 'performance',
  TREND = 'trend',
  SCHEDULE = 'schedule',
  SECURITY = 'security',
  REMINDER = 'reminder',
  MESSAGE = 'message',
  MARKETING = 'marketing',
  PRODUCT_UPDATE = 'product_update',
  REPORT = 'report',
}

export enum NotificationPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

export enum NotificationStatus {
  UNREAD = 'unread',
  READ = 'read',
}

export interface Notification {
  _id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  priority: NotificationPriority;
  status: NotificationStatus;
  data?: Record<string, unknown>;
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
  securityAlerts?: boolean;
  productUpdates?: boolean;
  messages?: boolean;
  reminders?: boolean;
  marketing?: boolean;
  reports?: boolean;
  quietHours: {
    enabled?: boolean;
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
  hasMore?: boolean;
}
