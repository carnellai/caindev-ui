import { useId, useState } from 'react';
import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../lib/cn';
import { safeJsonStringify } from '../lib/safeJsonStringify';
import { normalizeOperationStatus, type OperationStatus } from '../lib/operationStatus';

export type SpanKind = 'llm' | 'tool' | 'retrieval' | 'agent' | 'span' | 'embedding' | 'guardrail';
export type SpanStatus = OperationStatus;

export type SpanNode = {
  id: string;
  name: string;
  /** Controls the span badge treatment. */
  kind: SpanKind;
  /** Controls the status dot color. */
  status: SpanStatus;
  /** Duration displayed in milliseconds. */
  duration?: number;
  /** Model name shown in the span summary and details. */
  model?: string;
  inputTokens?: number;
  outputTokens?: number;
  /** Cost in dollars. */
  cost?: number;
  /** Retrieval query shown in the span details. */
  query?: string;
  resultCount?: number;
  /** JSON-like value rendered in the details panel. */
  input?: unknown;
  /** JSON-like value rendered in the details panel. */
  output?: unknown;
  /** Nested child spans rendered under this span. */
  children?: SpanNode[];
};

// Component-private palette — not part of the public token surface in v1.
const kindConfig: Record<SpanKind, { label: string; color: string; bg: string; icon: ReactNode }> = {
  llm: {
    label: 'LLM',
    color: 'var(--color-info)',
    bg: 'var(--color-info-muted)',
    icon: (
      <svg width="11" height="11" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <path d="M2 4h12M2 8h8M2 12h6" />
      </svg>
    ),
  },
  tool: {
    label: 'TOOL',
    color: 'var(--color-success)',
    bg: 'var(--color-success-muted)',
    icon: (
      <svg width="11" height="11" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.5 2.5a3 3 0 0 0-4 4L4 13a1 1 0 0 0 0 1.4l.6.6a1 1 0 0 0 1.4 0l6.5-6.5a3 3 0 0 0 4-4l-2 2-1.5-.5-.5-1.5 2-2z" />
      </svg>
    ),
  },
  retrieval: {
    label: 'RETRIEVAL',
    color: 'var(--color-warning)',
    bg: 'var(--color-warning-muted)',
    icon: (
      <svg width="11" height="11" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="7" cy="7" r="5" />
        <path d="M11 11l3 3" />
      </svg>
    ),
  },
  agent: {
    label: 'AGENT',
    color: 'var(--cd-trace-agent-color)',
    bg: 'var(--cd-trace-agent-bg)',
    icon: (
      <svg width="11" height="11" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="8" cy="6" r="3" />
        <path d="M2 14c0-3.3 2.7-6 6-6s6 2.7 6 6" />
      </svg>
    ),
  },
  span: {
    label: 'SPAN',
    color: 'var(--color-neutral)',
    bg: 'var(--color-neutral-muted)',
    icon: (
      <svg width="11" height="11" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <rect x="2" y="2" width="12" height="12" rx="2" />
      </svg>
    ),
  },
  embedding: {
    label: 'EMBED',
    color: 'var(--cd-trace-embed-color)',
    bg: 'var(--cd-trace-embed-bg)',
    icon: (
      <svg width="11" height="11" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <path d="M2 8h12M8 2v12" />
      </svg>
    ),
  },
  guardrail: {
    label: 'GUARD',
    color: 'var(--cd-trace-guard-color)',
    bg: 'var(--cd-trace-guard-bg)',
    icon: (
      <svg width="11" height="11" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 2L2 4.5v4c0 3 2.5 5.5 6 6 3.5-.5 6-3 6-6v-4L8 2z" />
      </svg>
    ),
  },
};

const statusDot: Record<OperationStatus, string> = {
  idle: 'var(--color-foreground-subtle)',
  pending: 'var(--color-foreground-subtle)',
  running: 'var(--color-info)',
  completed: 'var(--color-success)',
  failed: 'var(--color-error)',
  queued: 'var(--color-warning)',
  cancelled: 'var(--color-neutral)',
  skipped: 'var(--color-neutral)',
};

function JsonBlock({ value }: { value: unknown }) {
  const json = safeJsonStringify(value);

  return (
    <pre className="m-0 overflow-x-auto whitespace-pre-wrap break-words rounded-sm border border-border bg-background px-[10px] py-[8px] font-mono text-[0.6875rem] leading-[1.6] text-foreground-muted">
      {json}
    </pre>
  );
}

function MetaRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex items-center gap-[8px]">
      <span className="min-w-[80px] text-[0.6875rem] text-foreground-subtle">
        {label}
      </span>
      <span className="font-mono text-xs text-foreground-muted">
        {value}
      </span>
    </div>
  );
}

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <span className="mb-[4px] block text-[0.625rem] font-semibold uppercase tracking-[0.08em] text-foreground-subtle">
      {children}
    </span>
  );
}

export type SpanCardProps = HTMLAttributes<HTMLDivElement> & {
  span: SpanNode;
  defaultOpen?: boolean;
};

export function SpanCard({ span, defaultOpen = false, className, style, ...props }: SpanCardProps) {
  const [open, setOpen] = useState(defaultOpen);
  const detailId = useId();
  const cfg = kindConfig[span.kind];
  const normalizedStatus = normalizeOperationStatus(span.status);
  const hasTokenDetails = span.inputTokens !== undefined || span.outputTokens !== undefined;
  const hasModelDetails = span.model !== undefined || hasTokenDetails || span.cost !== undefined;
  const hasDetails = span.input !== undefined || span.output !== undefined || span.model !== undefined || span.query !== undefined || hasModelDetails;

  return (
    <div
      {...props}
      className={cn('overflow-hidden rounded-md border border-border bg-background-elevated shadow-card', className)}
      style={style}
    >
      <button
        type="button"
        aria-label={hasDetails ? `${open ? 'Collapse' : 'Expand'} ${span.name} details` : `${span.name} span`}
        aria-expanded={hasDetails ? open : undefined}
        aria-controls={hasDetails ? detailId : undefined}
        disabled={!hasDetails}
        onClick={() => hasDetails && setOpen((o) => !o)}
        className={cn('flex w-full items-center gap-[8px] border-0 bg-background-elevated px-[12px] py-[10px] text-left outline-none transition-[background] duration-[120ms] hover:bg-surface-hover focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent', hasDetails ? 'cursor-pointer' : 'cursor-default')}
      >
        {hasDetails && (
          <svg
            className="shrink-0 text-foreground-subtle transition-transform duration-150"
            width="10"
            height="10"
            viewBox="0 0 12 12"
            fill="none"
            style={{ transform: open ? 'rotate(90deg)' : 'none' }}
          >
            <path d="M4 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
        {!hasDetails && <span className="w-[10px] shrink-0" />}

        <span className="h-[7px] w-[7px] shrink-0 rounded-full" style={{ background: statusDot[normalizedStatus] }} />

        <span
          className="flex shrink-0 items-center gap-[4px] rounded-sm px-[6px] py-[2px] text-[0.625rem] font-bold leading-none tracking-[0.08em]"
          style={{
            color: cfg.color,
            background: cfg.bg,
          }}
        >
          <span style={{ color: cfg.color }}>{cfg.icon}</span>
          {cfg.label}
        </span>

        <span className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap font-mono text-[0.8125rem] font-medium text-foreground">
          {span.name}
        </span>

        <div className="flex min-w-0 shrink items-center justify-end gap-[10px]">
          {span.model && (
            <span className="max-w-[220px] truncate text-[0.6875rem] text-foreground-subtle">
              {span.model}
            </span>
          )}
          {hasTokenDetails && (
            <span className="whitespace-nowrap font-mono text-[0.6875rem] text-foreground-subtle">
              {(span.inputTokens ?? 0) + (span.outputTokens ?? 0)} tok
            </span>
          )}
          {span.cost !== undefined && (
            <span className="whitespace-nowrap font-mono text-[0.6875rem] text-foreground-subtle">
              ${span.cost.toFixed(4)}
            </span>
          )}
          {span.duration !== undefined && (
            <span className="whitespace-nowrap font-mono text-[0.6875rem] text-foreground-subtle tabular-nums">
              {span.duration}ms
            </span>
          )}
        </div>
      </button>

      {open && (
        <div
          id={detailId}
          className="flex flex-col gap-[12px] border-t border-border bg-background-subtle px-[14px] py-[12px]"
        >
          {hasModelDetails && (
            <div className="flex flex-col gap-[4px]">
              <SectionLabel>Model</SectionLabel>
              {span.model && <MetaRow label="model" value={span.model} />}
              {span.inputTokens !== undefined && <MetaRow label="input tokens" value={span.inputTokens.toLocaleString()} />}
              {span.outputTokens !== undefined && <MetaRow label="output tokens" value={span.outputTokens.toLocaleString()} />}
              {span.cost !== undefined && <MetaRow label="cost" value={`$${span.cost.toFixed(6)}`} />}
            </div>
          )}

          {span.query && (
            <div>
              <SectionLabel>Query</SectionLabel>
              <p className="m-0 text-[0.8125rem] italic leading-[1.55] text-foreground-muted">
                "{span.query}"
              </p>
              {span.resultCount !== undefined && (
                <p className="m-0 mt-1 text-xs text-foreground-subtle">
                  {span.resultCount} results returned
                </p>
              )}
            </div>
          )}

          {span.input !== undefined && (
            <div>
              <SectionLabel>Input</SectionLabel>
              <JsonBlock value={span.input} />
            </div>
          )}

          {span.output !== undefined && (
            <div>
              <SectionLabel>Output</SectionLabel>
              <JsonBlock value={span.output} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export type TraceTreeProps = HTMLAttributes<HTMLDivElement> & {
  /** Root spans for the trace tree. Child spans come from SpanNode.children. */
  spans: SpanNode[];
  traceName?: string;
  traceId?: string;
  /** Total trace duration displayed in milliseconds. */
  totalDuration?: number;
  /** Opens top-level span detail panels by default. */
  defaultOpen?: boolean;
};

function SpanTreeNode({ span, depth, defaultOpen }: { span: SpanNode; depth: number; defaultOpen: boolean }) {
  const childSpans = span.children ?? [];
  const hasChildren = childSpans.length > 0;

  return (
    <li className="list-none">
      <div style={{ paddingLeft: `${depth * 22}px` }}>
        <SpanCard span={span} defaultOpen={defaultOpen && depth === 0} />
      </div>
      {hasChildren && (
        <ul
          className="m-0 mt-[6px] flex list-none flex-col gap-[6px] border-l border-border pl-[10px]"
          style={{
            marginLeft: `${depth * 22 + 11}px`,
          }}
        >
          {childSpans.map((child) => (
            <SpanTreeNode key={child.id} span={child} depth={depth + 1} defaultOpen={defaultOpen} />
          ))}
        </ul>
      )}
    </li>
  );
}

export function TraceTree({
  spans,
  traceName,
  traceId,
  totalDuration,
  defaultOpen = false,
  className,
  style,
  ...props
}: TraceTreeProps) {
  return (
    <div
      {...props}
      className={cn('cd-trace-tree overflow-hidden rounded-md border border-border bg-background shadow-card', className)}
      style={style}
    >
      {(traceName || traceId || totalDuration !== undefined) && (
        <div className="flex items-center justify-between gap-[12px] border-b border-border bg-background-elevated px-[14px] py-[12px]">
          <div className="flex min-w-[0] items-center gap-[10px]">
            <span className="text-xs font-semibold text-foreground">
              {traceName ?? 'Trace'}
            </span>
            {traceId && (
              <span className="font-mono text-[0.6875rem] text-foreground-subtle">
                {traceId}
              </span>
            )}
          </div>
          {totalDuration !== undefined && (
            <span className="font-mono text-[0.6875rem] text-foreground-subtle">
              {totalDuration}ms total
            </span>
          )}
        </div>
      )}

      <ul className="m-0 flex list-none flex-col gap-[8px] p-[10px]">
        {spans.map((span) => (
          <SpanTreeNode key={span.id} span={span} depth={0} defaultOpen={defaultOpen} />
        ))}
      </ul>
    </div>
  );
}
