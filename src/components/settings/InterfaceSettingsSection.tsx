'use client';

import React, { useState, useEffect } from 'react';
import { useSettings } from '@/src/context/SettingsContext';
import { useTheme } from '@/src/hooks/useTheme';
import { InterfaceSettingsUpdate } from '@/src/types/settings';
import {
  ChevronDownIcon,
  MoonIcon,
  SunIcon,
  ComputerDesktopIcon,
} from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';

interface SelectFieldProps {
  label: string;
  value: string | number;
  onChange: (value: string | number) => void;
  options: { value: string | number; label: string }[];
  description?: string;
  error?: string;
}

const SelectField: React.FC<SelectFieldProps> = ({
  label,
  value,
  onChange,
  options,
  description,
  error,
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
          className={`w-full border rounded-lg px-3 py-2 text-left shadow-sm focus:outline-none focus:ring-2 focus:ring-accent-primary focus:border-accent-primary flex items-center justify-between ${
            error
              ? 'border-red-300 bg-red-50'
              : 'border-theme-primary bg-theme-card'
          }`}
        >
          <span className='text-theme-primary'>
            {options.find((opt) => opt.value === value)?.label || 'Select...'}
          </span>
          <ChevronDownIcon
            className={`h-4 w-4 text-theme-muted transition-transform ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
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

      {error && <p className='text-xs text-red-600'>{error}</p>}
    </div>
  );
};

interface ThemeSelectorProps {
  label: string;
  description?: string;
  value: 'light' | 'dark' | 'system';
  onChange: (theme: 'light' | 'dark' | 'system') => void;
  disabled?: boolean;
}

const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  label,
  description,
  value,
  onChange,
  disabled = false,
}) => {
  const { setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className='h-20 animate-pulse bg-gray-200 dark:bg-gray-700 rounded-lg' />
    );
  }

  const themes = [
    { value: 'light' as const, label: 'Light', icon: SunIcon },
    { value: 'dark' as const, label: 'Dark', icon: MoonIcon },
    { value: 'system' as const, label: 'System', icon: ComputerDesktopIcon },
  ];

  const handleThemeChange = (themeValue: 'light' | 'dark' | 'system') => {
    if (disabled) return;
    setTheme(themeValue); // Update next-themes
    onChange(themeValue); // Update local settings
  };

  return (
    <div className='space-y-3'>
      <div>
        <label className='text-sm font-medium text-theme-primary'>
          {label}
        </label>
        {description && (
          <p className='text-xs text-theme-muted mt-1'>{description}</p>
        )}
      </div>

      <div className='grid grid-cols-3 gap-3'>
        {themes.map(({ value: themeValue, label, icon: Icon }) => (
          <button
            key={themeValue}
            type='button'
            onClick={() => handleThemeChange(themeValue)}
            disabled={disabled}
            className={`p-3 rounded-lg border-2 transition-all duration-200 flex flex-col items-center space-y-2 ${
              disabled
                ? 'opacity-50 cursor-not-allowed'
                : value === themeValue
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
            }`}
          >
            <Icon className='h-5 w-5 text-gray-600 dark:text-gray-400' />
            <span className='text-sm font-medium text-theme-primary'>
              {label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

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

const InterfaceSettingsSection: React.FC = () => {
  const { settings, updateSettings, isLoading } = useSettings();
  const [localSettings, setLocalSettings] = useState<InterfaceSettingsUpdate>(
    {}
  );
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Initialize local settings when global settings load
  useEffect(() => {
    if (settings?.interface) {
      setLocalSettings({
        theme: settings.interface.theme || 'system',
        sidebarCollapsed: settings.interface.sidebarCollapsed || false,
        defaultView: settings.interface.defaultView || 'list',
        itemsPerPage: settings.interface.itemsPerPage || 25,
        enableAnimations: settings.interface.enableAnimation ?? true,
        compactMode: settings.interface.compactMode || false,
      });
    }
  }, [settings?.interface]);

  // Check for changes
  useEffect(() => {
    if (!settings?.interface) return;

    const originalSettings = {
      theme: settings.interface.theme || 'system',
      sidebarCollapsed: settings.interface.sidebarCollapsed || false,
      defaultView: settings.interface.defaultView || 'list',
      itemsPerPage: settings.interface.itemsPerPage || 25,
      enableAnimations: settings.interface.enableAnimation ?? true,
      compactMode: settings.interface.compactMode || false,
    };

    const hasChanges =
      JSON.stringify(localSettings) !== JSON.stringify(originalSettings);
    setHasChanges(hasChanges);
  }, [localSettings, settings?.interface]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!localSettings.theme) {
      newErrors.theme = 'Theme selection is required';
    }

    if (!localSettings.defaultView) {
      newErrors.defaultView = 'Default view is required';
    }

    if (!localSettings.itemsPerPage || localSettings.itemsPerPage < 1) {
      newErrors.itemsPerPage = 'Items per page must be a positive number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    field: keyof InterfaceSettingsUpdate,
    value: InterfaceSettingsUpdate[keyof InterfaceSettingsUpdate]
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
      const changedFields: InterfaceSettingsUpdate = {};

      if (localSettings.theme !== settings?.interface?.theme) {
        changedFields.theme = localSettings.theme;
      }
      if (
        localSettings.sidebarCollapsed !== settings?.interface?.sidebarCollapsed
      ) {
        changedFields.sidebarCollapsed = localSettings.sidebarCollapsed;
      }
      if (localSettings.defaultView !== settings?.interface?.defaultView) {
        changedFields.defaultView = localSettings.defaultView;
      }
      if (localSettings.itemsPerPage !== settings?.interface?.itemsPerPage) {
        changedFields.itemsPerPage = localSettings.itemsPerPage;
      }
      if (
        localSettings.enableAnimations !== settings?.interface?.enableAnimation
      ) {
        changedFields.enableAnimations = localSettings.enableAnimations;
      }
      if (localSettings.compactMode !== settings?.interface?.compactMode) {
        changedFields.compactMode = localSettings.compactMode;
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

      await updateSettings('interface', changedFields);
      setHasChanges(false);
    } catch (error) {
      console.error('Failed to update interface settings:', error);
      // Error is already handled by the context with toast
    } finally {
      setIsSaving(false);
    }
  };

  const handleDiscard = () => {
    if (settings?.interface) {
      setLocalSettings({
        theme: settings.interface.theme || 'system',
        sidebarCollapsed: settings.interface.sidebarCollapsed || false,
        defaultView: settings.interface.defaultView || 'list',
        itemsPerPage: settings.interface.itemsPerPage || 25,
        enableAnimations: settings.interface.enableAnimation ?? true,
        compactMode: settings.interface.compactMode || false,
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
        <div className='bg-yellow-50 border border-yellow-200 rounded-lg p-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center'>
              <div className='h-2 w-2 bg-yellow-400 rounded-full mr-3' />
              <p className='text-sm font-medium text-yellow-800'>
                You have unsaved changes
              </p>
            </div>
            <div className='flex items-center space-x-3'>
              <button
                onClick={handleDiscard}
                disabled={isSaving}
                className='text-sm text-yellow-700 hover:text-yellow-900 disabled:opacity-50'
              >
                Discard
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className='bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded-md text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed'
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Theme Settings */}
      <div className='bg-theme-card rounded-lg border border-theme-primary p-6'>
        <h3 className='text-lg font-semibold text-theme-primary mb-4'>
          Appearance
        </h3>

        <ThemeSelector
          label='Theme'
          description='Choose your preferred color scheme'
          value={localSettings.theme || 'system'}
          onChange={(theme) => handleChange('theme', theme)}
          disabled={isSaving}
        />
      </div>

      {/* Layout Settings */}
      <div className='bg-theme-card rounded-lg border border-theme-primary p-6'>
        <h3 className='text-lg font-semibold text-theme-primary mb-4'>
          Layout & Navigation
        </h3>

        <div className='space-y-6'>
          <SelectField
            label='Default View'
            value={localSettings.defaultView || 'list'}
            onChange={(value) =>
              handleChange('defaultView', value as 'list' | 'grid')
            }
            options={[
              { value: 'list', label: 'List View' },
              { value: 'grid', label: 'Grid View' },
            ]}
            description='Choose how content is displayed by default'
            error={errors.defaultView}
          />

          <SelectField
            label='Items Per Page'
            value={localSettings.itemsPerPage || 25}
            onChange={(value) => handleChange('itemsPerPage', Number(value))}
            options={[
              { value: 10, label: '10 items' },
              { value: 25, label: '25 items' },
              { value: 50, label: '50 items' },
              { value: 100, label: '100 items' },
            ]}
            description='Number of items to show per page'
            error={errors.itemsPerPage}
          />
        </div>
      </div>

      {/* Display Preferences */}
      <div className='bg-theme-card rounded-lg border border-theme-primary p-6'>
        <h3 className='text-lg font-semibold text-theme-primary mb-4'>
          Display Preferences
        </h3>

        <div className='space-y-4'>
          <ToggleSwitch
            label='Compact Mode'
            description='Use a more condensed layout to show more content'
            checked={localSettings.compactMode || false}
            onChange={(checked) => handleChange('compactMode', checked)}
            disabled={isSaving}
          />

          <ToggleSwitch
            label='Collapse Sidebar'
            description='Hide the sidebar by default for more content space'
            checked={localSettings.sidebarCollapsed || false}
            onChange={(checked) => handleChange('sidebarCollapsed', checked)}
            disabled={isSaving}
          />

          <ToggleSwitch
            label='Enable Animations'
            description='Show smooth transitions and micro-interactions'
            checked={localSettings.enableAnimations ?? true}
            onChange={(checked) => handleChange('enableAnimations', checked)}
            disabled={isSaving}
          />
        </div>
      </div>

      {/* Settings Summary */}
      <div className='bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-6'>
        <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4'>
          Current Settings Summary
        </h3>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm'>
          <div>
            <span className='font-medium text-gray-600 dark:text-gray-400'>
              Theme:
            </span>
            <span className='ml-2 text-gray-900 dark:text-gray-100 capitalize'>
              {localSettings.theme}
            </span>
          </div>
          <div>
            <span className='font-medium text-gray-600 dark:text-gray-400'>
              Default View:
            </span>
            <span className='ml-2 text-gray-900 dark:text-gray-100 capitalize'>
              {localSettings.defaultView}
            </span>
          </div>
          <div>
            <span className='font-medium text-gray-600 dark:text-gray-400'>
              Items Per Page:
            </span>
            <span className='ml-2 text-gray-900 dark:text-gray-100'>
              {localSettings.itemsPerPage}
            </span>
          </div>
          <div>
            <span className='font-medium text-gray-600 dark:text-gray-400'>
              Compact Mode:
            </span>
            <span className='ml-2 text-gray-900 dark:text-gray-100'>
              {localSettings.compactMode ? 'Enabled' : 'Disabled'}
            </span>
          </div>
          <div>
            <span className='font-medium text-gray-600 dark:text-gray-400'>
              Sidebar:
            </span>
            <span className='ml-2 text-gray-900 dark:text-gray-100'>
              {localSettings.sidebarCollapsed ? 'Collapsed' : 'Expanded'}
            </span>
          </div>
          <div>
            <span className='font-medium text-gray-600 dark:text-gray-400'>
              Animations:
            </span>
            <span className='ml-2 text-gray-900 dark:text-gray-100'>
              {localSettings.enableAnimations ? 'Enabled' : 'Disabled'}
            </span>
          </div>
        </div>

        {/* Preview of current settings */}
        <div className='mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg'>
          <p className='text-sm text-blue-800 dark:text-blue-200'>
            <span className='font-medium'>Active Configuration:</span>{' '}
            {localSettings.theme} theme • {localSettings.defaultView} view •{' '}
            {localSettings.itemsPerPage} items per page
            {localSettings.compactMode && ' • Compact'}
            {localSettings.sidebarCollapsed && ' • Sidebar collapsed'}
            {!localSettings.enableAnimations && ' • Animations disabled'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default InterfaceSettingsSection;
