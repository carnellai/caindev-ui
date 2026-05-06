export type CardPadding = 'none' | 'sm' | 'md' | 'lg';

export type CardProps = {
  children: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  padding?: CardPadding;
  style?: React.CSSProperties;
  className?: string;
};

const bodyPaddingClasses: Record<CardPadding, string> = {
  none: 'p-0',
  sm: 'p-3',
  md: 'p-5',
  lg: 'p-7',
};

const chromePaddingClasses: Record<CardPadding, string> = {
  none: 'px-0 py-3',
  sm: 'px-3 py-3',
  md: 'px-5 py-3',
  lg: 'px-7 py-3',
};

export function Card({
  children,
  header,
  footer,
  padding = 'md',
  style,
  className,
}: CardProps) {
  return (
    <div
      className={[
        'overflow-hidden rounded-[8px] border border-border bg-background-elevated shadow-[0_1px_3px_rgba(0,0,0,0.2)]',
        className,
      ].filter(Boolean).join(' ')}
      style={style}
    >
      {header && (
        <div
          className={[
            'flex items-center justify-between border-b border-border',
            chromePaddingClasses[padding],
          ].join(' ')}
        >
          {header}
        </div>
      )}
      <div className={bodyPaddingClasses[padding]}>{children}</div>
      {footer && (
        <div
          className={[
            'border-t border-border bg-background',
            chromePaddingClasses[padding],
          ].join(' ')}
        >
          {footer}
        </div>
      )}
    </div>
  );
}
