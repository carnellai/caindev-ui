import { cn } from '../lib/cn';
import type { HTMLAttributes } from 'react';
export type BadgeVariant =
  | 'default'
  | 'success'
  | 'warning'
  | 'error'
  | 'info'
  | 'outline';
export type BadgeSize = 'sm' | 'md';

export type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: BadgeVariant;
  size?: BadgeSize;
};

const variantClasses: Record<BadgeVariant, string> = {
  default: 'border border-border bg-background-subtle text-foreground',
  success: 'border border-success-border bg-success-muted text-success',
  warning: 'border border-warning-border bg-warning-muted text-warning',
  error: 'border border-error-border bg-error-muted text-error',
  info: 'border border-info-border bg-info-muted text-info',
  outline: 'border border-border bg-surface-control text-foreground-muted',
};

const sizeClasses: Record<BadgeSize, string> = {
  sm: 'gap-[4px] rounded-sm px-[8px] py-[2px] text-[0.6875rem]',
  md: 'gap-[6px] rounded-sm px-[10px] py-[4px] text-xs',
};

export function Badge({
  children,
  variant = 'default',
  size = 'md',
  style,
  className,
  ...props
}: BadgeProps) {
  return (
    <span
      {...props}
      className={cn(
        'inline-flex items-center whitespace-nowrap font-semibold leading-none',
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      style={style}
    >
      {children}
    </span>
  );
}
