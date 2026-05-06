import { cn } from '../lib/cn';
import type { CSSProperties, ReactNode } from 'react';
export type ContainerSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

export type ContainerProps = {
  children: ReactNode;
  size?: ContainerSize;
  center?: boolean;
  style?: CSSProperties;
  className?: string;
};

const sizeClasses: Record<ContainerSize, string> = {
  sm: 'max-w-[640px]',
  md: 'max-w-[768px]',
  lg: 'max-w-[1024px]',
  xl: 'max-w-[1280px]',
  full: 'max-w-none',
};

export function Container({
  children,
  size = 'xl',
  center = true,
  style,
  className,
}: ContainerProps) {
  return (
    <div
      className={cn(
        'w-full',
        sizeClasses[size],
        center ? 'mx-auto' : undefined,
        className,
      )}
      style={style}
    >
      {children}
    </div>
  );
}
