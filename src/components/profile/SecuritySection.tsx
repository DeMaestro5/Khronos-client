'use client';

import { useState } from 'react';
import {
  FiEye,
  FiEyeOff,
  FiLock,
  FiAlertCircle,
  FiShield,
} from 'react-icons/fi';
import { PasswordData, PasswordErrors } from '@/src/types/profile';

interface SecuritySectionProps {
  formData: PasswordData;
  errors: PasswordErrors;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  changePassword: boolean;
  setChangePassword: (value: boolean) => void;
}

export default function SecuritySection({
  formData,
  errors,
  onInputChange,
  changePassword,
  setChangePassword,
}: SecuritySectionProps) {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className='bg-theme-card rounded-xl shadow-theme-sm border border-theme-primary p-6'>
      <div className='flex items-center justify-between mb-6'>
        <h2 className='text-lg font-semibold text-theme-primary'>Security</h2>
        <button
          type='button'
          onClick={() => setChangePassword(!changePassword)}
          className='text-sm text-indigo-600 dark:text-indigo-400 cursor-pointer hover:text-indigo-700 dark:hover:text-indigo-300 font-medium hover:underline transition-colors duration-200'
        >
          {changePassword ? 'Cancel Password Change' : 'Change Password'}
        </button>
      </div>

      {changePassword && (
        <div className='space-y-6'>
          <div className='p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/50 rounded-lg'>
            <div className='flex items-start space-x-3'>
              <FiShield className='h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5' />
              <p className='text-sm text-amber-800 dark:text-amber-200'>
                Password changes require your current password for security
                verification.
              </p>
            </div>
          </div>

          {/* Current Password */}
          <div>
            <label
              htmlFor='currentPassword'
              className='block text-sm font-semibold text-gray-900 dark:text-slate-100 mb-2'
            >
              Current Password *
            </label>
            <div className='relative'>
              <FiLock className='absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-slate-500' />
              <input
                type={showCurrentPassword ? 'text' : 'password'}
                id='currentPassword'
                name='currentPassword'
                value={formData.currentPassword}
                onChange={onInputChange}
                className={`w-full pl-12 pr-12 py-3 bg-gray-50 dark:bg-slate-700 border text-gray-900 dark:text-slate-100 rounded-lg focus:outline-none focus:bg-white dark:focus:bg-slate-600 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-blue-500 focus:ring-offset-0 transition-all duration-200 ${
                  errors.currentPassword
                    ? 'border-red-300 dark:border-red-600 focus:border-red-500 focus:ring-red-500'
                    : 'border-gray-200 dark:border-slate-600 focus:border-indigo-500 dark:focus:border-blue-500'
                }`}
                placeholder='Enter your current password'
              />
              <button
                type='button'
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className='absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-slate-300'
              >
                {showCurrentPassword ? (
                  <FiEyeOff className='h-5 w-5' />
                ) : (
                  <FiEye className='h-5 w-5' />
                )}
              </button>
            </div>
            {errors.currentPassword && (
              <p className='mt-2 text-sm text-red-600 dark:text-red-400 flex items-center'>
                <FiAlertCircle className='h-4 w-4 mr-1 flex-shrink-0' />
                {errors.currentPassword}
              </p>
            )}
          </div>

          {/* New Password */}
          <div>
            <label
              htmlFor='newPassword'
              className='block text-sm font-semibold text-gray-900 dark:text-slate-100 mb-2'
            >
              New Password *
            </label>
            <div className='relative'>
              <FiLock className='absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-slate-500' />
              <input
                type={showNewPassword ? 'text' : 'password'}
                id='newPassword'
                name='newPassword'
                value={formData.newPassword}
                onChange={onInputChange}
                className={`w-full pl-12 pr-12 py-3 bg-gray-50 dark:bg-slate-700 border text-gray-900 dark:text-slate-100 rounded-lg focus:outline-none focus:bg-white dark:focus:bg-slate-600 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-blue-500 focus:ring-offset-0 transition-all duration-200 ${
                  errors.newPassword
                    ? 'border-red-300 dark:border-red-600 focus:border-red-500 focus:ring-red-500'
                    : 'border-gray-200 dark:border-slate-600 focus:border-indigo-500 dark:focus:border-blue-500'
                }`}
                placeholder='Enter your new password'
              />
              <button
                type='button'
                onClick={() => setShowNewPassword(!showNewPassword)}
                className='absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-slate-300'
              >
                {showNewPassword ? (
                  <FiEyeOff className='h-5 w-5' />
                ) : (
                  <FiEye className='h-5 w-5' />
                )}
              </button>
            </div>
            {errors.newPassword && (
              <p className='mt-2 text-sm text-red-600 dark:text-red-400 flex items-center'>
                <FiAlertCircle className='h-4 w-4 mr-1 flex-shrink-0' />
                {errors.newPassword}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label
              htmlFor='confirmPassword'
              className='block text-sm font-semibold text-gray-900 dark:text-slate-100 mb-2'
            >
              Confirm New Password *
            </label>
            <div className='relative'>
              <FiLock className='absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-slate-500' />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id='confirmPassword'
                name='confirmPassword'
                value={formData.confirmPassword}
                onChange={onInputChange}
                className={`w-full pl-12 pr-12 py-3 bg-gray-50 dark:bg-slate-700 border text-gray-900 dark:text-slate-100 rounded-lg focus:outline-none focus:bg-white dark:focus:bg-slate-600 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-blue-500 focus:ring-offset-0 transition-all duration-200 ${
                  errors.confirmPassword
                    ? 'border-red-300 dark:border-red-600 focus:border-red-500 focus:ring-red-500'
                    : 'border-gray-200 dark:border-slate-600 focus:border-indigo-500 dark:focus:border-blue-500'
                }`}
                placeholder='Confirm your new password'
              />
              <button
                type='button'
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className='absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-slate-300'
              >
                {showConfirmPassword ? (
                  <FiEyeOff className='h-5 w-5' />
                ) : (
                  <FiEye className='h-5 w-5' />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className='mt-2 text-sm text-red-600 dark:text-red-400 flex items-center'>
                <FiAlertCircle className='h-4 w-4 mr-1 flex-shrink-0' />
                {errors.confirmPassword}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
