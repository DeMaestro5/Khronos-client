// src/types/settings.ts

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

  // Notification preferences - Updated structure
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
  enableAnimations?: boolean;
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
  { value: 'UTC', label: 'UTC' },
  { value: 'EST', label: 'Eastern Time (EST)' },
  { value: 'PST', label: 'Pacific Time (PST)' },
  { value: 'GMT', label: 'Greenwich Mean Time (GMT)' },
  { value: 'CET', label: 'Central European Time (CET)' },
  { value: 'JST', label: 'Japan Standard Time (JST)' },
  { value: 'CST', label: 'Central Standard Time (CST)' },
  { value: 'MST', label: 'Mountain Standard Time (MST)' },
] as const;

export const LANGUAGE_OPTIONS = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Spanish' },
  { value: 'fr', label: 'French' },
  { value: 'de', label: 'German' },
  { value: 'it', label: 'Italian' },
  { value: 'pt', label: 'Portuguese' },
  { value: 'zh', label: 'Chinese' },
  { value: 'ja', label: 'Japanese' },
  { value: 'ko', label: 'Korean' },
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
