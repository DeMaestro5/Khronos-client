'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useGoogleAuth } from '@/src/hooks/useGoogleAuth';
import FloatingOrbs from '@/src/components/ui/floating-animation';
import { KhronosLogo } from '@/src/components/ui/khronos-logo';

function GoogleCallbackContent() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>(
    'loading'
  );
  const [message, setMessage] = useState('Processing authentication...');
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { processGoogleCallback } = useGoogleAuth();

  useEffect(() => {
    // Prevent multiple executions
    if (isProcessing || status !== 'loading') return;

    setIsProcessing(true);
    const handleCallback = async () => {
      try {
        // Debug: Log all search parameters
        console.log(
          'Google callback search params:',
          Object.fromEntries(searchParams.entries())
        );

        // Check if we have tokens from backend redirect (new flow)
        const success = searchParams.get('success');
        const accessToken = searchParams.get('accessToken');
        const refreshToken = searchParams.get('refreshToken');
        // const userId = searchParams.get('userId');
        const error = searchParams.get('error');

        // Handle OAuth errors
        if (error) {
          setStatus('error');
          setMessage(`Authentication failed: ${error}`);
          setTimeout(() => {
            router.push('/auth/login');
          }, 3000);
          return;
        }

        // New flow: Backend redirects with tokens
        if (success === 'true' && accessToken && refreshToken) {
          console.log('Processing new flow with tokens');
          try {
            // Store tokens directly
            const { AuthUtils } = await import('@/src/lib/auth-utils');
            AuthUtils.storeTokens({
              accessToken,
              refreshToken,
              expiresIn: 3600, // Default expiry
            });
            console.log('Tokens stored successfully');

            // Verify tokens are stored
            const storedTokens = AuthUtils.getStoredTokens();
            const hasValidTokens = AuthUtils.hasValidTokens();
            const isExpired = AuthUtils.isTokenExpired();
            console.log('Token verification:', {
              storedTokens: !!storedTokens,
              hasValidTokens,
              isExpired,
              accessToken: !!AuthUtils.getAccessToken(),
              refreshToken: !!AuthUtils.getRefreshToken(),
            });

            // Always fetch user data after successful authentication
            try {
              // Fetch user profile data
              const { profileAPI } = await import('@/src/lib/api');
              const userResponse = await profileAPI.getProfile();

              // Check different possible response structures
              let userData = null;
              if (userResponse.data?.data?.user) {
                userData = userResponse.data.data.user;
              } else if (userResponse.data?.user) {
                userData = userResponse.data.user;
              } else if (userResponse.data?.data) {
                userData = userResponse.data.data;
              }

              if (userData) {
                const { AuthUtils } = await import('@/src/lib/auth-utils');
                AuthUtils.storeUser(userData);

                // Dispatch event to notify AuthContext that user data has been updated
                window.dispatchEvent(
                  new CustomEvent('userUpdated', {
                    detail: { user: userData },
                  })
                );
              }
            } catch (userError) {
              console.warn('Failed to fetch user data:', userError);
              // Continue anyway - user is still authenticated
            }

            setStatus('success');
            setMessage('Authentication successful! Redirecting...');

            // Dispatch event to notify AuthContext that tokens have been updated
            window.dispatchEvent(
              new CustomEvent('tokensUpdated', {
                detail: { accessToken, refreshToken },
              })
            );

            // Add a delay to ensure AuthContext has time to process tokens
            setTimeout(() => {
              // Use window.location.href for full page refresh
              window.location.href = '/dashboard';
            }, 2000);
            return;
          } catch (tokenError) {
            console.error('Token storage error:', tokenError);
            setStatus('error');
            setMessage('Failed to store authentication tokens');
            setTimeout(() => {
              router.push('/auth/login');
            }, 3000);
            return;
          }
        }

        // Fallback: Old flow with code and state (if backend still uses this)
        const code = searchParams.get('code');
        const state = searchParams.get('state');

        console.log('Checking old flow - code:', code, 'state:', state);

        if (!code || !state) {
          console.log('No code or state found, redirecting to login');
          setStatus('error');
          setMessage('Invalid authentication response');
          setTimeout(() => {
            router.push('/auth/login');
          }, 3000);
          return;
        }

        // Process the callback using the old flow
        const result = await processGoogleCallback(code, state);

        if (result.success) {
          setStatus('success');
          setMessage('Authentication successful! Redirecting...');

          // Redirect to dashboard after successful authentication
          setTimeout(() => {
            router.push('/dashboard');
          }, 1500);
        } else {
          setStatus('error');
          setMessage(result.error || 'Authentication failed');
          setTimeout(() => {
            router.push('/auth/login');
          }, 3000);
        }
      } catch (error) {
        console.error('Google callback processing error:', error);
        setStatus('error');
        setMessage('An unexpected error occurred');
        setTimeout(() => {
          router.push('/auth/login');
        }, 3000);
      }
    };

    handleCallback();
  }, [searchParams, processGoogleCallback, router, isProcessing, status]);

  return (
    <div className='h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/30 flex items-center justify-center p-4 relative overflow-hidden'>
      {/* Floating Background Elements */}
      <FloatingOrbs />

      {/* Grid Pattern Overlay */}
      <div className='absolute inset-0 bg-grid-slate-100/50 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] opacity-30' />

      {/* Main Content */}
      <div className='w-full max-w-md relative z-10'>
        {/* Header Section */}
        <div className='text-center mb-8 animate-slideUp'>
          {/* Logo */}
          <div className='flex items-center justify-center space-x-2 mb-4'>
            <KhronosLogo size='lg' showText={true} />
          </div>

          <h1 className='text-2xl font-bold text-slate-900 mb-2'>
            Google Authentication
          </h1>
        </div>

        {/* Status Card */}
        <div className='bg-white/80 rounded-3xl shadow-2xl border border-white/20 p-8 animate-slideUp animation-delay-200'>
          <div className='text-center space-y-4'>
            {/* Status Icon */}
            <div className='flex justify-center'>
              {status === 'loading' && (
                <div className='w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin' />
              )}
              {status === 'success' && (
                <div className='w-16 h-16 bg-green-100 rounded-full flex items-center justify-center'>
                  <svg
                    className='w-8 h-8 text-green-600'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M5 13l4 4L19 7'
                    />
                  </svg>
                </div>
              )}
              {status === 'error' && (
                <div className='w-16 h-16 bg-red-100 rounded-full flex items-center justify-center'>
                  <svg
                    className='w-8 h-8 text-red-600'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M6 18L18 6M6 6l12 12'
                    />
                  </svg>
                </div>
              )}
            </div>

            {/* Status Message */}
            <div className='space-y-2'>
              <h2 className='text-xl font-semibold text-slate-900'>
                {status === 'loading' && 'Processing...'}
                {status === 'success' && 'Success!'}
                {status === 'error' && 'Authentication Failed'}
              </h2>
              <p className='text-slate-600'>{message}</p>
            </div>

            {/* Progress Bar for Loading */}
            {status === 'loading' && (
              <div className='w-full bg-slate-200 rounded-full h-2 overflow-hidden'>
                <div
                  className='bg-gradient-to-r from-indigo-600 to-purple-600 h-2 rounded-full animate-pulse'
                  style={{ width: '60%' }}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
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

        .animate-slideUp {
          animation: slideUp 0.6s ease-out;
        }

        .animation-delay-200 {
          animation-delay: 0.2s;
        }
      `}</style>
    </div>
  );
}

export default function GoogleCallbackPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <GoogleCallbackContent />
    </Suspense>
  );
}
