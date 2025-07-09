'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
import { useAuth } from './AuthContext';
import { settingsApi } from '@/src/lib/api';
import {
  UserSettings,
  SettingsState,
  ProfileSettingsUpdate,
  NotificationSettingsUpdate,
  PrivacySettingsUpdate,
  ContentSettingsUpdate,
  InterfaceSettingsUpdate,
} from '@/src/types/settings';
import toast from 'react-hot-toast';

// Union type for all possible update data types
type SettingsUpdateData =
  | ProfileSettingsUpdate
  | NotificationSettingsUpdate
  | PrivacySettingsUpdate
  | ContentSettingsUpdate
  | InterfaceSettingsUpdate;

// Backend notification structure (what the backend expects)
interface BackendNotificationSettings {
  email?: {
    enabled?: boolean;
    marketing?: boolean;
    productUpdate?: boolean;
    weeklyDigest?: boolean;
    contentReminders?: boolean;
    security?: boolean;
    updates?: boolean;
    messages?: boolean;
    reminders?: boolean;
    reports?: boolean;
  };
  push?: {
    enabled?: boolean;
    contentPublished?: boolean;
    trendsAlert?: boolean;
    collaborativeInvites?: boolean;
    security?: boolean;
    updates?: boolean;
    messages?: boolean;
    reminders?: boolean;
    marketing?: boolean;
    reports?: boolean;
  };
  inApp?: {
    enabled?: boolean;
    mentions?: boolean;
    comments?: boolean;
    likes?: boolean;
    security?: boolean;
    updates?: boolean;
    messages?: boolean;
    reminders?: boolean;
    marketing?: boolean;
    reports?: boolean;
  };
  quietHours?: {
    enabled?: boolean;
    startTime?: string;
    endTime?: string;
  };
}

// Backend settings structure (what comes from server)
interface BackendUserSettings {
  userId: string;
  profile: UserSettings['profile'];
  notifications: {
    email: {
      enabled: boolean;
      marketing: boolean;
      productUpdate: boolean;
      weeklyDigest: boolean;
      contentReminders: boolean;
    };
    push: {
      enabled: boolean;
      contentPublished: boolean;
      trendsAlert: boolean;
      collaborativeInvites: boolean;
    };
    inApp: {
      enabled: boolean;
      mentions: boolean;
      comments: boolean;
      likes: boolean;
    };
  };
  privacy: UserSettings['privacy'];
  content: {
    defaultPlatforms: string[];
    defaultContentType: 'article' | 'post' | 'video';
    autoSave: boolean;
    autoScheduling: boolean;
    aiSuggestion: boolean; // Note: backend uses "aiSuggestion"
    contentLanguage: string;
  };
  interface: {
    theme: 'light' | 'dark' | 'system';
    sidebarCollapsed: boolean;
    defaultView: 'list' | 'grid';
    itemsPerPage: number;
    enablesAnimation: boolean; // Note: backend uses "enablesAnimation"
    compactMode: boolean;
  };
  integrations: UserSettings['integrations'];
  createdAt: string;
  updatedAt: string;
}

// API response structure
interface ApiResponse<T = unknown> {
  data?: {
    statusCode?: string;
    data?: T;
    message?: string;
  };
}

// Settings API response
interface SettingsApiResponse {
  settings?: BackendUserSettings;
  profile?: UserSettings['profile'];
  notifications?: BackendUserSettings['notifications'];
  privacy?: UserSettings['privacy'];
  content?: BackendUserSettings['content'];
  interface?: BackendUserSettings['interface'];
}

// API update response type
interface SettingsUpdateResponse {
  settings?: BackendUserSettings;
  profile?: UserSettings['profile'];
  notifications?: BackendUserSettings['notifications'];
  privacy?: UserSettings['privacy'];
  content?: BackendUserSettings['content'];
  interface?: BackendUserSettings['interface'];
  updatedAt?: string;
}

// Error type
interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
}

function isApiError(error: unknown): error is ApiError {
  return typeof error === 'object' && error !== null && 'response' in error;
}

interface SettingsContextType extends SettingsState {
  fetchSettings: () => Promise<void>;
  refreshSettings: () => Promise<void>;
  updateSettings: (
    section: 'notifications' | 'profile' | 'privacy' | 'content' | 'interface',
    data: SettingsUpdateData
  ) => Promise<void>;
  updateProfileSettings: (data: ProfileSettingsUpdate) => Promise<void>;
  updateNotificationSettings: (
    data: NotificationSettingsUpdate
  ) => Promise<void>;
  updatePrivacySettings: (data: PrivacySettingsUpdate) => Promise<void>;
  updateContentSettings: (data: ContentSettingsUpdate) => Promise<void>;
  updateInterfaceSettings: (data: InterfaceSettingsUpdate) => Promise<void>;
  updateAllSettings: (data: Partial<UserSettings>) => Promise<void>;
  resetToDefaults: () => Promise<void>;
  exportSettings: () => Promise<void>;
  markUnsavedChanges: () => void;
  clearUnsavedChanges: () => void;
  isLoading: boolean;
}

const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined
);

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}

// Convert backend notification settings to frontend format
function convertBackendNotificationsToFrontend(
  backendNotifications: BackendUserSettings['notifications']
): UserSettings['notifications'] {
  return {
    emailEnabled: backendNotifications.email?.enabled || false,
    pushEnabled: backendNotifications.push?.enabled || false,
    inAppEnabled: backendNotifications.inApp?.enabled || false,
    emailTypes: {
      security: false, // Default since backend doesn't have this
      updates: backendNotifications.email?.productUpdate || false,
      messages: false, // Default since backend doesn't have this
      reminders: backendNotifications.email?.contentReminders || false,
      marketing: backendNotifications.email?.marketing || false,
      reports: backendNotifications.email?.weeklyDigest || false,
    },
    pushTypes: {
      security: false, // Default since backend doesn't have this
      updates: backendNotifications.push?.trendsAlert || false,
      messages: false, // Default since backend doesn't have this
      reminders: false, // Default since backend doesn't have this
      marketing: false, // Default since backend doesn't have this
      reports: false, // Default since backend doesn't have this
    },
    inAppTypes: {
      security: false, // Default since backend doesn't have this
      updates: false, // Default since backend doesn't have this
      messages: backendNotifications.inApp?.mentions || false,
      reminders: false, // Default since backend doesn't have this
      marketing: false, // Default since backend doesn't have this
      reports: false, // Default since backend doesn't have this
    },
    quietHoursEnabled: false, // Default since backend doesn't have this
    quietHoursStart: '22:00',
    quietHoursEnd: '08:00',
  };
}

// Convert frontend notification settings to backend format
function convertFrontendNotificationsToBackend(
  frontendNotifications: NotificationSettingsUpdate
): BackendNotificationSettings {
  const backendData: BackendNotificationSettings = {};

  if (
    frontendNotifications.emailEnabled !== undefined ||
    frontendNotifications.emailTypes
  ) {
    backendData.email = {
      enabled: frontendNotifications.emailEnabled,
      marketing: frontendNotifications.emailTypes?.marketing,
      productUpdate: frontendNotifications.emailTypes?.updates,
      weeklyDigest: frontendNotifications.emailTypes?.reports,
      contentReminders: frontendNotifications.emailTypes?.reminders,
    };
  }

  if (
    frontendNotifications.pushEnabled !== undefined ||
    frontendNotifications.pushTypes
  ) {
    backendData.push = {
      enabled: frontendNotifications.pushEnabled,
      contentPublished: true, // Default
      trendsAlert: frontendNotifications.pushTypes?.updates,
      collaborativeInvites: true, // Default
    };
  }

  if (
    frontendNotifications.inAppEnabled !== undefined ||
    frontendNotifications.inAppTypes
  ) {
    backendData.inApp = {
      enabled: frontendNotifications.inAppEnabled,
      mentions: frontendNotifications.inAppTypes?.messages,
      comments: true, // Default
      likes: false, // Default
    };
  }

  return backendData;
}

// Convert backend settings to frontend format
function convertBackendSettingsToFrontend(
  backendSettings: BackendUserSettings
): UserSettings {
  return {
    _id: backendSettings.userId,
    userId: backendSettings.userId,
    profile: backendSettings.profile,
    notifications: convertBackendNotificationsToFrontend(
      backendSettings.notifications
    ),
    privacy: backendSettings.privacy,
    content: {
      ...backendSettings.content,
      aiSuggestions: backendSettings.content.aiSuggestion, // Convert property name
    },
    interface: {
      ...backendSettings.interface,
      enableAnimation: backendSettings.interface.enablesAnimation, // Convert property name
    },
    integrations: backendSettings.integrations,
    createdAt: backendSettings.createdAt,
    updatedAt: backendSettings.updatedAt,
  };
}

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated } = useAuth();

  const [state, setState] = useState<SettingsState>({
    settings: null,
    loading: false,
    error: null,
    hasUnsavedChanges: false,
  });

  const updateState = useCallback((updates: Partial<SettingsState>) => {
    setState((prev) => ({ ...prev, ...updates }));
  }, []);

  const fetchSettings = useCallback(async () => {
    if (!isAuthenticated || !user) {
      updateState({ settings: null, loading: false, error: null });
      return;
    }

    updateState({ loading: true, error: null });

    try {
      const response: ApiResponse<SettingsApiResponse> =
        await settingsApi.getSettings();

      if (
        response.data?.statusCode === '10000' &&
        response.data?.data?.settings
      ) {
        const backendSettings = response.data.data.settings;
        const frontendSettings =
          convertBackendSettingsToFrontend(backendSettings);

        updateState({
          settings: frontendSettings,
          loading: false,
          error: null,
        });
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error: unknown) {
      console.error('❌ SettingsContext: Failed to fetch settings:', error);

      let errorMessage = 'Failed to load settings';
      if (isApiError(error)) {
        errorMessage = error.response?.data?.message || errorMessage;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      updateState({
        loading: false,
        error: errorMessage,
      });

      toast.error(errorMessage);
    }
  }, [isAuthenticated, user, updateState]);

  const refreshSettings = useCallback(async () => {
    await fetchSettings();
  }, [fetchSettings]);

  const handleSettingsUpdate = useCallback(
    async (
      updateFn: () => Promise<ApiResponse<SettingsUpdateResponse>>,
      successMessage: string,
      errorMsg: string
    ) => {
      updateState({ loading: true, error: null });

      try {
        const response = await updateFn();

        if (response.data?.statusCode === '10000') {
          await fetchSettings(); // Refresh the full settings
          toast.success(successMessage);
        } else {
          throw new Error('Invalid response format');
        }
      } catch (error: unknown) {
        console.error('❌ SettingsContext: Settings update failed:', error);

        let errorMessage = errorMsg;
        if (isApiError(error)) {
          errorMessage = error.response?.data?.message || errorMessage;
        } else if (error instanceof Error) {
          errorMessage = error.message;
        }

        updateState({
          loading: false,
          error: errorMessage,
        });

        toast.error(errorMessage);
      }
    },
    [updateState, fetchSettings]
  );

  const updateProfileSettings = useCallback(
    async (data: ProfileSettingsUpdate) => {
      await handleSettingsUpdate(
        () => settingsApi.updateProfile(data),
        'Profile settings updated successfully',
        'Failed to update profile settings'
      );
    },
    [handleSettingsUpdate]
  );

  const updateNotificationSettings = useCallback(
    async (data: NotificationSettingsUpdate) => {
      const backendData = convertFrontendNotificationsToBackend(data);
      await handleSettingsUpdate(
        () => settingsApi.updateNotifications(backendData),
        'Notification settings updated successfully',
        'Failed to update notification settings'
      );
    },
    [handleSettingsUpdate]
  );

  const updatePrivacySettings = useCallback(
    async (data: PrivacySettingsUpdate) => {
      await handleSettingsUpdate(
        () => settingsApi.updatePrivacy(data),
        'Privacy settings updated successfully',
        'Failed to update privacy settings'
      );
    },
    [handleSettingsUpdate]
  );

  const updateContentSettings = useCallback(
    async (data: ContentSettingsUpdate) => {
      // Convert frontend property names to backend
      const backendData: Record<string, unknown> = {
        ...data,
        aiSuggestion: data.aiSuggestions, // Convert property name
      };
      delete backendData.aiSuggestions; // Remove the frontend property

      await handleSettingsUpdate(
        () => settingsApi.updateContent(backendData),
        'Content settings updated successfully',
        'Failed to update content settings'
      );
    },
    [handleSettingsUpdate]
  );

  const updateInterfaceSettings = useCallback(
    async (data: InterfaceSettingsUpdate) => {
      // Convert frontend property names to backend
      const backendData: Record<string, unknown> = {
        ...data,
        enablesAnimation: data.enableAnimations, // Convert property name
      };
      delete backendData.enableAnimations; // Remove the frontend property

      await handleSettingsUpdate(
        () => settingsApi.updateInterface(backendData),
        'Interface settings updated successfully',
        'Failed to update interface settings'
      );
    },
    [handleSettingsUpdate]
  );

  const updateSettings = useCallback(
    async (
      section:
        | 'notifications'
        | 'profile'
        | 'privacy'
        | 'content'
        | 'interface',
      data: SettingsUpdateData
    ) => {
      switch (section) {
        case 'notifications':
          await updateNotificationSettings(data as NotificationSettingsUpdate);
          break;
        case 'profile':
          await updateProfileSettings(data as ProfileSettingsUpdate);
          break;
        case 'privacy':
          await updatePrivacySettings(data as PrivacySettingsUpdate);
          break;
        case 'content':
          await updateContentSettings(data as ContentSettingsUpdate);
          break;
        case 'interface':
          await updateInterfaceSettings(data as InterfaceSettingsUpdate);
          break;
        default:
          throw new Error(`Unknown settings section: ${section}`);
      }
    },
    [
      updateNotificationSettings,
      updateProfileSettings,
      updatePrivacySettings,
      updateContentSettings,
      updateInterfaceSettings,
    ]
  );

  const updateAllSettings = useCallback(
    async (data: Partial<UserSettings>) => {
      await handleSettingsUpdate(
        () => settingsApi.updateSettings(data),
        'Settings updated successfully',
        'Failed to update settings'
      );
    },
    [handleSettingsUpdate]
  );

  const resetToDefaults = useCallback(async () => {
    const confirmReset = window.confirm(
      'Are you sure you want to reset all settings to their default values? This action cannot be undone.'
    );

    if (!confirmReset) return;

    await handleSettingsUpdate(
      () => settingsApi.resetSettings(),
      'Settings reset to defaults successfully',
      'Failed to reset settings'
    );
  }, [handleSettingsUpdate]);

  const exportSettings = useCallback(async () => {
    try {
      updateState({ loading: true });

      const response: ApiResponse<UserSettings> =
        await settingsApi.exportSettings();

      if (response.data) {
        const blob = new Blob([JSON.stringify(response.data, null, 2)], {
          type: 'application/json',
        });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `settings-export-${
          new Date().toISOString().split('T')[0]
        }.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        toast.success('Settings exported successfully');
      }
    } catch (error: unknown) {
      console.error('❌ SettingsContext: Export failed:', error);

      let errorMessage = 'Failed to export settings';
      if (error instanceof Error) {
        errorMessage = error.message;
      }

      toast.error(errorMessage);
    } finally {
      updateState({ loading: false });
    }
  }, [updateState]);

  const markUnsavedChanges = useCallback(() => {
    updateState({ hasUnsavedChanges: true });
  }, [updateState]);

  const clearUnsavedChanges = useCallback(() => {
    updateState({ hasUnsavedChanges: false });
  }, [updateState]);

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchSettings();
    } else {
      updateState({
        settings: null,
        loading: false,
        error: null,
        hasUnsavedChanges: false,
      });
    }
  }, [isAuthenticated, user, fetchSettings, updateState]);

  const contextValue: SettingsContextType = {
    ...state,
    isLoading: state.loading,
    fetchSettings,
    refreshSettings,
    updateSettings,
    updateProfileSettings,
    updateNotificationSettings,
    updatePrivacySettings,
    updateContentSettings,
    updateInterfaceSettings,
    updateAllSettings,
    resetToDefaults,
    exportSettings,
    markUnsavedChanges,
    clearUnsavedChanges,
  };

  return (
    <SettingsContext.Provider value={contextValue}>
      {children}
    </SettingsContext.Provider>
  );
}
