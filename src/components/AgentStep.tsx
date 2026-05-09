import { cn } from '../lib/cn';
import type { HTMLAttributes, ReactNode } from 'react';
export type StepStatus = 'pending' | 'running' | 'completed' | 'failed' | 'queued' | 'cancelled' | 'skipped';

export type AgentStepItem = {
  id: string;
  label: string;
  description?: string;
  status: StepStatus;
  duration?: number;
};

export type AgentStepProps = HTMLAttributes<HTMLOListElement> & {
  steps: AgentStepItem[];
};

// Component-private palette — not part of the public token surface in v1.
function RunningIcon() {
  return (
    <svg
      className="cd-agent-step-spinner"
      width="14"
      height="14"
      viewBox="0 0 14 14"
    >
      <circle cx="7" cy="7" r="6" fill="none" stroke="var(--color-info)" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="28" strokeDashoffset="10" />
    </svg>
  );
}

const statusConfig: Record<StepStatus, { icon: ReactNode; color: string }> = {
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
    color: 'var(--color-info)',
  },
  completed: {
    icon: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <circle cx="7" cy="7" r="6" fill="var(--color-success)" stroke="var(--color-success)" strokeWidth="1.5" />
        <path d="M4 7l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    color: 'var(--color-success)',
  },
  failed: {
    icon: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <circle cx="7" cy="7" r="6" fill="var(--color-error)" stroke="var(--color-error)" strokeWidth="1.5" />
        <path d="M5 5l4 4M9 5l-4 4" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    color: 'var(--color-error)',
  },
  skipped: {
    icon: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 2" />
      </svg>
    ),
    color: 'var(--color-foreground-subtle)',
  },
  queued: {
    icon: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
    color: 'var(--color-warning)',
  },
  cancelled: {
    icon: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
    color: 'var(--color-foreground-subtle)',
  },
};

function normalizeStepStatus(status: StepStatus): StepStatus {
  if ((status as string) === 'complete') return 'completed';
  return status;
}

const statusA11yLabel: Record<StepStatus, string> = {
  pending: 'Pending',
  running: 'Running',
  completed: 'Completed',
  failed: 'Failed',
  queued: 'Queued',
  cancelled: 'Cancelled',
  skipped: 'Skipped',
};

export function AgentStep({ steps, className, style, ...props }: AgentStepProps) {
  return (
    <ol
      {...props}
      className={cn('m-0 flex list-none flex-col gap-[2px] p-0', className)}
      style={style}
    >
      {steps.map((step, i) => {
        const normalizedStatus = normalizeStepStatus(step.status);
        const cfg = statusConfig[normalizedStatus];
        const isLast = i === steps.length - 1;

        return (
          <li
            key={step.id}
            className="flex gap-[12px]"
            aria-label={`${step.label} — ${statusA11yLabel[normalizedStatus]}`}
          >
            <div className="flex shrink-0 flex-col items-center">
              <span className="z-[1] flex h-[18px] w-[18px] items-center justify-center rounded-full bg-background-elevated" style={{ color: cfg.color }}>
                {cfg.icon}
              </span>
              {!isLast && (
                <div
                  className="my-[4px] min-h-[16px] w-px flex-1 opacity-60"
                  style={{
                    background: normalizedStatus === 'completed' ? 'var(--color-success)' : 'var(--color-border)',
                  }}
                />
              )}
            </div>

            <div style={{ paddingBottom: isLast ? 0 : '18px' }} className="flex min-w-[0] flex-col gap-[5px]">
              <div className="flex items-center gap-[8px]">
                <span
                  className="text-sm font-medium leading-normal"
                  style={{
                    color: step.status === 'pending' || step.status === 'skipped'
                      ? 'var(--color-foreground-muted)'
                      : 'var(--color-foreground)',
                  }}
                >
                  {step.label}
                </span>
                <span className="sr-only">{statusA11yLabel[normalizedStatus]}</span>
                {step.duration !== undefined && normalizedStatus === 'completed' && (
                  <span className="font-mono text-[0.6875rem] text-foreground-subtle tabular-nums">
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
          </li>
        );
      })}
    </ol>
  );
}
