'use client';

import React, { useState, useEffect } from 'react';
import { useSettings } from '@/src/context/SettingsContext';
import { ProfileSettingsUpdate } from '@/src/types/settings';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';

interface InputFieldProps {
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  description?: string;
  error?: string;
  required?: boolean;
  maxLength?: number;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  description,
  error,
  required,
  maxLength,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const inputType = type === 'password' && showPassword ? 'text' : type;

  return (
    <div className='space-y-2'>
      <div className='flex items-center justify-between'>
        <label className='text-sm font-medium text-gray-900 dark:text-gray-100'>
          {label}
          {required && <span className='text-red-500 ml-1'>*</span>}
        </label>
        {maxLength && (
          <span className='text-xs text-gray-500 dark:text-gray-400'>
            {value.length}/{maxLength}
          </span>
        )}
      </div>

      <div className='relative'>
        <input
          type={inputType}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          maxLength={maxLength}
          className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
            error
              ? 'border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900/20'
              : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800'
          } text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400`}
        />

        {type === 'password' && (
          <button
            type='button'
            onClick={() => setShowPassword(!showPassword)}
            className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
          >
            {showPassword ? (
              <EyeSlashIcon className='h-4 w-4' />
            ) : (
              <EyeIcon className='h-4 w-4' />
            )}
          </button>
        )}
      </div>

      {description && (
        <p className='text-xs text-gray-500 dark:text-gray-400'>
          {description}
        </p>
      )}

      {error && (
        <p className='text-xs text-red-600 dark:text-red-400'>{error}</p>
      )}
    </div>
  );
};

interface TextAreaFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  description?: string;
  maxLength?: number;
  rows?: number;
}

const TextAreaField: React.FC<TextAreaFieldProps> = ({
  label,
  value,
  onChange,
  placeholder,
  description,
  maxLength,
  rows = 3,
}) => {
  return (
    <div className='space-y-2'>
      <div className='flex items-center justify-between'>
        <label className='text-sm font-medium text-gray-900 dark:text-gray-100'>
          {label}
        </label>
        {maxLength && (
          <span className='text-xs text-gray-500 dark:text-gray-400'>
            {value.length}/{maxLength}
          </span>
        )}
      </div>

      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        rows={rows}
        className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 resize-none'
      />

      {description && (
        <p className='text-xs text-gray-500 dark:text-gray-400'>
          {description}
        </p>
      )}
    </div>
  );
};

interface SelectFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
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
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const ProfileSettingsSection: React.FC = () => {
  const { settings, updateSettings, isLoading } = useSettings();
  const [localSettings, setLocalSettings] = useState<ProfileSettingsUpdate>({});
  const [hasChanges, setHasChanges] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Initialize local settings based on actual server structure
  useEffect(() => {
    if (settings?.profile) {
      setLocalSettings({
        displayName: settings.profile.displayName || '',
        bio: settings.profile.bio || '',
        location: settings.profile.location || '',
        website: settings.profile.website || '',
        timezone: settings.profile.timezone || 'UTC',
        language: settings.profile.language || 'en',
        dateFormat: settings.profile.dateFormat || 'MM/DD/YYYY',
        timeFormat: settings.profile.timeFormat || '12h',
      });
    }
  }, [settings?.profile]);

  // Check for changes
  useEffect(() => {
    if (!settings?.profile) return;

    const profileChanged = Object.keys(localSettings).some((key) => {
      return (
        localSettings[key as keyof ProfileSettingsUpdate] !==
        settings.profile[key as keyof typeof settings.profile]
      );
    });

    setHasChanges(profileChanged);
  }, [localSettings, settings?.profile]);

  const handleChange = (
    field: keyof ProfileSettingsUpdate,
    value: ProfileSettingsUpdate[keyof ProfileSettingsUpdate]
  ) => {
    setLocalSettings((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!localSettings.displayName?.trim()) {
      newErrors.displayName = 'Display name is required';
    }

    if (
      localSettings.website &&
      !/^https?:\/\/.+/.test(localSettings.website)
    ) {
      newErrors.website =
        'Please enter a valid URL (starting with http:// or https://)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      toast.error('Please fix the errors before saving');
      return;
    }

    try {
      await updateSettings('profile', localSettings);
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  const handleDiscard = () => {
    if (settings?.profile) {
      setLocalSettings({
        displayName: settings.profile.displayName || '',
        bio: settings.profile.bio || '',
        location: settings.profile.location || '',
        website: settings.profile.website || '',
        timezone: settings.profile.timezone || 'UTC',
        language: settings.profile.language || 'en',
        dateFormat: settings.profile.dateFormat || 'MM/DD/YYYY',
        timeFormat: settings.profile.timeFormat || '12h',
      });
      setErrors({});
    }
  };

  if (isLoading) {
    return (
      <div className='space-y-6'>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className='animate-pulse'>
            <div className='h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-2' />
            <div className='h-10 bg-gray-200 dark:bg-gray-700 rounded' />
          </div>
        ))}
      </div>
    );
  }

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

      {/* Basic Information */}
      <div className='bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6'>
        <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4'>
          Basic Information
        </h3>

        <div className='space-y-6'>
          <InputField
            label='Display Name'
            value={localSettings.displayName || ''}
            onChange={(value) => handleChange('displayName', value)}
            placeholder='Enter your display name'
            required
            error={errors.displayName}
            maxLength={100}
            description='This is how your name will appear to other users'
          />

          <TextAreaField
            label='Bio'
            value={localSettings.bio || ''}
            onChange={(value) => handleChange('bio', value)}
            placeholder='Tell us a bit about yourself...'
            description='A brief description that others can see on your profile'
            maxLength={500}
            rows={4}
          />

          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <InputField
              label='Website'
              type='url'
              value={localSettings.website || ''}
              onChange={(value) => handleChange('website', value)}
              placeholder='https://yourwebsite.com'
              error={errors.website}
              description='Your personal or professional website'
            />

            <InputField
              label='Location'
              value={localSettings.location || ''}
              onChange={(value) => handleChange('location', value)}
              placeholder='City, Country'
              description="Where you're based"
              maxLength={100}
            />
          </div>
        </div>
      </div>

      {/* Preferences */}
      <div className='bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6'>
        <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4'>
          Language & Regional Preferences
        </h3>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <SelectField
            label='Language'
            value={localSettings.language || 'en'}
            onChange={(value) => handleChange('language', value)}
            options={[
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
            ]}
            description='Choose your preferred language'
          />

          <SelectField
            label='Timezone'
            value={localSettings.timezone || 'UTC'}
            onChange={(value) => handleChange('timezone', value)}
            options={[
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
            ]}
            description='Used for displaying dates and times'
          />

          <SelectField
            label='Date Format'
            value={localSettings.dateFormat || 'MM/DD/YYYY'}
            onChange={(value) =>
              handleChange(
                'dateFormat',
                value as 'MM/DD/YYYY' | 'DD/MM/YYYY' | 'YYYY-MM-DD'
              )
            }
            options={[
              { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY (US)' },
              { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY (UK)' },
              { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD (ISO)' },
            ]}
            description='How dates are displayed'
          />

          <SelectField
            label='Time Format'
            value={localSettings.timeFormat || '12h'}
            onChange={(value) =>
              handleChange('timeFormat', value as '12h' | '24h')
            }
            options={[
              { value: '12h', label: '12-hour (1:30 PM)' },
              { value: '24h', label: '24-hour (13:30)' },
            ]}
            description='How times are displayed'
          />
        </div>
      </div>

      {/* Settings Summary */}
      <div className='bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-6'>
        <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4'>
          Profile Summary
        </h3>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 text-sm'>
          <div>
            <span className='font-medium text-gray-600 dark:text-gray-400'>
              Display Name:
            </span>
            <span className='ml-2 text-gray-900 dark:text-gray-100'>
              {localSettings.displayName || 'Not set'}
            </span>
          </div>
          <div>
            <span className='font-medium text-gray-600 dark:text-gray-400'>
              Location:
            </span>
            <span className='ml-2 text-gray-900 dark:text-gray-100'>
              {localSettings.location || 'Not set'}
            </span>
          </div>
          <div>
            <span className='font-medium text-gray-600 dark:text-gray-400'>
              Language:
            </span>
            <span className='ml-2 text-gray-900 dark:text-gray-100'>
              {localSettings.language || 'English'}
            </span>
          </div>
          <div>
            <span className='font-medium text-gray-600 dark:text-gray-400'>
              Timezone:
            </span>
            <span className='ml-2 text-gray-900 dark:text-gray-100'>
              {localSettings.timezone || 'UTC'}
            </span>
          </div>
          <div>
            <span className='font-medium text-gray-600 dark:text-gray-400'>
              Date Format:
            </span>
            <span className='ml-2 text-gray-900 dark:text-gray-100'>
              {localSettings.dateFormat || 'MM/DD/YYYY'}
            </span>
          </div>
          <div>
            <span className='font-medium text-gray-600 dark:text-gray-400'>
              Time Format:
            </span>
            <span className='ml-2 text-gray-900 dark:text-gray-100'>
              {localSettings.timeFormat || '12h'}
            </span>
          </div>
        </div>

        {localSettings.bio && (
          <div className='mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg'>
            <p className='text-sm text-blue-800 dark:text-blue-200'>
              <span className='font-medium'>Bio:</span> {localSettings.bio}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileSettingsSection;
