'use client';

import FloatingOrbs from '@/src/components/ui/floating-animation';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import ProgressIndicator from '@/src/components/auth/progress-indicator';
import SignupForm from '@/src/components/auth/signupForm';
import LeftSideSignUp from '@/src/components/auth/leftsideSignUp';
import { Footer } from '@/src/components/ui/footer';

export default function SignupPage() {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
  });
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<{
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    agreeToTerms?: string;
  }>({});

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const validateStep = (step: number) => {
    const newErrors: {
      firstName?: string;
      lastName?: string;
      email?: string;
      password?: string;
      confirmPassword?: string;
      agreeToTerms?: string;
    } = {};
    if (step === 1) {
      if (!formData.firstName.trim())
        newErrors.firstName = 'First name is required';
      if (!formData.lastName.trim())
        newErrors.lastName = 'Last name is required';
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Email is invalid';
      }
    }

    if (step === 2) {
      if (!formData.password) {
        newErrors.password = 'Password is required';
      } else if (formData.password.length < 8) {
        newErrors.password = 'Password must be at least 8 characters';
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
      if (!formData.agreeToTerms) {
        newErrors.agreeToTerms = 'You must agree to the terms and conditions';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(2);
    }
  };

  const handleBack = () => {
    setCurrentStep(1);
    setErrors({});
  };

  const handleInputChange = (
    field: keyof typeof formData,
    value: string | boolean
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className='h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/30 relative overflow-hidden'>
      {/* Desktop Left Side Animation - Hidden on mobile */}
      <div className='hidden lg:block absolute inset-0 w-1/2'>
        <LeftSideSignUp mousePosition={mousePosition} />
      </div>

      {/* Mobile Background Pattern */}
      <div className='lg:hidden absolute inset-0 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50'>
        <div className='absolute inset-0 bg-grid-slate-100/30 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] opacity-20' />
        <FloatingOrbs />
      </div>

      {/* Main Content */}
      <div className='relative z-10 flex h-full'>
        {/* Mobile Layout */}
        <div className='w-full lg:w-1/2 lg:ml-auto flex flex-col justify-center px-4 sm:px-6 lg:px-8 py-2 lg:py-4'>
          <div className='w-full max-w-md mx-auto'>
            {/* Header Section */}
            <div className='text-center mb-3 lg:mb-4'>
              {/* Logo */}
              <div className='flex items-center justify-center space-x-3 mb-3'>
                <div className='w-10 h-10 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-xl transform hover:scale-110 transition-all duration-300'>
                  <span className='text-white font-bold text-base'>K</span>
                </div>
                <div
                  onClick={() => router.push('/')}
                  className='text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent cursor-pointer'
                >
                  KHRONOS
                </div>
              </div>

              {/* Welcome Text */}
              <div className='space-y-1'>
                <h1 className='text-2xl lg:text-3xl font-bold text-slate-900 leading-tight'>
                  Create your account
                </h1>
                <p className='text-slate-700 text-sm leading-relaxed max-w-sm mx-auto'>
                  Join thousands of content creators managing their time
                  effectively
                </p>
              </div>
            </div>

            {/* Progress Indicator */}
            <div className='mb-3'>
              <ProgressIndicator currentStep={currentStep} />
            </div>

            {/* Signup Form */}
            <SignupForm
              formData={formData}
              handleInputChange={handleInputChange}
              errors={errors}
              handleNext={handleNext}
              handleBack={handleBack}
              currentStep={currentStep}
              showPassword={showPassword}
              showConfirmPassword={showConfirmPassword}
              setShowPassword={setShowPassword}
              setShowConfirmPassword={setShowConfirmPassword}
            />

            {/* Sign In Link */}
            <div className='text-center mt-3'>
              <p className='text-slate-700 text-sm'>
                Already have an account?{' '}
                <button
                  type='button'
                  className='text-indigo-600 hover:text-indigo-700 font-semibold transition-colors hover:underline cursor-pointer'
                  onClick={() => router.push('/auth/login')}
                >
                  Sign in here
                </button>
              </p>
            </div>

            {/* Footer */}
            <div className='mt-3'>
              <Footer variant='auth' animate={true} />
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .bg-grid-slate-100\/30 {
          background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='rgb(15 23 42 / 0.04)'%3e%3cpath d='m0 .5h32m-32 32h32m-32-16h32m-32-16h32'/%3e%3cpath d='m.5 0v32m32-32v32m-16-32v32m-16-32v32'/%3e%3c/svg%3e");
        }
      `}</style>
    </div>
  );
}
