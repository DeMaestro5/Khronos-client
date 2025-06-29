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

// API-compatible notification structure (what the backend expects)
interface ApiNotificationSettings {
  email?: {
    enabled?: boolean;
    marketing?: boolean;
    productUpdates?: boolean;
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
    trendAlert?: boolean;
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

// Type for API response structure
interface ApiResponse<T = unknown> {
  data?: {
    statusCode?: string;
    data?: T;
    message?: string;
  };
}

// Type for settings API response (raw from backend)
interface SettingsApiResponse {
  settings?: UserSettings;
  notifications?: ApiNotificationSettings;
  privacy?: UserSettings['privacy'];
  profile?: UserSettings['profile'];
  content?: UserSettings['content'];
  interface?: UserSettings['interface'];
}

// Type for processed settings response (after conversion)
interface ProcessedSettingsResponse {
  settings?: UserSettings;
  notifications?: UserSettings['notifications'];
  privacy?: UserSettings['privacy'];
  profile?: UserSettings['profile'];
  content?: UserSettings['content'];
  interface?: UserSettings['interface'];
}

// Type for error with response
interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
}

// Helper function to check if error is an ApiError
function isApiError(error: unknown): error is ApiError {
  return typeof error === 'object' && error !== null && 'response' in error;
}

interface SettingsContextType extends SettingsState {
  // Data fetching
  fetchSettings: () => Promise<void>;
  refreshSettings: () => Promise<void>;

  // Generic update method with proper typing
  updateSettings: (
    section: 'notifications' | 'profile' | 'privacy' | 'content' | 'interface',
    data: SettingsUpdateData
  ) => Promise<void>;

  // Section updates
  updateProfileSettings: (data: ProfileSettingsUpdate) => Promise<void>;
  updateNotificationSettings: (
    data: NotificationSettingsUpdate
  ) => Promise<void>;
  updatePrivacySettings: (data: PrivacySettingsUpdate) => Promise<void>;
  updateContentSettings: (data: ContentSettingsUpdate) => Promise<void>;
  updateInterfaceSettings: (data: InterfaceSettingsUpdate) => Promise<void>;

  // Bulk operations
  updateAllSettings: (data: Partial<UserSettings>) => Promise<void>;
  resetToDefaults: () => Promise<void>;
  exportSettings: () => Promise<void>;

  // Local state management
  markUnsavedChanges: () => void;
  clearUnsavedChanges: () => void;

  // Add these properties that the component expects
  isLoading: boolean;
}

const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined
);

// Custom hook to use settings context
export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}

// Helper function to convert flat notification structure to API format
function convertNotificationSettingsToApi(
  data: NotificationSettingsUpdate
): ApiNotificationSettings {
  const apiData: ApiNotificationSettings = {};

  // Convert email settings
  if (data.emailEnabled !== undefined || data.emailTypes) {
    apiData.email = {
      enabled: data.emailEnabled,
      ...data.emailTypes,
    };
  }

  // Convert push settings
  if (data.pushEnabled !== undefined || data.pushTypes) {
    apiData.push = {
      enabled: data.pushEnabled,
      ...data.pushTypes,
    };
  }

  // Convert in-app settings
  if (data.inAppEnabled !== undefined || data.inAppTypes) {
    apiData.inApp = {
      enabled: data.inAppEnabled,
      ...data.inAppTypes,
    };
  }

  // Convert quiet hours
  if (
    data.quietHoursEnabled !== undefined ||
    data.quietHoursStart ||
    data.quietHoursEnd
  ) {
    apiData.quietHours = {
      enabled: data.quietHoursEnabled,
      startTime: data.quietHoursStart,
      endTime: data.quietHoursEnd,
    };
  }

  return apiData;
}

// Helper function to convert API response to flat structure
function convertApiNotificationSettingsToFlat(
  apiData: ApiNotificationSettings
): UserSettings['notifications'] {
  return {
    emailEnabled: apiData.email?.enabled || false,
    pushEnabled: apiData.push?.enabled || false,
    inAppEnabled: apiData.inApp?.enabled || false,
    emailTypes: {
      security: apiData.email?.security || false,
      updates: apiData.email?.updates || apiData.email?.productUpdates || false,
      messages: apiData.email?.messages || false,
      reminders:
        apiData.email?.reminders || apiData.email?.contentReminders || false,
      marketing: apiData.email?.marketing || false,
      reports: apiData.email?.reports || apiData.email?.weeklyDigest || false,
    },
    pushTypes: {
      security: apiData.push?.security || false,
      updates: apiData.push?.updates || apiData.push?.trendAlert || false,
      messages: apiData.push?.messages || false,
      reminders: apiData.push?.reminders || false,
      marketing: apiData.push?.marketing || false,
      reports: apiData.push?.reports || false,
    },
    inAppTypes: {
      security: apiData.inApp?.security || false,
      updates: apiData.inApp?.updates || false,
      messages: apiData.inApp?.messages || apiData.inApp?.mentions || false,
      reminders: apiData.inApp?.reminders || false,
      marketing: apiData.inApp?.marketing || false,
      reports: apiData.inApp?.reports || false,
    },
    quietHoursEnabled: apiData.quietHours?.enabled || false,
    quietHoursStart: apiData.quietHours?.startTime || '22:00',
    quietHoursEnd: apiData.quietHours?.endTime || '08:00',
  };
}

// Settings provider component
export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated } = useAuth();

  // Settings state
  const [state, setState] = useState<SettingsState>({
    settings: null,
    loading: false,
    error: null,
    hasUnsavedChanges: false,
  });

  // Helper function to update state
  const updateState = useCallback((updates: Partial<SettingsState>) => {
    setState((prev) => ({ ...prev, ...updates }));
  }, []);

  // Fetch settings from API
  const fetchSettings = useCallback(async () => {
    if (!isAuthenticated || !user) {
      updateState({ settings: null, loading: false, error: null });
      return;
    }

    updateState({ loading: true, error: null });

    try {
      console.log('🔧 SettingsContext: Fetching user settings...');

      const response: ApiResponse<SettingsApiResponse> =
        await settingsApi.getSettings();

      if (
        response.data?.statusCode === '10000' &&
        response.data?.data?.settings
      ) {
        const settings = response.data.data.settings;

        // Convert API notification structure to flat structure if needed
        if (
          settings.notifications &&
          !('emailEnabled' in settings.notifications)
        ) {
          settings.notifications = convertApiNotificationSettingsToFlat(
            settings.notifications as ApiNotificationSettings
          );
        }

        updateState({
          settings,
          loading: false,
          error: null,
        });

        console.log('✅ SettingsContext: Settings loaded successfully');
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

  // Refresh settings (force reload)
  const refreshSettings = useCallback(async () => {
    await fetchSettings();
  }, [fetchSettings]);

  // Generic function to handle settings updates
  const handleSettingsUpdate = useCallback(
    async (
      updateFn: () => Promise<ApiResponse<SettingsApiResponse>>,
      successMessage: string,
      errorMsg: string
    ) => {
      updateState({ loading: true, error: null });

      try {
        const response = await updateFn();

        if (response.data?.statusCode === '10000') {
          // Extract settings from different possible response structures
          let updatedSettings: UserSettings | null = null;

          if (response.data.data?.settings) {
            updatedSettings = response.data.data.settings;

            // Convert API notification structure to flat structure if needed
            if (
              updatedSettings.notifications &&
              !('emailEnabled' in updatedSettings.notifications)
            ) {
              updatedSettings.notifications =
                convertApiNotificationSettingsToFlat(
                  updatedSettings.notifications as ApiNotificationSettings
                );
            }
          } else if (
            response.data.data?.notifications ||
            response.data.data?.privacy ||
            response.data.data?.profile ||
            response.data.data?.content ||
            response.data.data?.interface
          ) {
            // For section updates, we need to merge with existing settings
            const apiSectionData = response.data.data;
            const processedSectionData: ProcessedSettingsResponse = {};

            // Convert notifications if present
            if (apiSectionData.notifications) {
              if ('emailEnabled' in apiSectionData.notifications) {
                // Already in flat format
                processedSectionData.notifications =
                  apiSectionData.notifications as UserSettings['notifications'];
              } else {
                // Convert from API format to flat format
                processedSectionData.notifications =
                  convertApiNotificationSettingsToFlat(
                    apiSectionData.notifications as ApiNotificationSettings
                  );
              }
            }

            // Copy other sections as-is
            if (apiSectionData.privacy) {
              processedSectionData.privacy = apiSectionData.privacy;
            }
            if (apiSectionData.profile) {
              processedSectionData.profile = apiSectionData.profile;
            }
            if (apiSectionData.content) {
              processedSectionData.content = apiSectionData.content;
            }
            if (apiSectionData.interface) {
              processedSectionData.interface = apiSectionData.interface;
            }

            updatedSettings = {
              ...state.settings!,
              ...processedSectionData,
            };
          }

          if (updatedSettings) {
            updateState({
              settings: updatedSettings,
              loading: false,
              hasUnsavedChanges: false,
            });
          }

          toast.success(successMessage);
          console.log('✅ SettingsContext: Settings updated successfully');
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
    [state.settings, updateState]
  );

  // Update profile settings
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

  // Update notification settings
  const updateNotificationSettings = useCallback(
    async (data: NotificationSettingsUpdate) => {
      // Convert to API format
      const apiData = convertNotificationSettingsToApi(data);

      await handleSettingsUpdate(
        () => settingsApi.updateNotifications(apiData),
        'Notification settings updated successfully',
        'Failed to update notification settings'
      );
    },
    [handleSettingsUpdate]
  );

  // Update privacy settings
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

  // Update content settings
  const updateContentSettings = useCallback(
    async (data: ContentSettingsUpdate) => {
      await handleSettingsUpdate(
        () => settingsApi.updateContent(data),
        'Content settings updated successfully',
        'Failed to update content settings'
      );
    },
    [handleSettingsUpdate]
  );

  // Update interface settings
  const updateInterfaceSettings = useCallback(
    async (data: InterfaceSettingsUpdate) => {
      await handleSettingsUpdate(
        () => settingsApi.updateInterface(data),
        'Interface settings updated successfully',
        'Failed to update interface settings'
      );
    },
    [handleSettingsUpdate]
  );

  // Generic update method with proper typing
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

  // Update all settings at once
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

  // Reset settings to defaults
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

  // Export settings
  const exportSettings = useCallback(async () => {
    try {
      updateState({ loading: true });

      const response: ApiResponse<UserSettings> =
        await settingsApi.exportSettings();

      if (response.data) {
        // Create download link
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

  // Mark unsaved changes
  const markUnsavedChanges = useCallback(() => {
    updateState({ hasUnsavedChanges: true });
  }, [updateState]);

  // Clear unsaved changes
  const clearUnsavedChanges = useCallback(() => {
    updateState({ hasUnsavedChanges: false });
  }, [updateState]);

  // Auto-fetch settings when user authenticates
  useEffect(() => {
    if (isAuthenticated && user) {
      fetchSettings();
    } else {
      // Clear settings when user logs out
      updateState({
        settings: null,
        loading: false,
        error: null,
        hasUnsavedChanges: false,
      });
    }
  }, [isAuthenticated, user, fetchSettings, updateState]);

  // Context value
  const contextValue: SettingsContextType = {
    ...state,
    isLoading: state.loading, // Add alias for component compatibility
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
