'use client';

import { useState, useEffect, ChangeEvent, MouseEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/src/components/ui/input';
import { authAPI } from '@/src/lib/api';
import { AxiosError } from 'axios';
import {
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Key,
  ArrowLeft,
} from 'lucide-react';
import Link from 'next/link';
import PasswordStrengthIndicator from '@/src/components/auth/password-strength-ind';

interface FormData {
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  password?: string;
  confirmPassword?: string;
  email?: string;
}

export default function ResetPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState<string>('');
  const [resetCode, setResetCode] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [focusedField, setFocusedField] = useState('');

  useEffect(() => {
    // Get email and code from session storage
    const resetEmail = sessionStorage.getItem('resetEmail');
    const storedResetCode = sessionStorage.getItem('resetCode');

    if (resetEmail && storedResetCode) {
      setEmail(resetEmail);
      setResetCode(storedResetCode);
    } else {
      // No email or code found, redirect to forgot password
      router.push('/auth/forgot-password');
    }
  }, [router]);

  const validatePassword = (password: string) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (password.length < minLength) {
      return 'Password must be at least 8 characters long';
    }
    if (!hasUpperCase) {
      return 'Password must contain at least one uppercase letter';
    }
    if (!hasLowerCase) {
      return 'Password must contain at least one lowercase letter';
    }
    if (!hasNumbers) {
      return 'Password must contain at least one number';
    }
    if (!hasSpecialChar) {
      return 'Password must contain at least one special character';
    }
    return null;
  };

  const handleSubmit = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    // Validate email
    if (!email) {
      setErrors({ email: 'No email found. Please start over.' });
      setIsLoading(false);
      return;
    }

    // Validate password
    const newErrors: FormErrors = {};
    const passwordError = validatePassword(formData.password);
    if (passwordError) {
      newErrors.password = passwordError;
    }

    // Validate confirm password
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    try {
      await authAPI.resetPassword(resetCode, formData.password);
      setIsSuccess(true);
      // Clear session storage
      sessionStorage.removeItem('resetEmail');
      sessionStorage.removeItem('resetCode');
    } catch (error) {
      console.error('Reset password error:', error);

      if (error instanceof AxiosError) {
        const errorMessage =
          error.response?.data?.message ||
          error.response?.data?.error ||
          'Failed to reset password. Please try again.';

        setErrors({ password: errorMessage });
      } else {
        setErrors({ password: 'Failed to reset password. Please try again.' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleLoginRedirect = () => {
    router.push('/auth/login');
  };

  // Show error if no email found
  if (errors.email) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center p-4'>
        <div className='max-w-md w-full mx-auto'>
          <div className='bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl border border-slate-200/50 p-8 text-center'>
            <div className='w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6'>
              <AlertCircle className='w-10 h-10 text-red-600' />
            </div>

            <h1 className='text-2xl font-bold text-slate-900 mb-4'>
              Session Expired
            </h1>

            <p className='text-slate-600 mb-6 leading-relaxed'>
              {errors.email} Please start the password reset process again.
            </p>

            <div className='space-y-3'>
              <Link
                href='/auth/forgot-password'
                className='w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 hover:scale-[1.02] block text-center'
              >
                Start Password Reset
              </Link>

              <Link
                href='/auth/login'
                className='w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2'
              >
                <ArrowLeft className='w-4 h-4' />
                <span>Back to Login</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center p-4'>
        <div className='max-w-md w-full mx-auto'>
          <div className='bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl border border-slate-200/50 p-8 text-center'>
            <div className='w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6'>
              <CheckCircle2 className='w-10 h-10 text-green-600' />
            </div>

            <h1 className='text-2xl font-bold text-slate-900 mb-4'>
              Password Reset Successful!
            </h1>

            <p className='text-slate-600 mb-6 leading-relaxed'>
              Your password has been successfully reset. You can now log in with
              your new password.
            </p>

            <button
              onClick={handleLoginRedirect}
              className='w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 hover:scale-[1.02]'
            >
              Continue to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center p-4'>
      <div className='max-w-md w-full mx-auto'>
        <div className='bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl border border-slate-200/50 p-8'>
          {/* Header */}
          <div className='text-center mb-8'>
            <div className='w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4'>
              <Key className='w-8 h-8 text-purple-600' />
            </div>
            <h1 className='text-2xl font-bold text-slate-900 mb-2'>
              Create New Password
            </h1>
            <p className='text-slate-600'>
              Enter your new password below. Make sure it&apos;s strong and
              secure.
            </p>
            {email && (
              <p className='text-sm text-purple-600 mt-2 font-medium'>
                Resetting password for: {email}
              </p>
            )}
          </div>

          {/* Form */}
          <div className='space-y-6'>
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
                New Password
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
                  placeholder='Enter your new password'
                  value={formData.password}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField('')}
                  className={`w-full pl-12 pr-12 py-4 border-2 rounded-xl transition-all duration-300 text-purple-900 placeholder:text-purple-500 placeholder:font-medium ${
                    errors.password
                      ? 'border-red-400 focus:border-red-500 focus:ring-red-100 !bg-red-50/20'
                      : focusedField === 'password'
                      ? 'border-purple-400 focus:border-purple-500 focus:ring-purple-100 !bg-white shadow-lg'
                      : 'border-purple-200 hover:border-purple-300 focus:border-purple-400 focus:ring-purple-100 !bg-white hover:!bg-purple-50/20'
                  }`}
                  style={{
                    WebkitFontSmoothing: 'antialiased',
                    MozOsxFontSmoothing: 'grayscale',
                    backgroundColor: errors.password
                      ? 'rgba(254, 242, 242, 0.2)'
                      : 'white',
                    color: '#581c87',
                  }}
                />
                <button
                  type='button'
                  onClick={() => setShowPassword(!showPassword)}
                  className='absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-500 hover:text-purple-700 transition-colors p-1 rounded-lg hover:bg-purple-50'
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
                  <AlertCircle className='w-4 h-4' />
                  {errors.password}
                </p>
              )}
            </div>

            {/* Password Strength Indicator */}
            {formData.password && (
              <PasswordStrengthIndicator password={formData.password} />
            )}

            {/* Confirm Password Field */}
            <div className='group'>
              <label
                htmlFor='confirmPassword'
                className={`block text-sm font-bold mb-3 transition-all duration-200 ${
                  focusedField === 'confirmPassword' || formData.confirmPassword
                    ? 'text-purple-600'
                    : 'text-purple-800 dark:text-purple-400'
                }`}
              >
                Confirm New Password
              </label>
              <div className='relative'>
                <div className='absolute left-3 top-1/2 transform -translate-y-1/2 z-10'>
                  <Lock
                    className={`w-5 h-5 transition-colors duration-200 ${
                      focusedField === 'confirmPassword' ||
                      formData.confirmPassword
                        ? 'text-purple-600'
                        : 'text-purple-500'
                    }`}
                  />
                </div>
                <Input
                  id='confirmPassword'
                  name='confirmPassword'
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder='Confirm your new password'
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('confirmPassword')}
                  onBlur={() => setFocusedField('')}
                  className={`w-full pl-12 pr-12 py-4 border-2 rounded-xl transition-all duration-300 text-purple-900 placeholder:text-purple-500 placeholder:font-medium ${
                    errors.confirmPassword
                      ? 'border-red-400 focus:border-red-500 focus:ring-red-100 !bg-red-50/20'
                      : focusedField === 'confirmPassword'
                      ? 'border-purple-400 focus:border-purple-500 focus:ring-purple-100 !bg-white shadow-lg'
                      : 'border-purple-200 hover:border-purple-300 focus:border-purple-400 focus:ring-purple-100 !bg-white hover:!bg-purple-50/20'
                  }`}
                  style={{
                    WebkitFontSmoothing: 'antialiased',
                    MozOsxFontSmoothing: 'grayscale',
                    backgroundColor: errors.confirmPassword
                      ? 'rgba(254, 242, 242, 0.2)'
                      : 'white',
                    color: '#581c87',
                  }}
                />
                <button
                  type='button'
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className='absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-500 hover:text-purple-700 transition-colors p-1 rounded-lg hover:bg-purple-50'
                >
                  {showConfirmPassword ? (
                    <EyeOff className='w-5 h-5' />
                  ) : (
                    <Eye className='w-5 h-5' />
                  )}
                </button>
                {formData.confirmPassword &&
                  formData.password === formData.confirmPassword && (
                    <div className='absolute right-12 top-1/2 transform -translate-y-1/2'>
                      <CheckCircle2 className='w-5 h-5 text-green-500' />
                    </div>
                  )}
              </div>
              {errors.confirmPassword && (
                <p className='mt-2 text-sm text-red-600 flex items-center gap-1 font-medium'>
                  <AlertCircle className='w-4 h-4' />
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type='submit'
              disabled={isLoading}
              className='w-full group relative overflow-hidden bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-600 hover:from-purple-700 hover:via-purple-800 hover:to-indigo-700 text-white py-4 rounded-xl font-bold text-base shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]'
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
                    <span className='font-bold'>Updating Password...</span>
                  </div>
                ) : (
                  <span className='flex items-center justify-center space-x-2'>
                    <Key className='w-5 h-5' />
                    <span className='font-bold'>Reset Password</span>
                  </span>
                )}
              </div>
            </button>

            {/* Back to Login */}
            <div className='text-center'>
              <Link
                href='/auth/login'
                className='inline-flex items-center space-x-2 text-sm font-semibold text-purple-600 hover:text-purple-800 transition-colors group'
              >
                <ArrowLeft className='w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200' />
                <span>Back to Login</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
