'use client';

import { FiUser, FiMail, FiAlertCircle } from 'react-icons/fi';
import { BasicInfoData, BasicInfoErrors } from '@/src/types/profile';

interface BasicInfoSectionProps {
  formData: BasicInfoData;
  errors: BasicInfoErrors;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function BasicInfoSection({
  formData,
  errors,
  onInputChange,
}: BasicInfoSectionProps) {
  return (
    <div className='bg-white dark:bg-slate-800/80 rounded-xl shadow-sm border border-gray-200 dark:border-slate-600 p-6'>
      <h2 className='text-lg font-semibold text-gray-900 dark:text-slate-100 mb-6'>
        Basic Information
      </h2>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        {/* Name */}
        <div className='md:col-span-2'>
          <label
            htmlFor='name'
            className='block text-sm font-semibold text-gray-900 dark:text-slate-100 mb-2'
          >
            Full Name *
          </label>
          <div className='relative'>
            <FiUser className='absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-slate-500' />
            <input
              type='text'
              id='name'
              name='name'
              value={formData.name}
              onChange={onInputChange}
              className={`w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-slate-700 border text-gray-900 dark:text-slate-100 rounded-lg focus:outline-none focus:bg-white dark:focus:bg-slate-600 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-blue-400 focus:ring-offset-0 transition-all duration-200 ${
                errors.name
                  ? 'border-red-300 dark:border-red-600 focus:border-red-500 focus:ring-red-500 dark:focus:ring-red-400'
                  : 'border-gray-200 dark:border-slate-600 focus:border-indigo-500 dark:focus:border-blue-400'
              }`}
              placeholder='Enter your full name'
            />
          </div>
          {errors.name && (
            <p className='mt-2 text-sm text-red-600 dark:text-red-400 flex items-center'>
              <FiAlertCircle className='h-4 w-4 mr-1 flex-shrink-0' />
              {errors.name}
            </p>
          )}
        </div>

        {/* Email */}
        <div className='md:col-span-2'>
          <label
            htmlFor='email'
            className='block text-sm font-semibold text-gray-900 dark:text-slate-100 mb-2'
          >
            Email Address *
          </label>
          <div className='relative'>
            <FiMail className='absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-slate-500' />
            <input
              type='email'
              id='email'
              name='email'
              value={formData.email}
              onChange={onInputChange}
              className={`w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-slate-700 border text-gray-900 dark:text-slate-100 rounded-lg focus:outline-none focus:bg-white dark:focus:bg-slate-600 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-blue-400 focus:ring-offset-0 transition-all duration-200 disabled:bg-gray-100 dark:disabled:bg-slate-800 disabled:text-gray-500 dark:disabled:text-slate-400 ${
                errors.email
                  ? 'border-red-300 dark:border-red-600 focus:border-red-500 focus:ring-red-500 dark:focus:ring-red-400'
                  : 'border-gray-200 dark:border-slate-600 focus:border-indigo-500 dark:focus:border-blue-400'
              }`}
              placeholder='Enter your email address'
              disabled // Email updates might require verification
            />
          </div>
          {errors.email && (
            <p className='mt-2 text-sm text-red-600 dark:text-red-400 flex items-center'>
              <FiAlertCircle className='h-4 w-4 mr-1 flex-shrink-0' />
              {errors.email}
            </p>
          )}
          <p className='mt-2 text-xs text-gray-500 dark:text-slate-400'>
            Email changes require verification and are not currently supported.
          </p>
        </div>
      </div>
    </div>
  );
}
