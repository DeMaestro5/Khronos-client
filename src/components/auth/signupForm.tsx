import React, { useState } from 'react';
import { Button } from '../ui/button';
import {
  ChevronRight,
  Mail,
  User,
  Lock,
  Eye,
  EyeOff,
  ChevronLeft,
  CheckCircle,
  AlertCircle,
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
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());
  const router = useRouter();

  // Real-time validation function
  const validateField = (field: string, value: string | boolean) => {
    switch (field) {
      case 'firstName':
        if (!value) return 'First name is required';
        if (typeof value === 'string' && value.length < 2)
          return 'First name must be at least 2 characters';
        return '';
      case 'lastName':
        if (!value) return 'Last name is required';
        if (typeof value === 'string' && value.length < 2)
          return 'Last name must be at least 2 characters';
        return '';
      case 'email':
        if (!value) return 'Email is required';
        if (typeof value === 'string' && !/\S+@\S+\.\S+/.test(value))
          return 'Please enter a valid email address';
        return '';
      case 'password':
        if (!value) return 'Password is required';
        if (typeof value === 'string' && value.length < 8)
          return 'Password must be at least 8 characters';
        return '';
      case 'confirmPassword':
        if (!value) return 'Please confirm your password';
        if (typeof value === 'string' && value !== formData.password)
          return 'Passwords do not match';
        return '';
      case 'agreeToTerms':
        if (!value) return 'You must agree to the terms and conditions';
        return '';
      default:
        return '';
    }
  };

  // Handle input change with real-time validation
  const handleInputChangeWithValidation = (
    field: keyof SignupFormProps['formData'],
    value: string | boolean
  ) => {
    handleInputChange(field, value);

    // Mark field as touched
    setTouchedFields((prev) => new Set(prev).add(field));

    // Clear existing error for this field
    if (formErrors[field as keyof typeof formErrors]) {
      setFormErrors((prev) => ({ ...prev, [field]: '' }));
    }

    // Validate field in real-time if it's been touched
    if (touchedFields.has(field)) {
      const error = validateField(field, value);
      if (error) {
        setFormErrors((prev) => ({ ...prev, [field]: error }));
      }
    }
  };

  // Handle field blur with validation
  const handleFieldBlur = (field: string) => {
    setFocusedField('');
    setTouchedFields((prev) => new Set(prev).add(field));

    const value = formData[field as keyof typeof formData];
    const error = validateField(field, value);

    if (error) {
      setFormErrors((prev) => ({ ...prev, [field]: error }));
    } else {
      setFormErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const handleSignupSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setFormErrors({});

    // Mark all fields as touched for validation
    setTouchedFields(
      new Set([
        'firstName',
        'lastName',
        'email',
        'password',
        'confirmPassword',
        'agreeToTerms',
      ])
    );

    // Validation
    const newErrors: typeof errors = {};

    // Name validation
    if (!formData.firstName) newErrors.firstName = 'First name is required';
    else if (formData.firstName.length < 2)
      newErrors.firstName = 'First name must be at least 2 characters';

    if (!formData.lastName) newErrors.lastName = 'Last name is required';
    else if (formData.lastName.length < 2)
      newErrors.lastName = 'Last name must be at least 2 characters';

    // Email validation
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = 'Please enter a valid email address';

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
    <div className='bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl border border-slate-200/50 p-4 sm:p-6'>
      <form>
        <div>
          {/* Step 1: Personal Information */}
          {currentStep === 1 && (
            <div className='space-y-4'>
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4'>
                <div>
                  <label className='block text-sm font-semibold text-slate-800 mb-2'>
                    First Name
                  </label>
                  <div className='relative'>
                    <div className='absolute left-4 top-1/2 transform -translate-y-1/2 z-10'>
                      <User
                        className={`w-5 h-5 transition-colors duration-200 ${
                          focusedField === 'firstName' || formData.firstName
                            ? 'text-indigo-600'
                            : 'text-slate-400'
                        }`}
                      />
                    </div>
                    <input
                      type='text'
                      value={formData.firstName}
                      onChange={(e) =>
                        handleInputChangeWithValidation(
                          'firstName',
                          e.target.value
                        )
                      }
                      onFocus={() => setFocusedField('firstName')}
                      onBlur={() => handleFieldBlur('firstName')}
                      className={`w-full pl-12 pr-4 py-3 border-2 rounded-2xl transition-all duration-300 text-slate-900 placeholder:text-slate-500 placeholder:font-normal text-base ${
                        formErrors.firstName
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-100 bg-red-50/50'
                          : focusedField === 'firstName'
                          ? 'border-indigo-500 focus:border-indigo-600 focus:ring-indigo-100 bg-white shadow-lg'
                          : 'border-slate-200 hover:border-slate-300 focus:border-indigo-500 focus:ring-indigo-100 bg-white hover:bg-slate-50/50'
                      }`}
                      placeholder='First name'
                      style={{ minHeight: '48px' }}
                    />
                  </div>
                  {formErrors.firstName && (
                    <p className='text-red-600 text-sm mt-1 flex items-center gap-1'>
                      <AlertCircle className='w-4 h-4' />
                      {formErrors.firstName}
                    </p>
                  )}
                </div>
                <div>
                  <label className='block text-sm font-semibold text-slate-800 mb-2'>
                    Last Name
                  </label>
                  <div className='relative'>
                    <div className='absolute left-4 top-1/2 transform -translate-y-1/2 z-10'>
                      <User
                        className={`w-5 h-5 transition-colors duration-200 ${
                          focusedField === 'lastName' || formData.lastName
                            ? 'text-indigo-600'
                            : 'text-slate-400'
                        }`}
                      />
                    </div>
                    <input
                      type='text'
                      value={formData.lastName}
                      onChange={(e) =>
                        handleInputChangeWithValidation(
                          'lastName',
                          e.target.value
                        )
                      }
                      onFocus={() => setFocusedField('lastName')}
                      onBlur={() => handleFieldBlur('lastName')}
                      className={`w-full pl-12 pr-4 py-3 border-2 rounded-2xl transition-all duration-300 text-slate-900 placeholder:text-slate-500 placeholder:font-normal text-base ${
                        formErrors.lastName
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-100 bg-red-50/50'
                          : focusedField === 'lastName'
                          ? 'border-indigo-500 focus:border-indigo-600 focus:ring-indigo-100 bg-white shadow-lg'
                          : 'border-slate-200 hover:border-slate-300 focus:border-indigo-500 focus:ring-indigo-100 bg-white hover:bg-slate-50/50'
                      }`}
                      placeholder='Last name'
                      style={{ minHeight: '48px' }}
                    />
                  </div>
                  {formErrors.lastName && (
                    <p className='text-red-600 text-sm mt-1 flex items-center gap-1'>
                      <AlertCircle className='w-4 h-4' />
                      {formErrors.lastName}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className='block text-sm font-semibold text-slate-800 mb-2'>
                  Email Address
                </label>
                <div className='relative'>
                  <div className='absolute left-4 top-1/2 transform -translate-y-1/2 z-10'>
                    <Mail
                      className={`w-5 h-5 transition-colors duration-200 ${
                        focusedField === 'email' || formData.email
                          ? 'text-indigo-600'
                          : 'text-slate-400'
                      }`}
                    />
                  </div>
                  <input
                    type='email'
                    value={formData.email}
                    onChange={(e) =>
                      handleInputChangeWithValidation('email', e.target.value)
                    }
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => handleFieldBlur('email')}
                    className={`w-full pl-12 pr-4 py-3 border-2 rounded-2xl transition-all duration-300 text-slate-900 placeholder:text-slate-500 placeholder:font-normal text-base ${
                      formErrors.email
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-100 bg-red-50/50'
                        : focusedField === 'email'
                        ? 'border-indigo-500 focus:border-indigo-600 focus:ring-indigo-100 bg-white shadow-lg'
                        : 'border-slate-200 hover:border-slate-300 focus:border-indigo-500 focus:ring-indigo-100 bg-white hover:bg-slate-50/50'
                    }`}
                    placeholder='Email address'
                    style={{ minHeight: '48px' }}
                  />
                </div>
                {formErrors.email && (
                  <p className='text-red-600 text-sm mt-1 flex items-center gap-1'>
                    <AlertCircle className='w-4 h-4' />
                    {formErrors.email}
                  </p>
                )}
              </div>

              <Button
                onClick={handleNext}
                size='lg'
                type='button'
                className='w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-3 px-6 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group text-base'
                style={{ minHeight: '48px' }}
              >
                Continue
                <ChevronRight className='ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform' />
              </Button>
            </div>
          )}

          {/* Step 2: Password and Security */}
          {currentStep === 2 && (
            <div className='space-y-4'>
              <div>
                <label className='block text-sm font-semibold text-slate-800 mb-2'>
                  Password
                </label>
                <div className='relative'>
                  <div className='absolute left-4 top-1/2 transform -translate-y-1/2 z-10'>
                    <Lock
                      className={`w-5 h-5 transition-colors duration-200 ${
                        focusedField === 'password' || formData.password
                          ? 'text-indigo-600'
                          : 'text-slate-400'
                      }`}
                    />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) =>
                      handleInputChangeWithValidation(
                        'password',
                        e.target.value
                      )
                    }
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => handleFieldBlur('password')}
                    className={`w-full pl-12 pr-12 py-3 border-2 rounded-2xl transition-all duration-300 text-slate-900 placeholder:text-slate-500 placeholder:font-normal text-base ${
                      formErrors.password
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-100 bg-red-50/50'
                        : focusedField === 'password'
                        ? 'border-indigo-500 focus:border-indigo-600 focus:ring-indigo-100 bg-white shadow-lg'
                        : 'border-slate-200 hover:border-slate-300 focus:border-indigo-500 focus:ring-indigo-100 bg-white hover:bg-slate-50/50'
                    }`}
                    placeholder='Create a strong password'
                    style={{ minHeight: '48px' }}
                  />
                  <button
                    type='button'
                    onClick={() => setShowPassword(!showPassword)}
                    className='absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-lg hover:bg-slate-100'
                  >
                    {showPassword ? (
                      <EyeOff className='w-5 h-5' />
                    ) : (
                      <Eye className='w-5 h-5' />
                    )}
                  </button>
                </div>
                <div className='mt-2'>
                  <PasswordStrength password={formData.password} />
                </div>
                {formErrors.password && (
                  <p className='text-red-600 text-sm mt-1 flex items-center gap-1'>
                    <AlertCircle className='w-4 h-4' />
                    {formErrors.password}
                  </p>
                )}
              </div>

              <div>
                <label className='block text-sm font-semibold text-slate-800 mb-2'>
                  Confirm Password
                </label>
                <div className='relative'>
                  <div className='absolute left-4 top-1/2 transform -translate-y-1/2 z-10'>
                    <Lock
                      className={`w-5 h-5 transition-colors duration-200 ${
                        focusedField === 'confirmPassword' ||
                        formData.confirmPassword
                          ? 'text-indigo-600'
                          : 'text-slate-400'
                      }`}
                    />
                  </div>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      handleInputChangeWithValidation(
                        'confirmPassword',
                        e.target.value
                      )
                    }
                    onFocus={() => setFocusedField('confirmPassword')}
                    onBlur={() => handleFieldBlur('confirmPassword')}
                    className={`w-full pl-12 pr-12 py-3 border-2 rounded-2xl transition-all duration-300 text-slate-900 placeholder:text-slate-500 placeholder:font-normal text-base ${
                      formErrors.confirmPassword
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-100 bg-red-50/50'
                        : focusedField === 'confirmPassword'
                        ? 'border-indigo-500 focus:border-indigo-600 focus:ring-indigo-100 bg-white shadow-lg'
                        : 'border-slate-200 hover:border-slate-300 focus:border-indigo-500 focus:ring-indigo-100 bg-white hover:bg-slate-50/50'
                    }`}
                    placeholder='Confirm your password'
                    style={{ minHeight: '48px' }}
                  />
                  <button
                    type='button'
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className='absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-lg hover:bg-slate-100'
                  >
                    {showConfirmPassword ? (
                      <EyeOff className='w-5 h-5' />
                    ) : (
                      <Eye className='w-5 h-5' />
                    )}
                  </button>
                </div>
                {formErrors.confirmPassword && (
                  <p className='text-red-600 text-sm mt-1 flex items-center gap-1'>
                    <AlertCircle className='w-4 h-4' />
                    {formErrors.confirmPassword}
                  </p>
                )}
              </div>

              <div className='bg-gradient-to-br from-indigo-50/80 to-purple-50/80 backdrop-blur-sm rounded-2xl border border-indigo-100/60 p-4 shadow-sm hover:shadow-md transition-all duration-300'>
                <div className='relative'>
                  <input
                    type='checkbox'
                    id='terms'
                    checked={formData.agreeToTerms}
                    onChange={(e) =>
                      handleInputChangeWithValidation(
                        'agreeToTerms',
                        e.target.checked
                      )
                    }
                    className='sr-only'
                  />
                  <label
                    htmlFor='terms'
                    className='flex items-start cursor-pointer group'
                  >
                    <div
                      className={`w-5 h-5 border-2 rounded-md transition-all duration-300 flex items-center justify-center flex-shrink-0 mt-0 shadow-sm ${
                        formData.agreeToTerms
                          ? 'bg-gradient-to-r from-indigo-600 to-purple-600 border-indigo-600 shadow-indigo-200'
                          : 'border-slate-300 group-hover:border-indigo-400 group-hover:shadow-md'
                      }`}
                    >
                      {formData.agreeToTerms && (
                        <CheckCircle className='w-3 h-3 text-white' />
                      )}
                    </div>
                    <div className='ml-3 flex-1'>
                      <div className='text-sm text-slate-700 leading-tight space-y-0'>
                        <p className='font-medium text-slate-800 mb-0 text-sm'>
                          I agree to the terms and conditions
                        </p>
                        <p className='text-xs text-slate-600 leading-tight'>
                          By creating an account, you agree to our{' '}
                          <button
                            type='button'
                            className='text-indigo-600 hover:text-indigo-700 font-semibold hover:underline transition-colors duration-200 inline text-xs'
                            onClick={(e) => e.stopPropagation()}
                          >
                            Terms of Service
                          </button>{' '}
                          and{' '}
                          <button
                            type='button'
                            className='text-indigo-600 hover:text-indigo-700 font-semibold hover:underline transition-colors duration-200 inline text-xs'
                            onClick={(e) => e.stopPropagation()}
                          >
                            Privacy Policy
                          </button>
                        </p>
                      </div>
                    </div>
                  </label>
                </div>
              </div>
              {formErrors.agreeToTerms && (
                <p className='text-red-600 text-sm flex items-center gap-1'>
                  <AlertCircle className='w-4 h-4' />
                  {formErrors.agreeToTerms}
                </p>
              )}

              <div className='flex space-x-4'>
                <button
                  type='button'
                  onClick={handleBack}
                  className='flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 px-6 rounded-2xl font-semibold transition-all duration-300 flex items-center justify-center group shadow-sm text-base'
                  style={{ minHeight: '48px' }}
                >
                  <ChevronLeft className='mr-2 w-5 h-5 group-hover:-translate-x-1 transition-transform' />
                  Back
                </button>
                <button
                  type='submit'
                  onClick={handleSignupSubmit}
                  disabled={isLoading}
                  className='flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-3 px-6 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed text-base'
                  style={{ minHeight: '48px' }}
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
          <div className='mt-6'>
            <SocialLogin />
          </div>
        )}
      </form>
    </div>
  );
}
