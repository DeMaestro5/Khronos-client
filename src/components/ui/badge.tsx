import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const badgeVariants = cva(
  'inline-flex items-center gap-1.5 font-medium transition-colors duration-200 border select-none',
  {
    variants: {
      variant: {
        // Theme-first defaults
        default:
          'bg-theme-primary/10 text-theme-primary border-theme-primary/20',
        secondary: 'bg-theme-secondary text-theme-primary border-transparent',
        outline: 'bg-transparent text-theme-primary border-theme-tertiary',
        ghost:
          'bg-transparent text-theme-primary border-transparent hover:bg-theme-hover',

        // Semantic statuses
        success:
          'bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20',
        info: 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20',
        warning:
          'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20',
        destructive:
          'bg-accent-error/10 text-accent-error border-accent-error/20',
        neutral:
          'bg-slate-500/10 text-slate-700 dark:text-slate-300 border-slate-500/20',
      },
      size: {
        sm: 'text-[11px] px-2 py-0.5',
        md: 'text-xs px-2.5 py-1',
        lg: 'text-sm px-3 py-1.5',
      },
      shape: {
        rounded: 'rounded-md',
        pill: 'rounded-full',
      },
      elevated: {
        true: 'shadow-theme-sm',
        false: '',
      },
      interactive: {
        true: 'cursor-pointer hover:opacity-90',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
      shape: 'pill',
      elevated: false,
      interactive: false,
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  withDot?: boolean;
  dotColorClassName?: string; // override dot color if needed
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      className,
      variant,
      size,
      shape,
      elevated,
      interactive,
      withDot = false,
      dotColorClassName,
      leadingIcon,
      trailingIcon,
      children,
      ...props
    },
    ref
  ) => {
    // Dot color defaults to match variant intent
    const dotClassByVariant: Record<NonNullable<typeof variant>, string> = {
      default: 'bg-theme-primary',
      secondary: 'bg-theme-primary',
      outline: 'bg-theme-primary',
      ghost: 'bg-theme-primary',
      success: 'bg-green-500',
      info: 'bg-blue-500',
      warning: 'bg-amber-500',
      destructive: 'bg-accent-error',
      neutral: 'bg-slate-500',
    };

    const resolvedDot =
      dotColorClassName ||
      dotClassByVariant[
        (variant || 'default') as keyof typeof dotClassByVariant
      ];

    return (
      <span
        ref={ref}
        className={cn(
          badgeVariants({ variant, size, shape, elevated, interactive }),
          className
        )}
        {...props}
      >
        {withDot && (
          <span
            aria-hidden
            className={cn('h-1.5 w-1.5 rounded-full', resolvedDot)}
          />
        )}
        {leadingIcon ? <span className='-ml-0.5'>{leadingIcon}</span> : null}
        <span>{children}</span>
        {trailingIcon ? <span className='-mr-0.5'>{trailingIcon}</span> : null}
      </span>
    );
  }
);
Badge.displayName = 'Badge';

export { badgeVariants };
