'use client';

import React, { useEffect, useState } from 'react';
import LoginForm from '@/src/components/auth/LoginForm';
import SocialsAuth from '@/src/components/auth/SocialsAuth';
import { Footer } from '@/src/components/ui/footer';
import { KhronosLogo } from '@/src/components/ui/khronos-logo';
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
      {/* Grid Pattern Overlay */}
      <div className='absolute inset-0 bg-grid-slate-100/50 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] opacity-30' />

      {/* Main Content */}
      <div className='w-full max-w-md relative z-10'>
        {/* Header Section */}
        <div className='text-center mb-2'>
          {/* Logo */}
          <div className='flex items-center justify-center space-x-2 mb-1'>
            <KhronosLogo size='md' showText={true} clickable={true} />
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
        <div className='bg-white/80 rounded-3xl shadow-2xl border border-white/20 p-6'>
          {/* Login Form */}
          <LoginForm />

          {/* Divider and Social Login */}
          <div className='mt-4'>
            <SocialsAuth />
          </div>
        </div>

        {/* Sign Up Link */}
        <div className='text-center mt-2'>
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
        <Footer variant='auth' animate={false} />
      </div>

      <style jsx>{`
        .bg-grid-slate-100\/50 {
          background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='rgb(15 23 42 / 0.04)'%3e%3cpath d='m0 .5h32m-32 32h32m-32-16h32m-32-16h32'/%3e%3cpath d='m.5 0v32m32-32v32m-16-32v32m-16-32v32'/%3e%3c/svg%3e");
        }
      `}</style>
    </div>
  );
}
