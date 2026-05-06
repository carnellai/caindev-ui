export type TokenCostLayout = 'row' | 'stack';

export type TokenCostProps = {
  inputTokens?: number;
  outputTokens?: number;
  totalTokens?: number;
  cost?: number;
  model?: string;
  layout?: TokenCostLayout;
  style?: React.CSSProperties;
  className?: string;
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
}: TokenCostProps) {
  const total = totalTokens ?? (
    inputTokens !== undefined && outputTokens !== undefined
      ? inputTokens + outputTokens
      : undefined
  );
  const isRow = layout === 'row';

  return (
    <div
      className={[
        'flex flex-wrap',
        isRow ? 'flex-row items-center gap-3' : 'flex-col items-start gap-1',
        className,
      ].filter(Boolean).join(' ')}
      style={style}
    >
      {model && (
        <span className="text-xs text-foreground-subtle">{model}</span>
      )}
      {inputTokens !== undefined && (
        <span className="flex items-center gap-1">
          <span className="text-[0.6875rem] text-foreground-subtle">in</span>
          <span className="font-mono text-[0.8125rem] text-foreground-muted tabular-nums">
            {inputTokens.toLocaleString()}
          </span>
        </span>
      )}
      {outputTokens !== undefined && (
        <span className="flex items-center gap-1">
          <span className="text-[0.6875rem] text-foreground-subtle">out</span>
          <span className="font-mono text-[0.8125rem] text-foreground-muted tabular-nums">
            {outputTokens.toLocaleString()}
          </span>
        </span>
      )}
      {total !== undefined && !inputTokens && !outputTokens && (
        <span className="flex items-center gap-1">
          <span className="text-[0.6875rem] text-foreground-subtle">tokens</span>
          <span className="font-mono text-[0.8125rem] text-foreground-muted tabular-nums">
            {total.toLocaleString()}
          </span>
        </span>
      )}
      {cost !== undefined && (
        <span className="flex items-center gap-1">
          <span className="text-[0.6875rem] text-foreground-subtle">cost</span>
          <span className="font-mono text-[0.8125rem] text-foreground tabular-nums">
            ${cost < 0.01 ? cost.toFixed(6) : cost.toFixed(4)}
          </span>
        </span>
      )}
    </div>
  );
}
