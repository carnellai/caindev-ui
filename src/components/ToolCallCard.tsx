import { useId, useState } from 'react';
import type { HTMLAttributes } from 'react';
import { cn } from '../lib/cn';
import { safeJsonStringify } from '../lib/safeJsonStringify';
import { normalizeOperationStatus, type OperationStatus } from '../lib/operationStatus';

export type ToolStatus = OperationStatus;

export type ToolCallCardProps = HTMLAttributes<HTMLDivElement> & {
  name: string;
  status: ToolStatus;
  input?: Record<string, unknown>;
  output?: unknown;
  duration?: number;
  defaultOpen?: boolean;
};

const statusConfig: Record<OperationStatus, { label: string; color: string; bg: string }> = {
  idle: { label: 'Idle', color: 'var(--color-foreground-subtle)', bg: 'var(--color-background-subtle)' },
  pending: { label: 'Pending', color: 'var(--color-foreground-subtle)', bg: 'var(--color-background-subtle)' },
  running: { label: 'Running', color: 'var(--color-info)', bg: 'var(--color-info-muted)' },
  completed: { label: 'Done', color: 'var(--color-success)', bg: 'var(--color-success-muted)' },
  failed: { label: 'Failed', color: 'var(--color-error)', bg: 'var(--color-error-muted)' },
  queued: { label: 'Queued', color: 'var(--color-warning)', bg: 'var(--color-warning-muted)' },
  cancelled: { label: 'Cancelled', color: 'var(--color-neutral)', bg: 'var(--color-neutral-muted)' },
  skipped: { label: 'Skipped', color: 'var(--color-foreground-subtle)', bg: 'var(--color-background-subtle)' },
};

function WrenchIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.5 2.5a3 3 0 0 0-4 4L4 13a1 1 0 0 0 0 1.4l.6.6a1 1 0 0 0 1.4 0l6.5-6.5a3 3 0 0 0 4-4l-2 2-1.5-.5-.5-1.5 2-2z" />
    </svg>
  );
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      className="cd-tool-call-chevron transition-transform duration-150"
      width="11"
      height="11"
      viewBox="0 0 12 12"
      fill="none"
      style={{ transform: open ? 'rotate(90deg)' : 'rotate(0deg)' }}
    >
      <path d="M4 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function RunningDots() {
  return (
    <span className="inline-flex gap-0.5">
      {[0, 1, 2].map((i) => (
        <span key={i} className="cd-tool-call-dot inline-block h-[3px] w-[3px] rounded-full" />
      ))}
    </span>
  );
}

function JsonDisplay({ value }: { value: unknown }) {
  const json = safeJsonStringify(value);

  return (
    <pre className="m-0 overflow-x-auto whitespace-pre-wrap break-words rounded-sm border border-border bg-background px-[12px] py-[10px] font-mono text-xs leading-[1.6] text-foreground-muted">
      {json}
    </pre>
  );
}

export function ToolCallCard({
  name,
  status,
  input,
  output,
  duration,
  defaultOpen = false,
  className,
  style,
  ...props
}: ToolCallCardProps) {
  const [open, setOpen] = useState(defaultOpen);
  const contentId = useId();
  const normalizedStatus = normalizeOperationStatus(status);
  const cfg = statusConfig[normalizedStatus];
  const hasContent = input !== undefined || output !== undefined;

  return (
    <div
      {...props}
      className={cn('overflow-hidden rounded-md border border-border bg-background-elevated shadow-card', className)}
      style={style}
    >
      <button
        type="button"
        aria-expanded={hasContent ? open : undefined}
        aria-controls={hasContent ? contentId : undefined}
        disabled={!hasContent}
        onClick={() => hasContent && setOpen((o) => !o)}
        className={cn('flex w-full items-center gap-[8px] border-0 bg-background-elevated px-[14px] py-[12px] text-left outline-none transition-[background] duration-[120ms] hover:bg-surface-hover focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent', hasContent ? 'cursor-pointer' : 'cursor-default')}
      >
        {hasContent && <ChevronIcon open={open} />}
        <span className="flex text-foreground-muted">
          <WrenchIcon />
        </span>
        <span className="font-mono text-[0.8125rem] font-medium text-foreground">
          {name}
        </span>

        <span className="ml-auto flex items-center gap-[8px]">
          {normalizedStatus === 'running' && <RunningDots />}
          <span
            className="rounded-sm px-[7px] py-[3px] text-[0.6875rem] font-semibold leading-none"
            style={{
              color: cfg.color,
              background: cfg.bg,
            }}
          >
            {cfg.label}
          </span>
          {duration !== undefined && (
            <span className="text-[0.6875rem] text-foreground-subtle tabular-nums">
              {duration}ms
            </span>
          )}
        </span>
      </button>

      {open && (
        <div
          id={contentId}
          className="flex flex-col gap-[12px] border-t border-border bg-background-subtle p-[14px]"
        >
          {input !== undefined && (
            <div>
              <span className="mb-[6px] block text-[0.6875rem] font-semibold uppercase tracking-[0.08em] text-foreground-subtle">
                Input
              </span>
              <JsonDisplay value={input} />
            </div>
          )}
          {output !== undefined && (
            <div>
              <span className="mb-[6px] block text-[0.6875rem] font-semibold uppercase tracking-[0.08em] text-foreground-subtle">
                Output
              </span>
              <JsonDisplay value={output} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
