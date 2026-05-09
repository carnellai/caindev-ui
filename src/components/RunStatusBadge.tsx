import { cn } from '../lib/cn';
import type { HTMLAttributes } from 'react';
export type RunStatus = 'running' | 'completed' | 'failed' | 'queued' | 'cancelled';
export type RunStatusBadgeSize = 'sm' | 'md';

export type RunStatusBadgeProps = HTMLAttributes<HTMLSpanElement> & {
  status: RunStatus;
  size?: RunStatusBadgeSize;
};

const runConfig: Record<RunStatus, { label: string; color: string; bg: string; pulse?: boolean }> = {
  running: { label: 'Running', color: 'var(--color-info)', bg: 'var(--color-info-muted)', pulse: true },
  completed: { label: 'Completed', color: 'var(--color-success)', bg: 'var(--color-success-muted)' },
  failed: { label: 'Failed', color: 'var(--color-error)', bg: 'var(--color-error-muted)' },
  queued: { label: 'Queued', color: 'var(--color-warning)', bg: 'var(--color-warning-muted)' },
  cancelled: { label: 'Cancelled', color: 'var(--color-neutral)', bg: 'var(--color-neutral-muted)' },
};

function normalizeRunStatus(status: RunStatus | 'error'): RunStatus {
  // Legacy compatibility: normalize historical "error" values to canonical "failed".
  if (status === 'error') return 'failed';
  return status;
}

export function RunStatusBadge({ status, size = 'md', style, className, ...props }: RunStatusBadgeProps) {
  const cfg = runConfig[normalizeRunStatus(status)];
  const isSmall = size === 'sm';

  return (
    <span
      {...props}
      className={cn(
        'inline-flex items-center gap-[5px] whitespace-nowrap rounded-sm font-semibold tracking-[0.04em]',
        isSmall ? 'px-1.5 py-0.5 text-[0.625rem]' : 'px-[9px] py-[3px] text-[0.6875rem]',
        className,
      )}
      style={{
        background: cfg.bg,
        color: cfg.color,
        ...style,
      }}
    >
      <span
        className={cn('cd-run-status-dot shrink-0 rounded-full', isSmall ? 'h-[5px] w-[5px]' : 'h-1.5 w-1.5', cfg.pulse ? 'cd-run-status-dot-pulse' : '')}
        style={{
          background: cfg.color,
        }}
      />
      {cfg.label}
    </span>
  );
}
