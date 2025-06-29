// src/components/settings/SecuritySettingsSection.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useSettings } from '@/src/context/SettingsContext';
import {
  ShieldCheckIcon,
  DevicePhoneMobileIcon,
  ComputerDesktopIcon,
  EyeIcon,
  EyeSlashIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';

// Define security settings types (server doesn't have this endpoint yet)
interface SecuritySettings {
  twoFactorEnabled?: boolean;
  loginAlerts?: boolean;
  sessionTimeout?: string;
}

interface PasswordInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  showStrength?: boolean;
}

const PasswordInput: React.FC<PasswordInputProps> = ({
  label,
  value,
  onChange,
  placeholder,
  error,
  showStrength = false,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const getPasswordStrength = (password: string) => {
    let score = 0;
    const checks = {
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      numbers: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };

    score = Object.values(checks).filter(Boolean).length;

    return {
      score,
      checks,
      level: score < 2 ? 'weak' : score < 4 ? 'medium' : 'strong',
    };
  };

  const strength = showStrength && value ? getPasswordStrength(value) : null;

  return (
    <div className='space-y-2'>
      <label className='text-sm font-medium text-gray-900 dark:text-gray-100'>
        {label}
      </label>

      <div className='relative'>
        <input
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10 ${
            error
              ? 'border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900/20'
              : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800'
          } text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400`}
        />

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
      </div>

      {/* Password Strength Indicator */}
      {strength && (
        <div className='space-y-2'>
          <div className='flex items-center space-x-2'>
            <div className='flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2'>
              <div
                className={`h-2 rounded-full transition-all duration-300 ${
                  strength.level === 'weak'
                    ? 'bg-red-500 w-1/3'
                    : strength.level === 'medium'
                    ? 'bg-yellow-500 w-2/3'
                    : 'bg-green-500 w-full'
                }`}
              />
            </div>
            <span
              className={`text-xs font-medium ${
                strength.level === 'weak'
                  ? 'text-red-600 dark:text-red-400'
                  : strength.level === 'medium'
                  ? 'text-yellow-600 dark:text-yellow-400'
                  : 'text-green-600 dark:text-green-400'
              }`}
            >
              {strength.level.charAt(0).toUpperCase() + strength.level.slice(1)}
            </span>
          </div>

          <div className='grid grid-cols-2 gap-2 text-xs'>
            {Object.entries(strength.checks).map(([key, passed]) => (
              <div
                key={key}
                className={`flex items-center space-x-1 ${
                  passed
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-gray-400 dark:text-gray-500'
                }`}
              >
                {passed ? (
                  <CheckCircleIcon className='h-3 w-3' />
                ) : (
                  <XCircleIcon className='h-3 w-3' />
                )}
                <span>
                  {key === 'length' && '8+ characters'}
                  {key === 'lowercase' && 'Lowercase'}
                  {key === 'uppercase' && 'Uppercase'}
                  {key === 'numbers' && 'Numbers'}
                  {key === 'special' && 'Special chars'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {error && (
        <p className='text-xs text-red-600 dark:text-red-400'>{error}</p>
      )}
    </div>
  );
};

interface TwoFactorSetupProps {
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
}

const TwoFactorSetup: React.FC<TwoFactorSetupProps> = ({
  enabled,
  onToggle,
}) => {
  const [showSetup, setShowSetup] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [qrCode, setQrCode] = useState('');
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleEnable2FA = async () => {
    setShowSetup(true);
    // In a real app, you would call your API to get the QR code and setup secret
    setQrCode(
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='
    );
  };

  const handleVerify2FA = async () => {
    if (verificationCode.length !== 6) {
      toast.error('Please enter a 6-digit code');
      return;
    }

    setIsVerifying(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Generate backup codes
      const codes = Array.from({ length: 8 }, () =>
        Math.random().toString(36).substring(2, 10).toUpperCase()
      );
      setBackupCodes(codes);

      onToggle(true);
      toast.success('Two-factor authentication enabled successfully!');
    } catch (error: unknown) {
      console.error('2FA verification error:', error);
      toast.error('Invalid verification code. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleDisable2FA = async () => {
    try {
      onToggle(false);
      setShowSetup(false);
      setVerificationCode('');
      setBackupCodes([]);
      toast.success('Two-factor authentication disabled');
    } catch (error: unknown) {
      console.error('2FA disable error:', error);
      toast.error('Failed to disable two-factor authentication');
    }
  };

  if (showSetup && !enabled) {
    return (
      <div className='bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6'>
        <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4'>
          Set up Two-Factor Authentication
        </h3>

        {backupCodes.length === 0 ? (
          <div className='space-y-6'>
            <div className='text-center'>
              <div className='w-48 h-48 bg-gray-100 dark:bg-gray-700 rounded-lg mx-auto mb-4 flex items-center justify-center'>
                <img src={qrCode} alt='QR Code' className='w-40 h-40' />
              </div>
              <p className='text-sm text-gray-600 dark:text-gray-400'>
                Scan this QR code with your authenticator app
              </p>
            </div>

            <div className='space-y-4'>
              <div>
                <label className='text-sm font-medium text-gray-900 dark:text-gray-100'>
                  Verification Code
                </label>
                <input
                  type='text'
                  value={verificationCode}
                  onChange={(e) =>
                    setVerificationCode(
                      e.target.value.replace(/\D/g, '').slice(0, 6)
                    )
                  }
                  placeholder='Enter 6-digit code'
                  className='mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-lg text-center text-2xl tracking-widest'
                  maxLength={6}
                />
              </div>

              <div className='flex space-x-3'>
                <button
                  onClick={() => setShowSetup(false)}
                  className='flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700'
                >
                  Cancel
                </button>
                <button
                  onClick={handleVerify2FA}
                  disabled={verificationCode.length !== 6 || isVerifying}
                  className='flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg'
                >
                  {isVerifying ? 'Verifying...' : 'Verify & Enable'}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className='space-y-6'>
            <div className='text-center'>
              <CheckCircleIcon className='h-16 w-16 text-green-500 mx-auto mb-4' />
              <h4 className='text-lg font-semibold text-gray-900 dark:text-gray-100'>
                Two-Factor Authentication Enabled!
              </h4>
              <p className='text-gray-600 dark:text-gray-400 mt-2'>
                Save these backup codes in a safe place. You can use them to
                access your account if you lose your authenticator device.
              </p>
            </div>

            <div className='bg-gray-50 dark:bg-gray-900 rounded-lg p-4'>
              <h5 className='font-medium text-gray-900 dark:text-gray-100 mb-3'>
                Backup Codes
              </h5>
              <div className='grid grid-cols-2 gap-2 text-sm font-mono'>
                {backupCodes.map((code, index) => (
                  <div
                    key={index}
                    className='bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded px-3 py-2 text-center'
                  >
                    {code}
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => {
                setShowSetup(false);
                setBackupCodes([]);
              }}
              className='w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg'
            >
              Done
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className='flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-lg'>
      <div className='flex items-center space-x-3'>
        <ShieldCheckIcon
          className={`h-6 w-6 ${enabled ? 'text-green-500' : 'text-gray-400'}`}
        />
        <div>
          <h4 className='font-medium text-gray-900 dark:text-gray-100'>
            Two-Factor Authentication
          </h4>
          <p className='text-sm text-gray-500 dark:text-gray-400'>
            {enabled
              ? 'Your account is protected with 2FA'
              : 'Add an extra layer of security to your account'}
          </p>
        </div>
      </div>

      <button
        onClick={enabled ? handleDisable2FA : handleEnable2FA}
        className={`px-4 py-2 rounded-lg text-sm font-medium ${
          enabled
            ? 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-900/30'
            : 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/30'
        }`}
      >
        {enabled ? 'Disable' : 'Enable'}
      </button>
    </div>
  );
};

interface ActiveSession {
  id: string;
  device: string;
  location: string;
  lastActive: string;
  current: boolean;
  browser: string;
  ip: string;
}

const ActiveSessions: React.FC = () => {
  const [sessions] = useState<ActiveSession[]>([
    {
      id: '1',
      device: 'MacBook Pro',
      location: 'New York, NY',
      lastActive: '2 minutes ago',
      current: true,
      browser: 'Chrome',
      ip: '192.168.1.100',
    },
    {
      id: '2',
      device: 'iPhone 14',
      location: 'New York, NY',
      lastActive: '1 hour ago',
      current: false,
      browser: 'Safari',
      ip: '192.168.1.101',
    },
    {
      id: '3',
      device: 'Windows PC',
      location: 'Los Angeles, CA',
      lastActive: '3 days ago',
      current: false,
      browser: 'Firefox',
      ip: '10.0.1.50',
    },
  ]);

  const handleTerminateSession = (sessionId: string) => {
    console.log('Terminating session:', sessionId);
    toast.success('Session terminated successfully');
  };

  const handleTerminateAllSessions = () => {
    toast.success('All other sessions terminated');
  };

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <h4 className='font-medium text-gray-900 dark:text-gray-100'>
          Active Sessions
        </h4>
        <button
          onClick={handleTerminateAllSessions}
          className='text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300'
        >
          Terminate All Others
        </button>
      </div>

      <div className='space-y-3'>
        {sessions.map((session) => (
          <div
            key={session.id}
            className='flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg'
          >
            <div className='flex items-center space-x-3'>
              {session.device.toLowerCase().includes('iphone') ||
              session.device.toLowerCase().includes('mobile') ? (
                <DevicePhoneMobileIcon className='h-6 w-6 text-gray-400' />
              ) : (
                <ComputerDesktopIcon className='h-6 w-6 text-gray-400' />
              )}

              <div>
                <div className='flex items-center space-x-2'>
                  <span className='font-medium text-gray-900 dark:text-gray-100'>
                    {session.device}
                  </span>
                  {session.current && (
                    <span className='px-2 py-1 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 text-xs font-medium rounded-full'>
                      Current
                    </span>
                  )}
                </div>
                <div className='text-sm text-gray-500 dark:text-gray-400'>
                  {session.browser} • {session.location} • {session.ip}
                </div>
                <div className='flex items-center text-xs text-gray-400 dark:text-gray-500 mt-1'>
                  <ClockIcon className='h-3 w-3 mr-1' />
                  Last active {session.lastActive}
                </div>
              </div>
            </div>

            {!session.current && (
              <button
                onClick={() => handleTerminateSession(session.id)}
                className='text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300'
              >
                Terminate
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const SecuritySettingsSection: React.FC = () => {
  const { settings, isLoading } = useSettings();
  const [localSettings, setLocalSettings] = useState<SecuritySettings>({});
  const [hasChanges, setHasChanges] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>(
    {}
  );

  // Helper function to get default security settings
  const getDefaultSecuritySettings = (): SecuritySettings => ({
    twoFactorEnabled: false,
    loginAlerts: false,
    sessionTimeout: '24h',
  });

  // Initialize local settings (with defaults since server doesn't have security settings yet)
  useEffect(() => {
    const settingsWithSecurity = settings as unknown as {
      security?: SecuritySettings;
    };
    const securitySettings = settingsWithSecurity?.security;

    if (securitySettings) {
      setLocalSettings({
        twoFactorEnabled: securitySettings.twoFactorEnabled || false,
        loginAlerts: securitySettings.loginAlerts || false,
        sessionTimeout: securitySettings.sessionTimeout || '24h',
      });
    } else {
      // Use defaults if server doesn't have security settings yet
      setLocalSettings(getDefaultSecuritySettings());
    }
  }, [settings]);

  // Check for changes
  useEffect(() => {
    const settingsWithSecurity = settings as unknown as {
      security?: SecuritySettings;
    };
    const securitySettings = settingsWithSecurity?.security;

    if (!securitySettings) {
      // If no server settings, check against defaults
      const defaultSettings = getDefaultSecuritySettings();
      const hasChanges =
        JSON.stringify(localSettings) !== JSON.stringify(defaultSettings);
      setHasChanges(hasChanges);
      return;
    }

    const serverSettings: SecuritySettings = {
      twoFactorEnabled: securitySettings.twoFactorEnabled || false,
      loginAlerts: securitySettings.loginAlerts || false,
      sessionTimeout: securitySettings.sessionTimeout || '24h',
    };

    const hasChanges =
      JSON.stringify(localSettings) !== JSON.stringify(serverSettings);
    setHasChanges(hasChanges);
  }, [localSettings, settings]);

  const handleChange = (
    field: keyof SecuritySettings,
    value: SecuritySettings[keyof SecuritySettings]
  ) => {
    setLocalSettings((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validatePasswordForm = () => {
    const errors: Record<string, string> = {};

    if (!passwordForm.currentPassword) {
      errors.currentPassword = 'Current password is required';
    }

    if (!passwordForm.newPassword) {
      errors.newPassword = 'New password is required';
    } else if (passwordForm.newPassword.length < 8) {
      errors.newPassword = 'Password must be at least 8 characters';
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    if (passwordForm.currentPassword === passwordForm.newPassword) {
      errors.newPassword =
        'New password must be different from current password';
    }

    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePasswordChange = async () => {
    if (!validatePasswordForm()) {
      return;
    }

    try {
      // In a real app, you would call your API to change the password
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success('Password changed successfully');
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setPasswordErrors({});
    } catch (error: unknown) {
      console.error('Password change error:', error);
      toast.error('Failed to change password');
    }
  };

  const handleSave = async () => {
    try {
      // Note: Server doesn't have security endpoint yet
      toast.success(
        'Security settings saved locally (server endpoint not implemented yet)'
      );
      console.log('Security settings to save:', localSettings);
      setHasChanges(false);
    } catch (error: unknown) {
      console.error('Failed to save security settings:', error);
      toast.error('Failed to save security settings');
    }
  };

  const handleDiscard = () => {
    const settingsWithSecurity = settings as unknown as {
      security?: SecuritySettings;
    };
    const securitySettings = settingsWithSecurity?.security;

    if (securitySettings) {
      setLocalSettings({
        twoFactorEnabled: securitySettings.twoFactorEnabled || false,
        loginAlerts: securitySettings.loginAlerts || false,
        sessionTimeout: securitySettings.sessionTimeout || '24h',
      });
    } else {
      // Reset to defaults
      setLocalSettings(getDefaultSecuritySettings());
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

  return (
    <div className='space-y-6'>
      {/* Security Notice */}
      <div className='bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4'>
        <div className='flex items-center'>
          <ExclamationTriangleIcon className='h-5 w-5 text-blue-600 dark:text-blue-400 mr-3' />
          <div>
            <p className='text-sm font-medium text-blue-800 dark:text-blue-200'>
              Security Settings Preview
            </p>
            <p className='text-xs text-blue-700 dark:text-blue-300 mt-1'>
              Some security features may require server-side implementation to
              be fully functional.
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

      {/* Change Password */}
      <div className='bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6'>
        <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4'>
          Change Password
        </h3>

        <div className='space-y-4 max-w-md'>
          <PasswordInput
            label='Current Password'
            value={passwordForm.currentPassword}
            onChange={(value) =>
              setPasswordForm((prev) => ({ ...prev, currentPassword: value }))
            }
            placeholder='Enter your current password'
            error={passwordErrors.currentPassword}
          />

          <PasswordInput
            label='New Password'
            value={passwordForm.newPassword}
            onChange={(value) =>
              setPasswordForm((prev) => ({ ...prev, newPassword: value }))
            }
            placeholder='Enter your new password'
            error={passwordErrors.newPassword}
            showStrength
          />

          <PasswordInput
            label='Confirm New Password'
            value={passwordForm.confirmPassword}
            onChange={(value) =>
              setPasswordForm((prev) => ({ ...prev, confirmPassword: value }))
            }
            placeholder='Confirm your new password'
            error={passwordErrors.confirmPassword}
          />

          <button
            onClick={handlePasswordChange}
            className='w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium'
          >
            Change Password
          </button>
        </div>
      </div>

      {/* Two-Factor Authentication */}
      <TwoFactorSetup
        enabled={localSettings.twoFactorEnabled || false}
        onToggle={(enabled) => handleChange('twoFactorEnabled', enabled)}
      />

      {/* Security Preferences */}
      <div className='bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6'>
        <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4'>
          Security Preferences
        </h3>

        <div className='space-y-4'>
          <div className='flex items-center justify-between'>
            <div>
              <h4 className='font-medium text-gray-900 dark:text-gray-100'>
                Login Alerts
              </h4>
              <p className='text-sm text-gray-500 dark:text-gray-400'>
                Get notified when someone logs into your account
              </p>
            </div>
            <button
              onClick={() =>
                handleChange('loginAlerts', !localSettings.loginAlerts)
              }
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                localSettings.loginAlerts
                  ? 'bg-blue-600'
                  : 'bg-gray-200 dark:bg-gray-700'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  localSettings.loginAlerts ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className='space-y-2'>
            <label className='text-sm font-medium text-gray-900 dark:text-gray-100'>
              Session Timeout
            </label>
            <select
              value={localSettings.sessionTimeout || '24h'}
              onChange={(e) => handleChange('sessionTimeout', e.target.value)}
              className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-lg text-gray-900 dark:text-gray-100'
            >
              <option value='1h'>1 hour</option>
              <option value='8h'>8 hours</option>
              <option value='24h'>24 hours</option>
              <option value='7d'>7 days</option>
              <option value='30d'>30 days</option>
            </select>
            <p className='text-xs text-gray-500 dark:text-gray-400'>
              Automatically log out after this period of inactivity
            </p>
          </div>
        </div>
      </div>

      {/* Active Sessions */}
      <div className='bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6'>
        <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4'>
          Account Security
        </h3>
        <ActiveSessions />
      </div>
    </div>
  );
};

export default SecuritySettingsSection;
