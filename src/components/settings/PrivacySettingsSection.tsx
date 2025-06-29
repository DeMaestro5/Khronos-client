// src/components/settings/PrivacySettingsSection.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useSettings } from '@/src/context/SettingsContext';
import { settingsApi } from '@/src/lib/api';
import { PrivacySettingsUpdate } from '@/src/types/settings';
import {
  ShieldCheckIcon,
  UserGroupIcon,
  GlobeAltIcon,
  LockClosedIcon,
} from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';

// Type for privacy settings to match server structure
type PrivacySettings = PrivacySettingsUpdate;

interface ToggleSwitchProps {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  label,
  description,
  checked,
  onChange,
  disabled = false,
}) => {
  return (
    <div className='flex items-start justify-between'>
      <div className='flex-1'>
        <h4
          className={`text-sm font-medium ${
            disabled
              ? 'text-gray-400 dark:text-gray-500'
              : 'text-gray-900 dark:text-gray-100'
          }`}
        >
          {label}
        </h4>
        {description && (
          <p
            className={`text-xs mt-1 ${
              disabled
                ? 'text-gray-400 dark:text-gray-500'
                : 'text-gray-500 dark:text-gray-400'
            }`}
          >
            {description}
          </p>
        )}
      </div>

      <button
        type='button'
        onClick={() => !disabled && onChange(!checked)}
        disabled={disabled}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
          disabled
            ? 'opacity-50 cursor-not-allowed bg-gray-200 dark:bg-gray-700'
            : checked
            ? 'bg-blue-600'
            : 'bg-gray-200 dark:bg-gray-700'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            checked ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );
};

interface SelectFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string; description?: string }[];
  description?: string;
}

const SelectField: React.FC<SelectFieldProps> = ({
  label,
  value,
  onChange,
  options,
  description,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className='space-y-2'>
      <div>
        <label className='text-sm font-medium text-gray-900 dark:text-gray-100'>
          {label}
        </label>
        {description && (
          <p className='text-xs text-gray-500 dark:text-gray-400 mt-1'>
            {description}
          </p>
        )}
      </div>

      <div className='relative'>
        <button
          type='button'
          onClick={() => setIsOpen(!isOpen)}
          className='w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-left shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 flex items-center justify-between'
        >
          <span className='text-gray-900 dark:text-gray-100'>
            {options.find((opt) => opt.value === value)?.label || 'Select...'}
          </span>
          <svg
            className='h-4 w-4 text-gray-400'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M19 9l-7 7-7-7'
            />
          </svg>
        </button>

        {isOpen && (
          <div className='absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg'>
            <div className='max-h-60 overflow-auto py-1'>
              {options.map((option) => (
                <button
                  key={option.value}
                  type='button'
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 ${
                    value === option.value
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                      : 'text-gray-900 dark:text-gray-100'
                  }`}
                >
                  <div>
                    <div className='font-medium'>{option.label}</div>
                    {option.description && (
                      <div className='text-xs text-gray-500 dark:text-gray-400 mt-1'>
                        {option.description}
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const PrivacySettingsSection: React.FC = () => {
  const { settings, isLoading } = useSettings();
  const [localSettings, setLocalSettings] = useState<PrivacySettings>({});
  const [hasChanges, setHasChanges] = useState(false);

  // Helper function to get default privacy settings
  const getDefaultPrivacySettings = (): PrivacySettings => ({
    profileVisibility: 'public',
    showEmail: false,
    showLocation: false,
    allowAnalytics: true,
    dataSharing: false,
  });

  // Initialize local settings
  useEffect(() => {
    const settingsWithPrivacy = settings as unknown as {
      privacy?: PrivacySettings;
    };
    const privacySettings = settingsWithPrivacy?.privacy;

    if (privacySettings) {
      setLocalSettings({
        profileVisibility: privacySettings.profileVisibility || 'public',
        showEmail: privacySettings.showEmail ?? false,
        showLocation: privacySettings.showLocation ?? false,
        allowAnalytics: privacySettings.allowAnalytics ?? true,
        dataSharing: privacySettings.dataSharing ?? false,
      });
    } else {
      // Use sensible defaults if server doesn't have privacy settings yet
      setLocalSettings(getDefaultPrivacySettings());
    }
  }, [settings]);

  // Check for changes
  useEffect(() => {
    const settingsWithPrivacy = settings as unknown as {
      privacy?: PrivacySettings;
    };
    const privacySettings = settingsWithPrivacy?.privacy;

    if (!privacySettings) {
      // If no server settings, check against defaults
      const defaultSettings = getDefaultPrivacySettings();
      const hasChanges =
        JSON.stringify(localSettings) !== JSON.stringify(defaultSettings);
      setHasChanges(hasChanges);
      return;
    }

    const serverSettings: PrivacySettings = {
      profileVisibility: privacySettings.profileVisibility || 'public',
      showEmail: privacySettings.showEmail ?? false,
      showLocation: privacySettings.showLocation ?? false,
      allowAnalytics: privacySettings.allowAnalytics ?? true,
      dataSharing: privacySettings.dataSharing ?? false,
    };

    const hasChanges =
      JSON.stringify(localSettings) !== JSON.stringify(serverSettings);
    setHasChanges(hasChanges);
  }, [localSettings, settings]);

  const handleChange = (
    field: keyof PrivacySettings,
    value: PrivacySettings[keyof PrivacySettings]
  ) => {
    setLocalSettings((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    try {
      await settingsApi.updatePrivacy(localSettings);
      toast.success('Privacy settings saved successfully');
      setHasChanges(false);
    } catch (error: unknown) {
      console.error('Failed to save privacy settings:', error);
      toast.error('Failed to save privacy settings');
    }
  };

  const handleDiscard = () => {
    const settingsWithPrivacy = settings as unknown as {
      privacy?: PrivacySettings;
    };
    const privacySettings = settingsWithPrivacy?.privacy;

    if (privacySettings) {
      setLocalSettings({
        profileVisibility: privacySettings.profileVisibility || 'public',
        showEmail: privacySettings.showEmail ?? false,
        showLocation: privacySettings.showLocation ?? false,
        allowAnalytics: privacySettings.allowAnalytics ?? true,
        dataSharing: privacySettings.dataSharing ?? false,
      });
    } else {
      // Reset to defaults
      setLocalSettings(getDefaultPrivacySettings());
    }
  };

  if (isLoading) {
    return (
      <div className='space-y-6'>
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className='animate-pulse bg-gray-200 dark:bg-gray-700 rounded-lg h-32'
          />
        ))}
      </div>
    );
  }

  const visibilityOptions = [
    {
      value: 'public',
      label: 'Public',
      description: 'Anyone can view your profile and content',
    },
    {
      value: 'followers',
      label: 'Followers Only',
      description: 'Only your followers can view your profile',
    },
    {
      value: 'private',
      label: 'Private',
      description: 'Your profile is completely private',
    },
  ];

  return (
    <div className='space-y-6'>
      {/* Privacy Notice */}
      <div className='bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4'>
        <div className='flex items-center'>
          <ShieldCheckIcon className='h-5 w-5 text-blue-600 dark:text-blue-400 mr-3' />
          <div>
            <p className='text-sm font-medium text-blue-800 dark:text-blue-200'>
              Privacy Settings
            </p>
            <p className='text-xs text-blue-700 dark:text-blue-300 mt-1'>
              Control who can see your information and how your data is used.
            </p>
          </div>
        </div>
      </div>

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

      {/* Profile Visibility */}
      <div className='bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6'>
        <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4'>
          Profile Visibility
        </h3>

        <SelectField
          label='Who can see your profile'
          value={localSettings.profileVisibility || 'public'}
          onChange={(value) =>
            handleChange(
              'profileVisibility',
              value as 'public' | 'private' | 'followers'
            )
          }
          options={visibilityOptions}
          description='Control who can view your profile information and content'
        />

        <div className='mt-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg'>
          <div className='flex items-center mb-2'>
            {localSettings.profileVisibility === 'public' && (
              <>
                <GlobeAltIcon className='h-5 w-5 text-green-500 mr-2' />
                <span className='text-sm font-medium text-green-700 dark:text-green-400'>
                  Public Profile
                </span>
              </>
            )}
            {localSettings.profileVisibility === 'followers' && (
              <>
                <UserGroupIcon className='h-5 w-5 text-yellow-500 mr-2' />
                <span className='text-sm font-medium text-yellow-700 dark:text-yellow-400'>
                  Followers Only
                </span>
              </>
            )}
            {localSettings.profileVisibility === 'private' && (
              <>
                <LockClosedIcon className='h-5 w-5 text-red-500 mr-2' />
                <span className='text-sm font-medium text-red-700 dark:text-red-400'>
                  Private Profile
                </span>
              </>
            )}
          </div>
          <p className='text-xs text-gray-600 dark:text-gray-400'>
            {
              visibilityOptions.find(
                (opt) => opt.value === localSettings.profileVisibility
              )?.description
            }
          </p>
        </div>
      </div>

      {/* Personal Information */}
      <div className='bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6'>
        <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4'>
          Personal Information
        </h3>

        <div className='space-y-4'>
          <ToggleSwitch
            label='Show Email Address'
            description='Display your email address on your public profile'
            checked={localSettings.showEmail || false}
            onChange={(checked) => handleChange('showEmail', checked)}
          />

          <ToggleSwitch
            label='Show Location'
            description='Display your location on your public profile'
            checked={localSettings.showLocation || false}
            onChange={(checked) => handleChange('showLocation', checked)}
          />
        </div>
      </div>

      {/* Data & Analytics */}
      <div className='bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6'>
        <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4'>
          Data & Analytics
        </h3>

        <div className='space-y-4'>
          <ToggleSwitch
            label='Allow Analytics'
            description='Help us improve the product by sharing usage analytics'
            checked={localSettings.allowAnalytics || false}
            onChange={(checked) => handleChange('allowAnalytics', checked)}
          />

          <ToggleSwitch
            label='Data Sharing'
            description='Allow us to share anonymized usage data with trusted partners'
            checked={localSettings.dataSharing || false}
            onChange={(checked) => handleChange('dataSharing', checked)}
          />
        </div>
      </div>

      {/* Privacy Summary */}
      <div className='bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-6'>
        <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4'>
          Privacy Summary
        </h3>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 text-sm'>
          <div className='space-y-2'>
            <div className='flex items-center justify-between'>
              <span className='font-medium text-gray-600 dark:text-gray-400'>
                Profile Visibility:
              </span>
              <span className='text-gray-900 dark:text-gray-100 capitalize'>
                {localSettings.profileVisibility}
              </span>
            </div>
            <div className='flex items-center justify-between'>
              <span className='font-medium text-gray-600 dark:text-gray-400'>
                Show Email:
              </span>
              <span className='text-gray-900 dark:text-gray-100'>
                {localSettings.showEmail ? 'Yes' : 'No'}
              </span>
            </div>
            <div className='flex items-center justify-between'>
              <span className='font-medium text-gray-600 dark:text-gray-400'>
                Show Location:
              </span>
              <span className='text-gray-900 dark:text-gray-100'>
                {localSettings.showLocation ? 'Yes' : 'No'}
              </span>
            </div>
          </div>

          <div className='space-y-2'>
            <div className='flex items-center justify-between'>
              <span className='font-medium text-gray-600 dark:text-gray-400'>
                Analytics:
              </span>
              <span className='text-gray-900 dark:text-gray-100'>
                {localSettings.allowAnalytics ? 'Enabled' : 'Disabled'}
              </span>
            </div>
            <div className='flex items-center justify-between'>
              <span className='font-medium text-gray-600 dark:text-gray-400'>
                Data Sharing:
              </span>
              <span className='text-gray-900 dark:text-gray-100'>
                {localSettings.dataSharing ? 'Enabled' : 'Disabled'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacySettingsSection;
