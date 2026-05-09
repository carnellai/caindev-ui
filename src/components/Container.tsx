import { cn } from '../lib/cn';
import type { HTMLAttributes } from 'react';
export type ContainerSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

export type ContainerProps = HTMLAttributes<HTMLDivElement> & {
  size?: ContainerSize;
  center?: boolean;
};

const sizeClasses: Record<ContainerSize, string> = {
  sm: 'max-w-[640px]',
  md: 'max-w-[768px]',
  lg: 'max-w-[1024px]',
  xl: 'max-w-[1280px]',
  full: 'max-w-none',
};

export function Container({
  size = 'xl',
  center = true,
  children,
  style,
  className,
  ...props
}: ContainerProps) {
  return (
    <div
      {...props}
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
