export type StatDeltaFormat = 'number' | 'percent' | 'currency' | 'duration';

export type StatDeltaProps = {
  label: string;
  current: number;
  previous: number;
  unit?: string;
  format?: StatDeltaFormat;
  higherIsBetter?: boolean;
  style?: React.CSSProperties;
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
    <div className={['flex flex-col gap-1', className].filter(Boolean).join(' ')} style={style}>
      <span className="text-[0.6875rem] font-medium uppercase tracking-[0.08em] text-foreground-subtle">
        {label}
      </span>
      <div className="flex items-baseline gap-2">
        <span className="font-mono text-xl font-semibold text-foreground tabular-nums">
          {fmt(current)}{unit && <span className="ml-0.5 text-xs font-normal text-foreground-subtle">{unit}</span>}
        </span>
        <span className="font-mono text-xs font-medium" style={{ color }}>
          {arrow} {Math.abs(deltaPercent).toFixed(1)}%
        </span>
      </div>
      <span className="font-mono text-[0.6875rem] text-foreground-subtle">
        vs {fmt(previous)}{unit ? ` ${unit}` : ''} prev
      </span>
    </div>
  );
}
