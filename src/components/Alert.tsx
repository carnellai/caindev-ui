import { cn } from '../lib/cn';
import type { CSSProperties, ReactNode } from 'react';
export type AlertVariant = 'info' | 'success' | 'warning' | 'error';

export type AlertProps = {
  variant?: AlertVariant;
  title?: string;
  children: ReactNode;
  onDismiss?: () => void;
  style?: CSSProperties;
  className?: string;
};

const alertConfig: Record<
  AlertVariant,
  { color: string; bg: string; border: string; icon: ReactNode }
> = {
  info: {
    color: 'var(--color-info)',
    bg: 'var(--color-info-muted)',
    border: 'var(--color-info-border)',
    icon: (
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <circle cx="8" cy="8" r="6" />
        <path d="M8 7v4M8 5.5v.5" />
      </svg>
    ),
  },
  success: {
    color: 'var(--color-success)',
    bg: 'var(--color-success-muted)',
    border: 'var(--color-success-border)',
    icon: (
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="8" cy="8" r="6" />
        <path d="M5 8l2 2 4-4" />
      </svg>
    ),
  },
  warning: {
    color: 'var(--color-warning)',
    bg: 'var(--color-warning-muted)',
    border: 'var(--color-warning-border)',
    icon: (
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 2L1 14h14L8 2z" />
        <path d="M8 7v3M8 12v.5" />
      </svg>
    ),
  },
  error: {
    color: 'var(--color-error)',
    bg: 'var(--color-error-muted)',
    border: 'var(--color-error-border)',
    icon: (
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <circle cx="8" cy="8" r="6" />
        <path d="M6 6l4 4M10 6l-4 4" />
      </svg>
    ),
  },
};

export function Alert({ variant = 'info', title, children, onDismiss, style, className }: AlertProps) {
  const cfg = alertConfig[variant];
  const role = variant === 'warning' || variant === 'error' ? 'alert' : 'status';

  return (
    <div
      className={cn('flex gap-[14px] rounded-md px-[16px] py-[14px] shadow-highlight-inset', className)}
      role={role}
      aria-atomic="true"
      style={{
        border: `1px solid ${cfg.border}`,
        background: cfg.bg,
        ...style,
      }}
    >
      <span aria-hidden="true" className="mt-px shrink-0" style={{ color: cfg.color }}>
        {cfg.icon}
      </span>
      <div className="flex flex-1 flex-col gap-[4px]">
        {title && (
          <span className="text-sm font-semibold leading-normal text-foreground">
            {title}
          </span>
        )}
        <div className="cd-alert-content text-sm leading-[1.55] text-foreground-muted">
          {children}
        </div>
      </div>
      {onDismiss && (
        <button
          type="button"
          aria-label="Dismiss alert"
          onClick={onDismiss}
          className="flex h-[24px] w-[24px] shrink-0 cursor-pointer items-center justify-center rounded-sm border-0 bg-transparent p-[0px] text-foreground-subtle outline-none hover:bg-surface-hover hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <path d="M3 3l8 8M11 3l-8 8" />
          </svg>
        </button>
      )}
    </div>
  );
}
