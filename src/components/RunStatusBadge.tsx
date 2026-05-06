export type RunStatus = 'running' | 'completed' | 'failed' | 'error' | 'queued' | 'cancelled';
export type RunStatusBadgeSize = 'sm' | 'md';

export type RunStatusBadgeProps = {
  status: RunStatus;
  size?: RunStatusBadgeSize;
  style?: React.CSSProperties;
  className?: string;
};

const runConfig: Record<RunStatus, { label: string; color: string; bg: string; pulse?: boolean }> = {
  running: { label: 'Running', color: 'var(--color-info)', bg: 'var(--color-info-muted)', pulse: true },
  completed: { label: 'Completed', color: 'var(--color-success)', bg: 'var(--color-success-muted)' },
  failed: { label: 'Failed', color: 'var(--color-error)', bg: 'var(--color-error-muted)' },
  error: { label: 'Error', color: 'var(--color-error)', bg: 'var(--color-error-muted)' },
  queued: { label: 'Queued', color: 'var(--color-warning)', bg: 'var(--color-warning-muted)' },
  cancelled: { label: 'Cancelled', color: 'var(--color-neutral)', bg: 'var(--color-neutral-muted)' },
};

export function RunStatusBadge({ status, size = 'md', style, className }: RunStatusBadgeProps) {
  const cfg = runConfig[status];
  const isSmall = size === 'sm';

  return (
    <span
      className={[
        'inline-flex items-center gap-[5px] whitespace-nowrap rounded-[4px] font-semibold tracking-[0.04em]',
        isSmall ? 'px-1.5 py-0.5 text-[0.625rem]' : 'px-[9px] py-[3px] text-[0.6875rem]',
        className,
      ].filter(Boolean).join(' ')}
      style={{
        background: cfg.bg,
        color: cfg.color,
        ...style,
      }}
    >
      <span
        className={['cd-run-status-dot shrink-0 rounded-full', isSmall ? 'h-[5px] w-[5px]' : 'h-1.5 w-1.5', cfg.pulse ? 'cd-run-status-dot-pulse' : ''].filter(Boolean).join(' ')}
        style={{
          background: cfg.color,
        }}
      />
      {cfg.label}
    </span>
  );
}
