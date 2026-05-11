import { Menu as BaseMenu } from '@base-ui/react/menu';
import { cn } from '../lib/cn';
import type { CSSProperties, ReactElement } from 'react';

export type MenuItem = {
  id?: string;
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
      onOpenChange={onOpenChange}
    >
      <BaseMenu.Trigger render={trigger} />
      <BaseMenu.Portal>
        <BaseMenu.Positioner
          sideOffset={6}
          collisionPadding={8}
          positionMethod="fixed"
          className="z-[9999] outline-none"
        >
          <BaseMenu.Popup
            className={cn(
              'min-w-[192px] rounded-md border border-border bg-background-elevated p-[6px] text-foreground shadow-popover outline-none transition-[transform,opacity] duration-[120ms] data-[starting-style]:scale-95 data-[starting-style]:opacity-0 data-[ending-style]:scale-95 data-[ending-style]:opacity-0',
              className,
            )}
            style={{
              transformOrigin: 'var(--transform-origin)',
              ...style,
            }}
          >
            {groups.map((group, gi) => (
              // MenuGroup has no stable id; gi is acceptable since group order is static.
              <div key={gi}>
                {gi > 0 && (
                  <BaseMenu.Separator
                    className="my-[6px] h-px bg-border"
                  />
                )}
                {group.items.map((item) => (
                  <BaseMenu.Item
                    // Prefer item.id when provided; fall back to gi-prefixed label to
                    // prevent collisions when the same label appears in sibling groups.
                    key={item.id ?? `${gi}-${item.label}`}
                    label={item.label}
                    disabled={item.disabled}
                    onClick={item.onSelect}
                    className={cn(
                      'flex min-h-[34px] cursor-default select-none items-center rounded-sm px-[10px] py-[8px] text-sm outline-none transition-[background,color] duration-[80ms] data-[disabled]:cursor-not-allowed data-[disabled]:opacity-40 data-[highlighted]:bg-surface-hover',
                      item.destructive
                        ? 'text-destructive data-[highlighted]:text-destructive'
                        : 'text-foreground-muted data-[highlighted]:text-foreground',
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
