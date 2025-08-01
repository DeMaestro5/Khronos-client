'use client';

import { useState, ChangeEvent, MouseEvent } from 'react';
import { Input } from '../ui/input';
import { useAuth } from '@/src/context/AuthContext';
import { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, Mail, Lock, CheckCircle } from 'lucide-react';

interface FormData {
  email: string;
  password: string;
  remember: boolean;
}

interface FormErrors {
  email?: string;
  password?: string;
}

export default function LoginForm() {
  const router = useRouter();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    remember: false,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [focusedField, setFocusedField] = useState('');

  const handleSubmit = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    // Validate email
    const newErrors: FormErrors = {};
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = 'Email is invalid';

    // Validate Password
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 8)
      newErrors.password = 'Password must be at least 8 characters';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    try {
      await login(formData.email, formData.password, formData.remember);
      // Handle success - login function in AuthContext handles token storage
      router.replace('/dashboard');
      // Force a refresh to ensure the new auth state is picked up
      window.location.href = '/dashboard';
    } catch (error) {
      console.error('Login error:', error);

      // Handle the error properly
      if (error instanceof AxiosError) {
        // Check for different error response structures
        const errorMessage =
          error.response?.data?.message ||
          error.response?.data?.error ||
          error.message ||
          'Login failed. Please try again.';

        // For authentication failures, show a generic message for security
        if (error.response?.status === 401 || error.response?.status === 400) {
          setErrors({ email: 'Incorrect email or password' });
        } else {
          setErrors({ email: errorMessage });
        }
      } else {
        setErrors({ email: 'Login failed. Please try again.' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div className='max-w-md mx-auto p-4 sm:p-8 bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-slate-200/50'>
      <div className='space-y-6'>
        <div className='space-y-5'>
          {/* Email Field */}
          <div className='group'>
            <label
              htmlFor='email'
              className={`block text-sm font-bold mb-3 transition-all duration-200 ${
                focusedField === 'email' || formData.email
                  ? 'text-purple-600'
                  : 'text-purple-800 dark:text-purple-400'
              }`}
            >
              Email Address
            </label>
            <div className='relative'>
              <div className='absolute left-3 top-1/2 transform -translate-y-1/2 z-10'>
                <Mail
                  className={`w-5 h-5 transition-colors duration-200 ${
                    focusedField === 'email' || formData.email
                      ? 'text-purple-600'
                      : 'text-purple-500'
                  }`}
                />
              </div>
              <Input
                id='email'
                name='email'
                type='email'
                placeholder='Email'
                value={formData.email}
                onChange={handleChange}
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField('')}
                className={`w-full pl-12 pr-4 py-3 sm:py-4 border-2 rounded-xl transition-all duration-300 text-purple-900 placeholder:text-purple-500 placeholder:font-medium ${
                  errors.email
                    ? 'border-red-400 focus:border-red-500 focus:ring-red-100 !bg-red-50/20 dark:!bg-red-50/20'
                    : focusedField === 'email'
                    ? 'border-purple-400 focus:border-purple-500 focus:ring-purple-100 !bg-white dark:!bg-white shadow-lg'
                    : 'border-purple-200 hover:border-purple-300 focus:border-purple-400 focus:ring-purple-100 !bg-white dark:!bg-white hover:!bg-purple-50/20 dark:hover:!bg-purple-50/20'
                }`}
                style={{
                  WebkitFontSmoothing: 'antialiased',
                  MozOsxFontSmoothing: 'grayscale',
                  backgroundColor: errors.email
                    ? 'rgba(254, 242, 242, 0.2)'
                    : 'white',
                  color: '#581c87', // purple-900
                }}
              />
            </div>
            {errors.email && (
              <p className='mt-2 text-sm text-red-600 flex items-center gap-1 font-medium'>
                <svg
                  className='w-4 h-4'
                  viewBox='0 0 24 24'
                  fill='currentColor'
                >
                  <path d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z' />
                </svg>
                {errors.email}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div className='group'>
            <label
              htmlFor='password'
              className={`block text-sm font-bold mb-3 transition-all duration-200 ${
                focusedField === 'password' || formData.password
                  ? 'text-purple-600'
                  : 'text-purple-800 dark:text-purple-400'
              }`}
            >
              Password
            </label>
            <div className='relative'>
              <div className='absolute left-3 top-1/2 transform -translate-y-1/2 z-10'>
                <Lock
                  className={`w-5 h-5 transition-colors duration-200 ${
                    focusedField === 'password' || formData.password
                      ? 'text-purple-600'
                      : 'text-purple-500'
                  }`}
                />
              </div>
              <Input
                id='password'
                name='password'
                type={showPassword ? 'text' : 'password'}
                placeholder='Password'
                value={formData.password}
                onChange={handleChange}
                onFocus={() => setFocusedField('password')}
                onBlur={() => setFocusedField('')}
                className={`w-full pl-12 pr-12 py-3 sm:py-4 border-2 rounded-xl transition-all duration-300 text-purple-900 placeholder:text-purple-500 placeholder:font-medium ${
                  errors.password
                    ? 'border-red-400 focus:border-red-500 focus:ring-red-100 !bg-red-50/20 dark:!bg-red-50/20'
                    : focusedField === 'password'
                    ? 'border-purple-400 focus:border-purple-500 focus:ring-purple-100 !bg-white dark:!bg-white shadow-lg'
                    : 'border-purple-200 hover:border-purple-300 focus:border-purple-400 focus:ring-purple-100 !bg-white dark:!bg-white hover:!bg-purple-50/20 dark:hover:!bg-purple-50/20'
                }`}
                style={{
                  WebkitFontSmoothing: 'antialiased',
                  MozOsxFontSmoothing: 'grayscale',
                  backgroundColor: errors.password
                    ? 'rgba(254, 242, 242, 0.2)'
                    : 'white',
                  color: '#581c87', // purple-900
                }}
              />
              <button
                type='button'
                onClick={() => setShowPassword(!showPassword)}
                className='absolute right-4 top-1/2 transform -translate-y-1/2 text-purple-500 hover:text-purple-700 transition-colors p-1 rounded-lg hover:bg-purple-50'
              >
                {showPassword ? (
                  <EyeOff className='w-5 h-5' />
                ) : (
                  <Eye className='w-5 h-5' />
                )}
              </button>
            </div>
            {errors.password && (
              <p className='mt-2 text-sm text-red-600 flex items-center gap-1 font-medium'>
                <svg
                  className='w-4 h-4'
                  viewBox='0 0 24 24'
                  fill='currentColor'
                >
                  <path d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z' />
                </svg>
                {errors.password}
              </p>
            )}
          </div>
        </div>

        {/* Remember me and Forgot password */}
        <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between pt-2 space-y-3 sm:space-y-0'>
          <div className='flex items-center space-x-3'>
            <div className='relative'>
              <input
                type='checkbox'
                id='remember'
                name='remember'
                checked={formData.remember}
                onChange={handleChange}
                className='sr-only'
              />
              <label
                htmlFor='remember'
                className='flex items-center cursor-pointer group'
              >
                <div
                  className={`w-5 h-5 border-2 rounded-md transition-all duration-200 flex items-center justify-center ${
                    formData.remember
                      ? 'bg-purple-600 border-purple-600 scale-110'
                      : 'border-purple-300 group-hover:border-purple-500'
                  }`}
                >
                  {formData.remember && (
                    <CheckCircle className='w-3 h-3 text-white' />
                  )}
                </div>
                <span className='ml-3 text-sm text-purple-700 group-hover:text-purple-900 transition-colors font-semibold'>
                  Remember me
                </span>
              </label>
            </div>
          </div>
          <Link
            href='/auth/forgot-password'
            className='text-sm font-bold text-purple-600 hover:text-purple-800 transition-colors hover:underline bg-purple-50 hover:bg-purple-100 px-4 py-2 rounded-lg text-center sm:text-left w-full sm:w-auto'
          >
            Forgot password?
          </Link>
        </div>

        {/* Submit Button */}
        <button
          type='submit'
          disabled={isLoading}
          className='w-full group relative overflow-hidden bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-600 hover:from-purple-700 hover:via-purple-800 hover:to-indigo-700 text-white py-3 sm:py-4 rounded-xl font-bold text-base shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]'
          onClick={handleSubmit}
        >
          {/* Animated background gradient */}
          <div className='absolute inset-0 bg-gradient-to-r from-purple-500 via-purple-600 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300' />

          {/* Shimmer effect */}
          <div className='absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700' />

          <div className='relative z-10'>
            {isLoading ? (
              <div className='flex items-center justify-center space-x-2'>
                <div className='w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin' />
                <span className='font-bold'>Logging you in...</span>
              </div>
            ) : (
              <span className='flex items-center justify-center space-x-2'>
                <span className='font-bold'>Login</span>
                <svg
                  className='w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-200'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M17 8l4 4m0 0l-4 4m4-4H3'
                  />
                </svg>
              </span>
            )}
          </div>
        </button>
      </div>
    </div>
  );
}
