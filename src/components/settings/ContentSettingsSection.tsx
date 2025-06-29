// src/components/settings/ContentSettingsSection.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useSettings } from '@/src/context/SettingsContext';
import { settingsApi } from '@/src/lib/api';
import { ContentSettingsUpdate, PLATFORM_OPTIONS } from '@/src/types/settings';
import { DocumentTextIcon, VideoCameraIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';

// Define content settings types to match server structure
type ContentSettings = ContentSettingsUpdate;

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

interface MultiSelectFieldProps {
  label: string;
  value: string[];
  onChange: (value: string[]) => void;
  options: {
    value: string;
    label: string;
    icon?: string;
  }[];
  description?: string;
}

const MultiSelectField: React.FC<MultiSelectFieldProps> = ({
  label,
  value,
  onChange,
  options,
  description,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggleOption = (optionValue: string) => {
    if (value.includes(optionValue)) {
      onChange(value.filter((v) => v !== optionValue));
    } else {
      onChange([...value, optionValue]);
    }
  };

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
          <div className='flex flex-wrap gap-1'>
            {value.length === 0 ? (
              <span className='text-gray-500'>Select platforms...</span>
            ) : (
              value.map((val) => {
                const option = options.find((opt) => opt.value === val);
                return (
                  <span
                    key={val}
                    className='inline-flex items-center px-2 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded'
                  >
                    {option?.icon && (
                      <span className='mr-1'>{option.icon}</span>
                    )}
                    {option?.label}
                  </span>
                );
              })
            )}
          </div>
          <svg
            className='h-4 w-4 text-gray-400 flex-shrink-0'
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
                  onClick={() => handleToggleOption(option.value)}
                  className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center ${
                    value.includes(option.value)
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                      : 'text-gray-900 dark:text-gray-100'
                  }`}
                >
                  <input
                    type='checkbox'
                    checked={value.includes(option.value)}
                    onChange={() => {}}
                    className='mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded'
                  />
                  {option.icon && <span className='mr-2'>{option.icon}</span>}
                  <span className='font-medium'>{option.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

interface SelectFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: {
    value: string;
    label: string;
    description?: string;
    icon?: React.ComponentType<{ className?: string }>;
  }[];
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
          <div className='flex items-center'>
            {(() => {
              const selectedOption = options.find((opt) => opt.value === value);
              const Icon = selectedOption?.icon;
              return (
                <>
                  {Icon && <Icon className='h-4 w-4 mr-2 text-gray-400' />}
                  <span className='text-gray-900 dark:text-gray-100'>
                    {selectedOption?.label || 'Select...'}
                  </span>
                </>
              );
            })()}
          </div>
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
              {options.map((option) => {
                const Icon = option.icon;
                return (
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
                    <div className='flex items-start'>
                      {Icon && (
                        <Icon className='h-4 w-4 mr-2 mt-0.5 text-gray-400' />
                      )}
                      <div>
                        <div className='font-medium'>{option.label}</div>
                        {option.description && (
                          <div className='text-xs text-gray-500 dark:text-gray-400 mt-1'>
                            {option.description}
                          </div>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const ContentSettingsSection: React.FC = () => {
  const { settings, isLoading } = useSettings();
  const [localSettings, setLocalSettings] = useState<ContentSettings>({});
  const [hasChanges, setHasChanges] = useState(false);

  // Helper function to get default content settings
  const getDefaultContentSettings = (): ContentSettings => ({
    defaultPlatforms: ['twitter'],
    defaultContentType: 'post',
    autoSave: true,
    autoScheduling: false,
    aiSuggestions: true,
    contentLanguage: 'en',
  });

  // Initialize local settings
  useEffect(() => {
    const settingsWithContent = settings as unknown as {
      content?: ContentSettings;
    };
    const contentSettings = settingsWithContent?.content;

    if (contentSettings) {
      setLocalSettings({
        defaultPlatforms: contentSettings.defaultPlatforms || ['twitter'],
        defaultContentType: contentSettings.defaultContentType || 'post',
        autoSave: contentSettings.autoSave ?? true,
        autoScheduling: contentSettings.autoScheduling ?? false,
        aiSuggestions: contentSettings.aiSuggestions ?? true,
        contentLanguage: contentSettings.contentLanguage || 'en',
      });
    } else {
      // Use sensible defaults if server doesn't have content settings yet
      setLocalSettings(getDefaultContentSettings());
    }
  }, [settings]);

  // Check for changes
  useEffect(() => {
    const settingsWithContent = settings as unknown as {
      content?: ContentSettings;
    };
    const contentSettings = settingsWithContent?.content;

    if (!contentSettings) {
      // If no server settings, check against defaults
      const defaultSettings = getDefaultContentSettings();
      const hasChanges =
        JSON.stringify(localSettings) !== JSON.stringify(defaultSettings);
      setHasChanges(hasChanges);
      return;
    }

    const serverSettings: ContentSettings = {
      defaultPlatforms: contentSettings.defaultPlatforms || ['twitter'],
      defaultContentType: contentSettings.defaultContentType || 'post',
      autoSave: contentSettings.autoSave ?? true,
      autoScheduling: contentSettings.autoScheduling ?? false,
      aiSuggestions: contentSettings.aiSuggestions ?? true,
      contentLanguage: contentSettings.contentLanguage || 'en',
    };

    const hasChanges =
      JSON.stringify(localSettings) !== JSON.stringify(serverSettings);
    setHasChanges(hasChanges);
  }, [localSettings, settings]);

  const handleChange = (
    field: keyof ContentSettings,
    value: ContentSettings[keyof ContentSettings]
  ) => {
    setLocalSettings((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    try {
      await settingsApi.updateContent(localSettings);
      toast.success('Content settings saved successfully');
      setHasChanges(false);
    } catch (error: unknown) {
      console.error('Failed to save content settings:', error);
      toast.error('Failed to save content settings');
    }
  };

  const handleDiscard = () => {
    const settingsWithContent = settings as unknown as {
      content?: ContentSettings;
    };
    const contentSettings = settingsWithContent?.content;

    if (contentSettings) {
      setLocalSettings({
        defaultPlatforms: contentSettings.defaultPlatforms || ['twitter'],
        defaultContentType: contentSettings.defaultContentType || 'post',
        autoSave: contentSettings.autoSave ?? true,
        autoScheduling: contentSettings.autoScheduling ?? false,
        aiSuggestions: contentSettings.aiSuggestions ?? true,
        contentLanguage: contentSettings.contentLanguage || 'en',
      });
    } else {
      // Reset to defaults
      setLocalSettings(getDefaultContentSettings());
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

  const contentTypeOptions = [
    {
      value: 'post',
      label: 'Post',
      description: 'Social media posts and short content',
      icon: DocumentTextIcon,
    },
    {
      value: 'article',
      label: 'Article',
      description: 'Long-form articles and blog posts',
      icon: DocumentTextIcon,
    },
    {
      value: 'video',
      label: 'Video',
      description: 'Video content and multimedia',
      icon: VideoCameraIcon,
    },
  ];

  const languageOptions = [
    { value: 'en', label: 'English' },
    { value: 'es', label: 'Spanish' },
    { value: 'fr', label: 'French' },
    { value: 'de', label: 'German' },
    { value: 'it', label: 'Italian' },
    { value: 'pt', label: 'Portuguese' },
    { value: 'zh', label: 'Chinese' },
    { value: 'ja', label: 'Japanese' },
    { value: 'ko', label: 'Korean' },
  ];

  return (
    <div className='space-y-6'>
      {/* Content Notice */}
      <div className='bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4'>
        <div className='flex items-center'>
          <DocumentTextIcon className='h-5 w-5 text-blue-600 dark:text-blue-400 mr-3' />
          <div>
            <p className='text-sm font-medium text-blue-800 dark:text-blue-200'>
              Content Settings Preview
            </p>
            <p className='text-xs text-blue-700 dark:text-blue-300 mt-1'>
              These settings will be applied to new content creation and may
              require server-side implementation.
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

      {/* Default Settings */}
      <div className='bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6'>
        <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4'>
          Default Content Settings
        </h3>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <MultiSelectField
            label='Default Platforms'
            value={localSettings.defaultPlatforms || []}
            onChange={(value) => handleChange('defaultPlatforms', value)}
            options={PLATFORM_OPTIONS.map((opt) => ({
              value: opt.value,
              label: opt.label,
              icon: opt.icon,
            }))}
            description='Platforms to use for new content creation'
          />

          <SelectField
            label='Default Content Type'
            value={localSettings.defaultContentType || 'post'}
            onChange={(value) =>
              handleChange(
                'defaultContentType',
                value as 'article' | 'post' | 'video'
              )
            }
            options={contentTypeOptions}
            description='Type of content to create by default'
          />

          <SelectField
            label='Content Language'
            value={localSettings.contentLanguage || 'en'}
            onChange={(value) => handleChange('contentLanguage', value)}
            options={languageOptions}
            description='Default language for content creation'
          />
        </div>
      </div>

      {/* Content Behavior */}
      <div className='bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6'>
        <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4'>
          Content Behavior
        </h3>

        <div className='space-y-4'>
          <ToggleSwitch
            label='Auto-Save'
            description='Automatically save your work as you create content'
            checked={localSettings.autoSave || false}
            onChange={(checked) => handleChange('autoSave', checked)}
          />

          <ToggleSwitch
            label='Auto-Scheduling'
            description='Automatically schedule content based on optimal posting times'
            checked={localSettings.autoScheduling || false}
            onChange={(checked) => handleChange('autoScheduling', checked)}
          />
        </div>
      </div>

      {/* AI & Automation */}
      <div className='bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6'>
        <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4'>
          AI & Automation
        </h3>

        <div className='space-y-4'>
          <ToggleSwitch
            label='AI Suggestions'
            description='Enable AI-powered content suggestions and assistance'
            checked={localSettings.aiSuggestions || false}
            onChange={(checked) => handleChange('aiSuggestions', checked)}
          />
        </div>
      </div>

      {/* Content Summary */}
      <div className='bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-6'>
        <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4'>
          Content Summary
        </h3>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 text-sm'>
          <div className='space-y-2'>
            <div className='flex items-center justify-between'>
              <span className='font-medium text-gray-600 dark:text-gray-400'>
                Default Platforms:
              </span>
              <span className='text-gray-900 dark:text-gray-100'>
                {localSettings.defaultPlatforms?.length || 0} selected
              </span>
            </div>
            <div className='flex items-center justify-between'>
              <span className='font-medium text-gray-600 dark:text-gray-400'>
                Content Type:
              </span>
              <span className='text-gray-900 dark:text-gray-100 capitalize'>
                {localSettings.defaultContentType}
              </span>
            </div>
            <div className='flex items-center justify-between'>
              <span className='font-medium text-gray-600 dark:text-gray-400'>
                Content Language:
              </span>
              <span className='text-gray-900 dark:text-gray-100 uppercase'>
                {localSettings.contentLanguage}
              </span>
            </div>
          </div>

          <div className='space-y-2'>
            <div className='flex items-center justify-between'>
              <span className='font-medium text-gray-600 dark:text-gray-400'>
                Auto-Save:
              </span>
              <span className='text-gray-900 dark:text-gray-100'>
                {localSettings.autoSave ? 'Enabled' : 'Disabled'}
              </span>
            </div>
            <div className='flex items-center justify-between'>
              <span className='font-medium text-gray-600 dark:text-gray-400'>
                Auto-Scheduling:
              </span>
              <span className='text-gray-900 dark:text-gray-100'>
                {localSettings.autoScheduling ? 'Enabled' : 'Disabled'}
              </span>
            </div>
            <div className='flex items-center justify-between'>
              <span className='font-medium text-gray-600 dark:text-gray-400'>
                AI Suggestions:
              </span>
              <span className='text-gray-900 dark:text-gray-100'>
                {localSettings.aiSuggestions ? 'Enabled' : 'Disabled'}
              </span>
            </div>
          </div>
        </div>

        {localSettings.defaultPlatforms &&
          localSettings.defaultPlatforms.length > 0 && (
            <div className='mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg'>
              <p className='text-sm text-blue-800 dark:text-blue-200 mb-2'>
                <span className='font-medium'>Selected Platforms:</span>
              </p>
              <div className='flex flex-wrap gap-1'>
                {localSettings.defaultPlatforms.map((platform) => {
                  const platformOption = PLATFORM_OPTIONS.find(
                    (opt) => opt.value === platform
                  );
                  return (
                    <span
                      key={platform}
                      className='inline-flex items-center px-2 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded'
                    >
                      {platformOption?.icon && (
                        <span className='mr-1'>{platformOption.icon}</span>
                      )}
                      {platformOption?.label || platform}
                    </span>
                  );
                })}
              </div>
            </div>
          )}
      </div>
    </div>
  );
};

export default ContentSettingsSection;
