'use client';

import Link from 'next/link';
import { KhronosLogo } from '@/src/components/ui/khronos-logo';
import { Button } from '@/src/components/ui/button';

export default function NotFound() {
  const handleGoBack = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      window.history.back();
    } else {
      window.location.href = '/';
    }
  };

  return (
    <div className='min-h-screen bg-theme-secondary theme-transition overflow-x-hidden'>
      <div className='relative z-10 min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8'>
        <div className='w-full max-w-2xl mx-auto text-center'>
          {/* Logo */}
          <div className='mb-8'>
            <div className='flex justify-center'>
              <KhronosLogo size='lg' showText={true} />
            </div>
          </div>

          {/* 404 Number */}
          <div className='mb-6'>
            <h1 className='text-8xl sm:text-9xl font-black leading-none'>
              <span className='bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400 bg-clip-text text-transparent'>
                404
              </span>
            </h1>
          </div>

          {/* Main Message */}
          <div className='mb-8'>
            <h2 className='text-2xl sm:text-3xl font-bold text-theme-primary mb-4'>
              Page Not Found
            </h2>
            <p className='text-lg text-theme-secondary max-w-md mx-auto leading-relaxed'>
              Oops! The page you&apos;re looking for seems to have wandered off
              into the digital void.
            </p>
          </div>

          {/* Action Buttons */}
          <div className='flex flex-col sm:flex-row gap-4 justify-center items-center'>
            <Button
              onClick={handleGoBack}
              size='lg'
              className='w-full sm:w-auto bg-accent-primary hover:bg-accent-secondary text-white cursor-pointer'
            >
              <span className='flex items-center gap-2'>
                <svg
                  className='w-4 h-4'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M10 19l-7-7m0 0l7-7m-7 7h18'
                  />
                </svg>
                Go Back
              </span>
            </Button>
            <Link href='/contact'>
              <Button
                variant='outline'
                size='lg'
                className='w-full sm:w-auto cursor-pointer'
              >
                <span className='flex items-center gap-2'>
                  <svg
                    className='w-4 h-4'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z'
                    />
                  </svg>
                  Contact Support
                </span>
              </Button>
            </Link>
          </div>

          {/* Additional Help Text */}
          <div className='mt-8'>
            <p className='text-sm text-theme-muted'>
              Can&apos;t find what you&apos;re looking for?{' '}
              <Link
                href='/contact'
                className='text-accent-primary hover:underline font-medium'
              >
                Let us know
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
