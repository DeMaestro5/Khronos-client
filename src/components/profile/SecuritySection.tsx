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
    <div className='bg-white rounded-2xl shadow-lg border border-slate-200/60 p-8'>
      <div className='flex items-center justify-between mb-6'>
        <h2 className='text-xl font-bold text-gray-900'>Security</h2>
        <button
          type='button'
          onClick={() => setChangePassword(!changePassword)}
          className='text-sm text-indigo-600 hover:text-indigo-700 font-medium'
        >
          {changePassword ? 'Cancel Password Change' : 'Change Password'}
        </button>
      </div>

      {changePassword && (
        <div className='space-y-6'>
          <div className='p-4 bg-yellow-50 border border-yellow-200 rounded-xl'>
            <div className='flex items-center space-x-3'>
              <FiShield className='h-5 w-5 text-yellow-600 flex-shrink-0' />
              <p className='text-sm text-yellow-800'>
                Password changes require your current password for security
                verification.
              </p>
            </div>
          </div>

          {/* Current Password */}
          <div>
            <label
              htmlFor='currentPassword'
              className='block text-sm font-semibold text-gray-900 mb-2'
            >
              Current Password *
            </label>
            <div className='relative'>
              <FiLock className='absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400' />
              <input
                type={showCurrentPassword ? 'text' : 'password'}
                id='currentPassword'
                name='currentPassword'
                value={formData.currentPassword}
                onChange={onInputChange}
                className={`w-full pl-12 pr-12 py-4 bg-gray-50 border-2 rounded-xl focus:outline-none focus:bg-white transition-all duration-200 ${
                  errors.currentPassword
                    ? 'border-red-300 focus:border-red-500'
                    : 'border-gray-200 focus:border-indigo-500'
                }`}
                placeholder='Enter your current password'
              />
              <button
                type='button'
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className='absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600'
              >
                {showCurrentPassword ? (
                  <FiEyeOff className='h-5 w-5' />
                ) : (
                  <FiEye className='h-5 w-5' />
                )}
              </button>
            </div>
            {errors.currentPassword && (
              <p className='mt-2 text-sm text-red-600 flex items-center'>
                <FiAlertCircle className='h-4 w-4 mr-1 flex-shrink-0' />
                {errors.currentPassword}
              </p>
            )}
          </div>

          {/* New Password */}
          <div>
            <label
              htmlFor='newPassword'
              className='block text-sm font-semibold text-gray-900 mb-2'
            >
              New Password *
            </label>
            <div className='relative'>
              <FiLock className='absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400' />
              <input
                type={showNewPassword ? 'text' : 'password'}
                id='newPassword'
                name='newPassword'
                value={formData.newPassword}
                onChange={onInputChange}
                className={`w-full pl-12 pr-12 py-4 bg-gray-50 border-2 rounded-xl focus:outline-none focus:bg-white transition-all duration-200 ${
                  errors.newPassword
                    ? 'border-red-300 focus:border-red-500'
                    : 'border-gray-200 focus:border-indigo-500'
                }`}
                placeholder='Enter your new password'
              />
              <button
                type='button'
                onClick={() => setShowNewPassword(!showNewPassword)}
                className='absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600'
              >
                {showNewPassword ? (
                  <FiEyeOff className='h-5 w-5' />
                ) : (
                  <FiEye className='h-5 w-5' />
                )}
              </button>
            </div>
            {errors.newPassword && (
              <p className='mt-2 text-sm text-red-600 flex items-center'>
                <FiAlertCircle className='h-4 w-4 mr-1 flex-shrink-0' />
                {errors.newPassword}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label
              htmlFor='confirmPassword'
              className='block text-sm font-semibold text-gray-900 mb-2'
            >
              Confirm New Password *
            </label>
            <div className='relative'>
              <FiLock className='absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400' />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id='confirmPassword'
                name='confirmPassword'
                value={formData.confirmPassword}
                onChange={onInputChange}
                className={`w-full pl-12 pr-12 py-4 bg-gray-50 border-2 rounded-xl focus:outline-none focus:bg-white transition-all duration-200 ${
                  errors.confirmPassword
                    ? 'border-red-300 focus:border-red-500'
                    : 'border-gray-200 focus:border-indigo-500'
                }`}
                placeholder='Confirm your new password'
              />
              <button
                type='button'
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className='absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600'
              >
                {showConfirmPassword ? (
                  <FiEyeOff className='h-5 w-5' />
                ) : (
                  <FiEye className='h-5 w-5' />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className='mt-2 text-sm text-red-600 flex items-center'>
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
