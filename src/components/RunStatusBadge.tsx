export type RunStatus = 'running' | 'completed' | 'failed' | 'error' | 'queued' | 'cancelled';
export type RunStatusBadgeSize = 'sm' | 'md';

export type RunStatusBadgeProps = {
  status: RunStatus;
  size?: RunStatusBadgeSize;
  style?: React.CSSProperties;
  className?: string;
};

const runConfig: Record<RunStatus, { label: string; color: string; bg: string; pulse?: boolean }> = {
  running: { label: 'Running', color: '#a78bfa', bg: 'rgba(167,139,250,0.12)', pulse: true },
  completed: { label: 'Completed', color: '#34d399', bg: 'rgba(52,211,153,0.12)' },
  failed: { label: 'Failed', color: '#f87171', bg: 'rgba(248,113,113,0.12)' },
  error: { label: 'Error', color: '#f87171', bg: 'rgba(248,113,113,0.12)' },
  queued: { label: 'Queued', color: '#fbbf24', bg: 'rgba(251,191,36,0.12)' },
  cancelled: { label: 'Cancelled', color: '#94a3b8', bg: 'rgba(148,163,184,0.1)' },
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
