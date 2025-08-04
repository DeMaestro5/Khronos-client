'use client';

import { useAuth } from '@/src/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface AuthGuardProps {
  children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Only redirect if we're done loading and user is not authenticated
    if (!loading && !isAuthenticated) {
      console.log('User not authenticated, redirecting to login');
      router.push('/auth/login');
    }
  }, [loading, isAuthenticated, router]);

  // Show loading spinner while checking authentication - use theme-aware classes
  if (loading) {
    return (
      <div className='min-h-screen bg-theme-secondary flex items-center justify-center transition-colors duration-300'>
        <div className='text-center'>
          <div className='w-12 h-12 border-4 border-theme-tertiary border-t-accent-primary rounded-full animate-spin mx-auto mb-4'></div>
          <p className='text-theme-secondary font-medium'>
            Checking authentication...
          </p>
        </div>
      </div>
    );
  }

  // Don't render children if not authenticated (redirect will happen in useEffect)
  if (!isAuthenticated) {
    return (
      <div className='min-h-screen bg-theme-secondary flex items-center justify-center transition-colors duration-300'>
        <div className='text-center'>
          <div className='w-12 h-12 border-4 border-theme-tertiary border-t-accent-primary rounded-full animate-spin mx-auto mb-4'></div>
          <p className='text-theme-secondary font-medium'>
            Redirecting to login...
          </p>
        </div>
      </div>
    );
  }

  // User is authenticated, render the protected content
  return <>{children}</>;
}
