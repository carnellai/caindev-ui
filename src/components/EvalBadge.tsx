export type EvalVerdict = 'pass' | 'fail' | 'review' | 'insufficient';
export type EvalBadgeSize = 'sm' | 'md';

export type EvalBadgeProps = {
  verdict: EvalVerdict;
  score?: number;
  label?: string;
  size?: EvalBadgeSize;
  style?: React.CSSProperties;
  className?: string;
};

const evalConfig: Record<EvalVerdict, { label: string; color: string; bg: string; border: string }> = {
  pass: { label: 'Pass', color: 'var(--color-success)', bg: 'var(--color-success-muted)', border: 'var(--color-success-border)' },
  fail: { label: 'Fail', color: 'var(--color-error)', bg: 'var(--color-error-muted)', border: 'var(--color-error-border)' },
  review: { label: 'Review', color: 'var(--color-warning)', bg: 'var(--color-warning-muted)', border: 'var(--color-warning-border)' },
  insufficient: { label: 'Insufficient', color: 'var(--color-neutral)', bg: 'var(--color-neutral-muted)', border: 'var(--color-neutral-border)' },
};

export function EvalBadge({ verdict, score, label, size = 'md', style, className }: EvalBadgeProps) {
  const cfg = evalConfig[verdict];
  const isSmall = size === 'sm';

  return (
    <span
      className={[
        'inline-flex items-center gap-[5px] whitespace-nowrap rounded-[4px] font-semibold tracking-[0.04em]',
        isSmall ? 'px-1.5 py-0.5 text-[0.625rem]' : 'px-[9px] py-[3px] text-[0.6875rem]',
        className,
      ].filter(Boolean).join(' ')}
      style={{
        border: `1px solid ${cfg.border}`,
        background: cfg.bg,
        color: cfg.color,
        ...style,
      }}
    >
      <span
        className={['shrink-0 rounded-full', isSmall ? 'h-[5px] w-[5px]' : 'h-1.5 w-1.5'].join(' ')}
        style={{ background: cfg.color }}
      />
      {label ?? cfg.label}
      {score !== undefined && (
        <span className="font-mono opacity-80">
          {score.toFixed(2)}
        </span>
      )}
    </span>
  );
}
