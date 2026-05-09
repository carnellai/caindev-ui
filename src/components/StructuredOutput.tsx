import { cn } from '../lib/cn';
import type { HTMLAttributes } from 'react';
export type StructuredOutputProps = HTMLAttributes<HTMLDivElement> & {
  data: unknown;
  title?: string;
  maxDepth?: number;
  maxArrayItems?: number;
  maxStringLength?: number;
};

// Component-private palette — not part of the public token surface in v1.
type RenderLimits = {
  maxDepth: number;
  maxArrayItems: number;
  maxStringLength: number;
};

function ValueDisplay({
  value,
  depth = 0,
  maxDepth,
  maxArrayItems,
  maxStringLength,
}: { value: unknown; depth?: number } & RenderLimits) {
  if (value === null) return <span className="italic text-foreground-subtle">null</span>;
  if (value === undefined) return <span className="italic text-foreground-subtle">undefined</span>;
  if (typeof value === 'boolean') return <span style={{ color: 'var(--color-info)' }}>{value.toString()}</span>;
  if (typeof value === 'number') return <span style={{ color: 'var(--color-success)' }}>{value}</span>;
  if (typeof value === 'string') {
    if (value.length > maxStringLength) {
      return <span className="text-foreground-muted">"{value.slice(0, maxStringLength)}…"</span>;
    }
    return <span style={{ color: 'var(--color-warning)' }}>"{value}"</span>;
  }
  if (Array.isArray(value)) {
    if (value.length === 0) return <span className="text-foreground-subtle">[]</span>;
    if (depth >= maxDepth) return <span className="text-foreground-subtle">[{value.length} items]</span>;

    return (
      <div className="flex flex-col gap-[4px] border-l border-border pl-[12px]">
        {value.slice(0, maxArrayItems).map((item, i) => (
          <div key={i} className="flex items-start gap-[6px]">
            <span className="shrink-0 pt-px text-[0.6875rem] text-foreground-subtle">{i}</span>
            <ValueDisplay
              value={item}
              depth={depth + 1}
              maxDepth={maxDepth}
              maxArrayItems={maxArrayItems}
              maxStringLength={maxStringLength}
            />
          </div>
        ))}
        {value.length > maxArrayItems && (
          <span className="text-xs text-foreground-subtle">+{value.length - maxArrayItems} more</span>
        )}
      </div>
    );
  }
  if (typeof value === 'object') {
    if (depth >= maxDepth) return <span className="text-foreground-subtle">{'{ … }'}</span>;
    return (
      <StructuredOutputInner
        data={value as Record<string, unknown>}
        depth={depth + 1}
        maxDepth={maxDepth}
        maxArrayItems={maxArrayItems}
        maxStringLength={maxStringLength}
      />
    );
  }
  return <span className="text-foreground-muted">{String(value)}</span>;
}

function StructuredOutputInner({
  data,
  depth = 0,
  maxDepth,
  maxArrayItems,
  maxStringLength,
}: { data: Record<string, unknown>; depth?: number } & RenderLimits) {
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
            <ValueDisplay
              value={value}
              depth={depth}
              maxDepth={maxDepth}
              maxArrayItems={maxArrayItems}
              maxStringLength={maxStringLength}
            />
          </span>
        </div>
      ))}
    </div>
  );
}

export function StructuredOutput({
  data,
  title,
  maxDepth = 2,
  maxArrayItems = 5,
  maxStringLength = 120,
  className,
  style,
  ...props
}: StructuredOutputProps) {
  const isRootObject = typeof data === 'object' && data !== null && !Array.isArray(data);

  return (
    <div
      {...props}
      className={cn('overflow-hidden rounded-md border border-border bg-background-elevated shadow-card', className)}
      style={style}
    >
      {title && (
        <div className="border-b border-border bg-background-subtle px-[14px] py-[10px] font-mono text-xs font-medium text-foreground-muted">
          {title}
        </div>
      )}
      <div className="px-[14px] py-[14px]">
        {isRootObject ? (
          <StructuredOutputInner
            data={data as Record<string, unknown>}
            maxDepth={maxDepth}
            maxArrayItems={maxArrayItems}
            maxStringLength={maxStringLength}
          />
        ) : (
          <div className="font-mono text-[0.8125rem] leading-[1.55]">
            <ValueDisplay
              value={data}
              maxDepth={maxDepth}
              maxArrayItems={maxArrayItems}
              maxStringLength={maxStringLength}
            />
          </div>
        )}
      </div>
    </div>
  );
}
