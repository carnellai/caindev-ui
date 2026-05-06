export type AlertVariant = 'info' | 'success' | 'warning' | 'error';

export type AlertProps = {
  variant?: AlertVariant;
  title?: string;
  children: React.ReactNode;
  onDismiss?: () => void;
  style?: React.CSSProperties;
  className?: string;
};

const alertConfig: Record<
  AlertVariant,
  { color: string; bg: string; border: string; icon: React.ReactNode }
> = {
  info: {
    color: '#a78bfa',
    bg: 'rgba(167,139,250,0.08)',
    border: 'rgba(167,139,250,0.2)',
    icon: (
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <circle cx="8" cy="8" r="6" />
        <path d="M8 7v4M8 5.5v.5" />
      </svg>
    ),
  },
  success: {
    color: '#34d399',
    bg: 'rgba(52,211,153,0.08)',
    border: 'rgba(52,211,153,0.2)',
    icon: (
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="8" cy="8" r="6" />
        <path d="M5 8l2 2 4-4" />
      </svg>
    ),
  },
  warning: {
    color: '#fbbf24',
    bg: 'rgba(251,191,36,0.08)',
    border: 'rgba(251,191,36,0.2)',
    icon: (
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 2L1 14h14L8 2z" />
        <path d="M8 7v3M8 12v.5" />
      </svg>
    ),
  },
  error: {
    color: '#f87171',
    bg: 'rgba(248,113,113,0.08)',
    border: 'rgba(248,113,113,0.2)',
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
      className={['flex gap-3 rounded-[8px] px-3.5 py-3', className].filter(Boolean).join(' ')}
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
      <div className="flex flex-1 flex-col gap-[3px]">
        {title && (
          <span className="text-sm font-semibold text-foreground">
            {title}
          </span>
        )}
        <div className="text-sm leading-[1.55] text-foreground-muted">
          {children}
        </div>
      </div>
      {onDismiss && (
        <button
          type="button"
          aria-label="Dismiss alert"
          onClick={onDismiss}
          className="flex shrink-0 cursor-pointer items-start border-0 bg-transparent p-0 text-foreground-subtle"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <path d="M3 3l8 8M11 3l-8 8" />
          </svg>
        </button>
      )}
    </div>
  );
}
