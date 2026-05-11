import { Field } from '@base-ui/react/field';
import { Input } from './Input';
import { cn } from '../lib/cn';
import { useId } from 'react';
import type {
  CSSProperties,
  ComponentPropsWithoutRef,
  FormHTMLAttributes,
  InputHTMLAttributes,
  ReactNode,
  Ref,
} from 'react';

export type FormProps = FormHTMLAttributes<HTMLFormElement> & {
  gap?: 'sm' | 'md' | 'lg';
};

const formGapClass: Record<NonNullable<FormProps['gap']>, string> = {
  sm: 'gap-3',
  md: 'gap-4',
  lg: 'gap-6',
};

export function Form({ children, onSubmit, gap = 'md', style, className, ...props }: FormProps) {
  function handleSubmit(event: Parameters<NonNullable<FormProps['onSubmit']>>[0]) {
    const hasAction = typeof props.action === 'string' && props.action.length > 0;
    const hasMethod = typeof props.method === 'string' && props.method.length > 0;

    // Keep SPA/react handler usage from triggering a same-page navigation when no native submit target exists.
    if (onSubmit && !hasAction && !hasMethod) {
      event.preventDefault();
    }

    onSubmit?.(event);
  }

  return (
    <form
      {...props}
      className={cn('flex flex-col', formGapClass[gap], className)}
      onSubmit={handleSubmit}
      style={style}
    >
      {children}
    </form>
  );
}

type FormFieldRootProps = Omit<
  ComponentPropsWithoutRef<typeof Field.Root>,
  'children' | 'className' | 'style' | 'name' | 'disabled' | 'invalid'
>;

export type FormFieldProps = FormFieldRootProps & {
  name: string;
  label: string;
  hint?: string;
  error?: ReactNode;
  required?: boolean;
  disabled?: boolean;
  invalid?: boolean;
  children: ReactNode;
  style?: CSSProperties;
  className?: string;
  /** Optional control id for explicit label/control association. */
  controlId?: string;
  /** Optional description id used for aria-describedby wiring. */
  hintId?: string;
  /** Optional error id used for aria-describedby wiring. */
  errorId?: string;
};

export function FormField({
  name,
  label,
  hint,
  error,
  required,
  disabled,
  invalid,
  children,
  style,
  className,
  controlId,
  hintId,
  errorId,
  ...props
}: FormFieldProps) {
  const hasError = Boolean(error);

  return (
    <Field.Root
      {...props}
      name={name}
      disabled={disabled}
      invalid={invalid || hasError || undefined}
      className={cn('flex flex-col gap-2', className)}
      style={style}
    >
      <Field.Label htmlFor={controlId} className="flex items-center gap-1 text-[0.8125rem] font-medium text-foreground">
        {label}
        {required && <span aria-hidden="true" className="text-error">*</span>}
      </Field.Label>

      {children}

      {hint && (
        <Field.Description id={hintId} className="text-xs text-foreground-subtle">
          {hint}
        </Field.Description>
      )}

      <Field.Error id={errorId} match={hasError || undefined} className="text-xs text-error">
        {error}
      </Field.Error>
    </Field.Root>
  );
}

type FormInputNativeProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'name' | 'label' | 'children' | 'className' | 'style' | 'required' | 'disabled' | 'placeholder' | 'type'
>;

export type FormInputProps = FormInputNativeProps & {
  name: string;
  label: string;
  hint?: string;
  error?: string;
  invalid?: boolean;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  type?: string;
  /** Forwarded to Input; targets the input control, not FormField. */
  style?: CSSProperties;
  /** Forwarded to Input; targets the input control, not FormField. */
  className?: string;
  /** Ref forwarded to the underlying input element. */
  ref?: Ref<HTMLInputElement>;
};

function mergeIds(...ids: Array<string | undefined>) {
  const validIds = ids.filter((id): id is string => Boolean(id));
  return validIds.length > 0 ? validIds.join(' ') : undefined;
}

export function FormInput({
  name,
  label,
  hint,
  error,
  required,
  disabled,
  placeholder,
  type = 'text',
  style,
  className,
  id,
  invalid,
  ref,
  'aria-describedby': ariaDescribedBy,
  'aria-invalid': ariaInvalid,
  ...props
}: FormInputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const hintId = hint ? `${inputId}-hint` : undefined;
  const errorId = error ? `${inputId}-error` : undefined;
  const isInvalid = invalid || Boolean(error) || ariaInvalid || undefined;

  return (
    <FormField
      name={name}
      label={label}
      hint={hint}
      error={error}
      required={required}
      disabled={disabled}
      invalid={invalid}
      controlId={inputId}
      hintId={hintId}
      errorId={errorId}
    >
      <Input
        {...props}
        ref={ref}
        id={inputId}
        name={name}
        placeholder={placeholder}
        type={type}
        required={required}
        disabled={disabled}
        aria-describedby={mergeIds(ariaDescribedBy, hintId, errorId)}
        aria-invalid={isInvalid}
        style={style}
        className={className}
      />
    </FormField>
  );
}
