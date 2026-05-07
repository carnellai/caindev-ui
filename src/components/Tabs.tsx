import { Tabs as BaseTabs } from '@base-ui/react/tabs';
import { cn } from '../lib/cn';
import type { CSSProperties, ReactNode } from 'react';

export type Tab = {
  value: string;
  label: string;
  content: ReactNode;
  disabled?: boolean;
};

export type TabsProps = {
  tabs: Tab[];
  defaultValue?: string;
  value?: string | null;
  onValueChange?: (value: string | null) => void;
  className?: string;
  style?: CSSProperties;
};

export function Tabs({ tabs, defaultValue, value, onValueChange, className, style }: TabsProps) {
  return (
    <BaseTabs.Root
      defaultValue={defaultValue ?? tabs[0]?.value}
      value={value}
      onValueChange={(nextValue) => onValueChange?.(nextValue)}
      className={cn('flex flex-col gap-[12px]', className)}
      style={style}
    >
      <BaseTabs.List
        className="relative flex items-center gap-[2px] rounded-md border border-border bg-background-subtle p-[3px] shadow-highlight-inset"
      >
        {tabs.map((tab) => (
          <BaseTabs.Tab
            key={tab.value}
            value={tab.value}
            disabled={tab.disabled}
            className="relative flex h-[32px] cursor-pointer select-none items-center rounded-sm border-0 bg-transparent px-[12px] text-sm font-medium text-foreground-subtle outline-none transition-[background,color] duration-[120ms] data-[active]:bg-surface-active data-[active]:text-foreground data-[disabled]:cursor-not-allowed data-[disabled]:opacity-40 hover:bg-surface-hover hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent"
          >
            {tab.label}
          </BaseTabs.Tab>
        ))}
        <BaseTabs.Indicator
          className="absolute bottom-[3px] left-0 h-[2px] rounded-sm bg-accent transition-[width,transform] duration-200"
          style={{
            width: 'var(--active-tab-width)',
            transform: 'translateX(var(--active-tab-left))',
          }}
        />
      </BaseTabs.List>

      {tabs.map((tab) => (
        <BaseTabs.Panel
          key={tab.value}
          value={tab.value}
          className="cd-tabs-panel rounded-md border border-border bg-background-elevated p-[20px] text-foreground shadow-card outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          {tab.content}
        </BaseTabs.Panel>
      ))}
    </BaseTabs.Root>
  );
}
