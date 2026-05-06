import { Slider as BaseSlider } from '@base-ui/react/slider';
import { cn } from '../lib/cn';
import type { CSSProperties } from 'react';

export type SliderValue = number | number[];

export type SliderProps = {
  label?: string;
  min?: number;
  max?: number;
  step?: number;
  defaultValue?: SliderValue;
  value?: SliderValue;
  onValueChange?: (value: SliderValue) => void;
  disabled?: boolean;
  ariaLabel?: string;
  style?: CSSProperties;
  className?: string;
};

const thumbClassName = 'h-4 w-4 cursor-pointer rounded-full border border-border-strong bg-accent-foreground shadow-card outline-none data-[disabled]:cursor-not-allowed focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background';

export function Slider({
  label,
  min = 0,
  max = 100,
  step = 1,
  defaultValue = 50,
  value,
  onValueChange,
  disabled,
  ariaLabel,
  style,
  className,
}: SliderProps) {
  const isRange = Array.isArray(defaultValue) || Array.isArray(value);
  const thumbLabel = ariaLabel ?? label;

  return (
    <BaseSlider.Root
      min={min}
      max={max}
      step={step}
      defaultValue={defaultValue}
      value={value}
      onValueChange={onValueChange}
      disabled={disabled}
      className={cn('flex w-full flex-col gap-2.5', className)}
      style={{ opacity: disabled ? 0.5 : 1, ...style }}
    >
      <div className="flex items-center justify-between">
        {label ? (
          <BaseSlider.Label className={cn('text-[0.8125rem] font-medium', disabled ? 'text-foreground-subtle' : 'text-foreground')}>
            {label}
          </BaseSlider.Label>
        ) : <span />}
        <span className="font-mono text-xs text-foreground-muted">
          <BaseSlider.Value />
        </span>
      </div>

      <div>
        <BaseSlider.Control
          className={cn('flex w-full select-none items-center py-2.5 touch-none', disabled ? 'cursor-not-allowed' : undefined)}
        >
          <BaseSlider.Track
            className="relative h-1 w-full rounded-sm border border-border bg-background-subtle"
          >
            <BaseSlider.Indicator
              className="rounded-sm bg-accent"
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
      </div>
    </BaseSlider.Root>
  );
}
