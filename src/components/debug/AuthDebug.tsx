'use client';

import { useState, useEffect } from 'react';
import { AuthUtils } from '@/src/lib/auth-utils';

export default function AuthDebug() {
  const [tokens, setTokens] = useState<{
    accessToken: string | null;
    refreshToken: string | null;
    expiry: number | null;
  } | null>(null);
  const [apiUrl, setApiUrl] = useState<string>('');

  useEffect(() => {
    // Get tokens from AuthUtils
    const accessToken = AuthUtils.getAccessToken();
    const refreshToken = AuthUtils.getRefreshToken();
    const expiry = AuthUtils.getTokenExpiry();

    setTokens({
      accessToken,
      refreshToken,
      expiry,
    });

    // Get API URL
    const url = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
    setApiUrl(url);
  }, []);

  const testApiConnection = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/v1/content`, {
        headers: {
          Authorization: tokens?.accessToken
            ? `Bearer ${tokens.accessToken}`
            : '',
          'Content-Type': 'application/json',
        },
      });

      console.log('API Test Response Status:', response.status);
      console.log('API Test Response:', await response.text());
    } catch (error) {
      console.error('API Test Error:', error);
    }
  };

  const isTokenExpired = AuthUtils.isTokenExpired();
  const hasValidTokens = AuthUtils.hasValidTokens();

  return (
    <div className='fixed bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg border max-w-sm'>
      <h3 className='font-bold text-sm mb-2'>Auth Debug</h3>
      <div className='space-y-2 text-xs'>
        <div>
          <strong>Access Token:</strong>{' '}
          {tokens?.accessToken
            ? `${tokens.accessToken.substring(0, 20)}...`
            : 'None'}
        </div>
        <div>
          <strong>Refresh Token:</strong>{' '}
          {tokens?.refreshToken
            ? `${tokens.refreshToken.substring(0, 20)}...`
            : 'None'}
        </div>
        <div>
          <strong>Token Expiry:</strong>{' '}
          {tokens?.expiry
            ? new Date(tokens.expiry).toLocaleString()
            : 'Unknown'}
        </div>
        <div>
          <strong>Is Expired:</strong>{' '}
          <span className={isTokenExpired ? 'text-red-600' : 'text-green-600'}>
            {isTokenExpired ? 'Yes' : 'No'}
          </span>
        </div>
        <div>
          <strong>Has Valid Tokens:</strong>{' '}
          <span className={hasValidTokens ? 'text-green-600' : 'text-red-600'}>
            {hasValidTokens ? 'Yes' : 'No'}
          </span>
        </div>
        <div>
          <strong>API URL:</strong> {apiUrl}
        </div>
        <button
          onClick={testApiConnection}
          className='px-2 py-1 bg-blue-500 text-white rounded text-xs'
        >
          Test API
        </button>
        <button
          onClick={() => {
            AuthUtils.clearTokens();
            window.location.href = '/auth/login';
          }}
          className='px-2 py-1 bg-red-500 text-white rounded text-xs ml-2'
        >
          Force Login
        </button>
      </div>
    </div>
  );
}
