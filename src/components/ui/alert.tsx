import React from 'react';

interface AlertProps {
  children: React.ReactNode;
  variant?: 'default' | 'destructive';
  className?: string;
}

export const Alert = ({
  children,
  variant = 'default',
  className = '',
}: AlertProps) => {
  const variants = {
    default: 'bg-slate-50 text-slate-900 border-slate-200',
    destructive: 'bg-red-50 text-red-900 border-red-200',
  };

  return (
    <div
      className={`relative w-full rounded-lg border p-4 ${variants[variant]} ${className}`}
    >
      {children}
    </div>
  );
};
