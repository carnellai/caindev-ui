import { cn } from '../lib/cn';
import type { CSSProperties, ReactNode } from 'react';
export type BadgeVariant =
  | 'default'
  | 'success'
  | 'warning'
  | 'error'
  | 'info'
  | 'outline';
export type BadgeSize = 'sm' | 'md';

export type BadgeProps = {
  children: ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  style?: CSSProperties;
  className?: string;
};

const variantClasses: Partial<Record<BadgeVariant, string>> = {
  default: 'border border-border bg-background-subtle text-foreground-muted',
  success: 'border border-success-border bg-success-muted text-success',
  warning: 'border border-warning-border bg-warning-muted text-warning',
  error: 'border border-error-border bg-error-muted text-error',
  info: 'border border-info-border bg-info-muted text-info',
  outline: 'border border-border-strong bg-transparent text-foreground-muted',
};

const sizeClasses: Record<BadgeSize, string> = {
  sm: 'gap-1 rounded-sm px-1.5 py-px text-[0.625rem]',
  md: 'gap-1 rounded-sm px-2 py-0.5 text-[0.6875rem]',
};

export function Badge({
  children,
  variant = 'default',
  size = 'md',
  style,
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center whitespace-nowrap font-medium tracking-[0.02em]',
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
