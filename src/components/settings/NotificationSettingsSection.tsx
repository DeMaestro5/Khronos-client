// src/components/settings/NotificationSettingsSection.tsx
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

// Define notification type keys as a union type for type safety
type NotificationTypeKey =
  | 'security'
  | 'updates'
  | 'messages'
  | 'reminders'
  | 'marketing'
  | 'reports';

// Type guard to check if a string is a valid notification type key
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
  const sizeClasses = size === 'sm' ? 'h-5 w-9' : 'h-6 w-11';

  const thumbClasses = size === 'sm' ? 'h-3 w-3' : 'h-4 w-4';

  const translateClasses =
    size === 'sm'
      ? checked
        ? 'translate-x-5'
        : 'translate-x-1'
      : checked
      ? 'translate-x-6'
      : 'translate-x-1';

  return (
    <button
      type='button'
      onClick={() => !disabled && onChange(!checked)}
      disabled={disabled}
      className={`relative inline-flex items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
        disabled
          ? 'opacity-50 cursor-not-allowed bg-gray-200 dark:bg-gray-700'
          : checked
          ? 'bg-blue-600'
          : 'bg-gray-200 dark:bg-gray-700'
      } ${sizeClasses}`}
    >
      <span
        className={`inline-block transform rounded-full bg-white transition-transform ${thumbClasses} ${translateClasses}`}
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
    <div className='flex items-start justify-between py-4'>
      <div className='flex items-start space-x-3 flex-1'>
        {Icon && (
          <div className='flex-shrink-0 mt-1'>
            <Icon className='h-5 w-5 text-gray-400' />
          </div>
        )}
        <div className='flex-1'>
          <h4
            className={`text-sm font-medium ${
              disabled
                ? 'text-gray-400 dark:text-gray-500'
                : 'text-gray-900 dark:text-gray-100'
            }`}
          >
            {title}
          </h4>
          <p
            className={`text-sm mt-1 ${
              disabled
                ? 'text-gray-400 dark:text-gray-500'
                : 'text-gray-500 dark:text-gray-400'
            }`}
          >
            {description}
          </p>
        </div>
      </div>

      <div className='flex-shrink-0'>
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
    <div className='bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6'>
      <div className='flex items-center justify-between mb-4'>
        <div className='flex items-center space-x-3'>
          {Icon && <Icon className='h-6 w-6 text-gray-400' />}
          <div>
            <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100'>
              {title}
            </h3>
            <p className='text-sm text-gray-500 dark:text-gray-400'>
              {description}
            </p>
          </div>
        </div>

        <ToggleSwitch checked={enabled} onChange={onToggle} />
      </div>

      {enabled && (
        <div className='border-t border-gray-200 dark:border-gray-700 -mx-6 px-6'>
          {children}
        </div>
      )}

      {!enabled && (
        <div className='border-t border-gray-200 dark:border-gray-700 -mx-6 px-6 py-4'>
          <p className='text-sm text-gray-400 dark:text-gray-500 text-center'>
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
}

const QuietHours: React.FC<QuietHoursProps> = ({
  enabled,
  startTime,
  endTime,
  onEnabledChange,
  onStartTimeChange,
  onEndTimeChange,
}) => {
  return (
    <div className='bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6'>
      <div className='flex items-center justify-between mb-4'>
        <div>
          <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100'>
            Quiet Hours
          </h3>
          <p className='text-sm text-gray-500 dark:text-gray-400'>
            Disable notifications during specific hours
          </p>
        </div>

        <ToggleSwitch checked={enabled} onChange={onEnabledChange} />
      </div>

      {enabled && (
        <div className='border-t border-gray-200 dark:border-gray-700 -mx-6 px-6 pt-4'>
          <div className='grid grid-cols-2 gap-4'>
            <div>
              <label className='text-sm font-medium text-gray-900 dark:text-gray-100 mb-2 block'>
                Start Time
              </label>
              <input
                type='time'
                value={startTime}
                onChange={(e) => onStartTimeChange(e.target.value)}
                className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-lg text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
              />
            </div>

            <div>
              <label className='text-sm font-medium text-gray-900 dark:text-gray-100 mb-2 block'>
                End Time
              </label>
              <input
                type='time'
                value={endTime}
                onChange={(e) => onEndTimeChange(e.target.value)}
                className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-lg text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
              />
            </div>
          </div>

          <p className='text-xs text-gray-500 dark:text-gray-400 mt-2'>
            {enabled && startTime && endTime && (
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
  return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

const NotificationSettingsSection: React.FC = () => {
  const { settings, updateSettings, isLoading } = useSettings();
  const [localSettings, setLocalSettings] =
    useState<NotificationSettingsUpdate>({});
  const [hasChanges, setHasChanges] = useState(false);

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

    const hasChanges =
      JSON.stringify(localSettings) !==
      JSON.stringify({
        emailEnabled: settings.notifications.emailEnabled,
        pushEnabled: settings.notifications.pushEnabled,
        inAppEnabled: settings.notifications.inAppEnabled,
        emailTypes: settings.notifications.emailTypes,
        pushTypes: settings.notifications.pushTypes,
        inAppTypes: settings.notifications.inAppTypes,
        quietHoursEnabled: settings.notifications.quietHoursEnabled,
        quietHoursStart: settings.notifications.quietHoursStart,
        quietHoursEnd: settings.notifications.quietHoursEnd,
      });

    setHasChanges(hasChanges);
  }, [localSettings, settings?.notifications]);

  const handleSectionToggle = (
    section: 'email' | 'push' | 'inApp',
    enabled: boolean
  ) => {
    setLocalSettings((prev) => ({
      ...prev,
      [`${section}Enabled`]: enabled,
    }));
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
    await updateSettings('notifications', localSettings);
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
    }
  };

  if (isLoading) {
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
        <div className='bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center'>
              <div className='h-2 w-2 bg-yellow-400 rounded-full mr-3' />
              <p className='text-sm font-medium text-yellow-800 dark:text-yellow-200'>
                You have unsaved changes
              </p>
            </div>
            <div className='flex items-center space-x-3'>
              <button
                onClick={handleDiscard}
                className='text-sm text-yellow-700 dark:text-yellow-300 hover:text-yellow-900 dark:hover:text-yellow-100'
              >
                Discard
              </button>
              <button
                onClick={handleSave}
                className='bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded-md text-sm font-medium'
              >
                Save Changes
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
        <div className='space-y-0 divide-y divide-gray-200 dark:divide-gray-700'>
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
        <div className='space-y-0 divide-y divide-gray-200 dark:divide-gray-700'>
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
        <div className='space-y-0 divide-y divide-gray-200 dark:divide-gray-700'>
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
      />

      {/* Notification Summary */}
      <div className='bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-6'>
        <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4'>
          Notification Summary
        </h3>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          <div className='text-center'>
            <div
              className={`inline-flex items-center justify-center w-12 h-12 rounded-full mb-2 ${
                localSettings.emailEnabled
                  ? 'bg-green-100 dark:bg-green-900/20'
                  : 'bg-gray-100 dark:bg-gray-800'
              }`}
            >
              {localSettings.emailEnabled ? (
                <CheckCircleIcon className='h-6 w-6 text-green-600 dark:text-green-400' />
              ) : (
                <XCircleIcon className='h-6 w-6 text-gray-400' />
              )}
            </div>
            <p className='text-sm font-medium text-gray-900 dark:text-gray-100'>
              Email
            </p>
            <p className='text-xs text-gray-500 dark:text-gray-400'>
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
                  : 'bg-gray-100 dark:bg-gray-800'
              }`}
            >
              {localSettings.pushEnabled ? (
                <CheckCircleIcon className='h-6 w-6 text-green-600 dark:text-green-400' />
              ) : (
                <XCircleIcon className='h-6 w-6 text-gray-400' />
              )}
            </div>
            <p className='text-sm font-medium text-gray-900 dark:text-gray-100'>
              Push
            </p>
            <p className='text-xs text-gray-500 dark:text-gray-400'>
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
                  : 'bg-gray-100 dark:bg-gray-800'
              }`}
            >
              {localSettings.inAppEnabled ? (
                <CheckCircleIcon className='h-6 w-6 text-green-600 dark:text-green-400' />
              ) : (
                <XCircleIcon className='h-6 w-6 text-gray-400' />
              )}
            </div>
            <p className='text-sm font-medium text-gray-900 dark:text-gray-100'>
              In-App
            </p>
            <p className='text-xs text-gray-500 dark:text-gray-400'>
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
          <div className='mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg'>
            <p className='text-sm text-blue-800 dark:text-blue-200'>
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
