import { Tooltip as BaseTooltip } from '@base-ui/react/tooltip';
import { cn } from '../lib/cn';
import type { CSSProperties, ReactElement, ReactNode } from 'react';

export type TooltipSide = 'top' | 'bottom' | 'left' | 'right';

export type TooltipProps = {
  content: ReactNode;
  children: ReactElement;
  side?: TooltipSide;
  delay?: number;
  closeDelay?: number;
  disabled?: boolean;
  className?: string;
  style?: CSSProperties;
};

export function Tooltip({
  content,
  children,
  side = 'top',
  delay = 300,
  closeDelay,
  disabled,
  className,
  style,
}: TooltipProps) {
  return (
    <BaseTooltip.Provider delay={delay} closeDelay={closeDelay}>
      <BaseTooltip.Root disabled={disabled}>
        <BaseTooltip.Trigger render={children} />
        <BaseTooltip.Portal>
          <BaseTooltip.Positioner side={side} sideOffset={8}>
            <BaseTooltip.Popup
              className={cn(
                'max-w-[220px] rounded-sm border border-border-strong bg-background-elevated px-2.5 py-1.5 text-xs font-medium leading-[1.4] text-foreground shadow-popover transition-[transform,opacity] duration-100 data-[starting-style]:scale-95 data-[starting-style]:opacity-0 data-[ending-style]:scale-95 data-[ending-style]:opacity-0 data-[instant]:transition-none',
                className,
              )}
              style={{
                transformOrigin: 'var(--transform-origin)',
                ...style,
              }}
            >
              {content}
            </BaseTooltip.Popup>
          </BaseTooltip.Positioner>
        </BaseTooltip.Portal>
      </BaseTooltip.Root>
    </BaseTooltip.Provider>
  );
}
