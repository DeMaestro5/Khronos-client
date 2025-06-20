import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none',
  {
    variants: {
      variant: {
        default:
          'bg-slate-900 dark:bg-slate-100 text-slate-50 dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-200 rounded-md disabled:opacity-50 shadow-sm hover:shadow-md',
        destructive:
          'bg-red-500 dark:bg-red-600 text-white hover:bg-red-600 dark:hover:bg-red-700 rounded-md disabled:opacity-50 shadow-sm hover:shadow-md',
        outline:
          'border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-md disabled:opacity-50 shadow-sm hover:shadow-md',
        secondary:
          'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-md disabled:opacity-50 shadow-sm hover:shadow-md',
        ghost:
          'text-slate-900 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md disabled:opacity-50',
        link: 'underline-offset-4 hover:underline text-slate-900 dark:text-slate-100 disabled:opacity-50 cursor-pointer',
        unstyled: '',
        gradient:
          'bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 dark:from-blue-600 dark:via-indigo-600 dark:to-blue-700 hover:from-indigo-700 hover:via-purple-700 hover:to-indigo-700 dark:hover:from-blue-500 dark:hover:via-indigo-500 dark:hover:to-blue-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl dark:shadow-indigo-900/20 dark:hover:shadow-indigo-900/40 transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none',
      },
      size: {
        default: 'h-10 py-2 px-4',
        sm: 'h-9 px-3',
        lg: 'h-11 px-8',
        xl: 'h-12 px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size }), className)}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
