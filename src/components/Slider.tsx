import { Slider as BaseSlider } from '@base-ui/react/slider';
import { cn } from '../lib/cn';
import type { ComponentPropsWithoutRef } from 'react';

export type SliderValue = number | number[];

export type SliderProps = ComponentPropsWithoutRef<'div'> & {
  label?: string;
  min?: number;
  max?: number;
  step?: number;
  defaultValue?: SliderValue;
  value?: SliderValue;
  onValueChange?: (value: SliderValue) => void;
  onValueCommitted?: (value: SliderValue) => void;
  name?: string;
  disabled?: boolean;
  'aria-label'?: string;
};

const thumbClassName = 'box-border h-4 w-4 cursor-pointer rounded-full border-2 border-accent bg-background-elevated shadow-card outline-none data-[disabled]:cursor-not-allowed focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background';

export function Slider({
  label,
  min = 0,
  max = 100,
  step = 1,
  defaultValue = 50,
  value,
  onValueChange,
  onValueCommitted,
  name,
  disabled,
  'aria-label': ariaLabelProp,
  style,
  className,
  ...props
}: SliderProps) {
  const isRange = Array.isArray(defaultValue) || Array.isArray(value);
  const thumbLabel = ariaLabelProp ?? label;

  return (
    <BaseSlider.Root
      {...props}
      min={min}
      max={max}
      step={step}
      defaultValue={value !== undefined ? undefined : defaultValue}
      value={value}
      onValueChange={onValueChange}
      onValueCommitted={onValueCommitted}
      name={name}
      disabled={disabled}
      className={cn('flex w-full flex-col gap-2.5', className)}
      style={disabled ? { opacity: 0.5, ...style } : style}
    >
      <div className="flex items-center justify-between">
        {label && (
          <BaseSlider.Label className={cn('text-[0.8125rem] font-medium', disabled ? 'text-foreground-subtle' : 'text-foreground')}>
            {label}
          </BaseSlider.Label>
        )}
        <span className="ml-auto font-mono text-xs text-foreground-muted">
          <BaseSlider.Value />
        </span>
      </div>

      <BaseSlider.Control
        className={cn('flex w-full select-none items-center py-2.5 touch-none', disabled ? 'cursor-not-allowed' : undefined)}
      >
        <BaseSlider.Track
          className="box-border relative h-2 w-full rounded-sm border border-border-strong bg-surface-control"
        >
          <BaseSlider.Indicator
            className="h-full rounded-sm bg-accent"
          />
          {isRange ? (
            <>
              <BaseSlider.Thumb
                index={0}
                aria-label={thumbLabel ? `${thumbLabel} minimum` : 'Minimum value'}
                className={thumbClassName}
              />
              <BaseSlider.Thumb
                index={1}
                aria-label={thumbLabel ? `${thumbLabel} maximum` : 'Maximum value'}
                className={thumbClassName}
              />
            </>
          ) : (
            <BaseSlider.Thumb
              aria-label={thumbLabel ?? 'Value'}
              className={thumbClassName}
            />
          )}
        </BaseSlider.Track>
      </BaseSlider.Control>
    </BaseSlider.Root>
  );
}
