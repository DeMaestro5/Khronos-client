import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none',
  {
    variants: {
      variant: {
        default:
          'bg-theme-primary text-theme-inverse hover:bg-theme-secondary rounded-md disabled:opacity-50 shadow-theme-sm hover:shadow-theme-md',
        destructive:
          'bg-accent-error text-white hover:bg-accent-error/90 rounded-md disabled:opacity-50 shadow-theme-sm hover:shadow-theme-md',
        outline:
          'border border-theme-primary bg-theme-card text-theme-primary hover:bg-theme-hover rounded-md disabled:opacity-50 shadow-theme-sm hover:shadow-theme-md',
        secondary:
          'bg-theme-secondary text-theme-primary hover:bg-theme-hover rounded-md disabled:opacity-50 shadow-theme-sm hover:shadow-theme-md',
        ghost:
          'text-theme-primary hover:bg-theme-hover rounded-md disabled:opacity-50',
        link: 'underline-offset-4 hover:underline text-theme-primary disabled:opacity-50 cursor-pointer',
        unstyled: '',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
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
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
