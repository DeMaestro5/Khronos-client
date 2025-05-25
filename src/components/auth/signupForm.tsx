import React from 'react';
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
                        errors.firstName
                          ? 'border-red-300 bg-red-50'
                          : 'border-slate-300'
                      } placeholder:text-slate-400 text-slate-900`}
                      placeholder='First name'
                    />
                  </div>
                  {errors.firstName && (
                    <p className='text-red-500 text-xs mt-1 flex items-center'>
                      <X className='w-3 h-3 mr-1' />
                      {errors.firstName}
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
                        errors.lastName
                          ? 'border-red-300 bg-red-50'
                          : 'border-slate-300'
                      } placeholder:text-slate-400 text-slate-900`}
                      placeholder='Last name'
                    />
                  </div>
                  {errors.lastName && (
                    <p className='text-red-500 text-xs mt-1 flex items-center'>
                      <X className='w-3 h-3 mr-1' />
                      {errors.lastName}
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
                      errors.email
                        ? 'border-red-300 bg-red-50'
                        : 'border-slate-300'
                    } placeholder:text-slate-400 text-slate-900`}
                    placeholder='Email address'
                  />
                </div>
                {errors.email && (
                  <p className='text-red-500 text-xs mt-1 flex items-center'>
                    <X className='w-3 h-3 mr-1' />
                    {errors.email}
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
                      errors.password
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
                {errors.password && (
                  <p className='text-red-500 text-xs mt-1 flex items-center'>
                    <X className='w-3 h-3 mr-1' />
                    {errors.password}
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
                      errors.confirmPassword
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
                {errors.confirmPassword && (
                  <p className='text-red-500 text-xs mt-1 flex items-center'>
                    <X className='w-3 h-3 mr-1' />
                    {errors.confirmPassword}
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
              {errors.agreeToTerms && (
                <p className='text-red-500 text-xs flex items-center'>
                  <X className='w-3 h-3 mr-1' />
                  {errors.agreeToTerms}
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
                  className='flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 focus:ring-4 focus:ring-indigo-300 transition-all duration-200 flex items-center justify-center'
                >
                  Create Account
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
