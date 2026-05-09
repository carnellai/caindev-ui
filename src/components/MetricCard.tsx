import { cn } from '../lib/cn';
import type { HTMLAttributes } from 'react';
export type MetricTrend = 'up' | 'down' | 'neutral';

export type MetricCardProps = HTMLAttributes<HTMLDivElement> & {
  label: string;
  value: string | number;
  unit?: string;
  trend?: MetricTrend;
  trendValue?: string;
  trendPositive?: boolean;
  sublabel?: string;
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
  ...props
}: MetricCardProps) {
  const isGood = trend === 'neutral' ? null : trendPositive ? trend === 'up' : trend === 'down';
  const trendColor = isGood === null ? 'var(--color-foreground-subtle)' : isGood ? 'var(--color-success)' : 'var(--color-error)';

  return (
    <div
      {...props}
      className={cn(
        'flex flex-col gap-[10px] rounded-md border border-border-strong bg-background-elevated p-[20px] shadow-card',
        className,
      )}
      style={style}
    >
      <span className="text-xs font-semibold uppercase tracking-[0.08em] text-foreground-subtle">
        {label}
      </span>
      <div className="flex items-baseline gap-[6px]">
        <span className="font-mono text-[1.625rem] font-semibold leading-none text-foreground tabular-nums">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </span>
        {unit && <span className="text-xs font-medium text-foreground-subtle">{unit}</span>}
      </div>
      <div className="flex min-h-[16px] items-center gap-[8px]">
        {trend && trendValue && (
          <span className="font-mono text-xs font-semibold leading-none" style={{ color: trendColor }}>
            {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'} {trendValue}
          </span>
        )}
        {sublabel && (
          <span className="text-xs leading-none text-foreground-subtle">{sublabel}</span>
        )}
      </div>
    </div>
  );
}
