'use client';

import React, { useState, useEffect } from 'react';
import { useSettings } from '@/src/context/SettingsContext';
import { ContentSettingsUpdate, PLATFORM_OPTIONS } from '@/src/types/settings';
import { DocumentTextIcon, VideoCameraIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';

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
            disabled ? 'text-theme-muted' : 'text-theme-primary'
          }`}
        >
          {label}
        </h4>
        {description && (
          <p
            className={`text-xs mt-1 ${
              disabled ? 'text-theme-muted' : 'text-theme-secondary'
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
  error?: string;
}

const MultiSelectField: React.FC<MultiSelectFieldProps> = ({
  label,
  value,
  onChange,
  options,
  description,
  error,
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
        <label className='text-sm font-medium text-theme-primary'>
          {label}
        </label>
        {description && (
          <p className='text-xs text-theme-secondary mt-1'>{description}</p>
        )}
      </div>

      <div className='relative'>
        <button
          type='button'
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full border rounded-lg px-3 py-2 text-left shadow-sm focus:outline-none focus:ring-2 focus:ring-accent-primary focus:border-accent-primary flex items-center justify-between ${
            error
              ? 'border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900/20'
              : 'border-theme-primary bg-theme-card'
          }`}
        >
          <div className='flex flex-wrap gap-1'>
            {value.length === 0 ? (
              <span className='text-theme-muted'>Select platforms...</span>
            ) : (
              value.map((val) => {
                const option = options.find((opt) => opt.value === val);
                return (
                  <span
                    key={val}
                    className='inline-flex items-center px-2 py-1 text-xs font-medium bg-accent-primary/20 dark:bg-accent-primary/40 text-theme-primary rounded'
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
            className='h-4 w-4 text-theme-muted flex-shrink-0'
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
                  onClick={() => handleToggleOption(option.value)}
                  className={`w-full text-left px-3 py-2 text-sm hover:bg-theme-hover flex items-center ${
                    value.includes(option.value)
                      ? 'bg-accent-primary/10 text-accent-primary'
                      : 'text-theme-primary'
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

      {error && (
        <p className='text-xs text-red-600 dark:text-red-400'>{error}</p>
      )}
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
        <label className='text-sm font-medium text-theme-primary'>
          {label}
        </label>
        {description && (
          <p className='text-xs text-theme-secondary mt-1'>{description}</p>
        )}
      </div>

      <div className='relative'>
        <button
          type='button'
          onClick={() => setIsOpen(!isOpen)}
          className='w-full bg-theme-card border border-theme-primary rounded-lg px-3 py-2 text-left shadow-sm focus:outline-none focus:ring-2 focus:ring-accent-primary focus:border-accent-primary flex items-center justify-between'
        >
          <div className='flex items-center'>
            {(() => {
              const selectedOption = options.find((opt) => opt.value === value);
              const Icon = selectedOption?.icon;
              return (
                <>
                  {Icon && <Icon className='h-4 w-4 mr-2 text-theme-muted' />}
                  <span className='text-theme-primary'>
                    {selectedOption?.label || 'Select...'}
                  </span>
                </>
              );
            })()}
          </div>
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
                    className={`w-full text-left px-3 py-2 text-sm hover:bg-theme-hover ${
                      value === option.value
                        ? 'bg-accent-primary/10 text-accent-primary'
                        : 'text-theme-primary'
                    }`}
                  >
                    <div className='flex items-start'>
                      {Icon && (
                        <Icon className='h-4 w-4 mr-2 mt-0.5 text-theme-muted' />
                      )}
                      <div>
                        <div className='font-medium'>{option.label}</div>
                        {option.description && (
                          <div className='text-xs text-theme-secondary mt-1'>
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
  const { settings, updateSettings, isLoading } = useSettings();
  const [localSettings, setLocalSettings] = useState<ContentSettingsUpdate>({});
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Initialize local settings
  useEffect(() => {
    if (settings?.content) {
      setLocalSettings({
        defaultPlatforms: settings.content.defaultPlatforms || ['twitter'],
        defaultContentType: settings.content.defaultContentType || 'post',
        autoSave: settings.content.autoSave ?? true,
        autoScheduling: settings.content.autoScheduling ?? false,
        aiSuggestions: settings.content.aiSuggestions ?? true,
        contentLanguage: settings.content.contentLanguage || 'en',
      });
    }
  }, [settings?.content]);

  // Check for changes
  useEffect(() => {
    if (!settings?.content) return;

    const originalSettings = {
      defaultPlatforms: settings.content.defaultPlatforms || ['twitter'],
      defaultContentType: settings.content.defaultContentType || 'post',
      autoSave: settings.content.autoSave ?? true,
      autoScheduling: settings.content.autoScheduling ?? false,
      aiSuggestions: settings.content.aiSuggestions ?? true,
      contentLanguage: settings.content.contentLanguage || 'en',
    };

    const hasChanges =
      JSON.stringify(localSettings) !== JSON.stringify(originalSettings);
    setHasChanges(hasChanges);
  }, [localSettings, settings?.content]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (
      !localSettings.defaultPlatforms ||
      localSettings.defaultPlatforms.length === 0
    ) {
      newErrors.defaultPlatforms = 'At least one platform must be selected';
    }

    if (!localSettings.defaultContentType) {
      newErrors.defaultContentType = 'Content type is required';
    }

    if (!localSettings.contentLanguage) {
      newErrors.contentLanguage = 'Content language is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    field: keyof ContentSettingsUpdate,
    value: ContentSettingsUpdate[keyof ContentSettingsUpdate]
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

  const handleSave = async () => {
    if (!validateForm()) {
      toast.error('Please fix the errors before saving');
      return;
    }

    setIsSaving(true);
    try {
      // Only send changed fields
      const changedFields: ContentSettingsUpdate = {};

      if (
        JSON.stringify(localSettings.defaultPlatforms) !==
        JSON.stringify(settings?.content?.defaultPlatforms)
      ) {
        changedFields.defaultPlatforms = localSettings.defaultPlatforms;
      }
      if (
        localSettings.defaultContentType !==
        settings?.content?.defaultContentType
      ) {
        changedFields.defaultContentType = localSettings.defaultContentType;
      }
      if (localSettings.autoSave !== settings?.content?.autoSave) {
        changedFields.autoSave = localSettings.autoSave;
      }
      if (localSettings.autoScheduling !== settings?.content?.autoScheduling) {
        changedFields.autoScheduling = localSettings.autoScheduling;
      }
      if (localSettings.aiSuggestions !== settings?.content?.aiSuggestions) {
        changedFields.aiSuggestions = localSettings.aiSuggestions;
      }
      if (
        localSettings.contentLanguage !== settings?.content?.contentLanguage
      ) {
        changedFields.contentLanguage = localSettings.contentLanguage;
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

      await updateSettings('content', changedFields);
      setHasChanges(false);
    } catch (error) {
      console.error('Failed to update content settings:', error);
      // Error is already handled by the context with toast
    } finally {
      setIsSaving(false);
    }
  };

  const handleDiscard = () => {
    if (settings?.content) {
      setLocalSettings({
        defaultPlatforms: settings.content.defaultPlatforms || ['twitter'],
        defaultContentType: settings.content.defaultContentType || 'post',
        autoSave: settings.content.autoSave ?? true,
        autoScheduling: settings.content.autoScheduling ?? false,
        aiSuggestions: settings.content.aiSuggestions ?? true,
        contentLanguage: settings.content.contentLanguage || 'en',
      });
      setErrors({});
      setHasChanges(false);
    }
  };

  if (isLoading && !settings) {
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

      {/* Default Settings */}
      <div className='bg-theme-card rounded-lg border border-theme-primary p-6'>
        <h3 className='text-lg font-semibold text-theme-primary mb-4'>
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
            error={errors.defaultPlatforms}
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
      <div className='bg-theme-card rounded-lg border border-theme-primary p-6'>
        <h3 className='text-lg font-semibold text-theme-primary mb-4'>
          Content Behavior
        </h3>

        <div className='space-y-4'>
          <ToggleSwitch
            label='Auto-Save'
            description='Automatically save your work as you create content'
            checked={localSettings.autoSave || false}
            onChange={(checked) => handleChange('autoSave', checked)}
            disabled={isSaving}
          />

          <ToggleSwitch
            label='Auto-Scheduling'
            description='Automatically schedule content based on optimal posting times'
            checked={localSettings.autoScheduling || false}
            onChange={(checked) => handleChange('autoScheduling', checked)}
            disabled={isSaving}
          />
        </div>
      </div>

      {/* AI & Automation */}
      <div className='bg-theme-card rounded-lg border border-theme-primary p-6'>
        <h3 className='text-lg font-semibold text-theme-primary mb-4'>
          AI & Automation
        </h3>

        <div className='space-y-4'>
          <ToggleSwitch
            label='AI Suggestions'
            description='Enable AI-powered content suggestions and assistance'
            checked={localSettings.aiSuggestions || false}
            onChange={(checked) => handleChange('aiSuggestions', checked)}
            disabled={isSaving}
          />
        </div>
      </div>

      {/* Content Summary */}
      <div className='bg-theme-secondary/10 rounded-lg border border-theme-primary p-6'>
        <h3 className='text-lg font-semibold text-theme-primary mb-4'>
          Content Summary
        </h3>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 text-sm'>
          <div className='space-y-2'>
            <div className='flex items-center justify-between'>
              <span className='font-medium text-theme-secondary'>
                Default Platforms:
              </span>
              <span className='text-theme-primary'>
                {localSettings.defaultPlatforms?.length || 0} selected
              </span>
            </div>
            <div className='flex items-center justify-between'>
              <span className='font-medium text-theme-secondary'>
                Content Type:
              </span>
              <span className='text-theme-primary capitalize'>
                {localSettings.defaultContentType}
              </span>
            </div>
            <div className='flex items-center justify-between'>
              <span className='font-medium text-theme-secondary'>
                Content Language:
              </span>
              <span className='text-theme-primary uppercase'>
                {localSettings.contentLanguage}
              </span>
            </div>
          </div>

          <div className='space-y-2'>
            <div className='flex items-center justify-between'>
              <span className='font-medium text-theme-secondary'>
                Auto-Save:
              </span>
              <span className='text-theme-primary'>
                {localSettings.autoSave ? 'Enabled' : 'Disabled'}
              </span>
            </div>
            <div className='flex items-center justify-between'>
              <span className='font-medium text-theme-secondary'>
                Auto-Scheduling:
              </span>
              <span className='text-theme-primary'>
                {localSettings.autoScheduling ? 'Enabled' : 'Disabled'}
              </span>
            </div>
            <div className='flex items-center justify-between'>
              <span className='font-medium text-theme-secondary'>
                AI Suggestions:
              </span>
              <span className='text-theme-primary'>
                {localSettings.aiSuggestions ? 'Enabled' : 'Disabled'}
              </span>
            </div>
          </div>
        </div>

        {localSettings.defaultPlatforms &&
          localSettings.defaultPlatforms.length > 0 && (
            <div className='mt-4 p-3 bg-accent-primary/10 dark:bg-accent-primary/20 rounded-lg'>
              <p className='text-sm text-theme-primary mb-2'>
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
                      className='inline-flex items-center px-2 py-1 text-xs font-medium bg-accent-primary/20 dark:bg-accent-primary/40 text-theme-primary rounded'
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
