// src/app/settings/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  FiSettings,
  FiUser,
  FiBell,
  FiShield,
  FiFileText,
  FiMonitor,
  FiArrowLeft,
  FiRotateCcw,
  FiDownload,
  FiAlertCircle,
  FiLock,
} from 'react-icons/fi';
import { useSettings } from '@/src/context/SettingsContext';
import { useAuth } from '@/src/context/AuthContext';
import PageLoading from '@/src/components/ui/page-loading';
import ProfileSettingsSection from '@/src/components/settings/ProfileSettingsSection';
import NotificationSettingsSection from '@/src/components/settings/NotificationSettingsSection';
import PrivacySettingsSection from '@/src/components/settings/PrivacySettingsSection';
import ContentSettingsSection from '@/src/components/settings/ContentSettingsSection';
import InterfaceSettingsSection from '@/src/components/settings/InterfaceSettingsSection';
import SecuritySettingsSection from '@/src/components/settings/SecuritySettingsSection';

// Define the available settings sections
type SettingsSection =
  | 'profile'
  | 'notifications'
  | 'privacy'
  | 'content'
  | 'interface'
  | 'security';

interface SettingsTab {
  id: SettingsSection;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

const SETTINGS_TABS: SettingsTab[] = [
  {
    id: 'profile',
    label: 'Profile',
    icon: FiUser,
    description: 'Personal information and preferences',
  },
  {
    id: 'notifications',
    label: 'Notifications',
    icon: FiBell,
    description: 'Email, push, and in-app notification settings',
  },
  {
    id: 'interface',
    label: 'Interface',
    icon: FiMonitor,
    description: 'Theme, layout, and display preferences',
  },
  {
    id: 'privacy',
    label: 'Privacy',
    icon: FiShield,
    description: 'Profile visibility and data sharing preferences',
  },
  {
    id: 'content',
    label: 'Content',
    icon: FiFileText,
    description: 'Default platforms and content creation settings',
  },
  {
    id: 'security',
    label: 'Security',
    icon: FiLock,
    description: 'Password, two-factor authentication, and security settings',
  },
];

export default function SettingsPage() {
  const { user } = useAuth();
  const {
    settings,
    loading,
    error,
    hasUnsavedChanges,
    refreshSettings,
    resetToDefaults,
    exportSettings,
  } = useSettings();

  // Active tab state
  const [activeTab, setActiveTab] = useState<SettingsSection>('profile');

  // Handle browser back/forward and URL hash changes
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1) as SettingsSection;
      if (SETTINGS_TABS.some((tab) => tab.id === hash)) {
        setActiveTab(hash);
      }
    };

    // Set initial tab from URL hash
    handleHashChange();

    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Update URL hash when tab changes
  const handleTabChange = (tabId: SettingsSection) => {
    setActiveTab(tabId);
    window.history.replaceState(null, '', `#${tabId}`);
  };

  // Warn user about unsaved changes before leaving
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue =
          'You have unsaved changes. Are you sure you want to leave?';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  // Handle reset with confirmation
  const handleReset = async () => {
    const confirmed = window.confirm(
      'Are you sure you want to reset all settings to their default values? This action cannot be undone.'
    );

    if (confirmed) {
      try {
        await resetToDefaults();
      } catch (error: unknown) {
        console.error('Failed to reset settings:', error);
      }
    }
  };

  // Handle export
  const handleExport = async () => {
    try {
      await exportSettings();
    } catch (error: unknown) {
      console.error('Failed to export settings:', error);
    }
  };

  // Render the active settings section
  const renderActiveSection = () => {
    switch (activeTab) {
      case 'profile':
        return <ProfileSettingsSection />;
      case 'notifications':
        return <NotificationSettingsSection />;
      case 'interface':
        return <InterfaceSettingsSection />;
      case 'privacy':
        return <PrivacySettingsSection />;
      case 'content':
        return <ContentSettingsSection />;
      case 'security':
        return <SecuritySettingsSection />;
      default:
        return <ProfileSettingsSection />;
    }
  };

  // Loading state
  if (loading && !settings) {
    return (
      <PageLoading
        title='Loading Settings'
        subtitle='Getting your preferences ready...'
        contentType='settings'
      />
    );
  }

  // Error state
  if (error && !settings) {
    return (
      <div className='min-h-screen bg-gray-50 dark:bg-slate-950 flex items-center justify-center'>
        <div className='text-center'>
          <div className='w-16 h-16 bg-red-100 dark:bg-red-900/40 rounded-full flex items-center justify-center mx-auto mb-4'>
            <FiAlertCircle className='h-8 w-8 text-red-600 dark:text-red-400' />
          </div>
          <h1 className='text-xl font-semibold text-gray-900 dark:text-slate-100 mb-2'>
            Failed to Load Settings
          </h1>
          <p className='text-gray-600 dark:text-slate-400 mb-4'>{error}</p>
          <div className='space-x-3'>
            <button
              onClick={refreshSettings}
              className='px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors duration-200'
            >
              Try Again
            </button>
            <Link
              href='/dashboard'
              className='px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors duration-200'
            >
              Go to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50 dark:bg-slate-950'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        {/* Header */}
        <div className='mb-8'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-4'>
              <Link
                href='/dashboard'
                className='p-2 text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-slate-300 hover:bg-white dark:hover:bg-slate-800 rounded-lg transition-colors duration-200'
              >
                <FiArrowLeft className='h-5 w-5' />
              </Link>
              <div>
                <h1 className='text-2xl font-bold text-gray-900 dark:text-slate-100 flex items-center'>
                  <FiSettings className='h-6 w-6 mr-3' />
                  Settings
                </h1>
                <p className='text-gray-600 dark:text-slate-400 text-sm mt-1'>
                  Manage your account preferences and application settings
                </p>
              </div>
            </div>

            {/* Action buttons */}
            <div className='flex items-center space-x-3'>
              {hasUnsavedChanges && (
                <div className='flex items-center text-amber-600 dark:text-amber-400 text-sm'>
                  <FiAlertCircle className='h-4 w-4 mr-1' />
                  Unsaved changes
                </div>
              )}

              <button
                onClick={handleExport}
                disabled={loading}
                className='inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-slate-300 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-600 transition-colors duration-200 disabled:opacity-50'
              >
                <FiDownload className='h-4 w-4 mr-2' />
                Export
              </button>

              <button
                onClick={handleReset}
                disabled={loading}
                className='inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-slate-300 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-600 transition-colors duration-200 disabled:opacity-50'
              >
                <FiRotateCcw className='h-4 w-4 mr-2' />
                Reset
              </button>
            </div>
          </div>
        </div>

        <div className='flex flex-col lg:flex-row gap-8'>
          {/* Sidebar Navigation */}
          <div className='lg:w-64 flex-shrink-0'>
            <div className='bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden'>
              <nav className='space-y-1 p-4'>
                {SETTINGS_TABS.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;

                  return (
                    <button
                      key={tab.id}
                      onClick={() => handleTabChange(tab.id)}
                      className={`w-full flex items-start p-3 rounded-lg text-left transition-colors duration-200 ${
                        isActive
                          ? 'bg-indigo-50 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-700'
                          : 'text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700'
                      }`}
                    >
                      <Icon
                        className={`h-5 w-5 flex-shrink-0 mt-0.5 mr-3 ${
                          isActive
                            ? 'text-indigo-600 dark:text-indigo-400'
                            : 'text-gray-400 dark:text-slate-500'
                        }`}
                      />
                      <div>
                        <div className='font-medium'>{tab.label}</div>
                        <div className='text-xs text-gray-500 dark:text-slate-400 mt-1'>
                          {tab.description}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* User info card */}
            <div className='mt-6 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-4'>
              <div className='flex items-center'>
                <div className='h-10 w-10 bg-indigo-100 dark:bg-indigo-900/50 rounded-full flex items-center justify-center'>
                  <FiUser className='h-5 w-5 text-indigo-600 dark:text-indigo-400' />
                </div>
                <div className='ml-3'>
                  <div className='text-sm font-medium text-gray-900 dark:text-slate-100'>
                    {user?.name || 'Anonymous User'}
                  </div>
                  <div className='text-xs text-gray-500 dark:text-slate-400'>
                    {user?.email}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className='flex-1'>
            <div className='bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700'>
              {/* Section Header */}
              <div className='px-6 py-4 border-b border-gray-200 dark:border-slate-700'>
                <div className='flex items-center justify-between'>
                  <div>
                    <h2 className='text-lg font-semibold text-gray-900 dark:text-slate-100'>
                      {SETTINGS_TABS.find((tab) => tab.id === activeTab)?.label}
                    </h2>
                    <p className='text-sm text-gray-600 dark:text-slate-400 mt-1'>
                      {
                        SETTINGS_TABS.find((tab) => tab.id === activeTab)
                          ?.description
                      }
                    </p>
                  </div>

                  {loading && (
                    <div className='flex items-center text-sm text-gray-500 dark:text-slate-400'>
                      <div className='w-4 h-4 border-2 border-gray-300 dark:border-slate-600 border-t-indigo-600 dark:border-t-indigo-400 rounded-full animate-spin mr-2'></div>
                      Saving...
                    </div>
                  )}
                </div>
              </div>

              {/* Section Content */}
              <div className='p-6'>{renderActiveSection()}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
