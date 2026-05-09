import { cn } from '../lib/cn';
import type { HTMLAttributes } from 'react';
export type SectionSize = 'sm' | 'md' | 'lg';

export type SectionProps = HTMLAttributes<HTMLElement> & {
  size?: SectionSize;
};

const paddingMap: Record<SectionSize, string> = {
  sm: 'py-10',
  md: 'py-16',
  lg: 'py-24',
};

export function Section({
  size = 'md',
  children,
  style,
  className,
  ...props
}: SectionProps) {
  return (
    <section
      {...props}
      className={cn(paddingMap[size], className)}
      style={style}
    >
      {children}
    </section>
  );
}
