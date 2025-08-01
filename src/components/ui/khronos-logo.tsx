'use client';

import React from 'react';
import Link from 'next/link';

interface KhronosLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  clickable?: boolean;
  className?: string;
  textClassName?: string;
  logoClassName?: string;
}

export function KhronosLogo({
  size = 'md',
  showText = true,
  clickable = false,
  className = '',
  textClassName = '',
  logoClassName = '',
}: KhronosLogoProps) {
  const sizeClasses = {
    sm: {
      logo: 'w-7 h-7',
      text: 'text-xs',
      textSize: 'text-base',
    },
    md: {
      logo: 'w-10 h-10',
      text: 'text-base',
      textSize: 'text-xl',
    },
    lg: {
      logo: 'w-12 h-12',
      text: 'text-lg',
      textSize: 'text-2xl',
    },
  };

  const currentSize = sizeClasses[size];

  const LogoContent = () => (
    <div className={`flex items-center space-x-2 ${className}`}>
      <div
        className={`${currentSize.logo} bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-xl transform hover:scale-110 transition-all duration-300 animate-spin-slow ${logoClassName}`}
      >
        <span className={`text-white font-bold ${currentSize.text}`}>K</span>
      </div>
      {showText && (
        <span
          className={`font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent ${currentSize.textSize} ${textClassName}`}
        >
          KHRONOS
        </span>
      )}
    </div>
  );

  if (clickable) {
    return (
      <Link href='/' className='cursor-pointer'>
        <LogoContent />
      </Link>
    );
  }

  return <LogoContent />;
}

// Add this style to your component or global CSS
export const KhronosLogoStyles = () => (
  <style jsx global>{`
    @keyframes spin-slow {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
    }

    .animate-spin-slow {
      animation: spin-slow 20s linear infinite;
    }
  `}</style>
);
