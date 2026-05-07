import { cn } from '../lib/cn';
import type { CSSProperties } from 'react';
export type ScoreBarSize = 'sm' | 'md';

export type ScoreBarProps = {
  score: number;
  threshold?: number;
  label?: string;
  showValue?: boolean;
  size?: ScoreBarSize;
  style?: CSSProperties;
  className?: string;
};

export function ScoreBar({
  score,
  threshold,
  label,
  showValue = true,
  size = 'md',
  style,
  className,
}: ScoreBarProps) {
  const clampedScore = Math.min(Math.max(score, 0), 1);
  const pct = clampedScore * 100;
  const passing = threshold !== undefined ? score >= threshold : true;
  const barColor = passing ? 'var(--color-success)' : 'var(--color-error)';
  const height = size === 'sm' ? '5px' : '7px';
  const meterLabel = label ?? 'Score';

  return (
    <div className={cn('flex w-full flex-col gap-[8px]', className)} style={style}>
      {(label || showValue) && (
        <div className="flex items-center justify-between gap-[12px]">
          {label && <span className="text-sm font-medium leading-none text-foreground">{label}</span>}
          {showValue && (
            <span className="font-mono text-xs font-semibold tabular-nums" style={{ color: barColor }}>
              {(clampedScore * 100).toFixed(1)}%
            </span>
          )}
        </div>
      )}
      <div
        role="meter"
        aria-valuemin={0}
        aria-valuemax={1}
        aria-valuenow={clampedScore}
        aria-label={meterLabel}
        className="relative w-full overflow-visible rounded-full bg-background-subtle shadow-highlight-inset"
        style={{ height }}
      >
        <div
          className="absolute bottom-0 left-0 top-0 rounded-full transition-[width] duration-[400ms] ease-[ease]"
          style={{
            width: `${pct}%`,
            background: barColor,
          }}
        />
        {threshold !== undefined && (
          <div
            className="absolute top-[-3px] w-[2px] -translate-x-1/2 rounded-sm bg-foreground-subtle"
            style={{
              left: `${threshold * 100}%`,
              height: `calc(${height} + 6px)`,
            }}
          />
        )}
      </div>
    </div>
  );
}
