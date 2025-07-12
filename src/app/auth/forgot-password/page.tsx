'use client';

import { useState, useEffect, ChangeEvent, MouseEvent } from 'react';
import { Input } from '@/src/components/ui/input';
import { authAPI } from '@/src/lib/api';
import { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import {
  Mail,
  ArrowLeft,
  CheckCircle2,
  Send,
  AlertCircle,
  Smartphone,
  RefreshCw,
} from 'lucide-react';
import Link from 'next/link';
import CodeInput from '@/src/components/auth/code-input';

interface FormData {
  email: string;
  code: string;
}

interface FormErrors {
  email?: string;
  code?: string;
}

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    email: '',
    code: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [focusedField, setFocusedField] = useState('');
  const [resendCountdown, setResendCountdown] = useState(0);

  // Handle resend countdown
  useEffect(() => {
    if (resendCountdown > 0) {
      const timer = setTimeout(
        () => setResendCountdown(resendCountdown - 1),
        1000
      );
      return () => clearTimeout(timer);
    }
  }, [resendCountdown]);

  const handleSendCode = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    // Validate email
    const newErrors: FormErrors = {};
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    try {
      await authAPI.forgotPassword(formData.email);
      setIsCodeSent(true);
      setResendCountdown(60); // 60 seconds countdown
    } catch (error) {
      console.error('Send code error:', error);

      if (error instanceof AxiosError) {
        const errorMessage =
          error.response?.data?.message ||
          error.response?.data?.error ||
          'Failed to send verification code. Please try again.';

        setErrors({ email: errorMessage });
      } else {
        setErrors({
          email: 'Failed to send verification code. Please try again.',
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async (code: string) => {
    // Store email and code in session storage for reset password page
    sessionStorage.setItem('resetEmail', formData.email);
    sessionStorage.setItem('resetCode', code);
    router.push('/auth/reset-password');
  };

  const handleResendCode = async () => {
    if (resendCountdown > 0) return;

    setIsLoading(true);
    setErrors({});

    try {
      await authAPI.forgotPassword(formData.email);
      setResendCountdown(60);
      setErrors({ code: 'New code sent successfully!' });
      setTimeout(() => setErrors({}), 3000);
    } catch (error) {
      console.error('Resend code error:', error);
      setErrors({ code: 'Failed to resend code. Please try again.' });
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

  const handleBackToEmail = () => {
    setIsCodeSent(false);
    setFormData((prev) => ({ ...prev, code: '' }));
    setErrors({});
  };

  // Code verification step
  if (isCodeSent) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center p-4'>
        <div className='max-w-md w-full mx-auto'>
          <div className='bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl border border-slate-200/50 p-8'>
            {/* Header */}
            <div className='text-center mb-8'>
              <div className='w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                <Smartphone className='w-8 h-8 text-purple-600' />
              </div>
              <h1 className='text-2xl font-bold text-slate-900 mb-2'>
                Enter Verification Code
              </h1>
              <p className='text-slate-600 mb-4'>
                We&apos;ve sent a 5-character code to{' '}
                <span className='font-semibold text-purple-600'>
                  {formData.email}
                </span>
              </p>
            </div>

            {/* Code Input */}
            <div className='space-y-6'>
              <div className='space-y-4'>
                <CodeInput
                  value={formData.code}
                  onChange={(code) =>
                    setFormData((prev) => ({ ...prev, code }))
                  }
                  onComplete={handleVerifyCode}
                  disabled={isLoading}
                  error={!!errors.code}
                />

                {errors.code && (
                  <p
                    className={`text-sm flex items-center gap-1 font-medium text-center justify-center ${
                      errors.code.includes('sent successfully')
                        ? 'text-green-600'
                        : 'text-red-600'
                    }`}
                  >
                    <AlertCircle className='w-4 h-4' />
                    {errors.code}
                  </p>
                )}
              </div>

              {/* Resend Code */}
              <div className='text-center'>
                <p className='text-sm text-slate-600 mb-2'>
                  Didn&apos;t receive the code?
                </p>
                <button
                  onClick={handleResendCode}
                  disabled={resendCountdown > 0 || isLoading}
                  className={`inline-flex items-center space-x-2 text-sm font-semibold transition-colors ${
                    resendCountdown > 0 || isLoading
                      ? 'text-slate-400 cursor-not-allowed'
                      : 'text-purple-600 hover:text-purple-800'
                  }`}
                >
                  <RefreshCw
                    className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`}
                  />
                  <span>
                    {resendCountdown > 0
                      ? `Resend in ${resendCountdown}s`
                      : 'Resend Code'}
                  </span>
                </button>
              </div>

              {/* Back to Email */}
              <div className='text-center'>
                <button
                  onClick={handleBackToEmail}
                  className='inline-flex items-center space-x-2 text-sm font-semibold text-slate-600 hover:text-slate-800 transition-colors group'
                >
                  <ArrowLeft className='w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200' />
                  <span>Use different email</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Email input step
  return (
    <div className='min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center p-4'>
      <div className='max-w-md w-full mx-auto'>
        <div className='bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl border border-slate-200/50 p-8'>
          {/* Header */}
          <div className='text-center mb-8'>
            <div className='w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4'>
              <Mail className='w-8 h-8 text-purple-600' />
            </div>
            <h1 className='text-2xl font-bold text-slate-900 mb-2'>
              Forgot Password?
            </h1>
            <p className='text-slate-600'>
              No worries! Enter your email address and we&apos;ll send you a
              verification code to reset your password.
            </p>
          </div>

          {/* Form */}
          <div className='space-y-6'>
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
                  placeholder='Enter your email address'
                  value={formData.email}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField('')}
                  className={`w-full pl-12 pr-4 py-4 border-2 rounded-xl transition-all duration-300 text-purple-900 placeholder:text-purple-500 placeholder:font-medium ${
                    errors.email
                      ? 'border-red-400 focus:border-red-500 focus:ring-red-100 !bg-red-50/20'
                      : focusedField === 'email'
                      ? 'border-purple-400 focus:border-purple-500 focus:ring-purple-100 !bg-white shadow-lg'
                      : 'border-purple-200 hover:border-purple-300 focus:border-purple-400 focus:ring-purple-100 !bg-white hover:!bg-purple-50/20'
                  }`}
                  style={{
                    WebkitFontSmoothing: 'antialiased',
                    MozOsxFontSmoothing: 'grayscale',
                    backgroundColor: errors.email
                      ? 'rgba(254, 242, 242, 0.2)'
                      : 'white',
                    color: '#581c87',
                  }}
                />
                {formData.email && !errors.email && (
                  <div className='absolute right-3 top-1/2 transform -translate-y-1/2'>
                    <CheckCircle2 className='w-5 h-5 text-green-500' />
                  </div>
                )}
              </div>
              {errors.email && (
                <p className='mt-2 text-sm text-red-600 flex items-center gap-1 font-medium'>
                  <AlertCircle className='w-4 h-4' />
                  {errors.email}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type='submit'
              disabled={isLoading}
              className='w-full group relative overflow-hidden bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-600 hover:from-purple-700 hover:via-purple-800 hover:to-indigo-700 text-white py-4 rounded-xl font-bold text-base shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]'
              onClick={handleSendCode}
            >
              {/* Animated background gradient */}
              <div className='absolute inset-0 bg-gradient-to-r from-purple-500 via-purple-600 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300' />

              {/* Shimmer effect */}
              <div className='absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700' />

              <div className='relative z-10'>
                {isLoading ? (
                  <div className='flex items-center justify-center space-x-2'>
                    <div className='w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin' />
                    <span className='font-bold'>Sending Code...</span>
                  </div>
                ) : (
                  <span className='flex items-center justify-center space-x-2'>
                    <Send className='w-5 h-5' />
                    <span className='font-bold'>Send Verification Code</span>
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
