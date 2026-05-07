import { cn } from '../lib/cn';
import type { CSSProperties } from 'react';
export type StructuredOutputProps = {
  data: Record<string, unknown>;
  title?: string;
  className?: string;
  style?: CSSProperties;
};

// Component-private palette — not part of the public token surface in v1.
function ValueDisplay({ value, depth = 0 }: { value: unknown; depth?: number }) {
  if (value === null) return <span className="italic text-foreground-subtle">null</span>;
  if (value === undefined) return <span className="italic text-foreground-subtle">undefined</span>;
  if (typeof value === 'boolean') return <span style={{ color: '#a78bfa' }}>{value.toString()}</span>;
  if (typeof value === 'number') return <span style={{ color: '#34d399' }}>{value}</span>;
  if (typeof value === 'string') {
    if (value.length > 120) {
      return <span className="text-foreground-muted">"{value.slice(0, 120)}…"</span>;
    }
    return <span style={{ color: '#fbbf24' }}>"{value}"</span>;
  }
  if (Array.isArray(value)) {
    if (value.length === 0) return <span className="text-foreground-subtle">[]</span>;
    if (depth >= 2) return <span className="text-foreground-subtle">[{value.length} items]</span>;

    return (
      <div className="flex flex-col gap-[4px] border-l border-border pl-[12px]">
        {value.slice(0, 5).map((item, i) => (
          <div key={i} className="flex items-start gap-[6px]">
            <span className="shrink-0 pt-px text-[0.6875rem] text-foreground-subtle">{i}</span>
            <ValueDisplay value={item} depth={depth + 1} />
          </div>
        ))}
        {value.length > 5 && <span className="text-xs text-foreground-subtle">+{value.length - 5} more</span>}
      </div>
    );
  }
  if (typeof value === 'object') {
    if (depth >= 2) return <span className="text-foreground-subtle">{'{ … }'}</span>;
    return <StructuredOutputInner data={value as Record<string, unknown>} depth={depth + 1} />;
  }
  return <span className="text-foreground-muted">{String(value)}</span>;
}

function StructuredOutputInner({ data, depth = 0 }: { data: Record<string, unknown>; depth?: number }) {
  const entries = Object.entries(data);

  return (
    <div className="flex flex-col gap-[8px]">
      {entries.length === 0 && (
        <span className="font-mono text-[0.8125rem] text-foreground-subtle">{'{ }'}</span>
      )}
      {entries.map(([key, value]) => (
        <div
          key={key}
          className="grid items-start gap-[12px]"
          style={{
            gridTemplateColumns: depth === 0 ? '140px 1fr' : '110px 1fr',
          }}
        >
          <span className="overflow-hidden text-ellipsis whitespace-nowrap pt-px font-mono text-xs text-foreground-subtle">
            {key}
          </span>
          <span className="font-mono text-[0.8125rem] leading-[1.55]">
            <ValueDisplay value={value} depth={depth} />
          </span>
        </div>
      ))}
    </div>
  );
}

export function StructuredOutput({ data, title, className, style }: StructuredOutputProps) {
  return (
    <div
      className={cn('overflow-hidden rounded-md border border-border bg-background-elevated shadow-card', className)}
      style={style}
    >
      {title && (
        <div className="border-b border-border bg-background-subtle px-[14px] py-[10px] font-mono text-xs font-medium text-foreground-muted">
          {title}
        </div>
      )}
      <div className="px-[14px] py-[14px]">
        <StructuredOutputInner data={data} />
      </div>
    </div>
  );
}
