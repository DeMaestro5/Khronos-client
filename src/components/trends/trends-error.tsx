'use client';

import React from 'react';
import { AlertCircle } from 'lucide-react';

interface TrendsErrorProps {
  error: string | null;
}

const TrendsError: React.FC<TrendsErrorProps> = ({ error }) => {
  if (!error) return null;

  return (
    <div className='mb-8 p-4 bg-red-50 border border-red-200 rounded-2xl'>
      <div className='flex items-center space-x-3'>
        <AlertCircle className='w-5 h-5 text-red-500' />
        <span className='text-red-700 font-medium'>{error}</span>
      </div>
    </div>
  );
};

export default TrendsError;
