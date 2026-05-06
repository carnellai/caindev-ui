import { Switch as BaseSwitch } from '@base-ui/react/switch';
import { useId } from 'react';

export type SwitchProps = React.ComponentProps<typeof BaseSwitch.Root> & {
  label?: string;
};

function mergeClassName(
  base: string,
  className: SwitchProps['className'],
): SwitchProps['className'] {
  if (typeof className === 'function') {
    return (state) => [base, className(state)].filter(Boolean).join(' ');
  }

  return [base, className].filter(Boolean).join(' ');
}

export function Switch({ label, id, disabled, style, className, ...props }: SwitchProps) {
  const generatedId = useId();
  const switchId = id ?? generatedId;

  return (
    <label
      htmlFor={switchId}
      className={['inline-flex select-none items-center gap-2.5', disabled ? 'cursor-not-allowed' : 'cursor-pointer'].join(' ')}
      style={{ opacity: disabled ? 0.5 : 1 }}
    >
      <BaseSwitch.Root
        id={switchId}
        disabled={disabled}
        style={typeof style === 'object' ? style : undefined}
        className={mergeClassName(
          'relative flex h-5 w-9 shrink-0 cursor-inherit items-center rounded-full border border-white/10 bg-background-subtle p-0.5 shadow-[inset_0_1px_2px_rgba(0,0,0,0.3)] outline-none transition-[background,border-color] duration-150 data-[checked]:border-accent/50 data-[checked]:bg-accent data-[disabled]:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
          className,
        )}
        {...props}
      >
        <BaseSwitch.Thumb
          className="h-3.5 w-3.5 rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.4)] transition-[translate] duration-150 ease-[cubic-bezier(0.26,0.75,0.38,0.45)] data-[checked]:translate-x-4"
        />
      </BaseSwitch.Root>

      {label && (
        <span className="text-sm text-foreground-muted">
          {label}
        </span>
      )}
    </label>
  );
}
