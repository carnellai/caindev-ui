import { cn } from '../lib/cn';
import type { CSSProperties } from 'react';
export type StatDeltaFormat = 'number' | 'percent' | 'currency' | 'duration';

export type StatDeltaProps = {
  label: string;
  current: number;
  previous: number;
  unit?: string;
  format?: StatDeltaFormat;
  higherIsBetter?: boolean;
  style?: CSSProperties;
  className?: string;
};

export function StatDelta({
  label,
  current,
  previous,
  unit,
  format = 'number',
  higherIsBetter = true,
  style,
  className,
}: StatDeltaProps) {
  const delta = current - previous;
  const deltaPercent = previous !== 0 ? (delta / previous) * 100 : 0;
  const isImproved = higherIsBetter ? delta > 0 : delta < 0;
  const color = delta === 0 ? 'var(--color-foreground-subtle)' : isImproved ? 'var(--color-success)' : 'var(--color-error)';
  const arrow = delta > 0 ? '↑' : delta < 0 ? '↓' : '→';

  const fmt = (v: number) => {
    if (format === 'percent') return `${v.toFixed(1)}%`;
    if (format === 'currency') return `$${v.toFixed(4)}`;
    if (format === 'duration') return `${v.toFixed(0)}ms`;
    return v.toLocaleString();
  };

  return (
    <div className={cn('flex flex-col gap-[8px]', className)} style={style}>
      <span className="text-xs font-semibold uppercase tracking-[0.08em] text-foreground-subtle">
        {label}
      </span>
      <div className="flex items-baseline gap-[10px]">
        <span className="font-mono text-[1.25rem] font-semibold leading-none text-foreground tabular-nums">
          {fmt(current)}{unit && <span className="ml-[2px] text-xs font-normal text-foreground-subtle">{unit}</span>}
        </span>
        <span className="inline-flex items-center gap-[4px] rounded-sm border border-border bg-background-subtle px-[6px] py-[3px] font-mono text-xs font-semibold leading-none" style={{ color }}>
          {arrow} {Math.abs(deltaPercent).toFixed(1)}%
        </span>
      </div>
      <span className="font-mono text-xs leading-none text-foreground-subtle">
        vs {fmt(previous)}{unit ? ` ${unit}` : ''} prev
      </span>
    </div>
  );
}
