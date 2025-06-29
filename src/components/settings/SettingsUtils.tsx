// src/components/settings/SettingsUtils.tsx
'use client';

import React from 'react';
import {
  CheckCircleIcon,
  XMarkIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  ArrowDownTrayIcon,
} from '@heroicons/react/24/outline';

// Loading Skeleton Component
export const SettingsLoadingSkeleton: React.FC = () => {
  return (
    <div className='space-y-6'>
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className='bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6'
        >
          <div className='animate-pulse space-y-4'>
            <div className='h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4' />
            <div className='space-y-2'>
              <div className='h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4' />
              <div className='h-10 bg-gray-200 dark:bg-gray-700 rounded' />
            </div>
            <div className='space-y-2'>
              <div className='h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2' />
              <div className='h-10 bg-gray-200 dark:bg-gray-700 rounded' />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Alert/Notice Component
interface SettingsAlertProps {
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  message: string;
  dismissible?: boolean;
  onDismiss?: () => void;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const SettingsAlert: React.FC<SettingsAlertProps> = ({
  type,
  title,
  message,
  dismissible,
  onDismiss,
  action,
}) => {
  const getAlertStyles = () => {
    switch (type) {
      case 'error':
        return {
          container:
            'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800',
          icon: 'text-red-400',
          title: 'text-red-800 dark:text-red-200',
          message: 'text-red-700 dark:text-red-300',
          button:
            'text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200',
          IconComponent: ExclamationTriangleIcon,
        };
      case 'warning':
        return {
          container:
            'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800',
          icon: 'text-yellow-400',
          title: 'text-yellow-800 dark:text-yellow-200',
          message: 'text-yellow-700 dark:text-yellow-300',
          button:
            'text-yellow-600 hover:text-yellow-800 dark:text-yellow-400 dark:hover:text-yellow-200',
          IconComponent: ExclamationTriangleIcon,
        };
      case 'success':
        return {
          container:
            'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
          icon: 'text-green-400',
          title: 'text-green-800 dark:text-green-200',
          message: 'text-green-700 dark:text-green-300',
          button:
            'text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-200',
          IconComponent: CheckCircleIcon,
        };
      default: // info
        return {
          container:
            'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
          icon: 'text-blue-400',
          title: 'text-blue-800 dark:text-blue-200',
          message: 'text-blue-700 dark:text-blue-300',
          button:
            'text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200',
          IconComponent: InformationCircleIcon,
        };
    }
  };

  const styles = getAlertStyles();
  const { IconComponent } = styles;

  return (
    <div className={`border rounded-lg p-4 ${styles.container}`}>
      <div className='flex'>
        <div className='flex-shrink-0'>
          <IconComponent className={`h-5 w-5 ${styles.icon}`} />
        </div>
        <div className='ml-3 flex-1'>
          <h3 className={`text-sm font-medium ${styles.title}`}>{title}</h3>
          <div className={`mt-2 text-sm ${styles.message}`}>{message}</div>
          {action && (
            <div className='mt-4'>
              <button
                onClick={action.onClick}
                className={`text-sm font-medium ${styles.button} underline`}
              >
                {action.label}
              </button>
            </div>
          )}
        </div>
        {dismissible && onDismiss && (
          <div className='ml-auto pl-3'>
            <button
              onClick={onDismiss}
              className={`inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2 ${styles.button}`}
            >
              <XMarkIcon className='h-4 w-4' />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Section Header Component
interface SettingsSectionHeaderProps {
  title: string;
  description?: string;
  badge?: {
    text: string;
    variant: 'info' | 'warning' | 'success' | 'error';
  };
  action?: {
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary' | 'danger';
  };
}

export const SettingsSectionHeader: React.FC<SettingsSectionHeaderProps> = ({
  title,
  description,
  badge,
  action,
}) => {
  const getBadgeStyles = (variant: string) => {
    switch (variant) {
      case 'warning':
        return 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200';
      case 'error':
        return 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200';
      case 'success':
        return 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200';
      default: // info
        return 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200';
    }
  };

  const getActionStyles = (variant: string = 'secondary') => {
    switch (variant) {
      case 'primary':
        return 'bg-blue-600 hover:bg-blue-700 text-white';
      case 'danger':
        return 'bg-red-600 hover:bg-red-700 text-white';
      default: // secondary
        return 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300';
    }
  };

  return (
    <div className='flex items-start justify-between'>
      <div className='flex-1'>
        <div className='flex items-center space-x-3'>
          <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100'>
            {title}
          </h3>
          {badge && (
            <span
              className={`px-2 py-1 text-xs font-medium rounded-full ${getBadgeStyles(
                badge.variant
              )}`}
            >
              {badge.text}
            </span>
          )}
        </div>
        {description && (
          <p className='mt-1 text-sm text-gray-500 dark:text-gray-400'>
            {description}
          </p>
        )}
      </div>

      {action && (
        <button
          onClick={action.onClick}
          className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${getActionStyles(
            action.variant
          )}`}
        >
          {action.label}
        </button>
      )}
    </div>
  );
};

// Confirmation Modal Component
interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning' | 'info';
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'warning',
}) => {
  if (!isOpen) return null;

  const getVariantStyles = () => {
    switch (variant) {
      case 'danger':
        return {
          button: 'bg-red-600 hover:bg-red-700 text-white',
          icon: 'text-red-400',
          IconComponent: ExclamationTriangleIcon,
        };
      case 'info':
        return {
          button: 'bg-blue-600 hover:bg-blue-700 text-white',
          icon: 'text-blue-400',
          IconComponent: InformationCircleIcon,
        };
      default: // warning
        return {
          button: 'bg-yellow-600 hover:bg-yellow-700 text-white',
          icon: 'text-yellow-400',
          IconComponent: ExclamationTriangleIcon,
        };
    }
  };

  const styles = getVariantStyles();
  const { IconComponent } = styles;

  return (
    <div className='fixed inset-0 z-50 overflow-y-auto'>
      <div className='flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0'>
        <div
          className='fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity'
          onClick={onClose}
        />

        <div className='relative transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6'>
          <div className='sm:flex sm:items-start'>
            <div
              className={`mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full sm:mx-0 sm:h-10 sm:w-10 ${
                variant === 'danger'
                  ? 'bg-red-100 dark:bg-red-900/20'
                  : variant === 'info'
                  ? 'bg-blue-100 dark:bg-blue-900/20'
                  : 'bg-yellow-100 dark:bg-yellow-900/20'
              }`}
            >
              <IconComponent className={`h-6 w-6 ${styles.icon}`} />
            </div>
            <div className='mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left'>
              <h3 className='text-base font-semibold leading-6 text-gray-900 dark:text-gray-100'>
                {title}
              </h3>
              <div className='mt-2'>
                <p className='text-sm text-gray-500 dark:text-gray-400'>
                  {message}
                </p>
              </div>
            </div>
          </div>
          <div className='mt-5 sm:mt-4 sm:flex sm:flex-row-reverse'>
            <button
              onClick={onConfirm}
              className={`inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold shadow-sm sm:ml-3 sm:w-auto ${styles.button}`}
            >
              {confirmLabel}
            </button>
            <button
              onClick={onClose}
              className='mt-3 inline-flex w-full justify-center rounded-md bg-white dark:bg-gray-700 px-3 py-2 text-sm font-semibold text-gray-900 dark:text-gray-100 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 sm:mt-0 sm:w-auto'
            >
              {cancelLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Settings Export/Import Component
interface SettingsExportImportProps {
  onExport: () => void;
  onImport: (file: File) => void;
  isExporting?: boolean;
}

export const SettingsExportImport: React.FC<SettingsExportImportProps> = ({
  onExport,
  onImport,
  isExporting,
}) => {
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImport(file);
      // Reset input
      event.target.value = '';
    }
  };

  return (
    <div className='bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6'>
      <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4'>
        Export & Import Settings
      </h3>

      <div className='space-y-4'>
        <div>
          <h4 className='font-medium text-gray-900 dark:text-gray-100 mb-2'>
            Export Your Settings
          </h4>
          <p className='text-sm text-gray-500 dark:text-gray-400 mb-3'>
            Download a backup of all your settings that you can import later or
            share across devices.
          </p>
          <button
            onClick={onExport}
            disabled={isExporting}
            className='inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium'
          >
            <ArrowDownTrayIcon className='h-4 w-4 mr-2' />
            {isExporting ? 'Exporting...' : 'Export Settings'}
          </button>
        </div>

        <div className='border-t border-gray-200 dark:border-gray-700 pt-4'>
          <h4 className='font-medium text-gray-900 dark:text-gray-100 mb-2'>
            Import Settings
          </h4>
          <p className='text-sm text-gray-500 dark:text-gray-400 mb-3'>
            Upload a previously exported settings file to restore your
            preferences.
          </p>
          <div className='relative'>
            <input
              type='file'
              accept='.json'
              onChange={handleFileSelect}
              className='absolute inset-0 w-full h-full opacity-0 cursor-pointer'
            />
            <button className='inline-flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium'>
              Choose File
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Settings Search Component
interface SettingsSearchProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export const SettingsSearch: React.FC<SettingsSearchProps> = ({
  onSearch,
  placeholder = 'Search settings...',
}) => {
  const [query, setQuery] = React.useState('');

  const handleSearch = (value: string) => {
    setQuery(value);
    onSearch(value);
  };

  return (
    <div className='relative'>
      <input
        type='text'
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder={placeholder}
        className='w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-lg text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
      />
      <div className='absolute left-3 top-1/2 transform -translate-y-1/2'>
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
            d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
          />
        </svg>
      </div>
      {query && (
        <button
          onClick={() => handleSearch('')}
          className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
        >
          <XMarkIcon className='h-4 w-4' />
        </button>
      )}
    </div>
  );
};
