export type GridProps = {
  children: React.ReactNode;
  cols?: number | string;
  gap?: string | number;
  rowGap?: string | number;
  colGap?: string | number;
  minColWidth?: string;
  style?: React.CSSProperties;
  className?: string;
};

export function Grid({
  children,
  cols = 2,
  gap = '16px',
  rowGap,
  colGap,
  minColWidth,
  style,
  className,
}: GridProps) {
  const template = minColWidth
    ? `repeat(auto-fill, minmax(${minColWidth}, 1fr))`
    : typeof cols === 'number'
      ? `repeat(${cols}, 1fr)`
      : cols;

  return (
    <div
      className={['grid', className].filter(Boolean).join(' ')}
      style={{
        // Intentional inline styles: all values below are prop-driven at
        // runtime. gridTemplateColumns is computed from cols/minColWidth and
        // can be an arbitrary consumer string; gap values accept any unit.
        // None of these can be mapped to static Tailwind classes.
        gridTemplateColumns: template,
        gap: typeof gap === 'number' ? `${gap}px` : gap,
        rowGap: rowGap
          ? typeof rowGap === 'number'
            ? `${rowGap}px`
            : rowGap
          : undefined,
        columnGap: colGap
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
