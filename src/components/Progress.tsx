import { Progress as BaseProgress } from '@base-ui/react/progress'
import { cn } from '../lib/cn';
import type { CSSProperties } from 'react';

export type ProgressSize = 'sm' | 'md' | 'lg'
export type ProgressTone = 'neutral' | 'info' | 'success' | 'warning' | 'error'

export type ProgressProps = {
  value: number | null
  min?: number
  max?: number
  label?: string
  ariaLabel?: string
  showValue?: boolean
  size?: ProgressSize
  tone?: ProgressTone
  className?: string
  style?: CSSProperties
}

const sizeClasses: Record<ProgressSize, string> = {
  sm: 'h-[5px]',
  md: 'h-[7px]',
  lg: 'h-[10px]',
}

const toneClasses: Record<ProgressTone, string> = {
  neutral: 'bg-accent',
  info: 'bg-info',
  success: 'bg-success',
  warning: 'bg-warning',
  error: 'bg-error',
}

export function Progress({
  value,
  min = 0,
  max = 100,
  label,
  ariaLabel,
  showValue = false,
  size = 'md',
  tone = 'neutral',
  className,
  style,
}: ProgressProps) {
  return (
    <BaseProgress.Root
      value={value}
      min={min}
      max={max}
      aria-label={ariaLabel}
      className={cn('flex w-full flex-col gap-[8px]', className)}
      style={style}>
      {(label || showValue) && (
        <div className='flex items-center justify-between gap-[12px]'>
          {label && (
            <BaseProgress.Label className='text-sm font-medium leading-none text-foreground'>
              {label}
            </BaseProgress.Label>
          )}
          {showValue && (
            <BaseProgress.Value className='font-mono text-xs tabular-nums text-foreground-muted' />
          )}
        </div>
      )}
      <BaseProgress.Track
        className={cn(
          'w-full overflow-hidden rounded-full bg-background-subtle shadow-highlight-inset',
          sizeClasses[size],
        )}>
        <BaseProgress.Indicator
          className={cn(
            'h-full rounded-full transition-[width] duration-500',
            value === null && 'cd-progress-indeterminate',
            toneClasses[tone],
          )}
          style={
            value !== null
              ? { width: 'var(--progress-percent)' }
              : undefined
          }
        />
      </BaseProgress.Track>
    </BaseProgress.Root>
  )
}
