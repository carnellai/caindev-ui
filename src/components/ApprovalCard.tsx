export type ApprovalRisk = 'low' | 'medium' | 'high';

export type ApprovalCardProps = {
  title: string;
  description?: string;
  action: string;
  reasoning?: string;
  risk?: ApprovalRisk;
  onApprove: () => void;
  onReject: () => void;
  loading?: boolean;
  className?: string;
  style?: React.CSSProperties;
};

const riskConfig = {
  low: { label: 'Low risk', color: '#34d399', bg: 'rgba(52,211,153,0.1)' },
  medium: { label: 'Medium risk', color: '#fbbf24', bg: 'rgba(251,191,36,0.1)' },
  high: { label: 'High risk', color: '#f87171', bg: 'rgba(248,113,113,0.1)' },
};

function ShieldIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 2L2 4.5v4c0 3 2.5 5.5 6 6 3.5-.5 6-3 6-6v-4L8 2z" />
    </svg>
  );
}

export function ApprovalCard({
  title,
  description,
  action,
  reasoning,
  risk = 'medium',
  onApprove,
  onReject,
  loading = false,
  className,
  style,
}: ApprovalCardProps) {
  const rc = riskConfig[risk];

  return (
    <div
      className={['overflow-hidden rounded-md border border-border-strong bg-background-elevated shadow-[0_4px_16px_rgba(0,0,0,0.2)]', className].filter(Boolean).join(' ')}
      style={style}
    >
      <div className="flex items-center justify-between border-b border-border bg-background px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="flex" style={{ color: rc.color }}><ShieldIcon /></span>
          <span className="text-sm font-semibold text-foreground">
            {title}
          </span>
        </div>
        <span
          className="rounded-[4px] px-2 py-0.5 text-[0.6875rem] font-medium"
          style={{
            color: rc.color,
            background: rc.bg,
          }}
        >
          {rc.label}
        </span>
      </div>

      <div className="flex flex-col gap-3 p-4">
        {description && (
          <p className="m-0 text-sm leading-[1.55] text-foreground-muted">
            {description}
          </p>
        )}

        <div className="rounded-[7px] border border-border bg-background px-3 py-2.5">
          <span className="mb-1.5 block text-[0.6875rem] font-semibold uppercase tracking-[0.08em] text-foreground-subtle">
            Proposed action
          </span>
          <code className="whitespace-pre-wrap break-words font-mono text-[0.8125rem] text-foreground">
            {action}
          </code>
        </div>

        {reasoning && (
          <div className="rounded-[7px] border-l-2 border-border-strong bg-background-subtle px-3 py-2.5">
            <span className="mb-1 block text-[0.6875rem] font-semibold uppercase tracking-[0.08em] text-foreground-subtle">
              Agent reasoning
            </span>
            <p className="m-0 text-[0.8125rem] italic leading-[1.55] text-foreground-muted">
              {reasoning}
            </p>
          </div>
        )}

        <div className="mt-1 flex gap-2">
          <button
            type="button"
            onClick={onApprove}
            disabled={loading}
            className="flex-1 cursor-pointer rounded-[7px] border-0 bg-emerald-400 px-4 py-2 text-sm font-semibold text-green-950 opacity-100 transition-opacity duration-150 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Processing…' : 'Approve'}
          </button>
          <button
            type="button"
            onClick={onReject}
            disabled={loading}
            className="flex-1 cursor-pointer rounded-[7px] border border-border-strong bg-transparent px-4 py-2 text-sm font-medium text-foreground-muted disabled:cursor-not-allowed disabled:opacity-60"
          >
            Reject
          </button>
        </div>
      </div>
    </div>
  );
}
