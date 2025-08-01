'use client';

import FloatingOrbs from '@/src/components/ui/floating-animation';
import React, { useEffect, useState } from 'react';
import LoginForm from '@/src/components/auth/LoginForm';
import SocialsAuth from '@/src/components/auth/SocialsAuth';
import { Footer } from '@/src/components/ui/footer';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className='h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/30 flex items-center justify-center p-4 relative overflow-hidden'>
      {/* Floating Background Elements */}
      <FloatingOrbs />

      {/* Grid Pattern Overlay */}
      <div className='absolute inset-0 bg-grid-slate-100/50 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] opacity-30' />

      {/* Main Content */}
      <div className='w-full max-w-md relative z-10'>
        {/* Header Section */}
        <div className='text-center mb-2 animate-slideUp'>
          {/* Logo */}
          <div className='flex items-center justify-center space-x-2 mb-1'>
            <div className='w-10 h-10 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-xl transform hover:scale-110 transition-all duration-300 animate-logoSpin'>
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
          <div className='space-y-0.5'>
            <h1 className='text-2xl font-bold text-slate-900'>Welcome back</h1>
            <p className='bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent text-base'>
              Sign in to your account to continue
            </p>
          </div>
        </div>

        {/* Login Card */}
        <div className='bg-white/80 rounded-3xl shadow-2xl border border-white/20 p-6 animate-slideUp animation-delay-200'>
          {/* Login Form */}
          <LoginForm />

          {/* Divider and Social Login */}
          <div className='mt-4'>
            <SocialsAuth />
          </div>
        </div>

        {/* Sign Up Link */}
        <div className='text-center mt-2 animate-slideUp animation-delay-400'>
          <p className='text-slate-900'>
            Don&apos;t have an account?{' '}
            <button
              type='button'
              className='text-slate-900 hover:text-indigo-600 font-semibold transition-colors hover:underline cursor-pointer ml-1'
              onClick={() => router.push('/auth/signup')}
            >
              Sign up for free
            </button>
          </p>
        </div>

        {/* Footer */}
        <Footer variant='auth' animate={true} />
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

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes checkmark {
          0% {
            transform: scale(0);
          }
          50% {
            transform: scale(1.2);
          }
          100% {
            transform: scale(1);
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

        .animate-float-slow {
          animation: float-slow 6s ease-in-out infinite;
        }
        .animate-float-medium {
          animation: float-medium 4s ease-in-out infinite;
        }
        .animate-float-fast {
          animation: float-fast 3s ease-in-out infinite;
        }
        .animate-slideUp {
          animation: slideUp 0.6s ease-out;
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
        .animate-checkmark {
          animation: checkmark 0.3s ease-out;
        }
        .animate-logoSpin {
          animation: logoSpin 20s linear infinite;
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

        .bg-grid-slate-100\/50 {
          background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='rgb(15 23 42 / 0.04)'%3e%3cpath d='m0 .5h32m-32 32h32m-32-16h32m-32-16h32'/%3e%3cpath d='m.5 0v32m32-32v32m-16-32v32m-16-32v32'/%3e%3c/svg%3e");
        }
      `}</style>
    </div>
  );
}
