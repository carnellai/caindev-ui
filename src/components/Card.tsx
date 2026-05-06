import { cn } from '../lib/cn';
import type { CSSProperties, ReactNode } from 'react';
export type CardPadding = 'none' | 'sm' | 'md' | 'lg';

export type CardProps = {
  children: ReactNode;
  header?: ReactNode;
  footer?: ReactNode;
  padding?: CardPadding;
  style?: CSSProperties;
  className?: string;
};

const bodyPaddingClasses: Record<CardPadding, string> = {
  none: 'p-0',
  sm: 'p-3',
  md: 'p-5',
  lg: 'p-7',
};

const chromePaddingClasses: Record<CardPadding, string> = {
  none: 'px-0 py-3',
  sm: 'px-3 py-3',
  md: 'px-5 py-3',
  lg: 'px-7 py-3',
};

export function Card({
  children,
  header,
  footer,
  padding = 'md',
  style,
  className,
}: CardProps) {
  return (
    <div
      className={cn(
        'overflow-hidden rounded-md border border-border bg-background-elevated shadow-card',
        className,
      )}
      style={style}
    >
      {header && (
        <div
          className={cn(
            'flex items-center justify-between border-b border-border',
            chromePaddingClasses[padding],
          )}
        >
          {header}
        </div>
      )}
      <div className={bodyPaddingClasses[padding]}>{children}</div>
      {footer && (
        <div
          className={cn(
            'border-t border-border bg-background',
            chromePaddingClasses[padding],
          )}
        >
          {footer}
        </div>
      )}
    </div>
  );
}
