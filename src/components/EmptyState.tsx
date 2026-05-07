import { cn } from '../lib/cn';
import type { CSSProperties, ReactNode } from 'react';
export type EmptyStateVariant = 'default' | 'error';

export type EmptyStateProps = {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  variant?: EmptyStateVariant;
  style?: CSSProperties;
  className?: string;
};

function DefaultIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="4" width="24" height="24" rx="4" />
      <path d="M11 16h10M16 11v10" opacity="0.4" />
    </svg>
  );
}

function ErrorIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="16" cy="16" r="12" />
      <path d="M16 10v7M16 21v1" />
    </svg>
  );
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  variant = 'default',
  style,
  className,
}: EmptyStateProps) {
  const isError = variant === 'error';

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-[14px] px-[24px] py-[48px] text-center',
        className,
      )}
      style={style}
    >
      <span className={cn(isError ? 'text-error' : 'text-foreground-subtle', 'flex h-[44px] w-[44px] items-center justify-center rounded-md border border-border bg-background-subtle opacity-80 shadow-highlight-inset')}>
        {icon ?? (isError ? <ErrorIcon /> : <DefaultIcon />)}
      </span>
      <div className="flex max-w-[320px] flex-col gap-[6px]">
        <span className="text-base font-semibold leading-normal text-foreground">
          {title}
        </span>
        {description && (
          <p className="m-0 text-sm leading-[1.55] text-foreground-muted">
            {description}
          </p>
        )}
      </div>
      {action && <div className="mt-[2px]">{action}</div>}
    </div>
  );
}
