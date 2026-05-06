import { cn } from '../lib/cn';
import type { CSSProperties, ReactNode } from 'react';
export type StackDirection = 'vertical' | 'horizontal';

export type StackProps = {
  children: ReactNode;
  direction?: StackDirection;
  gap?: string | number;
  align?: CSSProperties['alignItems'];
  justify?: CSSProperties['justifyContent'];
  wrap?: boolean;
  style?: CSSProperties;
  className?: string;
};

export type HStackProps = Omit<StackProps, 'direction'>;
export type VStackProps = Omit<StackProps, 'direction'>;

export function Stack({
  children,
  direction = 'vertical',
  gap = '16px',
  align,
  justify,
  wrap = false,
  style,
  className,
}: StackProps) {
  return (
    <div
      className={cn('flex', className)}
      style={{
        // Intentional inline styles: all values below are prop-driven at
        // runtime. direction, gap, align, justify, and wrap accept arbitrary
        // consumer values that cannot be mapped to static Tailwind classes.
        flexDirection: direction === 'vertical' ? 'column' : 'row',
        gap: typeof gap === 'number' ? `${gap}px` : gap,
        alignItems: align,
        justifyContent: justify,
        flexWrap: wrap ? 'wrap' : 'nowrap',
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export function HStack(props: HStackProps) {
  return <Stack {...props} direction="horizontal" />;
}

export function VStack(props: VStackProps) {
  return <Stack {...props} direction="vertical" />;
}
