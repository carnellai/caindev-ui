import { cn } from '../lib/cn';
import type { HTMLAttributes } from 'react';
export type TokenCostLayout = 'row' | 'stack';

export type TokenCostProps = HTMLAttributes<HTMLDivElement> & {
  /** Prompt/input token count. Renders an `in` row when provided. */
  inputTokens?: number;
  /** Completion/output token count. Renders an `out` row when provided. */
  outputTokens?: number;
  /**
   * Total token count. Renders a `total` row whenever provided, including
   * when `inputTokens` and/or `outputTokens` are also present. No derived
   * total is computed from `inputTokens` + `outputTokens`; pass `totalTokens`
   * explicitly to show a total row.
   */
  totalTokens?: number;
  /** Cost in USD. */
  cost?: number;
  /** Model name string displayed verbatim. */
  model?: string;
  layout?: TokenCostLayout;
};

const formatCurrency = (value: number) => {
  const absolute = Math.abs(value);
  const fractionDigits = absolute < 0.01
    ? 6
    : absolute < 1
      ? 4
      : value % 1 === 0
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
      {totalTokens !== undefined && (
        <span className="flex items-center" style={{ gap: 4 }}>
          <span className="text-[0.6875rem] text-foreground-subtle">total</span>
          <span className="font-mono text-[0.8125rem] text-foreground-muted tabular-nums">
            {totalTokens.toLocaleString()}
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
