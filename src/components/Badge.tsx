export type BadgeVariant =
  | 'default'
  | 'success'
  | 'warning'
  | 'error'
  | 'info'
  | 'outline';
export type BadgeSize = 'sm' | 'md';

export type BadgeProps = {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  style?: React.CSSProperties;
  className?: string;
};

const variantClasses: Partial<Record<BadgeVariant, string>> = {
  default: 'border border-border bg-background-subtle text-foreground-muted',
  success: 'border border-emerald-400/20 bg-emerald-400/10 text-emerald-400',
  warning: 'border border-amber-400/20 bg-amber-400/10 text-amber-400',
  error: 'border border-red-400/20 bg-red-400/10 text-red-400',
  info: 'border border-violet-400/20 bg-violet-400/10 text-violet-400',
  outline: 'border border-border-strong bg-transparent text-foreground-muted',
};

const sizeClasses: Record<BadgeSize, string> = {
  sm: 'gap-1 rounded-[4px] px-1.5 py-px text-[0.625rem]',
  md: 'gap-1 rounded-[4px] px-2 py-0.5 text-[0.6875rem]',
};

export function Badge({
  children,
  variant = 'default',
  size = 'md',
  style,
  className,
}: BadgeProps) {
  return (
    <span
      className={[
        'inline-flex items-center whitespace-nowrap font-medium tracking-[0.02em]',
        variantClasses[variant],
        sizeClasses[size],
        className,
      ].filter(Boolean).join(' ')}
      style={style}
    >
      {children}
    </span>
  );
}
