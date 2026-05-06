import { NumberField as BaseNumberField } from '@base-ui/react/number-field'
import { useId } from 'react'
import type { CSSProperties } from 'react';
import { cn } from '../lib/cn';

export type NumberFieldProps = {
  label?: string
  hint?: string
  value?: number | null
  defaultValue?: number
  onValueChange?: (value: number | null) => void
  min?: number
  max?: number
  step?: number
  disabled?: boolean
  readOnly?: boolean
  placeholder?: string
  format?: Intl.NumberFormatOptions
  className?: string
  style?: CSSProperties
}

function PlusIcon() {
  return (
    <svg
      width='10'
      height='10'
      viewBox='0 0 10 10'
      fill='none'
      stroke='currentColor'
      strokeWidth='1.6'>
      <path d='M0 5H5M10 5H5M5 5V0M5 5V10' />
    </svg>
  )
}

function MinusIcon() {
  return (
    <svg
      width='10'
      height='10'
      viewBox='0 0 10 10'
      fill='none'
      stroke='currentColor'
      strokeWidth='1.6'>
      <path d='M0 5H10' />
    </svg>
  )
}

export function NumberField({
  label,
  hint,
  value,
  defaultValue,
  onValueChange,
  min,
  max,
  step,
  disabled,
  readOnly,
  placeholder,
  format,
  className,
  style,
}: NumberFieldProps) {
  const id = useId()

  return (
    <BaseNumberField.Root
      id={id}
      value={value}
      defaultValue={defaultValue}
      onValueChange={onValueChange}
      min={min}
      max={max}
      step={step}
      disabled={disabled}
      readOnly={readOnly}
      format={format}
      className={cn('flex flex-col gap-1.5', className)}
      style={style}>
      {label && (
        <BaseNumberField.ScrubArea className='cursor-ew-resize select-none'>
          <label
            htmlFor={id}
            className={cn(
              'cursor-ew-resize text-[0.8125rem] font-medium',
              disabled ? 'text-foreground-subtle' : 'text-foreground',
            )}>
            {label}
          </label>
          <BaseNumberField.ScrubAreaCursor>
            <svg
              width='26'
              height='14'
              viewBox='0 0 24 14'
              fill='currentColor'
              stroke='none'>
              <path d='M19.5 5.5L6.49737 5.51844V2L1 6.9999L6.5 12L6.49737 8.5L19.5 8.5V12L25 6.9999L19.5 2V5.5Z' />
            </svg>
          </BaseNumberField.ScrubAreaCursor>
        </BaseNumberField.ScrubArea>
      )}

      <BaseNumberField.Group className='inline-flex w-fit flex-row'>
        <BaseNumberField.Decrement className=' -ml-px flex h-9 w-9 shrink-0 cursor-pointer select-none items-center justify-center rounded-l-md border border-border-strong bg-surface-control text-foreground-muted outline-none transition-[background,color] duration-[80ms] hover:bg-surface-hover hover:text-foreground data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50 focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-offset-[-1px] focus-visible:outline-accent'>
          <MinusIcon />
        </BaseNumberField.Decrement>
        <BaseNumberField.Input
          style={{ width: '64px' }}
          className='h-9 shrink-0 border-y border-border-strong bg-surface-control text-center text-sm tabular-nums text-foreground outline-none transition-[border-color] duration-150 placeholder:text-foreground-subtle focus:z-10 focus:border-accent focus:outline-2 focus:outline-offset-[-1px] focus:outline-accent data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50'
        />
        <BaseNumberField.Increment className='-ml-px flex h-9 w-9 shrink-0 cursor-pointer select-none items-center justify-center rounded-r-md border border-border-strong bg-surface-control text-foreground-muted outline-none transition-[background,color] duration-[80ms] hover:bg-surface-hover hover:text-foreground data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50 focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-offset-[-1px] focus-visible:outline-accent'>
          <PlusIcon />
        </BaseNumberField.Increment>
      </BaseNumberField.Group>

      {hint && <span className='text-xs text-foreground-subtle'>{hint}</span>}
    </BaseNumberField.Root>
  )
}
