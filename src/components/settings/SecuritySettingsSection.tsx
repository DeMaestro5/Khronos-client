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
  disabled?: boolean;
}

const PasswordInput: React.FC<PasswordInputProps> = ({
  label,
  value,
  onChange,
  placeholder,
  error,
  showStrength = false,
  disabled = false,
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
      <label className='text-sm font-medium text-theme-primary'>{label}</label>

      <div className='relative'>
        <input
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-accent-primary focus:border-accent-primary pr-10 ${
            disabled
              ? 'opacity-50 cursor-not-allowed bg-theme-secondary/20'
              : error
              ? 'border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900/20'
              : 'border-theme-primary bg-theme-card'
          } text-theme-primary placeholder-theme-muted`}
        />

        <button
          type='button'
          onClick={() => setShowPassword(!showPassword)}
          disabled={disabled}
          className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${
            disabled
              ? 'text-theme-muted cursor-not-allowed'
              : 'text-theme-muted hover:text-theme-primary'
          }`}
        >
          {showPassword ? (
            <EyeSlashIcon className='h-4 w-4' />
          ) : (
            <EyeIcon className='h-4 w-4' />
          )}
        </button>
      </div>

      {/* Password Strength Indicator */}
      {strength && !disabled && (
        <div className='space-y-2'>
          <div className='flex items-center space-x-2'>
            <div className='flex-1 bg-theme-secondary/30 rounded-full h-2'>
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
                    : 'text-theme-muted'
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
  disabled?: boolean;
}

const TwoFactorSetup: React.FC<TwoFactorSetupProps> = ({
  enabled,
  onToggle,
  disabled = false,
}) => {
  const [showSetup, setShowSetup] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [qrCode, setQrCode] = useState('');
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleEnable2FA = async () => {
    if (disabled) return;
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
    if (disabled) return;
    const confirmDisable = window.confirm(
      'Are you sure you want to disable two-factor authentication? This will make your account less secure.'
    );

    if (!confirmDisable) return;

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
      <div className='bg-theme-card rounded-lg border border-theme-primary p-6'>
        <h3 className='text-lg font-semibold text-theme-primary mb-4'>
          Set up Two-Factor Authentication
        </h3>

        {backupCodes.length === 0 ? (
          <div className='space-y-6'>
            <div className='text-center'>
              <div className='w-48 h-48 bg-theme-secondary/20 rounded-lg mx-auto mb-4 flex items-center justify-center'>
                <img src={qrCode} alt='QR Code' className='w-40 h-40' />
              </div>
              <p className='text-sm text-theme-secondary'>
                Scan this QR code with your authenticator app
              </p>
            </div>

            <div className='space-y-4'>
              <div>
                <label className='text-sm font-medium text-theme-primary'>
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
                  className='mt-1 w-full px-3 py-2 border border-theme-primary bg-theme-card rounded-lg text-center text-2xl tracking-widest text-theme-primary'
                  maxLength={6}
                  disabled={isVerifying}
                />
              </div>

              <div className='flex space-x-3'>
                <button
                  onClick={() => setShowSetup(false)}
                  disabled={isVerifying}
                  className='flex-1 px-4 py-2 border border-theme-primary text-theme-primary rounded-lg hover:bg-theme-hover disabled:opacity-50 disabled:cursor-not-allowed'
                >
                  Cancel
                </button>
                <button
                  onClick={handleVerify2FA}
                  disabled={verificationCode.length !== 6 || isVerifying}
                  className='flex-1 px-4 py-2 bg-accent-primary hover:bg-accent-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg'
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
              <h4 className='text-lg font-semibold text-theme-primary'>
                Two-Factor Authentication Enabled!
              </h4>
              <p className='text-theme-secondary mt-2'>
                Save these backup codes in a safe place. You can use them to
                access your account if you lose your authenticator device.
              </p>
            </div>

            <div className='bg-theme-secondary/10 rounded-lg p-4'>
              <h5 className='font-medium text-theme-primary mb-3'>
                Backup Codes
              </h5>
              <div className='grid grid-cols-2 gap-2 text-sm font-mono'>
                {backupCodes.map((code, index) => (
                  <div
                    key={index}
                    className='bg-theme-card border border-theme-primary rounded px-3 py-2 text-center'
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
    <div className='flex items-center justify-between p-4 bg-theme-secondary/10 rounded-lg'>
      <div className='flex items-center space-x-3'>
        <ShieldCheckIcon
          className={`h-6 w-6 ${
            enabled
              ? 'text-green-500'
              : disabled
              ? 'text-gray-300'
              : 'text-gray-400'
          }`}
        />
        <div>
          <h4
            className={`font-medium ${
              disabled ? 'text-theme-muted' : 'text-theme-primary'
            }`}
          >
            Two-Factor Authentication
          </h4>
          <p
            className={`text-sm ${
              disabled ? 'text-theme-muted' : 'text-theme-secondary'
            }`}
          >
            {enabled
              ? 'Your account is protected with 2FA'
              : 'Add an extra layer of security to your account'}
          </p>
        </div>
      </div>

      <button
        onClick={enabled ? handleDisable2FA : handleEnable2FA}
        disabled={disabled}
        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
          disabled
            ? 'opacity-50 cursor-not-allowed bg-theme-secondary/20 text-theme-muted'
            : enabled
            ? 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-900/30'
            : 'bg-accent-primary/10 text-accent-primary hover:bg-accent-primary/20'
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

const ActiveSessions: React.FC<{ disabled?: boolean }> = ({
  disabled = false,
}) => {
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
    if (disabled) return;
    console.log('Terminating session:', sessionId);
    toast.success('Session terminated successfully (preview mode)');
  };

  const handleTerminateAllSessions = () => {
    if (disabled) return;
    const confirmTerminate = window.confirm(
      'Are you sure you want to terminate all other sessions? You will need to log in again on those devices.'
    );

    if (!confirmTerminate) return;
    toast.success('All other sessions terminated (preview mode)');
  };

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <h4
          className={`font-medium ${
            disabled ? 'text-theme-muted' : 'text-theme-primary'
          }`}
        >
          Active Sessions
        </h4>
        <button
          onClick={handleTerminateAllSessions}
          disabled={disabled}
          className={`text-sm font-medium transition-colors ${
            disabled
              ? 'text-theme-muted cursor-not-allowed'
              : 'text-red-700 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300'
          }`}
        >
          Terminate All Others
        </button>
      </div>

      <div className='space-y-3'>
        {sessions.map((session) => (
          <div
            key={session.id}
            className={`flex items-center justify-between p-4 border rounded-lg ${
              disabled
                ? 'border-theme-primary opacity-50'
                : 'border-theme-primary'
            }`}
          >
            <div className='flex items-center space-x-3'>
              {session.device.toLowerCase().includes('iphone') ||
              session.device.toLowerCase().includes('mobile') ? (
                <DevicePhoneMobileIcon
                  className={`h-6 w-6 ${
                    disabled ? 'text-theme-muted' : 'text-theme-secondary'
                  }`}
                />
              ) : (
                <ComputerDesktopIcon
                  className={`h-6 w-6 ${
                    disabled ? 'text-theme-muted' : 'text-theme-secondary'
                  }`}
                />
              )}

              <div>
                <div className='flex items-center space-x-2'>
                  <span
                    className={`font-medium ${
                      disabled ? 'text-theme-muted' : 'text-theme-primary'
                    }`}
                  >
                    {session.device}
                  </span>
                  {session.current && (
                    <span className='px-2 py-1 bg-green-600 text-white text-xs font-medium rounded-full'>
                      Current
                    </span>
                  )}
                </div>
                <div
                  className={`text-sm ${
                    disabled ? 'text-theme-muted' : 'text-theme-secondary'
                  }`}
                >
                  {session.browser} • {session.location} • {session.ip}
                </div>
                <div
                  className={`flex items-center text-xs mt-1 ${
                    disabled ? 'text-theme-muted' : 'text-theme-secondary'
                  }`}
                >
                  <ClockIcon className='h-3 w-3 mr-1' />
                  Last active {session.lastActive}
                </div>
              </div>
            </div>

            {!session.current && (
              <button
                onClick={() => handleTerminateSession(session.id)}
                disabled={disabled}
                className={`text-sm font-medium transition-colors ${
                  disabled
                    ? 'text-theme-muted cursor-not-allowed'
                    : 'text-red-700 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300'
                }`}
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
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>(
    {}
  );
  const [isChangingPassword, setIsChangingPassword] = useState(false);

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

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!localSettings.sessionTimeout) {
      newErrors.sessionTimeout = 'Session timeout is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    field: keyof SecuritySettings,
    value: SecuritySettings[keyof SecuritySettings]
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
      toast.error('Please fix the errors before changing password');
      return;
    }

    setIsChangingPassword(true);
    try {
      // In a real app, you would call your API to change the password
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success('Password changed successfully (preview mode)');
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setPasswordErrors({});
    } catch (error: unknown) {
      console.error('Password change error:', error);
      toast.error('Failed to change password');
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleSave = async () => {
    if (!validateForm()) {
      toast.error('Please fix the errors before saving');
      return;
    }

    setIsSaving(true);
    try {
      // Note: Server doesn't have security endpoint yet
      console.log('Security settings to save:', localSettings);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success(
        'Security settings saved locally (server endpoint not implemented yet)'
      );
      setHasChanges(false);
    } catch (error: unknown) {
      console.error('Failed to save security settings:', error);
      toast.error('Failed to save security settings');
    } finally {
      setIsSaving(false);
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
    setErrors({});
    setHasChanges(false);
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

  // Check if we're in preview mode (no backend security endpoint)
  const isPreviewMode = true; // This would be false when backend implements security

  return (
    <div className='space-y-6'>
      {/* Security Notice */}
      <div className='bg-accent-primary/10 dark:bg-accent-primary/20 border border-accent-primary/30 dark:border-accent-primary/40 rounded-lg p-4'>
        <div className='flex items-center'>
          <ExclamationTriangleIcon className='h-5 w-5 text-accent-primary mr-3' />
          <div>
            <p className='text-sm font-medium text-theme-primary'>
              Security Settings Preview
            </p>
            <p className='text-xs text-theme-secondary mt-1'>
              Security features are in preview mode and require server-side
              implementation to be fully functional.
            </p>
          </div>
        </div>
      </div>

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

      {/* Change Password */}
      <div className='bg-theme-card rounded-lg border border-theme-primary p-6'>
        <h3 className='text-lg font-semibold text-theme-primary mb-4'>
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
            disabled={isChangingPassword}
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
            disabled={isChangingPassword}
          />

          <PasswordInput
            label='Confirm New Password'
            value={passwordForm.confirmPassword}
            onChange={(value) =>
              setPasswordForm((prev) => ({ ...prev, confirmPassword: value }))
            }
            placeholder='Confirm your new password'
            error={passwordErrors.confirmPassword}
            disabled={isChangingPassword}
          />

          <button
            onClick={handlePasswordChange}
            disabled={isChangingPassword}
            className='w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-2 px-4 rounded-lg font-medium transition-colors'
          >
            {isChangingPassword ? 'Changing...' : 'Change Password'}
          </button>
        </div>
      </div>

      {/* Two-Factor Authentication */}
      <TwoFactorSetup
        enabled={localSettings.twoFactorEnabled || false}
        onToggle={(enabled) => handleChange('twoFactorEnabled', enabled)}
        disabled={isSaving}
      />

      {/* Security Preferences */}
      <div className='bg-theme-card rounded-lg border border-theme-primary p-6'>
        <h3 className='text-lg font-semibold text-theme-primary mb-4'>
          Security Preferences
        </h3>

        <div className='space-y-4'>
          <div className='flex items-center justify-between'>
            <div>
              <h4
                className={`font-medium ${
                  isSaving ? 'text-theme-muted' : 'text-theme-primary'
                }`}
              >
                Login Alerts
              </h4>
              <p
                className={`text-sm ${
                  isSaving ? 'text-theme-muted' : 'text-theme-secondary'
                }`}
              >
                Get notified when someone logs into your account
              </p>
            </div>
            <button
              onClick={() =>
                handleChange('loginAlerts', !localSettings.loginAlerts)
              }
              disabled={isSaving}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2 ${
                isSaving
                  ? 'opacity-50 cursor-not-allowed bg-theme-secondary/30'
                  : localSettings.loginAlerts
                  ? 'bg-accent-primary'
                  : 'bg-theme-secondary/30'
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
            <label
              className={`text-sm font-medium ${
                isSaving ? 'text-theme-muted' : 'text-theme-primary'
              }`}
            >
              Session Timeout
            </label>
            <select
              value={localSettings.sessionTimeout || '24h'}
              onChange={(e) => handleChange('sessionTimeout', e.target.value)}
              disabled={isSaving}
              className={`w-full px-3 py-2 border rounded-lg text-theme-primary ${
                isSaving
                  ? 'opacity-50 cursor-not-allowed bg-theme-secondary/20 border-theme-primary'
                  : errors.sessionTimeout
                  ? 'border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900/20'
                  : 'border-theme-primary bg-theme-card'
              }`}
            >
              <option value='1h'>1 hour</option>
              <option value='8h'>8 hours</option>
              <option value='24h'>24 hours</option>
              <option value='7d'>7 days</option>
              <option value='30d'>30 days</option>
            </select>
            <p
              className={`text-xs ${
                errors.sessionTimeout
                  ? 'text-red-600 dark:text-red-400'
                  : isSaving
                  ? 'text-theme-muted'
                  : 'text-theme-secondary'
              }`}
            >
              {errors.sessionTimeout ||
                'Automatically log out after this period of inactivity'}
            </p>
          </div>
        </div>
      </div>

      {/* Active Sessions */}
      <div className='bg-theme-card rounded-lg border border-theme-primary p-6'>
        <h3 className='text-lg font-semibold text-theme-primary mb-4'>
          Account Security
        </h3>
        <ActiveSessions disabled={isPreviewMode} />
      </div>
    </div>
  );
};

export default SecuritySettingsSection;
