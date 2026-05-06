import { Separator as BaseSeparator } from '@base-ui/react/separator';
import { cn } from '../lib/cn';
import type { CSSProperties } from 'react';

export type SeparatorOrientation = 'horizontal' | 'vertical';

export type SeparatorProps = {
  orientation?: SeparatorOrientation;
  label?: string;
  style?: CSSProperties;
  className?: string;
};

export function Separator({
  orientation = 'horizontal',
  label,
  style,
  className,
}: SeparatorProps) {
  if (orientation === 'vertical') {
    return (
      <BaseSeparator
        className={cn('w-px self-stretch bg-border', className)}
        orientation="vertical"
        style={style}
      />
    );
  }

  if (label) {
    return (
      <div
        className={cn('flex items-center gap-3', className)}
        style={style}
      >
        <BaseSeparator className="h-px flex-1 bg-border" />
        <span className="whitespace-nowrap text-xs text-foreground-subtle">
          {label}
        </span>
        <BaseSeparator className="h-px flex-1 bg-border" />
      </div>
    );
  }

  return (
    <BaseSeparator
      className={cn('h-px bg-border', className)}
      style={style}
    />
  );
}
