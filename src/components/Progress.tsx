import { Progress as BaseProgress } from '@base-ui/react/progress'
import { cn } from '../lib/cn';
import type { CSSProperties } from 'react';

export type ProgressSize = 'sm' | 'md' | 'lg'
export type ProgressVariant = 'default' | 'success' | 'warning' | 'error'

export type ProgressProps = {
  value: number | null
  min?: number
  max?: number
  label?: string
  showValue?: boolean
  size?: ProgressSize
  variant?: ProgressVariant
  className?: string
  style?: CSSProperties
}

const sizeClasses: Record<ProgressSize, string> = {
  sm: 'h-[5px]',
  md: 'h-[7px]',
  lg: 'h-[10px]',
}

const variantClasses: Record<ProgressVariant, string> = {
  default: 'bg-accent',
  success: 'bg-success',
  warning: 'bg-warning',
  error: 'bg-error',
}

export function Progress({
  value,
  min = 0,
  max = 100,
  label,
  showValue = false,
  size = 'md',
  variant = 'default',
  className,
  style,
}: ProgressProps) {
  return (
    <BaseProgress.Root
      value={value}
      min={min}
      max={max}
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
            'h-full rounded-full transition-[width] duration-500 data-[indeterminate]:cd-progress-indeterminate',
            variantClasses[variant],
          )}
          style={
            value !== null
              ? { width: `${((value - min) / (max - min)) * 100}%` }
              : undefined
          }
        />
      </BaseProgress.Track>
    </BaseProgress.Root>
  )
}
