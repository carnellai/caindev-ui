import { Accordion as BaseAccordion } from '@base-ui/react/accordion';

export type AccordionItem = {
  value: string;
  trigger: React.ReactNode;
  content: React.ReactNode;
  disabled?: boolean;
};

export type AccordionValue = string[];

export type AccordionProps = {
  items: AccordionItem[];
  multiple?: boolean;
  value?: AccordionValue;
  defaultValue?: AccordionValue;
  onValueChange?: (value: AccordionValue) => void;
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
};

function PlusIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
      <path d="M6.75 0H5.25V5.25H0V6.75L5.25 6.75V12H6.75V6.75L12 6.75V5.25H6.75V0Z" />
    </svg>
  );
}

export function Accordion({
  items,
  multiple = false,
  value,
  defaultValue,
  onValueChange,
  disabled,
  className,
  style,
}: AccordionProps) {
  return (
    <BaseAccordion.Root
      multiple={multiple}
      value={value}
      defaultValue={defaultValue}
      onValueChange={onValueChange}
      disabled={disabled}
      className={['flex w-full flex-col', className].filter(Boolean).join(' ')}
      style={style}
    >
      {items.map((item) => (
        <BaseAccordion.Item
          key={item.value}
          value={item.value}
          disabled={item.disabled}
          className="border-b border-border"
        >
          <BaseAccordion.Header className="m-0">
            <BaseAccordion.Trigger
              className="group flex w-full cursor-pointer select-none items-center justify-between gap-4 border-0 bg-transparent py-3.5 text-left text-sm font-medium text-foreground outline-none data-[disabled]:cursor-not-allowed data-[disabled]:opacity-40 hover:text-foreground-muted focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              <span>{item.trigger}</span>
              <span
                className="shrink-0 text-foreground-subtle transition-transform duration-200 ease-[ease] group-data-[panel-open]:rotate-45"
              >
                <PlusIcon />
              </span>
            </BaseAccordion.Trigger>
          </BaseAccordion.Header>

          <BaseAccordion.Panel
            style={{ height: 'var(--accordion-panel-height)' }}
            className="overflow-hidden transition-[height] duration-200 ease-[ease] data-[starting-style]:h-0 data-[ending-style]:h-0"
          >
            <div
              className="pb-3.5 text-sm leading-[1.6] text-foreground-muted"
            >
              {item.content}
            </div>
          </BaseAccordion.Panel>
        </BaseAccordion.Item>
      ))}
    </BaseAccordion.Root>
  );
}
