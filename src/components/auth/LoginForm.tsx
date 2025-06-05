'use client';

import { useState, ChangeEvent, MouseEvent } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { authAPI } from '@/src/lib/api';
import { AuthUtils } from '@/src/lib/auth-utils';
import { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';

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

    // Validation
    const newErrors: FormErrors = {};
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = 'Email is invalid';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 8)
      newErrors.password = 'Password must be at least 8 characters';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    try {
      console.log('Login submitted:', formData);

      const response = await authAPI.login(formData.email, formData.password);
      console.log('Login Response:', response.data);

      // Handle success
      if (response.data.data?.tokens) {
        // Use AuthUtils to store tokens and user data properly
        AuthUtils.storeTokens(response.data.data.tokens);

        // Store user data if available
        if (response.data.data.user) {
          AuthUtils.storeUser(response.data.data.user);
        }

        router.replace('/dashboard');
        // Force a refresh to ensure the new auth state is picked up
        window.location.href = '/dashboard';
      } else {
        console.log('No tokens in response:', response.data);
        setErrors({ email: 'Login failed. Please try again.' });
      }
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
    <div className='max-w-md mx-auto p-8 bg-white rounded-2xl shadow-xl'>
      <div className='space-y-6'>
        <div className='space-y-5'>
          {/* Email Field */}
          <div className='group'>
            <label
              htmlFor='email'
              className={`block text-sm font-medium mb-2 transition-all duration-200 ${
                focusedField === 'email' || formData.email
                  ? 'text-indigo-600 transform -translate-y-1'
                  : 'text-slate-700'
              }`}
            >
              Email Address
            </label>
            <div className='relative'>
              <Input
                id='email'
                name='email'
                type='email'
                placeholder='Enter your email'
                value={formData.email}
                onChange={handleChange}
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField('')}
                className={`w-full px-4 py-3 border rounded-xl transition-all duration-300 bg-white text-black hover:bg-gray-50 focus:bg-white focus:scale-[1.02] focus:shadow-lg placeholder:text-gray-500 placeholder:font-medium ${
                  errors.email
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                    : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-200'
                }`}
                style={{
                  // Ensure crisp text rendering
                  WebkitFontSmoothing: 'antialiased',
                  MozOsxFontSmoothing: 'grayscale',
                }}
              />
              <div
                className={`absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-500/10 to-purple-500/10 transition-opacity duration-300 pointer-events-none ${
                  focusedField === 'email' ? 'opacity-100' : 'opacity-0'
                }`}
              />
            </div>
            {errors.email && (
              <p className='mt-1 text-sm text-red-600 animate-pulse'>
                {errors.email}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div className='group'>
            <label
              htmlFor='password'
              className={`block text-sm font-medium mb-2 transition-all duration-200 ${
                focusedField === 'password' || formData.password
                  ? 'text-indigo-600 transform -translate-y-1'
                  : 'text-slate-700'
              }`}
            >
              Password
            </label>
            <div className='relative'>
              <Input
                id='password'
                name='password'
                type={showPassword ? 'text' : 'password'}
                placeholder='Enter your password'
                value={formData.password}
                onChange={handleChange}
                onFocus={() => setFocusedField('password')}
                onBlur={() => setFocusedField('')}
                className={`w-full px-4 py-3 pr-12 border rounded-xl transition-all text-black duration-300 bg-white hover:bg-gray-50 focus:bg-white focus:scale-[1.02] focus:shadow-lg placeholder:text-gray-500 placeholder:font-medium ${
                  errors.password
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                    : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-200'
                }`}
                style={{
                  // Ensure crisp text rendering
                  WebkitFontSmoothing: 'antialiased',
                  MozOsxFontSmoothing: 'grayscale',
                }}
              />
              <button
                type='button'
                onClick={() => setShowPassword(!showPassword)}
                className='absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-slate-700 transition-colors p-1 rounded-lg hover:bg-slate-100'
              >
                {showPassword ? (
                  <svg
                    className='w-5 h-5'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21'
                    />
                  </svg>
                ) : (
                  <svg
                    className='w-5 h-5'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'
                    />
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z'
                    />
                  </svg>
                )}
              </button>
              <div
                className={`absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-500/10 to-purple-500/10 transition-opacity duration-300 pointer-events-none ${
                  focusedField === 'password' ? 'opacity-100' : 'opacity-0'
                }`}
              />
            </div>
            {errors.password && (
              <p className='mt-1 text-sm text-red-600 animate-pulse'>
                {errors.password}
              </p>
            )}
          </div>
        </div>

        {/* Remember me and Forgot password */}
        <div className='flex items-center justify-between'>
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
                className={`flex items-center cursor-pointer group`}
              >
                <div
                  className={`w-5 h-5 border-2 rounded transition-all duration-200 flex items-center justify-center ${
                    formData.remember
                      ? 'bg-indigo-600 border-indigo-600 scale-110'
                      : 'border-slate-300 group-hover:border-indigo-400'
                  }`}
                >
                  {formData.remember && (
                    <svg
                      className='w-3 h-3 text-white'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={3}
                        d='M5 13l4 4L19 7'
                      />
                    </svg>
                  )}
                </div>
                <span className='ml-2 text-sm text-slate-600 group-hover:text-slate-800 transition-colors'>
                  Remember me
                </span>
              </label>
            </div>
          </div>
          <Button
            variant='link'
            className='text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors hover:underline'
          >
            Forgot password?
          </Button>
        </div>

        {/* Submit Button */}
        <Button
          type='submit'
          disabled={isLoading}
          variant='gradient'
          size='xl'
          className='w-full group'
          onClick={handleSubmit}
          style={{
            backgroundSize: '200% 100%',
            backgroundPosition: isLoading ? '100% 0' : '0% 0',
          }}
        >
          {isLoading ? (
            <div className='flex items-center justify-center space-x-2'>
              <div className='w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin' />
              <span>Logging you in...</span>
            </div>
          ) : (
            <span className='flex items-center justify-center space-x-2'>
              <span>Login</span>
              <svg
                className='w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-200'
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
        </Button>
      </div>
    </div>
  );
}
