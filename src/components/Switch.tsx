import { Switch as BaseSwitch } from '@base-ui/react/switch';
import { useId } from 'react';
import type { ComponentProps } from 'react';
import { cn } from '../lib/cn';

export type SwitchProps = ComponentProps<typeof BaseSwitch.Root> & {
  label?: string;
  /** Targets the Base UI switch root/control; the outer label owns layout. */
  className?: ComponentProps<typeof BaseSwitch.Root>['className'];
  /** Targets the Base UI switch root/control; the outer label owns layout. */
  style?: ComponentProps<typeof BaseSwitch.Root>['style'];
};

function mergeClassName(
  base: string,
  className: SwitchProps['className'],
): SwitchProps['className'] {
  if (typeof className === 'function') {
    return (state) => cn(base, className(state));
  }

  return cn(base, className);
}

export function Switch({ label, id, disabled, style, className, ...props }: SwitchProps) {
  const generatedId = useId();
  const switchId = id ?? generatedId;

  return (
    <label
      htmlFor={switchId}
      className={cn('inline-flex select-none items-center gap-[12px]', disabled ? 'cursor-not-allowed' : 'cursor-pointer')}
      style={{ opacity: disabled ? 0.5 : 1 }}
    >
      <BaseSwitch.Root
        id={switchId}
        disabled={disabled}
        style={typeof style === 'object' ? style : undefined}
        className={mergeClassName(
          'relative flex h-[24px] w-[44px] shrink-0 cursor-inherit items-center rounded-full border border-border bg-surface-control p-[2px] shadow-highlight-inset outline-none transition-[background,border-color,box-shadow] duration-150 hover:bg-surface-hover data-[checked]:border-accent/50 data-[checked]:bg-accent data-[disabled]:cursor-not-allowed data-[disabled]:bg-surface-control-disabled data-[disabled]:hover:bg-surface-control-disabled focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
          className,
        )}
        {...props}
      >
        <BaseSwitch.Thumb
          className="h-[18px] w-[18px] rounded-full bg-foreground-muted shadow-card transition-[translate] duration-150 ease-[cubic-bezier(0.26,0.75,0.38,0.45)] data-[checked]:translate-x-[20px] data-[checked]:bg-accent-foreground"
        />
      </BaseSwitch.Root>

      {label && (
        <span className="text-sm leading-normal text-foreground">
          {label}
        </span>
      )}
    </label>
  );
}
