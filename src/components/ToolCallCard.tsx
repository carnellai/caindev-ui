import { useId, useState } from 'react';

export type ToolStatus = 'pending' | 'running' | 'success' | 'error';

export type ToolCallCardProps = {
  name: string;
  status: ToolStatus;
  input?: Record<string, unknown>;
  output?: unknown;
  duration?: number;
  defaultOpen?: boolean;
  className?: string;
  style?: React.CSSProperties;
};

const statusConfig: Record<ToolStatus, { label: string; color: string; bg: string }> = {
  pending: { label: 'Pending', color: 'var(--color-foreground-subtle)', bg: 'var(--color-background-subtle)' },
  running: { label: 'Running', color: 'var(--color-info)', bg: 'var(--color-info-muted)' },
  success: { label: 'Done', color: 'var(--color-success)', bg: 'var(--color-success-muted)' },
  error: { label: 'Error', color: 'var(--color-error)', bg: 'var(--color-error-muted)' },
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
    <pre className="m-0 overflow-x-auto whitespace-pre-wrap break-words rounded-sm border border-border bg-background px-3 py-2.5 font-mono text-xs leading-[1.55] text-foreground-muted">
      {json}
    </pre>
  );
}

function safeJsonStringify(value: unknown) {
  const seen = new WeakSet<object>();

  try {
    const json = JSON.stringify(value, (_key, nestedValue) => {
      if (typeof nestedValue === 'bigint') return `${nestedValue.toString()}n`;
      if (typeof nestedValue === 'function') return '[Function]';
      if (typeof nestedValue === 'symbol') return nestedValue.toString();
      if (typeof nestedValue === 'object' && nestedValue !== null) {
        if (seen.has(nestedValue)) return '[Circular]';
        seen.add(nestedValue);
      }
      return nestedValue;
    }, 2);

    return json ?? String(value);
  } catch {
    return String(value);
  }
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
}: ToolCallCardProps) {
  const [open, setOpen] = useState(defaultOpen);
  const contentId = useId();
  const cfg = statusConfig[status];
  const hasContent = input !== undefined || output !== undefined;

  return (
    <div
      className={['overflow-hidden rounded-[8px] border border-border bg-background-elevated', className].filter(Boolean).join(' ')}
      style={style}
    >
      <button
        type="button"
        aria-expanded={hasContent ? open : undefined}
        aria-controls={hasContent ? contentId : undefined}
        disabled={!hasContent}
        onClick={() => hasContent && setOpen((o) => !o)}
        className={['flex w-full items-center gap-2 border-0 bg-transparent px-3 py-2.5 text-left', hasContent ? 'cursor-pointer' : 'cursor-default'].join(' ')}
      >
        {hasContent && <ChevronIcon open={open} />}
        <span className="flex text-foreground-muted">
          <WrenchIcon />
        </span>
        <span className="font-mono text-[0.8125rem] font-medium text-foreground">
          {name}
        </span>

        <span className="ml-auto flex items-center gap-1.5">
          {status === 'running' && <RunningDots />}
          <span
            className="rounded-[4px] px-[7px] py-0.5 text-[0.6875rem] font-medium"
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
          className="flex flex-col gap-2.5 border-t border-border p-3"
        >
          {input !== undefined && (
            <div>
              <span className="mb-1.5 block text-[0.6875rem] font-semibold uppercase tracking-[0.08em] text-foreground-subtle">
                Input
              </span>
              <JsonDisplay value={input} />
            </div>
          )}
          {output !== undefined && (
            <div>
              <span className="mb-1.5 block text-[0.6875rem] font-semibold uppercase tracking-[0.08em] text-foreground-subtle">
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
