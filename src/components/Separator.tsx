import { Separator as BaseSeparator } from '@base-ui/react/separator';

export type SeparatorOrientation = 'horizontal' | 'vertical';

export type SeparatorProps = {
  orientation?: SeparatorOrientation;
  label?: string;
  style?: React.CSSProperties;
  className?: string;
};

export function Separator({
  orientation = 'horizontal',
  label,
  style,
  className,
}: SeparatorProps) {
  if (orientation === 'vertical') {
    return (
      <BaseSeparator
        className={['w-px self-stretch bg-border', className].filter(Boolean).join(' ')}
        orientation="vertical"
        style={style}
      />
    );
  }

  if (label) {
    return (
      <div
        className={['flex items-center gap-3', className].filter(Boolean).join(' ')}
        style={style}
      >
        <BaseSeparator className="h-px flex-1 bg-border" />
        <span className="whitespace-nowrap text-xs text-foreground-subtle">
          {label}
        </span>
        <BaseSeparator className="h-px flex-1 bg-border" />
      </div>
    );
  }

  return (
    <BaseSeparator
      className={['h-px bg-border', className].filter(Boolean).join(' ')}
      style={style}
    />
  );
}
