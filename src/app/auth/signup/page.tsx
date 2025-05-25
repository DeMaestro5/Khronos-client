'use client';

import PasswordStrength from '@/src/components/auth/password-strength-ind';
import SocialsAuth from '@/src/components/auth/SocialsAuth';
import { Button } from '@/src/components/ui/button';
import FloatingOrbs from '@/src/components/ui/floating-animation';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import ProgressIndicator from '@/src/components/auth/progress-indicator';
import SignupForm from '@/src/components/auth/signupForm';
import LeftSideSignUp from '@/src/components/auth/leftsideSignUp';

// Password Strength Component
<PasswordStrength password='12345678' />;
// Social Login Component
<SocialsAuth />;

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
    <div className='h-screen flex relative overflow-hidden'>
      {/* Full-Screen Left Side Animation */}
      <LeftSideSignUp mousePosition={mousePosition} />
      {/* Right Side - Signup Form */}
      <div className='w-full max-w-md lg:max-w-lg xl:max-w-xl bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/30 flex items-center justify-center p-6 relative overflow-hidden'>
        {/* Floating Background Elements for Form Side */}
        <FloatingOrbs />

        {/* Grid Pattern Overlay */}
        <div className='absolute inset-0 bg-grid-slate-100/50 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] opacity-30' />

        {/* Main Content */}
        <div className='w-full max-w-md relative z-10'>
          {/* Header Section */}
          <div className='text-center mb-4 animate-slideInRight'>
            {/* Logo */}
            <div className='flex items-center justify-center space-x-3 mb-2'>
              <div className='w-12 h-12 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-xl transform hover:scale-110 transition-all duration-300 animate-logoSpin'>
                <span className='text-white font-bold text-lg'>K</span>
              </div>
              <div
                onClick={() => router.push('/')}
                className='text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent cursor-pointer'
              >
                KHRONOS
              </div>
            </div>

            {/* Welcome Text */}
            <div className='space-y-1'>
              <h1 className='text-2xl font-bold text-slate-900'>
                Create your account
              </h1>
              <p className='bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent text-base'>
                Join thousands of content creators managing their time
                effectively
              </p>
            </div>
          </div>

          {/* Progress Indicator */}
          <div className='animate-slideInRight animation-delay-200 mb-3'>
            <ProgressIndicator currentStep={currentStep} />
          </div>

          {/* Signup Card */}
          <div className='animate-slideInRight animation-delay-400'>
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
          </div>

          {/* Sign In Link */}
          <div className='text-center mt-2 animate-slideInRight animation-delay-600'>
            <p className='text-amber-50 text-sm'>
              Already have an account?{' '}
              <Button
                variant='link'
                className='text-indigo-200 hover:text-indigo-400 font-semibold transition-colors hover:underline cursor-pointer p-0 h-auto'
                onClick={() => router.push('/auth/login')}
              >
                Sign in here
              </Button>
            </p>
          </div>

          {/* Footer */}
          <div className='text-center text-xs text-slate-400 mt-1 animate-slideInRight animation-delay-800'>
            <p>© 2025 KHRONOS. All rights reserved.</p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float-slow {
          0%,
          100% {
            transform: translateY(0px) scale(1);
          }
          50% {
            transform: translateY(-20px) scale(1.05);
          }
        }
        @keyframes float-medium {
          0%,
          100% {
            transform: translateY(0px) scale(1);
          }
          50% {
            transform: translateY(-15px) scale(1.03);
          }
        }
        @keyframes float-fast {
          0%,
          100% {
            transform: translateY(0px) scale(1);
          }
          50% {
            transform: translateY(-10px) scale(1.02);
          }
        }
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes logoSpin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        @keyframes pulse-glow {
          0%,
          100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 0.7;
            transform: scale(1.05);
          }
        }
        @keyframes bounce-slow {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        @keyframes float-particle {
          0%,
          100% {
            transform: translateY(0px) translateX(0px);
            opacity: 0;
          }
          10%,
          90% {
            opacity: 1;
          }
          50% {
            transform: translateY(-100px) translateX(50px);
            opacity: 0.8;
          }
        }
        @keyframes pulse-slow {
          0%,
          100% {
            opacity: 0.4;
            transform: scale(1);
          }
          50% {
            opacity: 0.6;
            transform: scale(1.1);
          }
        }
        @keyframes drift {
          0% {
            transform: translateX(0px) translateY(0px);
          }
          25% {
            transform: translateX(50px) translateY(-30px);
          }
          50% {
            transform: translateX(-30px) translateY(-60px);
          }
          75% {
            transform: translateX(-60px) translateY(-30px);
          }
          100% {
            transform: translateX(0px) translateY(0px);
          }
        }
        @keyframes float-gentle {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .animate-float-slow {
          animation: float-slow 6s ease-in-out infinite;
        }
        .animate-float-medium {
          animation: float-medium 4s ease-in-out infinite;
        }
        .animate-float-fast {
          animation: float-fast 3s ease-in-out infinite;
        }
        .animate-slideInLeft {
          animation: slideInLeft 0.8s ease-out;
        }
        .animate-slideInRight {
          animation: slideInRight 0.8s ease-out;
        }
        .animate-logoSpin {
          animation: logoSpin 20s linear infinite;
        }
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
        .animate-pulse-glow {
          animation: pulse-glow 3s ease-in-out infinite;
        }
        .animate-bounce-slow {
          animation: bounce-slow 4s ease-in-out infinite;
        }
        .animate-float-particle {
          animation: float-particle linear infinite;
        }
        .animate-pulse-slow {
          animation: pulse-slow 8s ease-in-out infinite;
        }
        .animate-drift {
          animation: drift 15s ease-in-out infinite;
        }
        .animate-float-gentle {
          animation: float-gentle 3s ease-in-out infinite;
        }

        .animation-delay-200 {
          animation-delay: 0.2s;
        }
        .animation-delay-400 {
          animation-delay: 0.4s;
        }
        .animation-delay-600 {
          animation-delay: 0.6s;
        }
        .animation-delay-800 {
          animation-delay: 0.8s;
        }

        .bg-grid-slate-100\/50 {
          background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='rgb(15 23 42 / 0.04)'%3e%3cpath d='m0 .5h32m-32 32h32m-32-16h32m-32-16h32'/%3e%3cpath d='m.5 0v32m32-32v32m-16-32v32m-16-32v32'/%3e%3c/svg%3e");
        }
      `}</style>
    </div>
  );
}
