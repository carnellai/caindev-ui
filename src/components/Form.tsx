import { Field } from '@base-ui/react/field';
import { Form as BaseForm } from '@base-ui/react/form';
import { Input } from './Input';

export type FormProps = {
  children: React.ReactNode;
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
  gap?: number;
  style?: React.CSSProperties;
  className?: string;
};

export function Form({ children, onSubmit, gap = 16, style, className }: FormProps) {
  return (
    <BaseForm
      className={['flex flex-col', className].filter(Boolean).join(' ')}
      onSubmit={onSubmit}
      style={{ gap, ...style }}
    >
      {children}
    </BaseForm>
  );
}

export type FormFieldProps = {
  name: string;
  label: string;
  hint?: string;
  error?: React.ReactNode;
  required?: boolean;
  disabled?: boolean;
  invalid?: boolean;
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
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
}: FormFieldProps) {
  const hasError = Boolean(error);

  return (
    <Field.Root
      name={name}
      disabled={disabled}
      invalid={invalid || hasError || undefined}
      className={['flex flex-col gap-1.5', className].filter(Boolean).join(' ')}
      style={style}
    >
      <Field.Label className="flex items-center gap-1 text-[0.8125rem] font-medium text-foreground">
        {label}
        {required && <span aria-hidden="true" className="text-error">*</span>}
      </Field.Label>

      {children}

      {hint && (
        <Field.Description className="text-xs text-foreground-subtle">
          {hint}
        </Field.Description>
      )}

      <Field.Error match={hasError || undefined} className="text-xs text-error">
        {error}
      </Field.Error>
    </Field.Root>
  );
}

export type FormInputProps = {
  name: string;
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  type?: string;
  style?: React.CSSProperties;
  className?: string;
};

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
}: FormInputProps) {
  return (
    <FormField name={name} label={label} hint={hint} error={error} required={required} disabled={disabled}>
      <Input
        name={name}
        placeholder={placeholder}
        type={type}
        required={required}
        disabled={disabled}
        aria-label={label}
        style={style}
        className={className}
      />
    </FormField>
  );
}
