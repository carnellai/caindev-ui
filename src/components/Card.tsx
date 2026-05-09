import { cn } from '../lib/cn';
import type { HTMLAttributes, ReactNode } from 'react';
export type CardPadding = 'none' | 'sm' | 'md' | 'lg';

export type CardProps = HTMLAttributes<HTMLDivElement> & {
  header?: ReactNode;
  footer?: ReactNode;
  padding?: CardPadding;
};

const bodyPaddingClasses: Record<CardPadding, string> = {
  none: 'p-[0px]',
  sm: 'p-[16px]',
  md: 'p-[20px]',
  lg: 'p-[24px]',
};

const chromePaddingClasses: Record<CardPadding, string> = {
  none: 'px-[0px] py-[14px]',
  sm: 'px-[16px] py-[14px]',
  md: 'px-[20px] py-[16px]',
  lg: 'px-[24px] py-[16px]',
};

export function Card({
  children,
  header,
  footer,
  padding = 'md',
  style,
  className,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        'overflow-hidden rounded-md border border-border bg-background-elevated text-foreground shadow-card',
        className,
      )}
      style={style}
      {...props}
    >
      {header && (
        <div
          className={cn(
            'cd-card-slot cd-card-header flex items-center justify-between gap-[16px] border-b border-border bg-background-elevated',
            chromePaddingClasses[padding],
          )}
        >
          {header}
        </div>
      )}
      <div className={cn('cd-card-slot cd-card-body', bodyPaddingClasses[padding])}>
        {children}
      </div>
      {footer && (
        <div
          className={cn(
            'cd-card-slot cd-card-footer flex items-center justify-end gap-[8px] border-t border-border bg-background-subtle',
            chromePaddingClasses[padding],
          )}
        >
          {footer}
        </div>
      )}
    </div>
  );
}
