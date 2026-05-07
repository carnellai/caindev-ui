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
          <BaseTooltip.Positioner
            side={side}
            align="center"
            sideOffset={8}
            collisionPadding={8}
            positionMethod="fixed"
            className="z-[9999] outline-none"
          >
            <BaseTooltip.Popup
              className={cn(
                'max-w-[240px] rounded-sm border border-border bg-background-elevated px-[10px] py-[7px] text-xs font-medium leading-[1.45] text-foreground shadow-popover transition-[transform,opacity] duration-100 data-[starting-style]:scale-95 data-[starting-style]:opacity-0 data-[ending-style]:scale-95 data-[ending-style]:opacity-0 data-[instant]:transition-none',
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
