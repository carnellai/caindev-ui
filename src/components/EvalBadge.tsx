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

const evalConfig: Record<EvalVerdict, { label: string; color: string; bg: string }> = {
  pass: { label: 'Pass', color: '#34d399', bg: 'rgba(52,211,153,0.12)' },
  fail: { label: 'Fail', color: '#f87171', bg: 'rgba(248,113,113,0.12)' },
  review: { label: 'Review', color: '#fbbf24', bg: 'rgba(251,191,36,0.12)' },
  insufficient: { label: 'Insufficient', color: '#94a3b8', bg: 'rgba(148,163,184,0.1)' },
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
        border: `1px solid ${cfg.color}22`,
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
