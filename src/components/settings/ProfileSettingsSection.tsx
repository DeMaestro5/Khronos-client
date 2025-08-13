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
        <label className='text-sm font-medium text-theme-primary'>
          {label}
          {required && <span className='text-red-500 ml-1'>*</span>}
        </label>
        {maxLength && (
          <span className='text-xs text-theme-muted'>
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
          className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-accent-primary focus:border-accent-primary ${
            error
              ? 'border-red-300 bg-red-50'
              : 'border-theme-primary bg-theme-card'
          } text-theme-primary placeholder-theme-muted`}
        />

        {type === 'password' && (
          <button
            type='button'
            onClick={() => setShowPassword(!showPassword)}
            className='absolute right-3 top-1/2 transform -translate-y-1/2 text-theme-muted hover:text-theme-primary'
          >
            {showPassword ? (
              <EyeSlashIcon className='h-4 w-4' />
            ) : (
              <EyeIcon className='h-4 w-4' />
            )}
          </button>
        )}
      </div>

      {description && <p className='text-xs text-theme-muted'>{description}</p>}

      {error && <p className='text-xs text-red-600'>{error}</p>}
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
        <label className='text-sm font-medium text-theme-primary'>
          {label}
        </label>
        {maxLength && (
          <span className='text-xs text-theme-muted'>
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
        className='w-full px-3 py-2 border border-theme-primary bg-theme-card rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-accent-primary focus:border-accent-primary text-theme-primary placeholder-theme-muted resize-none'
      />

      {description && <p className='text-xs text-theme-muted'>{description}</p>}
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
        <label className='text-sm font-medium text-theme-primary'>
          {label}
        </label>
        {description && (
          <p className='text-xs text-theme-muted mt-1'>{description}</p>
        )}
      </div>

      <div className='relative'>
        <button
          type='button'
          onClick={() => setIsOpen(!isOpen)}
          className='w-full bg-theme-card border border-theme-primary rounded-lg px-3 py-2 text-left shadow-sm focus:outline-none focus:ring-2 focus:ring-accent-primary focus:border-accent-primary flex items-center justify-between'
        >
          <span className='text-theme-primary'>
            {options.find((opt) => opt.value === value)?.label || 'Select...'}
          </span>
          <svg
            className='h-4 w-4 text-theme-muted'
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
          <div className='absolute z-10 mt-1 w-full bg-theme-card border border-theme-primary rounded-lg shadow-lg'>
            <div className='max-h-60 overflow-auto py-1'>
              {options.map((option) => (
                <button
                  key={option.value}
                  type='button'
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-sm hover:bg-theme-hover ${
                    value === option.value
                      ? 'bg-accent-primary/10 text-accent-primary'
                      : 'text-theme-primary'
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
  const [isSaving, setIsSaving] = useState(false);

  // Initialize local settings
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
    if (!settings?.profile || Object.keys(localSettings).length === 0) {
      setHasChanges(false);
      return;
    }

    const profileChanged = Object.keys(localSettings).some((key) => {
      const localValue = localSettings[key as keyof ProfileSettingsUpdate];
      const serverValue =
        settings.profile[key as keyof typeof settings.profile];

      // Handle null/undefined comparisons properly
      const normalizedLocalValue = localValue || '';
      const normalizedServerValue = serverValue || '';

      return normalizedLocalValue !== normalizedServerValue;
    });

    setHasChanges(profileChanged);
  }, [localSettings, settings?.profile, settings]);

  const handleChange = (field: keyof ProfileSettingsUpdate, value: string) => {
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
    } else if (localSettings.displayName.length > 100) {
      newErrors.displayName = 'Display name must be 100 characters or less';
    }

    if (localSettings.bio && localSettings.bio.length > 500) {
      newErrors.bio = 'Bio must be 500 characters or less';
    }

    if (
      localSettings.website &&
      !/^https?:\/\/.+/.test(localSettings.website)
    ) {
      newErrors.website =
        'Please enter a valid URL (starting with http:// or https://)';
    }

    if (localSettings.location && localSettings.location.length > 100) {
      newErrors.location = 'Location must be 100 characters or less';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      toast.error('Please fix the errors before saving');
      return;
    }

    setIsSaving(true);
    try {
      // Only send changed fields
      const changedFields: ProfileSettingsUpdate = {};

      // Check each field explicitly
      if (
        localSettings.displayName !== settings?.profile.displayName &&
        localSettings.displayName !== undefined
      ) {
        changedFields.displayName = localSettings.displayName;
      }
      if (
        localSettings.bio !== settings?.profile.bio &&
        localSettings.bio !== undefined
      ) {
        changedFields.bio = localSettings.bio;
      }
      if (
        localSettings.location !== settings?.profile.location &&
        localSettings.location !== undefined
      ) {
        changedFields.location = localSettings.location;
      }
      if (
        localSettings.website !== settings?.profile.website &&
        localSettings.website !== undefined
      ) {
        changedFields.website = localSettings.website;
      }
      if (
        localSettings.timezone !== settings?.profile.timezone &&
        localSettings.timezone !== undefined
      ) {
        changedFields.timezone = localSettings.timezone;
      }
      if (
        localSettings.language !== settings?.profile.language &&
        localSettings.language !== undefined
      ) {
        changedFields.language = localSettings.language;
      }
      if (
        localSettings.dateFormat !== settings?.profile.dateFormat &&
        localSettings.dateFormat !== undefined
      ) {
        changedFields.dateFormat = localSettings.dateFormat;
      }
      if (
        localSettings.timeFormat !== settings?.profile.timeFormat &&
        localSettings.timeFormat !== undefined
      ) {
        changedFields.timeFormat = localSettings.timeFormat;
      }

      if (Object.keys(changedFields).length === 0) {
        // Changed from toast.info to toast.success with info styling
        toast('No changes to save', {
          icon: 'ℹ️',
          style: {
            background: '#3b82f6',
            color: 'white',
          },
        });
        setHasChanges(false);
        return;
      }

      await updateSettings('profile', changedFields);
      setHasChanges(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
      // Error is already handled by the context with toast
    } finally {
      setIsSaving(false);
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
      setHasChanges(false);
    }
  };

  if (isLoading && !settings) {
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
        <div className='bg-accent-warning/10 dark:bg-accent-warning/20 border border-accent-warning/30 dark:border-accent-warning/40 rounded-lg p-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center'>
              <div className='h-2 w-2 bg-accent-warning rounded-full mr-3' />
              <p className='text-sm font-medium text-theme-primary'>
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

      {/* Basic Information */}
      <div className='bg-theme-card rounded-lg border border-theme-primary p-6'>
        <h3 className='text-lg font-semibold text-theme-primary mb-4'>
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
              error={errors.location}
            />
          </div>
        </div>
      </div>

      {/* Language & Regional Preferences */}
      <div className='bg-theme-card rounded-lg border border-theme-primary p-6'>
        <h3 className='text-lg font-semibold text-theme-primary mb-4'>
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
            onChange={(value) => handleChange('dateFormat', value)}
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
            onChange={(value) => handleChange('timeFormat', value)}
            options={[
              { value: '12h', label: '12-hour (1:30 PM)' },
              { value: '24h', label: '24-hour (13:30)' },
            ]}
            description='How times are displayed'
          />
        </div>
      </div>

      {/* Profile Summary */}
      <div className='bg-theme-secondary/10 rounded-lg border border-theme-primary p-6'>
        <h3 className='text-lg font-semibold text-theme-primary mb-4'>
          Profile Summary
        </h3>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 text-sm'>
          <div>
            <span className='font-medium text-theme-secondary'>
              Display Name:
            </span>
            <span className='ml-2 text-theme-primary'>
              {localSettings.displayName || 'Not set'}
            </span>
          </div>
          <div>
            <span className='font-medium text-theme-secondary'>Location:</span>
            <span className='ml-2 text-theme-primary'>
              {localSettings.location || 'Not set'}
            </span>
          </div>
          <div>
            <span className='font-medium text-theme-secondary'>Language:</span>
            <span className='ml-2 text-theme-primary'>
              {localSettings.language || 'English'}
            </span>
          </div>
          <div>
            <span className='font-medium text-theme-secondary'>Timezone:</span>
            <span className='ml-2 text-theme-primary'>
              {localSettings.timezone || 'UTC'}
            </span>
          </div>
          <div>
            <span className='font-medium text-theme-secondary'>
              Date Format:
            </span>
            <span className='ml-2 text-theme-primary'>
              {localSettings.dateFormat || 'MM/DD/YYYY'}
            </span>
          </div>
          <div>
            <span className='font-medium text-theme-secondary'>
              Time Format:
            </span>
            <span className='ml-2 text-theme-primary'>
              {localSettings.timeFormat || '12h'}
            </span>
          </div>
        </div>

        {localSettings.bio && (
          <div className='mt-4 p-3 bg-accent-primary/10 dark:bg-accent-primary/20 rounded-lg'>
            <p className='text-sm text-theme-primary'>
              <span className='font-medium'>Bio:</span> {localSettings.bio}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileSettingsSection;
