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
  sm: 'h-[30px] gap-1.5 px-2.5 text-xs',
  md: 'h-[34px] gap-[7px] px-3.5 text-[0.8125rem]',
  lg: 'h-[38px] gap-2 px-[18px] text-sm',
};

const variantClasses: Record<ButtonVariant, string> = {
  solid: 'border border-border-strong bg-accent text-accent-foreground shadow-highlight-inset',
  outline: 'border border-border-strong bg-surface-control text-foreground shadow-highlight-inset',
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
          'cd-button inline-flex select-none items-center justify-center rounded-md font-medium tracking-[-0.01em] outline-none transition-[background,border-color,color,opacity,box-shadow] duration-[120ms]',
          `cd-button-${variant}`,
          variantClasses[variant],
          sizeClasses[size],
          isDisabled ? 'cursor-not-allowed opacity-[0.56]' : 'cursor-pointer',
        ),
        className,
      )}
      style={typeof style === 'object' ? style : undefined}
      {...props}
    >
      {loading && <span className="cd-button-spinner" aria-hidden="true" />}
      {children}
    </BaseButton>
  );
}
