import { Select as BaseSelect } from '@base-ui/react/select';
import { cn } from '../lib/cn';
import type { CSSProperties } from 'react';

export type SelectOption = {
  label: string;
  value: string;
  disabled?: boolean;
};

export type SelectProps = {
  label?: string;
  placeholder?: string;
  options: SelectOption[];
  value?: string | null;
  defaultValue?: string | null;
  onValueChange?: (value: string | null) => void;
  disabled?: boolean;
  style?: CSSProperties;
  className?: string;
  triggerStyle?: CSSProperties;
  triggerClassName?: string;
};

function ChevronUpDownIcon() {
  return (
    <svg
      width="8"
      height="12"
      viewBox="0 0 8 12"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M0.5 4.5L4 1.5L7.5 4.5" />
      <path d="M0.5 7.5L4 10.5L7.5 7.5" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
      <path d="M9.1603 1.12218C9.50684 1.34873 9.60427 1.81354 9.37792 2.16038L5.13603 8.66012C5.01614 8.8438 4.82192 8.96576 4.60451 8.99384C4.3871 9.02194 4.1683 8.95335 4.00574 8.80615L1.24664 6.30769C0.939709 6.02975 0.916013 5.55541 1.19372 5.24822C1.47142 4.94102 1.94536 4.91731 2.2523 5.19524L4.36085 7.10461L8.12299 1.33999C8.34934 0.993152 8.81376 0.895638 9.1603 1.12218Z" />
    </svg>
  );
}

export function Select({
  label,
  placeholder = 'Select an option',
  options,
  value,
  defaultValue,
  onValueChange,
  disabled,
  style,
  className,
  triggerStyle,
  triggerClassName,
}: SelectProps) {
  return (
    <div className={cn('flex flex-col gap-[6px]', className)} style={style}>
      <BaseSelect.Root
        items={options}
        value={value}
        defaultValue={defaultValue}
        onValueChange={onValueChange}
        disabled={disabled}
      >
        {label && (
          <BaseSelect.Label
            className={cn('text-[0.8125rem] font-medium', disabled ? 'text-foreground-subtle' : 'text-foreground')}
          >
            {label}
          </BaseSelect.Label>
        )}
        <BaseSelect.Trigger
          aria-label={label ? undefined : placeholder}
          className={cn(
            'box-border font-[inherit] flex h-[36px] min-w-[176px] cursor-pointer select-none appearance-none items-center justify-between gap-[8px] rounded-md border border-border bg-surface-control pl-[14px] pr-[12px] text-sm leading-none text-foreground shadow-highlight-inset outline-none transition-[background,border-color,box-shadow] duration-150 hover:bg-surface-hover data-[disabled]:cursor-not-allowed data-[disabled]:bg-surface-control-disabled data-[disabled]:opacity-60 data-[popup-open]:border-accent focus-visible:border-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
            triggerClassName,
          )}
          style={triggerStyle}
        >
          <BaseSelect.Value
            className="text-foreground data-[placeholder]:text-foreground-subtle"
            placeholder={options.length === 0 ? 'No options' : placeholder}
          />
          <BaseSelect.Icon
            className="flex text-foreground-muted"
          >
            <ChevronUpDownIcon />
          </BaseSelect.Icon>
        </BaseSelect.Trigger>

        <BaseSelect.Portal>
          <BaseSelect.Positioner
            sideOffset={6}
            collisionPadding={8}
            positionMethod="fixed"
            className="z-[9999] outline-none"
          >
            <BaseSelect.Popup
              className="rounded-md border border-border bg-background-elevated p-[6px] text-foreground shadow-popover outline-none transition-[transform,opacity] duration-[120ms] data-[starting-style]:scale-95 data-[starting-style]:opacity-0 data-[ending-style]:scale-95 data-[ending-style]:opacity-0"
              style={{
                minWidth: 'max(var(--anchor-width), 180px)',
                transformOrigin: 'var(--transform-origin)',
              }}
            >
              <BaseSelect.List
                className="m-0 list-none overflow-y-auto p-0"
                style={{
                  maxHeight: 'var(--available-height)',
                }}
              >
                {options.map(
                  ({
                    label: optLabel,
                    value: optValue,
                    disabled: optDisabled,
                  }) => (
                    <BaseSelect.Item
                      key={optValue}
                      value={optValue}
                      disabled={optDisabled}
                      className="grid cursor-default select-none grid-cols-[16px_1fr] items-center gap-[8px] whitespace-nowrap rounded-sm px-[10px] py-[8px] text-sm text-foreground-muted outline-none data-[disabled]:cursor-not-allowed data-[disabled]:opacity-40 data-[highlighted]:bg-surface-hover data-[highlighted]:text-foreground data-[selected]:bg-surface-active data-[selected]:text-foreground"
                    >
                      <BaseSelect.ItemIndicator
                        className="flex text-accent"
                      >
                        <CheckIcon />
                      </BaseSelect.ItemIndicator>
                      <BaseSelect.ItemText>{optLabel}</BaseSelect.ItemText>
                    </BaseSelect.Item>
                  ),
                )}
              </BaseSelect.List>
            </BaseSelect.Popup>
          </BaseSelect.Positioner>
        </BaseSelect.Portal>
      </BaseSelect.Root>
    </div>
  );
}
