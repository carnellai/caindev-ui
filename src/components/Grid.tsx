import { cn } from '../lib/cn';
import type { HTMLAttributes } from 'react';
export type GridProps = HTMLAttributes<HTMLDivElement> & {
  cols?: number | string;
  gap?: string | number;
  rowGap?: string | number;
  colGap?: string | number;
  minColWidth?: string;
};

export function Grid({
  cols = 2,
  gap = '16px',
  rowGap,
  colGap,
  minColWidth,
  children,
  style,
  className,
  ...props
}: GridProps) {
  const template = minColWidth
    ? `repeat(auto-fill, minmax(${minColWidth}, 1fr))`
    : typeof cols === 'number'
      ? `repeat(${cols}, 1fr)`
      : cols;

  return (
    <div
      {...props}
      className={cn('grid', className)}
      style={{
        // Intentional inline styles: all values below are prop-driven at
        // runtime. gridTemplateColumns is computed from cols/minColWidth and
        // can be an arbitrary consumer string; gap values accept any unit.
        // None of these can be mapped to static Tailwind classes.
        gridTemplateColumns: template,
        gap: typeof gap === 'number' ? `${gap}px` : gap,
        rowGap: rowGap != null
          ? typeof rowGap === 'number'
            ? `${rowGap}px`
            : rowGap
          : undefined,
        columnGap: colGap != null
          ? typeof colGap === 'number'
            ? `${colGap}px`
            : colGap
          : undefined,
        ...style,
      }}
    >
      {children}
    </div>
  );
}
