import { Checkbox as BaseCheckbox } from '@base-ui/react/checkbox';
import { useId } from 'react';
import type { ComponentProps } from 'react';
import { cn } from '../lib/cn';

export type CheckboxProps = ComponentProps<typeof BaseCheckbox.Root> & {
  label?: string;
  /** Targets the Base UI checkbox root/control; the outer label owns layout. */
  className?: ComponentProps<typeof BaseCheckbox.Root>['className'];
  /** Targets the Base UI checkbox root/control; the outer label owns layout. */
  style?: ComponentProps<typeof BaseCheckbox.Root>['style'];
};

function CheckIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
      <path d="M9.1603 1.12218C9.50684 1.34873 9.60427 1.81354 9.37792 2.16038L5.13603 8.66012C5.01614 8.8438 4.82192 8.96576 4.60451 8.99384C4.3871 9.02194 4.1683 8.95335 4.00574 8.80615L1.24664 6.30769C0.939709 6.02975 0.916013 5.55541 1.19372 5.24822C1.47142 4.94102 1.94536 4.91731 2.2523 5.19524L4.36085 7.10461L8.12299 1.33999C8.34934 0.993152 8.81376 0.895638 9.1603 1.12218Z" />
    </svg>
  );
}

function MinusIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <path d="M2 5h6" />
    </svg>
  );
}

function mergeClassName(
  base: string,
  className: CheckboxProps['className'],
): CheckboxProps['className'] {
  if (typeof className === 'function') {
    return (state) => cn(base, className(state));
  }

  return cn(base, className);
}

export function Checkbox({
  label,
  id,
  disabled,
  indeterminate,
  style,
  className,
  ...props
}: CheckboxProps) {
  const generatedId = useId();
  const checkboxId = id ?? generatedId;

  return (
    <label
      htmlFor={checkboxId}
      className={cn('inline-flex select-none items-center gap-[12px]', disabled ? 'cursor-not-allowed' : 'cursor-pointer')}
      style={{ opacity: disabled ? 0.5 : 1 }}
    >
      <BaseCheckbox.Root
        id={checkboxId}
        disabled={disabled}
        indeterminate={indeterminate}
        style={typeof style === 'object' ? style : undefined}
        className={mergeClassName(
          'flex h-[20px] w-[20px] shrink-0 cursor-inherit items-center justify-center rounded-sm border border-border bg-surface-control shadow-highlight-inset outline-none transition-[background,border-color,box-shadow] duration-[120ms] hover:bg-surface-hover data-[checked]:border-accent data-[checked]:bg-accent data-[indeterminate]:border-accent data-[indeterminate]:bg-accent data-[disabled]:cursor-not-allowed data-[disabled]:bg-surface-control-disabled data-[disabled]:hover:bg-surface-control-disabled focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
          className,
        )}
        {...props}
      >
        <BaseCheckbox.Indicator
          className="flex text-accent-foreground data-[unchecked]:hidden"
        >
          {indeterminate ? <MinusIcon /> : <CheckIcon />}
        </BaseCheckbox.Indicator>
      </BaseCheckbox.Root>

      {label && (
        <span className="text-sm leading-normal text-foreground">
          {label}
        </span>
      )}
    </label>
  );
}
