import { cn } from '../lib/cn';
import type { CSSProperties, ReactNode } from 'react';
export type SectionSize = 'sm' | 'md' | 'lg';

export type SectionProps = {
  children: ReactNode;
  size?: SectionSize;
  style?: CSSProperties;
  className?: string;
  id?: string;
};

const paddingMap: Record<SectionSize, string> = {
  sm: 'py-10',
  md: 'py-16',
  lg: 'py-24',
};

export function Section({
  children,
  size = 'md',
  style,
  className,
  id,
}: SectionProps) {
  return (
    <section
      id={id}
      className={cn(paddingMap[size], className)}
      style={style}
    >
      {children}
    </section>
  );
}
