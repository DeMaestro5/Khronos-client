'use client';

import React, { useState, useEffect } from 'react';
import { useSettings } from '@/src/context/SettingsContext';
import { NotificationSettingsUpdate } from '@/src/types/settings';
import {
  EnvelopeIcon,
  DevicePhoneMobileIcon,
  ComputerDesktopIcon,
  CheckCircleIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';

// Define notification type keys as a union type for type safety
type NotificationTypeKey =
  | 'security'
  | 'updates'
  | 'messages'
  | 'reminders'
  | 'marketing'
  | 'reports';

interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  size?: 'sm' | 'md';
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  checked,
  onChange,
  disabled = false,
  size = 'md',
}) => {
  const sizeClasses = size === 'sm' ? 'h-4 w-8' : 'h-5 w-10';
  const thumbClasses = size === 'sm' ? 'h-2.5 w-2.5' : 'h-3 w-3';
  const translateClasses =
    size === 'sm'
      ? checked
        ? 'translate-x-4'
        : 'translate-x-0.5'
      : checked
      ? 'translate-x-5'
      : 'translate-x-0.5';

  return (
    <button
      type='button'
      onClick={() => !disabled && onChange(!checked)}
      disabled={disabled}
      className={`relative inline-flex items-center rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2 ${
        disabled
          ? 'opacity-50 cursor-not-allowed bg-gray-300 dark:bg-gray-600'
          : checked
          ? 'bg-accent-primary'
          : 'bg-gray-300 dark:bg-gray-600'
      } ${sizeClasses}`}
    >
      <span
        className={`inline-block transform rounded-full bg-white transition-all duration-200 ${thumbClasses} ${translateClasses}`}
      />
    </button>
  );
};

interface NotificationRowProps {
  title: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  icon?: React.ComponentType<{ className?: string }>;
}

const NotificationRow: React.FC<NotificationRowProps> = ({
  title,
  description,
  checked,
  onChange,
  disabled,
  icon: Icon,
}) => {
  return (
    <div className='flex items-start justify-between py-3 md:py-4'>
      <div className='flex items-start space-x-3 flex-1 min-w-0'>
        {Icon && (
          <div className='flex-shrink-0 mt-1'>
            <Icon className='h-4 w-4 md:h-5 md:w-5 text-theme-secondary' />
          </div>
        )}
        <div className='flex-1 min-w-0'>
          <h4
            className={`text-sm font-medium ${
              disabled ? 'text-theme-secondary' : 'text-theme-primary'
            }`}
          >
            {title}
          </h4>
          <p
            className={`text-xs md:text-sm mt-1 ${
              disabled ? 'text-theme-secondary' : 'text-theme-secondary'
            }`}
          >
            {description}
          </p>
        </div>
      </div>

      <div className='flex-shrink-0 ml-3'>
        <ToggleSwitch
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          size='sm'
        />
      </div>
    </div>
  );
};

interface NotificationSectionProps {
  title: string;
  description: string;
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
  children: React.ReactNode;
  icon?: React.ComponentType<{ className?: string }>;
}

const NotificationSection: React.FC<NotificationSectionProps> = ({
  title,
  description,
  enabled,
  onToggle,
  children,
  icon: Icon,
}) => {
  return (
    <div className='bg-theme-card rounded-lg border border-theme-primary p-4 md:p-6'>
      <div className='flex items-center justify-between mb-4'>
        <div className='flex items-center space-x-3 flex-1 min-w-0'>
          {Icon && (
            <Icon className='h-5 w-5 md:h-6 md:w-6 text-theme-secondary flex-shrink-0' />
          )}
          <div className='min-w-0 flex-1'>
            <h3 className='text-base md:text-lg font-semibold text-theme-primary'>
              {title}
            </h3>
            <p className='text-xs md:text-sm text-theme-secondary'>
              {description}
            </p>
          </div>
        </div>

        <div className='flex-shrink-0 ml-3'>
          <ToggleSwitch checked={enabled} onChange={onToggle} />
        </div>
      </div>

      {enabled && (
        <div className='border-t border-theme-primary -mx-4 md:-mx-6 px-4 md:px-6'>
          {children}
        </div>
      )}

      {!enabled && (
        <div className='border-t border-theme-primary -mx-4 md:-mx-6 px-4 md:px-6 py-4'>
          <p className='text-xs md:text-sm text-theme-secondary text-center'>
            Enable {title.toLowerCase()} to configure specific notification
            types
          </p>
        </div>
      )}
    </div>
  );
};

interface QuietHoursProps {
  enabled: boolean;
  startTime: string;
  endTime: string;
  onEnabledChange: (enabled: boolean) => void;
  onStartTimeChange: (time: string) => void;
  onEndTimeChange: (time: string) => void;
  error?: string;
}

const QuietHours: React.FC<QuietHoursProps> = ({
  enabled,
  startTime,
  endTime,
  onEnabledChange,
  onStartTimeChange,
  onEndTimeChange,
  error,
}) => {
  return (
    <div className='bg-theme-card rounded-lg border border-theme-primary p-6'>
      <div className='flex items-center justify-between mb-4'>
        <div>
          <h3 className='text-lg font-semibold text-theme-primary'>
            Quiet Hours
          </h3>
          <p className='text-sm text-theme-secondary'>
            Disable notifications during specific hours
          </p>
        </div>

        <ToggleSwitch checked={enabled} onChange={onEnabledChange} />
      </div>

      {enabled && (
        <div className='border-t border-theme-primary -mx-6 px-6 pt-4'>
          <div className='grid grid-cols-2 gap-4'>
            <div>
              <label className='text-sm font-medium text-theme-primary mb-2 block'>
                Start Time
              </label>
              <input
                type='time'
                value={startTime}
                onChange={(e) => onStartTimeChange(e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg text-theme-primary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:border-accent-primary ${
                  error
                    ? 'border-red-300 bg-red-50'
                    : 'border-theme-primary bg-theme-card'
                }`}
              />
            </div>

            <div>
              <label className='text-sm font-medium text-theme-primary mb-2 block'>
                End Time
              </label>
              <input
                type='time'
                value={endTime}
                onChange={(e) => onEndTimeChange(e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg text-theme-primary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:border-accent-primary ${
                  error
                    ? 'border-red-300 bg-red-50'
                    : 'border-theme-primary bg-theme-card'
                }`}
              />
            </div>
          </div>

          {error && <p className='text-xs text-red-600 mt-2'>{error}</p>}

          <p className='text-xs text-theme-secondary mt-2'>
            {enabled && startTime && endTime && !error && (
              <>
                Notifications will be silenced from {formatTime(startTime)} to{' '}
                {formatTime(endTime)}
              </>
            )}
          </p>
        </div>
      )}
    </div>
  );
};

// Helper function to format time
const formatTime = (time: string) => {
  try {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  } catch {
    return time;
  }
};

const NotificationSettingsSection: React.FC = () => {
  const { settings, updateSettings, isLoading } = useSettings();
  const [localSettings, setLocalSettings] =
    useState<NotificationSettingsUpdate>({});
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Initialize local settings when global settings load
  useEffect(() => {
    if (settings?.notifications) {
      setLocalSettings({
        emailEnabled: settings.notifications.emailEnabled,
        pushEnabled: settings.notifications.pushEnabled,
        inAppEnabled: settings.notifications.inAppEnabled,
        emailTypes: { ...settings.notifications.emailTypes },
        pushTypes: { ...settings.notifications.pushTypes },
        inAppTypes: { ...settings.notifications.inAppTypes },
        quietHoursEnabled: settings.notifications.quietHoursEnabled,
        quietHoursStart: settings.notifications.quietHoursStart,
        quietHoursEnd: settings.notifications.quietHoursEnd,
      });
    }
  }, [settings?.notifications]);

  // Check for changes
  useEffect(() => {
    if (!settings?.notifications) return;

    const originalSettings = {
      emailEnabled: settings.notifications.emailEnabled,
      pushEnabled: settings.notifications.pushEnabled,
      inAppEnabled: settings.notifications.inAppEnabled,
      emailTypes: settings.notifications.emailTypes,
      pushTypes: settings.notifications.pushTypes,
      inAppTypes: settings.notifications.inAppTypes,
      quietHoursEnabled: settings.notifications.quietHoursEnabled,
      quietHoursStart: settings.notifications.quietHoursStart,
      quietHoursEnd: settings.notifications.quietHoursEnd,
    };

    const hasChanges =
      JSON.stringify(localSettings) !== JSON.stringify(originalSettings);
    setHasChanges(hasChanges);
  }, [localSettings, settings?.notifications]);

  const validateQuietHours = () => {
    const newErrors: Record<string, string> = {};

    if (localSettings.quietHoursEnabled) {
      const startTime = localSettings.quietHoursStart;
      const endTime = localSettings.quietHoursEnd;

      if (!startTime || !endTime) {
        newErrors.quietHours = 'Both start and end times are required';
      } else if (
        !/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(startTime) ||
        !/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(endTime)
      ) {
        newErrors.quietHours = 'Please enter valid time format (HH:MM)';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSectionToggle = (
    section: 'email' | 'push' | 'inApp',
    enabled: boolean
  ) => {
    setLocalSettings((prev) => ({
      ...prev,
      [`${section}Enabled`]: enabled,
    }));

    // Clear related errors
    if (errors[section]) {
      setErrors((prev) => ({
        ...prev,
        [section]: '',
      }));
    }
  };

  const handleTypeToggle = (
    section: 'emailTypes' | 'pushTypes' | 'inAppTypes',
    type: NotificationTypeKey,
    enabled: boolean
  ) => {
    setLocalSettings((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [type]: enabled,
      },
    }));
  };

  // Helper function to safely get notification type value
  const getNotificationTypeValue = (
    types: Partial<Record<NotificationTypeKey, boolean>> | undefined,
    key: NotificationTypeKey
  ): boolean => {
    return types?.[key] || false;
  };

  const handleSave = async () => {
    if (!validateQuietHours()) {
      toast.error('Please fix the errors before saving');
      return;
    }

    setIsSaving(true);
    try {
      // Only send changed fields
      const changedFields: NotificationSettingsUpdate = {};

      if (localSettings.emailEnabled !== settings?.notifications.emailEnabled) {
        changedFields.emailEnabled = localSettings.emailEnabled;
      }
      if (localSettings.pushEnabled !== settings?.notifications.pushEnabled) {
        changedFields.pushEnabled = localSettings.pushEnabled;
      }
      if (localSettings.inAppEnabled !== settings?.notifications.inAppEnabled) {
        changedFields.inAppEnabled = localSettings.inAppEnabled;
      }

      // Check email types
      if (
        JSON.stringify(localSettings.emailTypes) !==
        JSON.stringify(settings?.notifications.emailTypes)
      ) {
        changedFields.emailTypes = localSettings.emailTypes;
      }

      // Check push types
      if (
        JSON.stringify(localSettings.pushTypes) !==
        JSON.stringify(settings?.notifications.pushTypes)
      ) {
        changedFields.pushTypes = localSettings.pushTypes;
      }

      // Check in-app types
      if (
        JSON.stringify(localSettings.inAppTypes) !==
        JSON.stringify(settings?.notifications.inAppTypes)
      ) {
        changedFields.inAppTypes = localSettings.inAppTypes;
      }

      // Check quiet hours
      if (
        localSettings.quietHoursEnabled !==
        settings?.notifications.quietHoursEnabled
      ) {
        changedFields.quietHoursEnabled = localSettings.quietHoursEnabled;
      }
      if (
        localSettings.quietHoursStart !==
        settings?.notifications.quietHoursStart
      ) {
        changedFields.quietHoursStart = localSettings.quietHoursStart;
      }
      if (
        localSettings.quietHoursEnd !== settings?.notifications.quietHoursEnd
      ) {
        changedFields.quietHoursEnd = localSettings.quietHoursEnd;
      }

      if (Object.keys(changedFields).length === 0) {
        toast('No changes to save', {
          icon: 'ℹ️',
          style: {
            background: '#3b82f6',
            color: 'white',
          },
        });
        return;
      }

      await updateSettings('notifications', changedFields);
      setHasChanges(false);
    } catch (error) {
      console.error('Failed to update notification settings:', error);
      // Error is already handled by the context with toast
    } finally {
      setIsSaving(false);
    }
  };

  const handleDiscard = () => {
    if (settings?.notifications) {
      setLocalSettings({
        emailEnabled: settings.notifications.emailEnabled,
        pushEnabled: settings.notifications.pushEnabled,
        inAppEnabled: settings.notifications.inAppEnabled,
        emailTypes: { ...settings.notifications.emailTypes },
        pushTypes: { ...settings.notifications.pushTypes },
        inAppTypes: { ...settings.notifications.inAppTypes },
        quietHoursEnabled: settings.notifications.quietHoursEnabled,
        quietHoursStart: settings.notifications.quietHoursStart,
        quietHoursEnd: settings.notifications.quietHoursEnd,
      });
      setErrors({});
      setHasChanges(false);
    }
  };

  if (isLoading && !settings) {
    return (
      <div className='space-y-6'>
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className='animate-pulse bg-gray-200 dark:bg-gray-700 rounded-lg h-48'
          />
        ))}
      </div>
    );
  }

  // Notification type configurations with typed keys
  const notificationTypes: Record<
    NotificationTypeKey,
    { title: string; description: string }
  > = {
    security: {
      title: 'Security Alerts',
      description: 'Account security, login attempts, and password changes',
    },
    updates: {
      title: 'Product Updates',
      description: 'New features, improvements, and system updates',
    },
    messages: {
      title: 'Messages',
      description: 'Direct messages and mentions from other users',
    },
    reminders: {
      title: 'Reminders',
      description: 'Scheduled reminders and task notifications',
    },
    marketing: {
      title: 'Marketing',
      description: 'Promotional emails and product announcements',
    },
    reports: {
      title: 'Reports',
      description: 'Weekly summaries and analytics reports',
    },
  };

  return (
    <div className='space-y-6'>
      {/* Unsaved Changes Banner */}
      {hasChanges && (
        <div className='bg-accent-warning/10 dark:bg-accent-warning/20 border border-accent-warning/30 dark:border-accent-warning/40 rounded-lg p-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center'>
              <div className='h-2 w-2 bg-accent-warning rounded-full mr-3' />
              <p className='text-sm font-medium text-theme-primary dark:text-theme-primary'>
                You have unsaved changes
              </p>
            </div>
            <div className='flex items-center space-x-3'>
              <button
                onClick={handleDiscard}
                disabled={isSaving}
                className='text-sm text-theme-secondary hover:text-theme-primary disabled:opacity-50'
              >
                Discard
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className='bg-accent-warning hover:bg-accent-warning/90 text-white px-3 py-1 rounded-md text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed'
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Email Notifications */}
      <NotificationSection
        title='Email Notifications'
        description='Receive notifications via email'
        enabled={localSettings.emailEnabled || false}
        onToggle={(enabled) => handleSectionToggle('email', enabled)}
        icon={EnvelopeIcon}
      >
        <div className='space-y-0 divide-y divide-theme-primary'>
          {(
            Object.entries(notificationTypes) as [
              NotificationTypeKey,
              (typeof notificationTypes)[NotificationTypeKey]
            ][]
          ).map(([key, config]) => (
            <NotificationRow
              key={key}
              title={config.title}
              description={config.description}
              checked={getNotificationTypeValue(localSettings.emailTypes, key)}
              onChange={(checked) =>
                handleTypeToggle('emailTypes', key, checked)
              }
              disabled={!localSettings.emailEnabled}
            />
          ))}
        </div>
      </NotificationSection>

      {/* Push Notifications */}
      <NotificationSection
        title='Push Notifications'
        description='Receive notifications on your devices'
        enabled={localSettings.pushEnabled || false}
        onToggle={(enabled) => handleSectionToggle('push', enabled)}
        icon={DevicePhoneMobileIcon}
      >
        <div className='space-y-0 divide-y divide-theme-primary'>
          {(
            Object.entries(notificationTypes) as [
              NotificationTypeKey,
              (typeof notificationTypes)[NotificationTypeKey]
            ][]
          ).map(([key, config]) => (
            <NotificationRow
              key={key}
              title={config.title}
              description={config.description}
              checked={getNotificationTypeValue(localSettings.pushTypes, key)}
              onChange={(checked) =>
                handleTypeToggle('pushTypes', key, checked)
              }
              disabled={!localSettings.pushEnabled}
            />
          ))}
        </div>
      </NotificationSection>

      {/* In-App Notifications */}
      <NotificationSection
        title='In-App Notifications'
        description='Show notifications within the application'
        enabled={localSettings.inAppEnabled || false}
        onToggle={(enabled) => handleSectionToggle('inApp', enabled)}
        icon={ComputerDesktopIcon}
      >
        <div className='space-y-0 divide-y divide-theme-primary'>
          {(
            Object.entries(notificationTypes) as [
              NotificationTypeKey,
              (typeof notificationTypes)[NotificationTypeKey]
            ][]
          ).map(([key, config]) => (
            <NotificationRow
              key={key}
              title={config.title}
              description={config.description}
              checked={getNotificationTypeValue(localSettings.inAppTypes, key)}
              onChange={(checked) =>
                handleTypeToggle('inAppTypes', key, checked)
              }
              disabled={!localSettings.inAppEnabled}
            />
          ))}
        </div>
      </NotificationSection>

      {/* Quiet Hours */}
      <QuietHours
        enabled={localSettings.quietHoursEnabled || false}
        startTime={localSettings.quietHoursStart || '22:00'}
        endTime={localSettings.quietHoursEnd || '08:00'}
        onEnabledChange={(enabled) =>
          setLocalSettings((prev) => ({ ...prev, quietHoursEnabled: enabled }))
        }
        onStartTimeChange={(time) =>
          setLocalSettings((prev) => ({ ...prev, quietHoursStart: time }))
        }
        onEndTimeChange={(time) =>
          setLocalSettings((prev) => ({ ...prev, quietHoursEnd: time }))
        }
        error={errors.quietHours}
      />

      {/* Notification Summary */}
      <div className='bg-theme-secondary/10 rounded-lg border border-theme-primary p-6'>
        <h3 className='text-lg font-semibold text-theme-primary mb-4'>
          Notification Summary
        </h3>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          <div className='text-center'>
            <div
              className={`inline-flex items-center justify-center w-12 h-12 rounded-full mb-2 ${
                localSettings.emailEnabled
                  ? 'bg-green-100 dark:bg-green-900/20'
                  : 'bg-theme-secondary/20'
              }`}
            >
              {localSettings.emailEnabled ? (
                <CheckCircleIcon className='h-6 w-6 text-green-600 dark:text-green-400' />
              ) : (
                <XCircleIcon className='h-6 w-6 text-theme-secondary' />
              )}
            </div>
            <p className='text-sm font-medium text-theme-primary'>Email</p>
            <p className='text-xs text-theme-secondary'>
              {localSettings.emailEnabled
                ? `${
                    Object.values(localSettings.emailTypes || {}).filter(
                      Boolean
                    ).length
                  } types enabled`
                : 'Disabled'}
            </p>
          </div>

          <div className='text-center'>
            <div
              className={`inline-flex items-center justify-center w-12 h-12 rounded-full mb-2 ${
                localSettings.pushEnabled
                  ? 'bg-green-100 dark:bg-green-900/20'
                  : 'bg-theme-secondary/20'
              }`}
            >
              {localSettings.pushEnabled ? (
                <CheckCircleIcon className='h-6 w-6 text-green-600 dark:text-green-400' />
              ) : (
                <XCircleIcon className='h-6 w-6 text-theme-secondary' />
              )}
            </div>
            <p className='text-sm font-medium text-theme-primary'>Push</p>
            <p className='text-xs text-theme-secondary'>
              {localSettings.pushEnabled
                ? `${
                    Object.values(localSettings.pushTypes || {}).filter(Boolean)
                      .length
                  } types enabled`
                : 'Disabled'}
            </p>
          </div>

          <div className='text-center'>
            <div
              className={`inline-flex items-center justify-center w-12 h-12 rounded-full mb-2 ${
                localSettings.inAppEnabled
                  ? 'bg-green-100 dark:bg-green-900/20'
                  : 'bg-theme-secondary/20'
              }`}
            >
              {localSettings.inAppEnabled ? (
                <CheckCircleIcon className='h-6 w-6 text-green-600 dark:text-green-400' />
              ) : (
                <XCircleIcon className='h-6 w-6 text-theme-secondary' />
              )}
            </div>
            <p className='text-sm font-medium text-theme-primary'>In-App</p>
            <p className='text-xs text-theme-secondary'>
              {localSettings.inAppEnabled
                ? `${
                    Object.values(localSettings.inAppTypes || {}).filter(
                      Boolean
                    ).length
                  } types enabled`
                : 'Disabled'}
            </p>
          </div>
        </div>

        {localSettings.quietHoursEnabled && (
          <div className='mt-4 p-3 bg-accent-primary/10 rounded-lg'>
            <p className='text-sm text-accent-primary'>
              <span className='font-medium'>Quiet Hours:</span>{' '}
              {formatTime(localSettings.quietHoursStart || '22:00')} -{' '}
              {formatTime(localSettings.quietHoursEnd || '08:00')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationSettingsSection;
