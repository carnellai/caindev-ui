import { cn } from '../lib/cn';
import type { HTMLAttributes } from 'react';
export type StatDeltaFormat = 'number' | 'percent' | 'currency' | 'duration';

export type StatDeltaProps = HTMLAttributes<HTMLDivElement> & {
  label: string;
  current: number;
  previous: number;
  unit?: string;
  format?: StatDeltaFormat;
  higherIsBetter?: boolean;
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
  ...props
}: StatDeltaProps) {
  const delta = current - previous;
  const hasZeroBaseline = previous === 0;
  const deltaPercent = !hasZeroBaseline ? (delta / previous) * 100 : 0;
  const isImproved = higherIsBetter ? delta > 0 : delta < 0;
  const color = delta === 0 ? 'var(--color-foreground-subtle)' : isImproved ? 'var(--color-success)' : 'var(--color-error)';
  const arrow = delta > 0 ? '↑' : delta < 0 ? '↓' : '→';

  const fmt = (v: number) => {
    if (format === 'percent') return `${v.toFixed(1)}%`;
    if (format === 'currency') return `$${v.toFixed(4)}`;
    if (format === 'duration') return `${v.toFixed(0)}ms`;
    return v.toLocaleString();
  };

  // duration/percent/currency formats already embed their unit in the formatted string;
  // only render the unit prop as a suffix for plain 'number' format.
  const showUnit = unit !== undefined && format === 'number';
  const deltaBadgeText = hasZeroBaseline
    ? delta === 0
      ? 'No change'
      : delta > 0
        ? 'New'
        : `${arrow} ${fmt(Math.abs(delta))}`
    : `${arrow} ${Math.abs(deltaPercent).toFixed(1)}%`;

  return (
    <div {...props} className={cn('flex flex-col gap-[8px]', className)} style={style}>
      <span className="text-xs font-semibold uppercase tracking-[0.08em] text-foreground-subtle">
        {label}
      </span>
      <div className="flex items-baseline gap-[10px]">
        <span className="font-mono text-[1.25rem] font-semibold leading-none text-foreground tabular-nums">
          {fmt(current)}{showUnit && <span className="ml-[2px] text-xs font-normal text-foreground-subtle">{unit}</span>}
        </span>
        <span className="inline-flex items-center gap-[4px] rounded-sm border border-border bg-background-subtle px-[6px] py-[3px] font-mono text-xs font-semibold leading-none" style={{ color }}>
          {deltaBadgeText}
        </span>
      </div>
      <span className="font-mono text-xs leading-none text-foreground-subtle">
        vs {fmt(previous)}{showUnit ? ` ${unit}` : ''} prev
      </span>
    </div>
  );
}
