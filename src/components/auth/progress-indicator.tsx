import { Check } from 'lucide-react';
import React from 'react';

export default function ProgressIndicator({
  currentStep,
}: {
  currentStep: number;
}) {
  return (
    <div className='m-1 animate-slideUp animation-delay-200'>
      <div className='flex items-center justify-center space-x-3'>
        <div
          className={`flex items-center justify-center w-7 h-7 rounded-full border-2 transition-all duration-300 ${
            currentStep >= 1
              ? 'bg-indigo-600 border-indigo-600 text-white'
              : 'border-slate-300 text-slate-400'
          }`}
        >
          {currentStep > 1 ? <Check className='w-3 h-3' /> : '1'}
        </div>
        <div
          className={`h-1 w-12 rounded-full transition-all duration-300 ${
            currentStep >= 2 ? 'bg-indigo-600' : 'bg-slate-200'
          }`}
        />
        <div
          className={`flex items-center justify-center w-7 h-7 rounded-full border-2 transition-all duration-300 ${
            currentStep >= 2
              ? 'bg-indigo-600 border-indigo-600 text-white'
              : 'border-slate-300 text-slate-400'
          }`}
        >
          2
        </div>
      </div>
      <div className='flex justify-between text-xs text-slate-500 mt-1 px-1'>
        <span>Personal Info</span>
        <span>Security</span>
      </div>
    </div>
  );
}
