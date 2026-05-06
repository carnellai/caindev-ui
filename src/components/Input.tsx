import { Input as BaseInput } from '@base-ui/react/input';
import { useId } from 'react';

export type InputProps = React.ComponentProps<typeof BaseInput> & {
  label?: string;
  hint?: string;
  error?: string;
};

function mergeIds(...ids: Array<string | undefined>) {
  return ids.filter(Boolean).join(' ') || undefined;
}

function mergeClassName(
  base: string,
  className: InputProps['className'],
): InputProps['className'] {
  if (typeof className === 'function') {
    return (state) => [base, className(state)].filter(Boolean).join(' ');
  }

  return [base, className].filter(Boolean).join(' ');
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
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="text-[0.8125rem] font-medium text-foreground"
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
          [
            'box-border h-9 w-full rounded-[8px] bg-white/[0.04] px-3 text-sm text-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] outline-none transition-[border-color] duration-150 placeholder:text-foreground-subtle focus:border-accent focus:ring-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-not-allowed disabled:bg-white/[0.025] disabled:text-foreground-subtle disabled:opacity-[0.65]',
            error ? 'border border-destructive' : 'border border-border-strong',
          ].join(' '),
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
