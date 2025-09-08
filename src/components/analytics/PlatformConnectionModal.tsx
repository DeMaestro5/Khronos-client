'use client';

import React, { useEffect, useRef, useState } from 'react';
import { integrationsAPI } from '@/src/lib/api';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import Label from '../../components/ui/label';
import { useRouter } from 'next/navigation';
import { AuthUtils } from '@/src/lib/auth-utils';
import { useAuth } from '@/src/context/AuthContext';

interface Props {
  platform: string; // 'youtube' | 'instagram' | 'facebook' | ...
  isOpen: boolean; // controls visibility from parent
  onClose: () => void; // close callback
  onConnected: () => void; // after successful connect
}

export default function PlatformConnectionModal({
  platform,
  isOpen,
  onClose,
  onConnected,
}: Props) {
  // hooks must be declared unconditionally
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();
  const { refreshTokens, checkAuthStatus } = useAuth();
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Close on ESC (only when open)
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setError(null);
      setIsRedirecting(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;
  // Friendly title map
  const platformTitles: Record<string, string> = {
    youtube: 'YouTube',
    instagram: 'Instagram',
    facebook: 'Facebook',
    linkedin: 'LinkedIn',
    twitter: 'Twitter',
    tiktok: 'TikTok',
  };
  const title = platformTitles[platform] || 'Platform';

  // Fields per platform (no side-effects)
  const fields =
    platform === 'instagram'
      ? [
          {
            key: 'igBusinessAccountId',
            label: 'Business Account ID',
            placeholder: '1784...',
          },
          {
            key: 'igUserAccessToken',
            label: 'User Access Token (EAAG...)',
            placeholder: 'EAAG...',
          },
        ]
      : platform === 'facebook'
      ? [
          { key: 'pageId', label: 'Page ID', placeholder: '1234567890' },
          {
            key: 'pageAccessToken',
            label: 'Page Access Token (EAAG...)',
            placeholder: 'EAAG...',
          },
        ]
      : platform === 'linkedin'
      ? [
          {
            key: 'memberUrn',
            label: 'Member URN',
            placeholder: 'urn:li:person:XXXX',
          },
          {
            key: 'accessToken',
            label: 'Access Token',
            placeholder: 'token...',
          },
        ]
      : platform === 'twitter'
      ? [
          { key: 'userId', label: 'User ID', placeholder: '1234567890' },
          {
            key: 'accessToken',
            label: 'Access Token',
            placeholder: 'token...',
          },
          {
            key: 'accessTokenSecret',
            label: 'Access Token Secret',
            placeholder: 'secret...',
          },
        ]
      : platform === 'tiktok'
      ? [
          { key: 'openId', label: 'Open ID', placeholder: 'openid...' },
          {
            key: 'accessToken',
            label: 'Access Token',
            placeholder: 'token...',
          },
        ]
      : [];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // YouTube = OAuth redirect only on explicit submit
    if (platform === 'youtube') {
      const redirectUrl = await integrationsAPI.youtube.initiate();
      router.push(redirectUrl);
      console.log('Redirecting to', redirectUrl);
      return;
    }

    // Collect payload from form
    const form = formRef.current;
    if (!form) return;
    const data = new FormData(form);
    const payload = Object.fromEntries(data.entries()) as Record<
      string,
      string
    >;

    const api = integrationsAPI[platform as keyof typeof integrationsAPI];
    // Narrow to platforms that expose `connect`
    if (api && 'connect' in api) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (api as any).connect(payload);
        onConnected();
      } catch (err) {
        console.error('Connection failed:', err);
      }
    } else {
      onClose();
    }
  }

  // Click outside to close
  function onBackdrop(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === e.currentTarget) onClose();
  }

  return (
    <div
      className='fixed inset-0 z-[10000] flex items-center justify-center p-4'
      role='dialog'
      aria-modal='true'
      onMouseDown={onBackdrop}
    >
      <div className='absolute inset-0 bg-theme-backdrop backdrop-blur-sm' />
      <div className='relative bg-theme-card border border-theme-tertiary rounded-xl shadow-xl w-full max-w-md overflow-hidden'>
        {/* header */}
        <div className='flex items-center justify-between p-5 border-b border-theme-tertiary'>
          <h2 className='text-lg font-semibold text-theme-primary'>
            Connect to {title}
          </h2>
          <button
            onClick={onClose}
            className='px-2 py-1 rounded-md hover:bg-theme-hover transition-colors'
            aria-label='Close'
          >
            ×
          </button>
        </div>

        {/* content */}
        <div className='p-5'>
          {platform === 'youtube' ? (
            <div className='space-y-4'>
              {error && (
                <div className='p-3 bg-red-50 border border-red-200 rounded-md'>
                  <p className='text-sm text-red-600'>{error}</p>
                </div>
              )}
              <div className='flex items-center justify-end gap-2'>
                <Button
                  disabled={isRedirecting}
                  onClick={async () => {
                    try {
                      if (isRedirecting) return;
                      setError(null);
                      setIsRedirecting(true);

                      // Check if token needs refresh before attempting connection
                      if (AuthUtils.shouldRefreshToken()) {
                        console.log(
                          '🔄 Refreshing token before YouTube connection...'
                        );
                        const refreshSuccess = await refreshTokens();
                        if (!refreshSuccess) {
                          setError(
                            'Your session has expired. Please refresh the page and try again.'
                          );
                          setIsRedirecting(false);
                          return;
                        }
                        // Update auth status after refresh
                        checkAuthStatus();
                      }

                      const redirectUrl =
                        await integrationsAPI.youtube.initiate();
                      console.log('Redirecting to:', redirectUrl);
                      router.push(redirectUrl);
                    } catch (error) {
                      setIsRedirecting(false);
                      console.error('Failed to initiate YouTube OAuth:', error);
                      const errorMessage =
                        error instanceof Error
                          ? error.message
                          : 'Failed to connect to YouTube. Please try again.';
                      setError(errorMessage);
                    }
                  }}
                  className='text-theme-primary cursor-pointer'
                >
                  {isRedirecting ? 'Connecting...' : 'Connect via Google'}
                </Button>
                <Button
                  variant='outline'
                  onClick={onClose}
                  className='cursor-pointer'
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <form ref={formRef} onSubmit={handleSubmit} className='space-y-4'>
              {fields.map((f) => (
                <div key={f.key} className='space-y-2'>
                  <Label className='text-theme-primary' htmlFor={f.key}>
                    {f.label}
                  </Label>
                  <Input id={f.key} name={f.key} placeholder={f.placeholder} />
                </div>
              ))}
              <div className='flex items-center justify-end gap-2 pt-2'>
                <Button type='submit' className='text-theme-primary'>
                  Connect
                </Button>
                <Button variant='outline' type='button' onClick={onClose}>
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
