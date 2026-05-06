export type StepStatus = 'pending' | 'running' | 'complete' | 'failed' | 'skipped';

export type AgentStepItem = {
  id: string;
  label: string;
  description?: string;
  status: StepStatus;
  duration?: number;
};

export type AgentStepProps = {
  steps: AgentStepItem[];
  className?: string;
  style?: React.CSSProperties;
};

function RunningIcon() {
  return (
    <svg
      className="cd-agent-step-spinner"
      width="14"
      height="14"
      viewBox="0 0 14 14"
    >
      <circle cx="7" cy="7" r="6" fill="none" stroke="#a78bfa" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="28" strokeDashoffset="10" />
    </svg>
  );
}

const statusConfig: Record<StepStatus, { icon: React.ReactNode; color: string }> = {
  pending: {
    icon: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
    color: 'var(--color-foreground-subtle)',
  },
  running: {
    icon: <RunningIcon />,
    color: '#a78bfa',
  },
  complete: {
    icon: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <circle cx="7" cy="7" r="6" fill="#34d399" stroke="#34d399" strokeWidth="1.5" />
        <path d="M4 7l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    color: '#34d399',
  },
  failed: {
    icon: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <circle cx="7" cy="7" r="6" fill="#f87171" stroke="#f87171" strokeWidth="1.5" />
        <path d="M5 5l4 4M9 5l-4 4" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    color: '#f87171',
  },
  skipped: {
    icon: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 2" />
      </svg>
    ),
    color: 'var(--color-foreground-subtle)',
  },
};

export function AgentStep({ steps, className, style }: AgentStepProps) {
  return (
    <div className={['flex flex-col gap-0', className].filter(Boolean).join(' ')} style={style}>
      {steps.map((step, i) => {
        const cfg = statusConfig[step.status];
        const isLast = i === steps.length - 1;

        return (
          <div key={step.id} className="flex gap-3">
            <div className="flex shrink-0 flex-col items-center">
              <span className="z-[1] flex" style={{ color: cfg.color }}>
                {cfg.icon}
              </span>
              {!isLast && (
                <div
                  className="my-[3px] min-h-4 w-px flex-1 opacity-40"
                  style={{
                    background: step.status === 'complete' ? '#34d399' : 'var(--color-border)',
                  }}
                />
              )}
            </div>

            <div style={{ paddingBottom: isLast ? 0 : '16px' }} className="flex min-w-0 flex-col gap-0.5">
              <div className="flex items-center gap-2">
                <span
                  className="text-sm font-medium leading-[14px]"
                  style={{
                    color: step.status === 'pending' || step.status === 'skipped'
                      ? 'var(--color-foreground-muted)'
                      : 'var(--color-foreground)',
                  }}
                >
                  {step.label}
                </span>
                {step.duration !== undefined && step.status === 'complete' && (
                  <span className="text-[0.6875rem] text-foreground-subtle tabular-nums">
                    {step.duration}ms
                  </span>
                )}
              </div>
              {step.description && (
                <p className="m-0 text-[0.8125rem] leading-normal text-foreground-subtle">
                  {step.description}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
