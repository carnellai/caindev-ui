import { Tabs as BaseTabs } from '@base-ui/react/tabs';

export type Tab = {
  value: string;
  label: string;
  content: React.ReactNode;
  disabled?: boolean;
};

export type TabsProps = {
  tabs: Tab[];
  defaultValue?: string;
  value?: string | null;
  onValueChange?: (value: string | null) => void;
  className?: string;
  style?: React.CSSProperties;
};

export function Tabs({ tabs, defaultValue, value, onValueChange, className, style }: TabsProps) {
  return (
    <BaseTabs.Root
      defaultValue={defaultValue ?? tabs[0]?.value}
      value={value}
      onValueChange={(nextValue) => onValueChange?.(nextValue)}
      className={['flex flex-col gap-0', className].filter(Boolean).join(' ')}
      style={style}
    >
      <BaseTabs.List
        className="relative flex items-center gap-0.5 border-b border-border px-0.5"
      >
        {tabs.map((tab) => (
          <BaseTabs.Tab
            key={tab.value}
            value={tab.value}
            disabled={tab.disabled}
            className="relative flex h-9 cursor-pointer select-none items-center border-0 bg-transparent px-3 text-sm font-medium text-foreground-subtle outline-none transition-colors duration-[120ms] data-[active]:text-foreground data-[disabled]:cursor-not-allowed data-[disabled]:opacity-40 hover:text-foreground-muted focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent"
          >
            {tab.label}
          </BaseTabs.Tab>
        ))}
        <BaseTabs.Indicator
          className="absolute bottom-[-1px] left-0 h-0.5 rounded-[1px] bg-accent transition-[width,transform] duration-200"
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
          className="py-5 outline-none focus-visible:rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          {tab.content}
        </BaseTabs.Panel>
      ))}
    </BaseTabs.Root>
  );
}
