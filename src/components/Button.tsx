import { Button as BaseButton } from '@base-ui/react/button';
import { cn } from '../lib/cn';
import type { ComponentProps } from 'react';

export type ButtonVariant = 'solid' | 'outline' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

export type ButtonProps = ComponentProps<typeof BaseButton> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'h-[32px] gap-[6px] px-[12px] text-xs',
  md: 'h-[36px] gap-[8px] px-[16px] text-sm',
  lg: 'h-[40px] gap-[8px] px-[20px] text-sm',
};

const variantClasses: Record<ButtonVariant, string> = {
  solid: 'border border-transparent bg-accent text-accent-foreground shadow-none',
  outline: 'border border-border bg-surface-control text-foreground shadow-highlight-inset',
  ghost: 'border-0 bg-transparent text-foreground-muted shadow-none',
};

function mergeClassName(
  base: string,
  className: ButtonProps['className'],
): ButtonProps['className'] {
  if (typeof className === 'function') {
    return (state) => cn(base, className(state));
  }

  return cn(base, className);
}

export function Button({
  variant = 'solid',
  size = 'md',
  loading = false,
  disabled,
  children,
  style,
  className,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <BaseButton
      aria-busy={loading || undefined}
      disabled={isDisabled}
      className={mergeClassName(
        cn(
          'cd-button box-border font-[inherit] inline-flex select-none appearance-none items-center justify-center whitespace-nowrap rounded-md font-medium leading-none outline-none transition-[background,border-color,color,opacity,box-shadow] duration-[120ms]',
          `cd-button-${variant}`,
          variantClasses[variant],
          sizeClasses[size],
          isDisabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
        ),
        className,
      )}
      style={style}
      {...props}
    >
      {loading && <span className="cd-button-spinner" aria-hidden="true" />}
      {children}
    </BaseButton>
  );
}
