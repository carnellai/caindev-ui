import { Menu as BaseMenu } from '@base-ui/react/menu';
import { cn } from '../lib/cn';
import type { CSSProperties, ReactElement } from 'react';

export type MenuItem = {
  label: string;
  onSelect?: () => void;
  disabled?: boolean;
  destructive?: boolean;
};

export type MenuGroup = {
  items: MenuItem[];
};

export type MenuProps = {
  trigger: ReactElement;
  groups: MenuGroup[];
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
  style?: CSSProperties;
};

export function Menu({
  trigger,
  groups,
  open,
  defaultOpen,
  onOpenChange,
  className,
  style,
}: MenuProps) {
  return (
    <BaseMenu.Root
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={(nextOpen) => onOpenChange?.(nextOpen)}
    >
      <BaseMenu.Trigger render={trigger} />
      <BaseMenu.Portal>
        <BaseMenu.Positioner sideOffset={6}>
          <BaseMenu.Popup
            className={cn(
              'min-w-[180px] rounded-md border border-border-strong bg-background-elevated p-1 shadow-popover outline-none transition-[transform,opacity] duration-[120ms] data-[starting-style]:scale-95 data-[starting-style]:opacity-0 data-[ending-style]:scale-95 data-[ending-style]:opacity-0',
              className,
            )}
            style={{
              transformOrigin: 'var(--transform-origin)',
              ...style,
            }}
          >
            {groups.map((group, gi) => (
              <div key={gi}>
                {gi > 0 && (
                  <BaseMenu.Separator
                    className="my-1 h-px bg-border"
                  />
                )}
                {group.items.map((item) => (
                  <BaseMenu.Item
                    key={item.label}
                    label={item.label}
                    disabled={item.disabled}
                    onClick={item.onSelect}
                    className={cn(
                      'flex cursor-default select-none items-center rounded-sm px-2.5 py-[7px] text-sm outline-none transition-[background,color] duration-[80ms] data-[disabled]:opacity-40 data-[highlighted]:bg-surface-hover data-[highlighted]:text-foreground',
                      item.destructive ? 'text-destructive' : 'text-foreground-muted',
                    )}
                  >
                    {item.label}
                  </BaseMenu.Item>
                ))}
              </div>
            ))}
          </BaseMenu.Popup>
        </BaseMenu.Positioner>
      </BaseMenu.Portal>
    </BaseMenu.Root>
  );
}
