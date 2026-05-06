import { Menu as BaseMenu } from '@base-ui/react/menu';

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
  trigger: React.ReactElement;
  groups: MenuGroup[];
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
  style?: React.CSSProperties;
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
            className={[
              'min-w-[180px] rounded-[8px] border border-border-strong bg-background-elevated p-1 shadow-[0_8px_24px_rgba(0,0,0,0.4),0_2px_8px_rgba(0,0,0,0.3)] outline-none transition-[transform,opacity] duration-[120ms] data-[starting-style]:scale-95 data-[starting-style]:opacity-0 data-[ending-style]:scale-95 data-[ending-style]:opacity-0',
              className,
            ].filter(Boolean).join(' ')}
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
                    className={[
                      'flex cursor-default select-none items-center rounded-sm px-2.5 py-[7px] text-sm outline-none transition-[background,color] duration-[80ms] data-[disabled]:opacity-40 data-[highlighted]:bg-background-subtle data-[highlighted]:text-foreground',
                      item.destructive ? 'text-destructive' : 'text-foreground-muted',
                    ].join(' ')}
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
