import { useId, useState } from 'react';

export type SpanKind = 'llm' | 'tool' | 'retrieval' | 'agent' | 'span' | 'embedding' | 'guardrail';
export type SpanStatus = 'running' | 'success' | 'error' | 'pending';

export type SpanNode = {
  id: string;
  name: string;
  kind: SpanKind;
  status: SpanStatus;
  duration?: number;
  startOffset?: number;
  model?: string;
  inputTokens?: number;
  outputTokens?: number;
  cost?: number;
  query?: string;
  resultCount?: number;
  input?: unknown;
  output?: unknown;
  children?: SpanNode[];
};

const kindConfig: Record<SpanKind, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
  llm: {
    label: 'LLM',
    color: '#a78bfa',
    bg: 'rgba(167,139,250,0.12)',
    icon: (
      <svg width="11" height="11" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <path d="M2 4h12M2 8h8M2 12h6" />
      </svg>
    ),
  },
  tool: {
    label: 'TOOL',
    color: '#34d399',
    bg: 'rgba(52,211,153,0.12)',
    icon: (
      <svg width="11" height="11" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.5 2.5a3 3 0 0 0-4 4L4 13a1 1 0 0 0 0 1.4l.6.6a1 1 0 0 0 1.4 0l6.5-6.5a3 3 0 0 0 4-4l-2 2-1.5-.5-.5-1.5 2-2z" />
      </svg>
    ),
  },
  retrieval: {
    label: 'RETRIEVAL',
    color: '#fbbf24',
    bg: 'rgba(251,191,36,0.12)',
    icon: (
      <svg width="11" height="11" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="7" cy="7" r="5" />
        <path d="M11 11l3 3" />
      </svg>
    ),
  },
  agent: {
    label: 'AGENT',
    color: '#f472b6',
    bg: 'rgba(244,114,182,0.12)',
    icon: (
      <svg width="11" height="11" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="8" cy="6" r="3" />
        <path d="M2 14c0-3.3 2.7-6 6-6s6 2.7 6 6" />
      </svg>
    ),
  },
  span: {
    label: 'SPAN',
    color: '#94a3b8',
    bg: 'rgba(148,163,184,0.1)',
    icon: (
      <svg width="11" height="11" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <rect x="2" y="2" width="12" height="12" rx="2" />
      </svg>
    ),
  },
  embedding: {
    label: 'EMBED',
    color: '#60a5fa',
    bg: 'rgba(96,165,250,0.12)',
    icon: (
      <svg width="11" height="11" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <path d="M2 8h12M8 2v12" />
      </svg>
    ),
  },
  guardrail: {
    label: 'GUARD',
    color: '#fb923c',
    bg: 'rgba(251,146,60,0.12)',
    icon: (
      <svg width="11" height="11" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 2L2 4.5v4c0 3 2.5 5.5 6 6 3.5-.5 6-3 6-6v-4L8 2z" />
      </svg>
    ),
  },
};

const statusDot: Record<SpanStatus, string> = {
  running: '#a78bfa',
  success: '#34d399',
  error: '#f87171',
  pending: '#52525b',
};

function JsonBlock({ value }: { value: unknown }) {
  const json = safeJsonStringify(value);

  return (
    <pre className="m-0 overflow-x-auto whitespace-pre-wrap break-words rounded-[5px] border border-border bg-background px-2.5 py-2 font-mono text-[0.6875rem] leading-[1.55] text-foreground-muted">
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

function MetaRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2">
      <span className="min-w-20 text-[0.6875rem] text-foreground-subtle">
        {label}
      </span>
      <span className="font-mono text-xs text-foreground-muted">
        {value}
      </span>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="mb-1 block text-[0.5625rem] font-semibold uppercase tracking-[0.1em] text-foreground-subtle">
      {children}
    </span>
  );
}

export type SpanCardProps = {
  span: SpanNode;
  defaultOpen?: boolean;
  depth?: number;
  className?: string;
  style?: React.CSSProperties;
};

export function SpanCard({ span, defaultOpen = false, className, style }: SpanCardProps) {
  const [open, setOpen] = useState(defaultOpen);
  const detailId = useId();
  const cfg = kindConfig[span.kind];
  const hasDetails = span.input !== undefined || span.output !== undefined || span.model || span.query;

  return (
    <div
      className={['overflow-hidden rounded-[7px] border border-border bg-background-elevated', className].filter(Boolean).join(' ')}
      style={style}
    >
      <button
        type="button"
        aria-label={hasDetails ? `${open ? 'Collapse' : 'Expand'} ${span.name} details` : `${span.name} span`}
        aria-expanded={hasDetails ? open : undefined}
        aria-controls={hasDetails ? detailId : undefined}
        disabled={!hasDetails}
        onClick={() => hasDetails && setOpen((o) => !o)}
        className={['flex w-full items-center gap-2 border-0 bg-transparent px-2.5 py-[9px] text-left', hasDetails ? 'cursor-pointer' : 'cursor-default'].join(' ')}
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
        {!hasDetails && <span className="w-2.5 shrink-0" />}

        <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: statusDot[span.status] }} />

        <span
          className="flex shrink-0 items-center gap-[3px] rounded-[3px] px-[5px] py-px text-[0.5625rem] font-bold tracking-[0.08em]"
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

        <div className="flex shrink-0 items-center gap-2.5">
          {span.model && (
            <span className="text-[0.6875rem] text-foreground-subtle">
              {span.model}
            </span>
          )}
          {(span.inputTokens || span.outputTokens) && (
            <span className="font-mono text-[0.6875rem] text-foreground-subtle">
              {(span.inputTokens ?? 0) + (span.outputTokens ?? 0)} tok
            </span>
          )}
          {span.cost !== undefined && (
            <span className="font-mono text-[0.6875rem] text-foreground-subtle">
              ${span.cost.toFixed(4)}
            </span>
          )}
          {span.duration !== undefined && (
            <span className="font-mono text-[0.6875rem] text-foreground-subtle tabular-nums">
              {span.duration}ms
            </span>
          )}
        </div>
      </button>

      {open && (
        <div
          id={detailId}
          className="flex flex-col gap-2.5 border-t border-border px-3 py-2.5"
        >
          {(span.model || span.inputTokens || span.outputTokens || span.cost) && (
            <div className="flex flex-col gap-1">
              <SectionLabel>Model</SectionLabel>
              {span.model && <MetaRow label="model" value={span.model} />}
              {span.inputTokens && <MetaRow label="input tokens" value={span.inputTokens.toLocaleString()} />}
              {span.outputTokens && <MetaRow label="output tokens" value={span.outputTokens.toLocaleString()} />}
              {span.cost !== undefined && <MetaRow label="cost" value={`$${span.cost.toFixed(6)}`} />}
            </div>
          )}

          {span.query && (
            <div>
              <SectionLabel>Query</SectionLabel>
              <p className="m-0 text-[0.8125rem] italic text-foreground-muted">
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

export type TraceTreeProps = {
  spans: SpanNode[];
  traceName?: string;
  traceId?: string;
  totalDuration?: number;
  defaultOpen?: boolean;
  className?: string;
  style?: React.CSSProperties;
};

function SpanTreeNode({ span, depth, defaultOpen }: { span: SpanNode; depth: number; defaultOpen: boolean }) {
  return (
    <div>
      <div style={{ paddingLeft: `${depth * 20}px` }}>
        <SpanCard span={span} defaultOpen={defaultOpen && depth === 0} depth={depth} />
      </div>
      {span.children && span.children.length > 0 && (
        <div
          className="mt-1 flex flex-col gap-1 border-l border-border pl-2.5"
          style={{
            marginLeft: `${depth * 20 + 10}px`,
          }}
        >
          {span.children.map((child) => (
            <SpanTreeNode key={child.id} span={child} depth={depth + 1} defaultOpen={defaultOpen} />
          ))}
        </div>
      )}
    </div>
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
}: TraceTreeProps) {
  return (
    <div
      className={['overflow-hidden rounded-md border border-border-strong bg-background', className].filter(Boolean).join(' ')}
      style={style}
    >
      {(traceName || traceId || totalDuration) && (
        <div className="flex items-center justify-between border-b border-border bg-background-elevated px-3.5 py-2.5">
          <div className="flex items-center gap-2.5">
            <span className="text-xs font-semibold text-foreground">
              {traceName ?? 'Trace'}
            </span>
            {traceId && (
              <span className="font-mono text-[0.6875rem] text-foreground-subtle">
                {traceId}
              </span>
            )}
          </div>
          {totalDuration && (
            <span className="font-mono text-[0.6875rem] text-foreground-subtle">
              {totalDuration}ms total
            </span>
          )}
        </div>
      )}

      <div className="flex flex-col gap-1 p-2.5">
        {spans.map((span) => (
          <SpanTreeNode key={span.id} span={span} depth={0} defaultOpen={defaultOpen} />
        ))}
      </div>
    </div>
  );
}
