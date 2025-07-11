import React, { useState } from 'react';
import { Button } from '../ui/button';
import {
  ChevronRight,
  Mail,
  User,
  X,
  Lock,
  Eye,
  EyeOff,
  ChevronLeft,
  CheckCircle,
} from 'lucide-react';
import PasswordStrength from './password-strength-ind';
import SocialLogin from './SocialsAuth';
import { useRouter } from 'next/navigation';
import { AxiosError } from 'axios';
import { authAPI } from '@/src/lib/api';
import { AuthUtils } from '@/src/lib/auth-utils';

interface SignupFormProps {
  formData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
    agreeToTerms: boolean;
  };
  handleInputChange: (
    field: keyof SignupFormProps['formData'],
    value: string | boolean
  ) => void;
  errors: {
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    agreeToTerms?: string;
  };
  handleNext: () => void;
  handleBack: () => void;
  currentStep: number;
  showPassword: boolean;
  showConfirmPassword: boolean;
  setShowPassword: (value: boolean) => void;
  setShowConfirmPassword: (value: boolean) => void;
}

export default function SignupForm({
  formData,
  handleInputChange,
  errors,
  handleNext,
  handleBack,
  currentStep,
  showPassword,
  showConfirmPassword,
  setShowPassword,
  setShowConfirmPassword,
}: SignupFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formErrors, setFormErrors] = useState(errors);
  const [focusedField, setFocusedField] = useState('');
  const router = useRouter();

  const handleSignupSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setFormErrors({});

    // Validation
    const newErrors: typeof errors = {};

    // Name validation
    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.lastName) newErrors.lastName = 'Last name is required';

    // Email validation
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = 'Email is invalid';

    // Password validation
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 8)
      newErrors.password = 'Password must be at least 8 characters';

    // Confirm password validation
    if (!formData.confirmPassword)
      newErrors.confirmPassword = 'Please confirm your password';
    else if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = 'Passwords do not match';

    // Terms validation
    if (!formData.agreeToTerms)
      newErrors.agreeToTerms = 'You must agree to the terms and conditions';

    if (Object.keys(newErrors).length > 0) {
      setFormErrors(newErrors);
      setIsLoading(false);
      return;
    }

    try {
      console.log('Signup request payload:', {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: '[REDACTED]', // Don't log actual password
      });

      const response = await authAPI.signup(
        `${formData.firstName} ${formData.lastName}`.trim(),
        formData.email,
        formData.password
      );

      console.log('Signup Response:', response.data);

      if (response.data.data?.tokens) {
        AuthUtils.storeTokens(response.data.data.tokens);

        // Store user data if available
        if (response.data.data.user) {
          AuthUtils.storeUser(response.data.data.user);
        }

        router.replace('/dashboard');
      } else if (response.data.data?.user) {
        router.replace('/verify-email');
      } else {
        setFormErrors({
          email: 'Account created but login failed. Please try logging in.',
        });
      }
    } catch (error) {
      console.error('Signup error:', error);

      if (error instanceof AxiosError) {
        const errorMessage =
          error.response?.data?.message ||
          error.response?.data?.error ||
          error.message ||
          'Signup failed. Please try again.';

        if (error.response?.status === 409 || error.response?.status === 400) {
          if (errorMessage.toLowerCase().includes('email')) {
            setFormErrors({
              email: 'An account with this email already exists',
            });
          } else if (errorMessage.toLowerCase().includes('password')) {
            setFormErrors({ password: errorMessage });
          } else {
            setFormErrors({ email: errorMessage });
          }
        } else if (error.response?.status === 422) {
          setFormErrors({ email: errorMessage });
        } else {
          setFormErrors({ email: errorMessage });
        }
      } else {
        setFormErrors({ email: 'Signup failed. Please try again.' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl border border-slate-200/50 p-8 animate-slideUp animation-delay-400'>
      <form>
        <div>
          {/* Step 1: Personal Information */}
          {currentStep === 1 && (
            <div className='space-y-6 animate-slideUp'>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm font-semibold text-purple-700 dark:text-purple-300 mb-3'>
                    First Name
                  </label>
                  <div className='relative'>
                    <div className='absolute left-3 top-1/2 transform -translate-y-1/2 z-10'>
                      <User
                        className={`w-5 h-5 transition-colors duration-200 ${
                          focusedField === 'firstName' || formData.firstName
                            ? 'text-indigo-500'
                            : 'text-purple-400'
                        }`}
                      />
                    </div>
                    <input
                      type='text'
                      value={formData.firstName}
                      onChange={(e) =>
                        handleInputChange('firstName', e.target.value)
                      }
                      onFocus={() => setFocusedField('firstName')}
                      onBlur={() => setFocusedField('')}
                      className={`w-full pl-12 pr-4 py-4 border-2 rounded-xl transition-all duration-300 text-purple-900 placeholder:text-purple-400 placeholder:font-normal ${
                        formErrors.firstName
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-100 !bg-red-50/20 dark:!bg-red-50/20'
                          : focusedField === 'firstName'
                          ? 'border-indigo-400 focus:border-indigo-500 focus:ring-indigo-100 !bg-white dark:!bg-white shadow-lg'
                          : 'border-slate-200 hover:border-slate-300 focus:border-indigo-400 focus:ring-indigo-100 !bg-white dark:!bg-white hover:!bg-slate-50/30 dark:hover:!bg-slate-50/30'
                      }`}
                      placeholder='First name'
                      style={{
                        backgroundColor: formErrors.firstName
                          ? 'rgba(254, 242, 242, 0.2)'
                          : 'white',
                        color: '#581c87', // purple-900
                      }}
                    />
                    {formData.firstName && !formErrors.firstName && (
                      <div className='absolute right-3 top-1/2 transform -translate-y-1/2'>
                        <CheckCircle className='w-5 h-5 text-green-500' />
                      </div>
                    )}
                  </div>
                  {formErrors.firstName && (
                    <p className='text-red-600 text-sm mt-2 flex items-center gap-1'>
                      <X className='w-4 h-4' />
                      {formErrors.firstName}
                    </p>
                  )}
                </div>
                <div>
                  <label className='block text-sm font-semibold text-purple-700 dark:text-purple-300 mb-3'>
                    Last Name
                  </label>
                  <div className='relative'>
                    <div className='absolute left-3 top-1/2 transform -translate-y-1/2 z-10'>
                      <User
                        className={`w-5 h-5 transition-colors duration-200 ${
                          focusedField === 'lastName' || formData.lastName
                            ? 'text-indigo-500'
                            : 'text-purple-400'
                        }`}
                      />
                    </div>
                    <input
                      type='text'
                      value={formData.lastName}
                      onChange={(e) =>
                        handleInputChange('lastName', e.target.value)
                      }
                      onFocus={() => setFocusedField('lastName')}
                      onBlur={() => setFocusedField('')}
                      className={`w-full pl-12 pr-4 py-4 border-2 rounded-xl transition-all duration-300 text-purple-900 placeholder:text-purple-400 placeholder:font-normal ${
                        formErrors.lastName
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-100 !bg-red-50/20 dark:!bg-red-50/20'
                          : focusedField === 'lastName'
                          ? 'border-indigo-400 focus:border-indigo-500 focus:ring-indigo-100 !bg-white dark:!bg-white shadow-lg'
                          : 'border-slate-200 hover:border-slate-300 focus:border-indigo-400 focus:ring-indigo-100 !bg-white dark:!bg-white hover:!bg-slate-50/30 dark:hover:!bg-slate-50/30'
                      }`}
                      placeholder='Last name'
                      style={{
                        backgroundColor: formErrors.lastName
                          ? 'rgba(254, 242, 242, 0.2)'
                          : 'white',
                        color: '#581c87', // purple-900
                      }}
                    />
                    {formData.lastName && !formErrors.lastName && (
                      <div className='absolute right-3 top-1/2 transform -translate-y-1/2'>
                        <CheckCircle className='w-5 h-5 text-green-500' />
                      </div>
                    )}
                  </div>
                  {formErrors.lastName && (
                    <p className='text-red-600 text-sm mt-2 flex items-center gap-1'>
                      <X className='w-4 h-4' />
                      {formErrors.lastName}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className='block text-sm font-semibold text-purple-700 dark:text-purple-300 mb-3'>
                  Email Address
                </label>
                <div className='relative'>
                  <div className='absolute left-3 top-1/2 transform -translate-y-1/2 z-10'>
                    <Mail
                      className={`w-5 h-5 transition-colors duration-200 ${
                        focusedField === 'email' || formData.email
                          ? 'text-indigo-500'
                          : 'text-purple-400'
                      }`}
                    />
                  </div>
                  <input
                    type='email'
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField('')}
                    className={`w-full pl-12 pr-4 py-4 border-2 rounded-xl transition-all duration-300 text-purple-900 placeholder:text-purple-400 placeholder:font-normal ${
                      formErrors.email
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-100 !bg-red-50/20 dark:!bg-red-50/20'
                        : focusedField === 'email'
                        ? 'border-indigo-400 focus:border-indigo-500 focus:ring-indigo-100 !bg-white dark:!bg-white shadow-lg'
                        : 'border-slate-200 hover:border-slate-300 focus:border-indigo-400 focus:ring-indigo-100 !bg-white dark:!bg-white hover:!bg-slate-50/30 dark:hover:!bg-slate-50/30'
                    }`}
                    placeholder='Email address'
                    style={{
                      backgroundColor: formErrors.email
                        ? 'rgba(254, 242, 242, 0.2)'
                        : 'white',
                      color: '#581c87', // purple-900
                    }}
                  />
                  {formData.email && !formErrors.email && (
                    <div className='absolute right-3 top-1/2 transform -translate-y-1/2'>
                      <CheckCircle className='w-5 h-5 text-green-500' />
                    </div>
                  )}
                </div>
                {formErrors.email && (
                  <p className='text-red-600 text-sm mt-2 flex items-center gap-1'>
                    <X className='w-4 h-4' />
                    {formErrors.email}
                  </p>
                )}
              </div>

              <Button
                onClick={handleNext}
                size='lg'
                type='button'
                className='w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-4 px-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group'
              >
                Continue
                <ChevronRight className='ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform' />
              </Button>
            </div>
          )}

          {/* Step 2: Password and Security */}
          {currentStep === 2 && (
            <div className='space-y-6 animate-slideUp'>
              <div>
                <label className='block text-sm font-semibold text-purple-700 dark:text-purple-300 mb-3'>
                  Password
                </label>
                <div className='relative'>
                  <div className='absolute left-3 top-1/2 transform -translate-y-1/2 z-10'>
                    <Lock
                      className={`w-5 h-5 transition-colors duration-200 ${
                        focusedField === 'password' || formData.password
                          ? 'text-indigo-500'
                          : 'text-purple-400'
                      }`}
                    />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) =>
                      handleInputChange('password', e.target.value)
                    }
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField('')}
                    className={`w-full pl-12 pr-12 py-4 border-2 rounded-xl transition-all duration-300 text-purple-900 placeholder:text-purple-400 placeholder:font-normal ${
                      formErrors.password
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-100 !bg-red-50/20 dark:!bg-red-50/20'
                        : focusedField === 'password'
                        ? 'border-indigo-400 focus:border-indigo-500 focus:ring-indigo-100 !bg-white dark:!bg-white shadow-lg'
                        : 'border-slate-200 hover:border-slate-300 focus:border-indigo-400 focus:ring-indigo-100 !bg-white dark:!bg-white hover:!bg-slate-50/30 dark:hover:!bg-slate-50/30'
                    }`}
                    placeholder='Create a strong password'
                    style={{
                      backgroundColor: formErrors.password
                        ? 'rgba(254, 242, 242, 0.2)'
                        : 'white',
                      color: '#581c87', // purple-900
                    }}
                  />
                  <button
                    type='button'
                    onClick={() => setShowPassword(!showPassword)}
                    className='absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-400 hover:text-purple-600 transition-colors p-1 rounded-lg hover:bg-slate-100'
                  >
                    {showPassword ? (
                      <EyeOff className='w-5 h-5' />
                    ) : (
                      <Eye className='w-5 h-5' />
                    )}
                  </button>
                  {formData.password && !formErrors.password && (
                    <div className='absolute right-12 top-1/2 transform -translate-y-1/2'>
                      <CheckCircle className='w-5 h-5 text-green-500' />
                    </div>
                  )}
                </div>
                <div className='mt-3'>
                  <PasswordStrength password={formData.password} />
                </div>
                {formErrors.password && (
                  <p className='text-red-600 text-sm mt-2 flex items-center gap-1'>
                    <X className='w-4 h-4' />
                    {formErrors.password}
                  </p>
                )}
              </div>

              <div>
                <label className='block text-sm font-semibold text-purple-700 dark:text-purple-300 mb-3'>
                  Confirm Password
                </label>
                <div className='relative'>
                  <div className='absolute left-3 top-1/2 transform -translate-y-1/2 z-10'>
                    <Lock
                      className={`w-5 h-5 transition-colors duration-200 ${
                        focusedField === 'confirmPassword' ||
                        formData.confirmPassword
                          ? 'text-indigo-500'
                          : 'text-purple-400'
                      }`}
                    />
                  </div>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      handleInputChange('confirmPassword', e.target.value)
                    }
                    onFocus={() => setFocusedField('confirmPassword')}
                    onBlur={() => setFocusedField('')}
                    className={`w-full pl-12 pr-12 py-4 border-2 rounded-xl transition-all duration-300 text-purple-900 placeholder:text-purple-400 placeholder:font-normal ${
                      formErrors.confirmPassword
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-100 !bg-red-50/20 dark:!bg-red-50/20'
                        : focusedField === 'confirmPassword'
                        ? 'border-indigo-400 focus:border-indigo-500 focus:ring-indigo-100 !bg-white dark:!bg-white shadow-lg'
                        : 'border-slate-200 hover:border-slate-300 focus:border-indigo-400 focus:ring-indigo-100 !bg-white dark:!bg-white hover:!bg-slate-50/30 dark:hover:!bg-slate-50/30'
                    }`}
                    placeholder='Confirm your password'
                    style={{
                      backgroundColor: formErrors.confirmPassword
                        ? 'rgba(254, 242, 242, 0.2)'
                        : 'white',
                      color: '#581c87', // purple-900
                    }}
                  />
                  <button
                    type='button'
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className='absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-400 hover:text-purple-600 transition-colors p-1 rounded-lg hover:bg-slate-100'
                  >
                    {showConfirmPassword ? (
                      <EyeOff className='w-5 h-5' />
                    ) : (
                      <Eye className='w-5 h-5' />
                    )}
                  </button>
                  {formData.confirmPassword &&
                    !formErrors.confirmPassword &&
                    formData.password === formData.confirmPassword && (
                      <div className='absolute right-12 top-1/2 transform -translate-y-1/2'>
                        <CheckCircle className='w-5 h-5 text-green-500' />
                      </div>
                    )}
                </div>
                {formErrors.confirmPassword && (
                  <p className='text-red-600 text-sm mt-2 flex items-center gap-1'>
                    <X className='w-4 h-4' />
                    {formErrors.confirmPassword}
                  </p>
                )}
              </div>

              <div className='flex items-start space-x-3 p-4 bg-white/50 backdrop-blur-sm rounded-xl border border-slate-200/50'>
                <div className='relative'>
                  <input
                    type='checkbox'
                    id='terms'
                    checked={formData.agreeToTerms}
                    onChange={(e) =>
                      handleInputChange('agreeToTerms', e.target.checked)
                    }
                    className='sr-only'
                  />
                  <label
                    htmlFor='terms'
                    className='flex items-start cursor-pointer group'
                  >
                    <div
                      className={`w-5 h-5 border-2 rounded-md transition-all duration-200 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                        formData.agreeToTerms
                          ? 'bg-indigo-600 border-indigo-600'
                          : 'border-slate-300 group-hover:border-indigo-400'
                      }`}
                    >
                      {formData.agreeToTerms && (
                        <CheckCircle className='w-3 h-3 text-white' />
                      )}
                    </div>
                    <div className='ml-3 text-sm text-purple-600 leading-relaxed'>
                      I agree to the{' '}
                      <button
                        type='button'
                        className='text-indigo-600 hover:text-indigo-700 underline font-medium'
                      >
                        Terms of Service
                      </button>{' '}
                      and{' '}
                      <button
                        type='button'
                        className='text-indigo-600 hover:text-indigo-700 underline font-medium'
                      >
                        Privacy Policy
                      </button>
                    </div>
                  </label>
                </div>
              </div>
              {formErrors.agreeToTerms && (
                <p className='text-red-600 text-sm flex items-center gap-1'>
                  <X className='w-4 h-4' />
                  {formErrors.agreeToTerms}
                </p>
              )}

              <div className='flex space-x-4'>
                <button
                  type='button'
                  onClick={handleBack}
                  className='flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-4 px-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center group shadow-sm'
                >
                  <ChevronLeft className='mr-2 w-5 h-5 group-hover:-translate-x-1 transition-transform' />
                  Back
                </button>
                <button
                  type='submit'
                  onClick={handleSignupSubmit}
                  disabled={isLoading}
                  className='flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-4 px-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed'
                >
                  {isLoading ? (
                    <div className='flex items-center space-x-2'>
                      <div className='w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin' />
                      <span>Creating Account...</span>
                    </div>
                  ) : (
                    'Create Account'
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Social Login - Only show on step 1 */}
        {currentStep === 1 && (
          <div className='mt-8'>
            <SocialLogin />
          </div>
        )}
      </form>
    </div>
  );
}
