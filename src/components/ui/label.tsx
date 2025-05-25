import React from 'react';

interface LabelProps {
  children: React.ReactNode;
  htmlFor: string;
  className?: string;
}

const Label = ({ children, htmlFor, className = '' }: LabelProps) => {
  return (
    <label
      htmlFor={htmlFor}
      className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-slate-900 ${className}`}
    >
      {children}
    </label>
  );
};

export default Label;
