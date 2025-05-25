import { Check } from 'lucide-react';
import React from 'react';

export default function ProgressIndicator({
  currentStep,
}: {
  currentStep: number;
}) {
  return (
    <div className='m-2 animate-slideUp animation-delay-200'>
      <div className='flex items-center justify-center space-x-4'>
        <div
          className={`flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all duration-300 ${
            currentStep >= 1
              ? 'bg-indigo-600 border-indigo-600 text-white'
              : 'border-slate-300 text-slate-400'
          }`}
        >
          {currentStep > 1 ? <Check className='w-4 h-4' /> : '1'}
        </div>
        <div
          className={`h-1 w-16 rounded-full transition-all duration-300 ${
            currentStep >= 2 ? 'bg-indigo-600' : 'bg-slate-200'
          }`}
        />
        <div
          className={`flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all duration-300 ${
            currentStep >= 2
              ? 'bg-indigo-600 border-indigo-600 text-white'
              : 'border-slate-300 text-slate-400'
          }`}
        >
          2
        </div>
      </div>
      <div className='flex justify-between text-xs text-white-500 mt-2 px-2'>
        <span>Personal Info</span>
        <span>Security</span>
      </div>
    </div>
  );
}
