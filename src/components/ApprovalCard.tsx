import { cn } from '../lib/cn';
import type { HTMLAttributes } from 'react';
export type ApprovalRisk = 'low' | 'medium' | 'high';

export type ApprovalCardProps = HTMLAttributes<HTMLDivElement> & {
  title: string;
  description?: string;
  action: string;
  reasoning?: string;
  risk?: ApprovalRisk;
  onApprove: () => void;
  onReject: () => void;
  loading?: boolean;
};

// Component-private palette — not part of the public token surface in v1.
const riskConfig = {
  low: { label: 'Low risk', color: 'var(--color-success)', bg: 'var(--color-success-muted)' },
  medium: { label: 'Medium risk', color: 'var(--color-warning)', bg: 'var(--color-warning-muted)' },
  high: { label: 'High risk', color: 'var(--color-error)', bg: 'var(--color-error-muted)' },
};

function ShieldIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 2L2 4.5v4c0 3 2.5 5.5 6 6 3.5-.5 6-3 6-6v-4L8 2z" />
    </svg>
  );
}

export function ApprovalCard({
  title,
  description,
  action,
  reasoning,
  risk = 'medium',
  onApprove,
  onReject,
  loading = false,
  className,
  style,
  ...props
}: ApprovalCardProps) {
  const rc = riskConfig[risk];

  return (
    <div
      {...props}
      aria-busy={loading || undefined}
      className={cn('overflow-hidden rounded-md border border-border bg-background-elevated shadow-card', className)}
      style={style}
    >
      <div className="flex items-center justify-between gap-[12px] border-b border-border bg-background-subtle px-[16px] py-[14px]">
        <div className="flex min-w-[0] items-center gap-[8px]">
          <span className="flex" style={{ color: rc.color }}><ShieldIcon /></span>
          <span className="truncate text-sm font-semibold text-foreground">
            {title}
          </span>
        </div>
        <span
          className="shrink-0 rounded-sm px-[8px] py-[3px] text-[0.6875rem] font-semibold leading-none"
          style={{
            color: rc.color,
            background: rc.bg,
          }}
        >
          {rc.label}
        </span>
      </div>

      <div className="flex flex-col gap-[14px] p-[16px]">
        {description && (
          <p className="m-0 text-sm leading-[1.55] text-foreground-muted">
            {description}
          </p>
        )}

        <div className="rounded-md border border-border bg-background px-[12px] py-[10px]">
          <span className="mb-[6px] block text-[0.6875rem] font-semibold uppercase tracking-[0.08em] text-foreground-subtle">
            Proposed action
          </span>
          <code className="whitespace-pre-wrap break-words font-mono text-[0.8125rem] text-foreground">
            {action}
          </code>
        </div>

        {reasoning && (
          <div className="rounded-md border border-border bg-background-subtle px-[12px] py-[10px]">
            <span className="mb-[4px] block text-[0.6875rem] font-semibold uppercase tracking-[0.08em] text-foreground-subtle">
              Agent reasoning
            </span>
            <p className="m-0 text-[0.8125rem] italic leading-[1.55] text-foreground-muted">
              {reasoning}
            </p>
          </div>
        )}

        <div className="mt-[2px] flex gap-[8px]">
          <button
            type="button"
            onClick={onApprove}
            disabled={loading}
            className="flex-1 cursor-pointer rounded-md border border-transparent bg-accent px-[16px] py-[9px] text-sm font-semibold text-accent-foreground opacity-100 shadow-none outline-none transition-[background,opacity] duration-150 hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            {loading ? 'Processing…' : 'Approve'}
          </button>
          <button
            type="button"
            onClick={onReject}
            disabled={loading}
            className="flex-1 cursor-pointer rounded-md border border-border bg-surface-control px-[16px] py-[9px] text-sm font-medium text-foreground-muted shadow-highlight-inset outline-none hover:bg-surface-hover hover:text-foreground disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            Reject
          </button>
        </div>
      </div>
    </div>
  );
}
