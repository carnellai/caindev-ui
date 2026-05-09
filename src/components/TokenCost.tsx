import { cn } from '../lib/cn';
import type { HTMLAttributes } from 'react';
export type TokenCostLayout = 'row' | 'stack';

export type TokenCostProps = HTMLAttributes<HTMLDivElement> & {
  inputTokens?: number;
  outputTokens?: number;
  totalTokens?: number;
  cost?: number;
  model?: string;
  layout?: TokenCostLayout;
};

const formatCurrency = (value: number) => {
  const absolute = Math.abs(value);
  const fractionDigits = absolute < 0.01
    ? 6
    : absolute < 1
      ? 4
      : Number.isInteger(value)
        ? 0
        : 2;

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(value);
};

export function TokenCost({
  inputTokens,
  outputTokens,
  totalTokens,
  cost,
  model,
  layout = 'row',
  style,
  className,
  ...props
}: TokenCostProps) {
  const total = totalTokens ?? (
    inputTokens !== undefined && outputTokens !== undefined
      ? inputTokens + outputTokens
      : undefined
  );
  const isRow = layout === 'row';

  return (
    <div
      {...props}
      className={cn(
        'flex flex-wrap',
        isRow ? 'flex-row items-center' : 'flex-col items-start',
        className,
      )}
      style={{
        gap: isRow ? '6px 12px' : '4px',
        ...style,
      }}
    >
      {model && (
        <span className="flex items-center" style={{ gap: 4 }}>
          <span className="text-[0.6875rem] text-foreground-subtle">model</span>
          <span className="text-[0.8125rem] text-foreground-muted">{model}</span>
        </span>
      )}
      {inputTokens !== undefined && (
        <span className="flex items-center" style={{ gap: 4 }}>
          <span className="text-[0.6875rem] text-foreground-subtle">in</span>
          <span className="font-mono text-[0.8125rem] text-foreground-muted tabular-nums">
            {inputTokens.toLocaleString()}
          </span>
        </span>
      )}
      {outputTokens !== undefined && (
        <span className="flex items-center" style={{ gap: 4 }}>
          <span className="text-[0.6875rem] text-foreground-subtle">out</span>
          <span className="font-mono text-[0.8125rem] text-foreground-muted tabular-nums">
            {outputTokens.toLocaleString()}
          </span>
        </span>
      )}
      {total !== undefined && inputTokens === undefined && outputTokens === undefined && (
        <span className="flex items-center" style={{ gap: 4 }}>
          <span className="text-[0.6875rem] text-foreground-subtle">tokens</span>
          <span className="font-mono text-[0.8125rem] text-foreground-muted tabular-nums">
            {total.toLocaleString()}
          </span>
        </span>
      )}
      {cost !== undefined && (
        <span className="flex items-center" style={{ gap: 4 }}>
          <span className="text-[0.6875rem] text-foreground-subtle">cost</span>
          <span className="font-mono text-[0.8125rem] text-foreground tabular-nums">
            {formatCurrency(cost)}
          </span>
        </span>
      )}
    </div>
  );
}
