export interface UserSettings {
  _id: string;
  userId: string;

  // Profile settings
  profile: {
    displayName?: string;
    bio?: string;
    location?: string;
    website?: string;
    timezone?: string;
    language?: string;
    dateFormat: 'MM/DD/YYYY' | 'DD/MM/YYYY' | 'YYYY-MM-DD';
    timeFormat: '12h' | '24h';
  };

  // Notification preferences - Updated structure to match backend
  notifications: {
    emailEnabled: boolean;
    pushEnabled: boolean;
    inAppEnabled: boolean;

    emailTypes: {
      security: boolean;
      updates: boolean;
      messages: boolean;
      reminders: boolean;
      marketing: boolean;
      reports: boolean;
    };

    pushTypes: {
      security: boolean;
      updates: boolean;
      messages: boolean;
      reminders: boolean;
      marketing: boolean;
      reports: boolean;
    };

    inAppTypes: {
      security: boolean;
      updates: boolean;
      messages: boolean;
      reminders: boolean;
      marketing: boolean;
      reports: boolean;
    };

    // Quiet hours settings
    quietHoursEnabled: boolean;
    quietHoursStart: string;
    quietHoursEnd: string;
  };

  // Privacy settings
  privacy: {
    profileVisibility: 'public' | 'private' | 'followers';
    showEmail: boolean;
    showLocation: boolean;
    allowAnalytics: boolean;
    dataSharing: boolean;
  };

  // Content preference
  content: {
    defaultPlatforms: string[];
    defaultContentType: 'article' | 'post' | 'video';
    autoSave: boolean;
    autoScheduling: boolean;
    aiSuggestions: boolean;
    contentLanguage: string;
  };

  // UI/UX preference
  interface: {
    theme: 'light' | 'dark' | 'system';
    sidebarCollapsed: boolean;
    defaultView: 'list' | 'grid';
    itemsPerPage: number;
    enableAnimation: boolean;
    compactMode: boolean;
  };

  // Integration settings
  integrations: {
    connectedAccounts: ConnectedAccounts[];
    apiKeys: ApiKey[];
  };

  createdAt: string;
  updatedAt: string;
}

export interface ConnectedAccounts {
  platform: string;
  accountId: string;
  accountName: string;
  isActive: boolean;
  permissions: string[];
  connectedAt: string;
}

export interface ApiKey {
  name: string;
  keyId: string;
  permissions: string[];
  createdAt: string;
  lastUsed: string;
  isActive: boolean;
}

// Partial update types for each section
export interface ProfileSettingsUpdate {
  displayName?: string;
  bio?: string;
  location?: string;
  website?: string;
  timezone?: string;
  language?: string;
  dateFormat?: 'MM/DD/YYYY' | 'DD/MM/YYYY' | 'YYYY-MM-DD';
  timeFormat?: '12h' | '24h';
}

export interface NotificationSettingsUpdate {
  emailEnabled?: boolean;
  pushEnabled?: boolean;
  inAppEnabled?: boolean;
  emailTypes?: Partial<UserSettings['notifications']['emailTypes']>;
  pushTypes?: Partial<UserSettings['notifications']['pushTypes']>;
  inAppTypes?: Partial<UserSettings['notifications']['inAppTypes']>;
  quietHoursEnabled?: boolean;
  quietHoursStart?: string;
  quietHoursEnd?: string;
}

export interface PrivacySettingsUpdate {
  profileVisibility?: 'public' | 'private' | 'followers';
  showEmail?: boolean;
  showLocation?: boolean;
  allowAnalytics?: boolean;
  dataSharing?: boolean;
}

export interface ContentSettingsUpdate {
  defaultPlatforms?: string[];
  defaultContentType?: 'article' | 'post' | 'video';
  autoSave?: boolean;
  autoScheduling?: boolean;
  aiSuggestions?: boolean;
  contentLanguage?: string;
}

export interface InterfaceSettingsUpdate {
  theme?: 'light' | 'dark' | 'system';
  sidebarCollapsed?: boolean;
  defaultView?: 'list' | 'grid';
  itemsPerPage?: number;
  enableAnimation?: boolean;
  compactMode?: boolean;
}

// Settings context state
export interface SettingsState {
  settings: UserSettings | null;
  loading: boolean;
  error: string | null;
  hasUnsavedChanges: boolean;
}

// Available options for dropdowns
export const TIMEZONE_OPTIONS = [
  { value: 'UTC', label: 'UTC (Coordinated Universal Time)' },
  { value: 'America/New_York', label: 'Eastern Time (ET)' },
  { value: 'America/Chicago', label: 'Central Time (CT)' },
  { value: 'America/Denver', label: 'Mountain Time (MT)' },
  { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
  { value: 'Europe/London', label: 'London (GMT/BST)' },
  { value: 'Europe/Paris', label: 'Paris (CET/CEST)' },
  { value: 'Europe/Berlin', label: 'Berlin (CET/CEST)' },
  { value: 'Asia/Tokyo', label: 'Tokyo (JST)' },
  { value: 'Asia/Shanghai', label: 'Shanghai (CST)' },
  { value: 'Asia/Mumbai', label: 'Mumbai (IST)' },
  { value: 'Australia/Sydney', label: 'Sydney (AEST/AEDT)' },
] as const;

export const LANGUAGE_OPTIONS = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Español' },
  { value: 'fr', label: 'Français' },
  { value: 'de', label: 'Deutsch' },
  { value: 'it', label: 'Italiano' },
  { value: 'pt', label: 'Português' },
  { value: 'ru', label: 'Русский' },
  { value: 'zh', label: '中文' },
  { value: 'ja', label: '日本語' },
  { value: 'ko', label: '한국어' },
] as const;

export const PLATFORM_OPTIONS = [
  { value: 'twitter', label: 'Twitter', icon: '🐦' },
  { value: 'linkedin', label: 'LinkedIn', icon: '💼' },
  { value: 'facebook', label: 'Facebook', icon: '📘' },
  { value: 'instagram', label: 'Instagram', icon: '📷' },
  { value: 'tiktok', label: 'TikTok', icon: '🎵' },
  { value: 'youtube', label: 'YouTube', icon: '📺' },
] as const;

export interface PartialSettingsUpdate {
  profile?: ProfileSettingsUpdate;
  notifications?: NotificationSettingsUpdate;
  privacy?: PrivacySettingsUpdate;
  content?: ContentSettingsUpdate;
  interface?: InterfaceSettingsUpdate;
  integrations?: {
    connectedAccounts?: ConnectedAccounts[];
    apiKeys?: ApiKey[];
  };
}
