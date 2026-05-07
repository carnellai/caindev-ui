import { Input as BaseInput } from '@base-ui/react/input';
import { useId } from 'react';
import type { ComponentProps } from 'react';
import { cn } from '../lib/cn';

export type InputProps = ComponentProps<typeof BaseInput> & {
  label?: string;
  hint?: string;
  error?: string;
  /** Targets the inner input control, not the label/hint/error wrapper. */
  className?: ComponentProps<typeof BaseInput>['className'];
  /** Targets the inner input control, not the label/hint/error wrapper. */
  style?: ComponentProps<typeof BaseInput>['style'];
};

function mergeIds(...ids: Array<string | undefined>) {
  return ids.filter(Boolean).join(' ') || undefined;
}

function mergeClassName(
  base: string,
  className: InputProps['className'],
): InputProps['className'] {
  if (typeof className === 'function') {
    return (state) => cn(base, className(state));
  }

  return cn(base, className);
}

export function Input({
  label,
  hint,
  error,
  id,
  style,
  className,
  disabled,
  placeholder,
  'aria-describedby': ariaDescribedBy,
  'aria-invalid': ariaInvalid,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  ...props
}: InputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const hintId = hint && !error ? `${inputId}-hint` : undefined;
  const errorId = error ? `${inputId}-error` : undefined;
  const accessibleLabel = ariaLabel ?? (!label && !ariaLabelledBy ? placeholder : undefined);

  return (
    <div className="flex min-w-[0] flex-col gap-[6px]">
      {label && (
        <label
          htmlFor={inputId}
          className="text-sm font-medium leading-normal text-foreground"
        >
          {label}
        </label>
      )}

      <BaseInput
        id={inputId}
        disabled={disabled}
        placeholder={placeholder}
        aria-describedby={mergeIds(ariaDescribedBy, hintId, errorId)}
        aria-invalid={error ? true : ariaInvalid}
        aria-label={accessibleLabel}
        aria-labelledby={ariaLabelledBy}
        style={typeof style === 'object' ? style : undefined}
        className={mergeClassName(
          cn(
            'box-border h-[36px] w-full min-w-[0] appearance-none rounded-md bg-surface-control px-[14px] text-sm leading-none text-foreground shadow-highlight-inset outline-none transition-[background,border-color,box-shadow] duration-150 placeholder:text-foreground-subtle hover:bg-surface-hover focus:border-accent focus:bg-surface-control focus:ring-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-not-allowed disabled:bg-surface-control-disabled disabled:text-foreground-subtle disabled:opacity-60',
            error ? 'border border-destructive' : 'border border-border',
          ),
          className,
        )}
        {...props}
      />

      {hint && !error && (
        <span
          id={hintId}
          className="text-xs text-foreground-subtle"
        >
          {hint}
        </span>
      )}

      {error && (
        <span
          id={errorId}
          role="alert"
          className="text-xs text-destructive"
        >
          {error}
        </span>
      )}
    </div>
  );
}
