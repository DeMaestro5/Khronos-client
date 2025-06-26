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
    <div className='bg-white/80 rounded-3xl shadow-2xl border border-white/20 p-8 animate-slideUp animation-delay-400'>
      <form>
        <div>
          {/* Step 1: Personal Information */}
          {currentStep === 1 && (
            <div className='space-y-6 animate-slideUp'>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm font-medium text-slate-700 mb-2'>
                    First Name
                  </label>
                  <div className='relative'>
                    <User className='absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5' />
                    <input
                      type='text'
                      value={formData.firstName}
                      onChange={(e) =>
                        handleInputChange('firstName', e.target.value)
                      }
                      className={`w-full pl-12 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 ${
                        formErrors.firstName
                          ? 'border-red-300 bg-red-50'
                          : 'border-slate-300'
                      } placeholder:text-slate-400 text-slate-900`}
                      placeholder='First name'
                    />
                  </div>
                  {formErrors.firstName && (
                    <p className='text-red-500 text-xs mt-1 flex items-center'>
                      <X className='w-3 h-3 mr-1' />
                      {formErrors.firstName}
                    </p>
                  )}
                </div>
                <div>
                  <label className='block text-sm font-medium text-slate-700 mb-2'>
                    Last Name
                  </label>
                  <div className='relative'>
                    <User className='absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5' />
                    <input
                      type='text'
                      value={formData.lastName}
                      onChange={(e) =>
                        handleInputChange('lastName', e.target.value)
                      }
                      className={`w-full pl-12 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 ${
                        formErrors.lastName
                          ? 'border-red-300 bg-red-50'
                          : 'border-slate-300'
                      } placeholder:text-slate-400 text-slate-900`}
                      placeholder='Last name'
                    />
                  </div>
                  {formErrors.lastName && (
                    <p className='text-red-500 text-xs mt-1 flex items-center'>
                      <X className='w-3 h-3 mr-1' />
                      {formErrors.lastName}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className='block text-sm font-medium text-slate-700 mb-2'>
                  Email Address
                </label>
                <div className='relative'>
                  <Mail className='absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5' />
                  <input
                    type='email'
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`w-full pl-12 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 ${
                      formErrors.email
                        ? 'border-red-300 bg-red-50'
                        : 'border-slate-300'
                    } placeholder:text-slate-400 text-slate-900`}
                    placeholder='Email address'
                  />
                </div>
                {formErrors.email && (
                  <p className='text-red-500 text-xs mt-1 flex items-center'>
                    <X className='w-3 h-3 mr-1' />
                    {formErrors.email}
                  </p>
                )}
              </div>

              <Button
                onClick={handleNext}
                size='lg'
                type='button'
                className='w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 focus:ring-4 focus:ring-indigo-300 transition-all duration-200 flex items-center justify-center group'
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
                <label className='block text-sm font-medium text-slate-700 mb-2'>
                  Password
                </label>
                <div className='relative'>
                  <Lock className='absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5' />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) =>
                      handleInputChange('password', e.target.value)
                    }
                    className={`w-full pl-12 pr-12 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 ${
                      formErrors.password
                        ? 'border-red-300 bg-red-50'
                        : 'border-slate-300'
                    } placeholder:text-slate-400 text-slate-900`}
                    placeholder='Create a strong password'
                  />
                  <button
                    type='button'
                    onClick={() => setShowPassword(!showPassword)}
                    className='absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600'
                  >
                    {showPassword ? (
                      <EyeOff className='w-5 h-5' />
                    ) : (
                      <Eye className='w-5 h-5' />
                    )}
                  </button>
                </div>
                <PasswordStrength password={formData.password} />
                {formErrors.password && (
                  <p className='text-red-500 text-xs mt-1 flex items-center'>
                    <X className='w-3 h-3 mr-1' />
                    {formErrors.password}
                  </p>
                )}
              </div>

              <div>
                <label className='block text-sm font-medium text-slate-700 mb-2'>
                  Confirm Password
                </label>
                <div className='relative'>
                  <Lock className='absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5' />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      handleInputChange('confirmPassword', e.target.value)
                    }
                    className={`w-full pl-12 pr-12 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 ${
                      formErrors.confirmPassword
                        ? 'border-red-300 bg-red-50'
                        : 'border-slate-300'
                    } placeholder:text-slate-400 text-slate-900`}
                    placeholder='Confirm your password'
                  />
                  <button
                    type='button'
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className='absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600'
                  >
                    {showConfirmPassword ? (
                      <EyeOff className='w-5 h-5' />
                    ) : (
                      <Eye className='w-5 h-5' />
                    )}
                  </button>
                </div>
                {formErrors.confirmPassword && (
                  <p className='text-red-500 text-xs mt-1 flex items-center'>
                    <X className='w-3 h-3 mr-1' />
                    {formErrors.confirmPassword}
                  </p>
                )}
              </div>

              <div className='flex items-start space-x-3'>
                <input
                  type='checkbox'
                  id='terms'
                  checked={formData.agreeToTerms}
                  onChange={(e) =>
                    handleInputChange('agreeToTerms', e.target.checked)
                  }
                  className='mt-1 w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500'
                />
                <label htmlFor='terms' className='text-sm text-slate-600'>
                  I agree to the{' '}
                  <button
                    type='button'
                    className='text-indigo-600 hover:text-indigo-700 underline'
                  >
                    Terms of Service
                  </button>{' '}
                  and{' '}
                  <button
                    type='button'
                    className='text-indigo-600 hover:text-indigo-700 underline'
                  >
                    Privacy Policy
                  </button>
                </label>
              </div>
              {formErrors.agreeToTerms && (
                <p className='text-red-500 text-xs flex items-center'>
                  <X className='w-3 h-3 mr-1' />
                  {formErrors.agreeToTerms}
                </p>
              )}

              <div className='flex space-x-4'>
                <button
                  type='button'
                  onClick={handleBack}
                  className='flex-1 bg-slate-100 text-slate-700 py-3 px-4 rounded-xl font-semibold hover:bg-slate-200 transition-all duration-200 flex items-center justify-center group'
                >
                  <ChevronLeft className='mr-2 w-5 h-5 group-hover:-translate-x-1 transition-transform' />
                  Back
                </button>
                <button
                  type='submit'
                  onClick={handleSignupSubmit}
                  disabled={isLoading}
                  className='flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 focus:ring-4 focus:ring-indigo-300 transition-all duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed'
                >
                  {isLoading ? 'Creating Account...' : 'Create Account'}
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
