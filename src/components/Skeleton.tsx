import { cn } from '../lib/cn';
import type { CSSProperties } from 'react';
export type SkeletonProps = {
  width?: string | number;
  height?: string | number;
  borderRadius?: string | number;
  style?: CSSProperties;
  className?: string;
};

export function Skeleton({
  width = '100%',
  height = '16px',
  borderRadius = '4px',
  style,
  className,
}: SkeletonProps) {
  return (
    <div
      className={cn('cd-skeleton relative overflow-hidden', className)}
      style={{ width, height, borderRadius, ...style }}
    >
      <div className="cd-skeleton-shimmer absolute inset-0" />
    </div>
  );
}

export type SkeletonTextProps = {
  lines?: number;
  lastLineWidth?: string;
  style?: CSSProperties;
  className?: string;
};

export function SkeletonText({
  lines = 3,
  lastLineWidth = '60%',
  style,
  className,
}: SkeletonTextProps) {
  return (
    <div className={cn('flex flex-col gap-2', className)} style={style}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} width={i === lines - 1 ? lastLineWidth : '100%'} height="14px" />
      ))}
    </div>
  );
}

export type SkeletonCardProps = {
  style?: CSSProperties;
  className?: string;
};

export function SkeletonCard({ style, className }: SkeletonCardProps = {}) {
  return (
    <div
      className={cn('flex flex-col gap-3 rounded-md border border-border p-4', className)}
      style={style}
    >
      <div className="flex items-center gap-2.5">
        <Skeleton width="32px" height="32px" borderRadius="50%" />
        <div className="flex flex-1 flex-col gap-1.5">
          <Skeleton width="40%" height="14px" />
          <Skeleton width="25%" height="11px" />
        </div>
      </div>
      <SkeletonText lines={3} />
    </div>
  );
}
