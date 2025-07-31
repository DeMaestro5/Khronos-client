'use client';

import { useEffect, useState } from 'react';

export default function DebugEnvPage() {
  const [envVars, setEnvVars] = useState<Record<string, string>>({});

  useEffect(() => {
    // Only show NEXT_PUBLIC_ environment variables
    const publicEnvVars: Record<string, string> = {};

    // Check for specific environment variables
    const envVarsToCheck = [
      'NEXT_PUBLIC_API_URL',
      'NEXT_PUBLIC_API_KEY',
      'NEXT_PUBLIC_GOOGLE_CLIENT_ID',
      'NEXT_PUBLIC_GOOGLE_CALLBACK_URL',
      'NEXT_PUBLIC_DEBUG_OAUTH',
    ];

    envVarsToCheck.forEach((key) => {
      if (process.env[key]) {
        publicEnvVars[key] = process.env[key]!;
      } else {
        publicEnvVars[key] = 'NOT SET';
      }
    });

    setEnvVars(publicEnvVars);
  }, []);

  return (
    <div className='min-h-screen bg-gray-100 p-8'>
      <div className='max-w-4xl mx-auto'>
        <h1 className='text-3xl font-bold mb-8'>Environment Variables Debug</h1>

        <div className='bg-white rounded-lg shadow p-6'>
          <h2 className='text-xl font-semibold mb-4'>
            NEXT_PUBLIC Environment Variables
          </h2>

          <div className='space-y-4'>
            {Object.entries(envVars).map(([key, value]) => (
              <div key={key} className='border-b pb-2'>
                <div className='font-mono text-sm text-gray-600'>{key}</div>
                <div className='font-mono text-sm bg-gray-100 p-2 rounded mt-1 break-all'>
                  {value}
                </div>
              </div>
            ))}
          </div>

          <div className='mt-8 p-4 bg-blue-50 rounded-lg'>
            <h3 className='font-semibold text-blue-900 mb-2'>
              Troubleshooting Tips:
            </h3>
            <ul className='text-sm text-blue-800 space-y-1'>
              <li>
                • If NEXT_PUBLIC_API_URL shows &quot;NOT SET&quot;, add it to
                your Vercel environment variables
              </li>
              <li>
                • Make sure the API URL points to your production backend (not
                localhost)
              </li>
              <li>
                • Verify that all required environment variables are set in
                Vercel dashboard
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
