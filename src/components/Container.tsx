export type ContainerSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

export type ContainerProps = {
  children: React.ReactNode;
  size?: ContainerSize;
  center?: boolean;
  style?: React.CSSProperties;
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
      className={[
        'w-full',
        sizeClasses[size],
        center ? 'mx-auto' : undefined,
        className,
      ].filter(Boolean).join(' ')}
      style={style}
    >
      {children}
    </div>
  );
}
