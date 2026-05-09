import { cn } from '../lib/cn';
import type { HTMLAttributes, ReactNode } from 'react';
export type AlertTone = 'neutral' | 'info' | 'success' | 'warning' | 'error';

export type AlertProps = HTMLAttributes<HTMLDivElement> & {
  tone?: AlertTone;
  title?: string;
  children: ReactNode;
  onDismiss?: () => void;
};

const neutralIcon = (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <circle cx="8" cy="8" r="6" />
    <path d="M8 7v4M8 5.5v.5" />
  </svg>
);

const alertConfig: Record<
  AlertTone,
  { iconClass: string; bgClass: string; borderClass: string; icon: ReactNode }
> = {
  neutral: {
    iconClass: 'text-foreground-muted',
    bgClass: 'bg-background-subtle',
    borderClass: 'border-border',
    icon: neutralIcon,
  },
  info: {
    iconClass: 'text-info',
    bgClass: 'bg-info-muted',
    borderClass: 'border-info-border',
    icon: neutralIcon,
  },
  success: {
    iconClass: 'text-success',
    bgClass: 'bg-success-muted',
    borderClass: 'border-success-border',
    icon: (
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="8" cy="8" r="6" />
        <path d="M5 8l2 2 4-4" />
      </svg>
    ),
  },
  warning: {
    iconClass: 'text-warning',
    bgClass: 'bg-warning-muted',
    borderClass: 'border-warning-border',
    icon: (
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 2L1 14h14L8 2z" />
        <path d="M8 7v3M8 12v.5" />
      </svg>
    ),
  },
  error: {
    iconClass: 'text-error',
    bgClass: 'bg-error-muted',
    borderClass: 'border-error-border',
    icon: (
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <circle cx="8" cy="8" r="6" />
        <path d="M6 6l4 4M10 6l-4 4" />
      </svg>
    ),
  },
};

export function Alert({ tone = 'info', title, children, onDismiss, style, className, ...props }: AlertProps) {
  const cfg = alertConfig[tone];
  const role = tone === 'warning' || tone === 'error' ? 'alert' : 'status';

  return (
    <div
      {...props}
      role={role}
      aria-atomic="true"
      className={cn('flex gap-[14px] rounded-md border px-[16px] py-[14px] shadow-highlight-inset', cfg.bgClass, cfg.borderClass, className)}
      style={style}
    >
      <span aria-hidden="true" className={cn('mt-px shrink-0', cfg.iconClass)}>
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
