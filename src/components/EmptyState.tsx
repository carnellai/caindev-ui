export type EmptyStateVariant = 'default' | 'error';

export type EmptyStateProps = {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  variant?: EmptyStateVariant;
  style?: React.CSSProperties;
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
      className={[
        'flex flex-col items-center justify-center gap-3 px-6 py-12 text-center',
        className,
      ].filter(Boolean).join(' ')}
      style={style}
    >
      <span className={[isError ? 'text-red-400' : 'text-foreground-subtle', 'opacity-60'].join(' ')}>
        {icon ?? (isError ? <ErrorIcon /> : <DefaultIcon />)}
      </span>
      <div className="flex flex-col gap-1.5">
        <span className="text-[0.9375rem] font-semibold text-foreground">
          {title}
        </span>
        {description && (
          <p className="m-0 max-w-xs text-sm leading-[1.55] text-foreground-muted">
            {description}
          </p>
        )}
      </div>
      {action && <div className="mt-1">{action}</div>}
    </div>
  );
}
