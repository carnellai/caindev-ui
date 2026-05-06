import { cn } from '../lib/cn';
import type { CSSProperties } from 'react';
export type MetricTrend = 'up' | 'down' | 'neutral';

export type MetricCardProps = {
  label: string;
  value: string | number;
  unit?: string;
  trend?: MetricTrend;
  trendValue?: string;
  trendPositive?: boolean;
  sublabel?: string;
  style?: CSSProperties;
  className?: string;
};

export function MetricCard({
  label,
  value,
  unit,
  trend,
  trendValue,
  trendPositive = true,
  sublabel,
  style,
  className,
}: MetricCardProps) {
  const isGood = trend === 'neutral' ? null : trendPositive ? trend === 'up' : trend === 'down';
  const trendColor = isGood === null ? 'var(--color-foreground-subtle)' : isGood ? 'var(--color-success)' : 'var(--color-error)';

  return (
    <div
      className={cn(
        'flex flex-col gap-1.5 rounded-md border border-border bg-background-elevated px-4 py-3.5',
        className,
      )}
      style={style}
    >
      <span className="text-[0.6875rem] font-medium uppercase tracking-[0.08em] text-foreground-subtle">
        {label}
      </span>
      <div className="flex items-baseline gap-1">
        <span className="font-mono text-2xl font-semibold leading-none text-foreground tabular-nums">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </span>
        {unit && <span className="text-xs text-foreground-subtle">{unit}</span>}
      </div>
      <div className="flex items-center gap-1.5">
        {trend && trendValue && (
          <span className="text-[0.6875rem] font-medium" style={{ color: trendColor }}>
            {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'} {trendValue}
          </span>
        )}
        {sublabel && (
          <span className="text-[0.6875rem] text-foreground-subtle">{sublabel}</span>
        )}
      </div>
    </div>
  );
}
