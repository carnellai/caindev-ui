import { Combobox as BaseCombobox } from '@base-ui/react/combobox'

export type ComboboxOption = {
  label: string
  value: string
  disabled?: boolean
}

export type ComboboxProps = {
  label?: string
  placeholder?: string
  options: ComboboxOption[]
  value?: string | null
  defaultValue?: string | null
  onValueChange?: (value: string | null) => void
  emptyText?: string
  disabled?: boolean
  className?: string
  style?: React.CSSProperties
}

function CheckIcon() {
  return (
    <svg width='10' height='10' viewBox='0 0 10 10' fill='currentColor'>
      <path d='M9.1603 1.12218C9.50684 1.34873 9.60427 1.81354 9.37792 2.16038L5.13603 8.66012C5.01614 8.8438 4.82192 8.96576 4.60451 8.99384C4.3871 9.02194 4.1683 8.95335 4.00574 8.80615L1.24664 6.30769C0.939709 6.02975 0.916013 5.55541 1.19372 5.24822C1.47142 4.94102 1.94536 4.91731 2.2523 5.19524L4.36085 7.10461L8.12299 1.33999C8.34934 0.993152 8.81376 0.895638 9.1603 1.12218Z' />
    </svg>
  )
}

function ChevronIcon() {
  return (
    <svg
      width='12'
      height='12'
      viewBox='0 0 12 12'
      fill='none'
      stroke='currentColor'
      strokeWidth='1.5'
      strokeLinecap='round'>
      <path d='M2 4.5L6 8L10 4.5' />
    </svg>
  )
}

export function Combobox({
  label,
  placeholder = 'Search...',
  options,
  value,
  defaultValue,
  onValueChange,
  emptyText = 'No results found.',
  disabled,
  className,
  style,
}: ComboboxProps) {
  return (
    <div
      className={['flex flex-col gap-1.5', className].filter(Boolean).join(' ')}
      style={style}>
      {label && (
        <label
          className={[
            'text-[0.8125rem] font-medium',
            disabled ? 'text-foreground-subtle' : 'text-foreground',
          ].join(' ')}>
          {label}
        </label>
      )}
      <BaseCombobox.Root
        items={options}
        value={value}
        defaultValue={defaultValue}
        onValueChange={onValueChange}
        disabled={disabled}>
        {/*
          InputGroup renders a <div> that is `position: relative` internally.
          Use `box-content` so the h-9 height is the content height, not total height.
          The icon div is absolute, anchored to bottom-0, with the same height as InputGroup.
          Input uses w-full + box-border + pr to make room for the icon on the right.
        */}
        <BaseCombobox.InputGroup
          className='relative h-9 w-64 rounded-[8px] border border-border-strong bg-surface-control shadow-highlight-inset focus-within:border-accent focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-accent data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50'
          style={{ display: 'grid', gridTemplateColumns: '1fr 2.25rem' }}>
          <BaseCombobox.Input
            placeholder={placeholder}
            className='h-full min-w-0 border-0 bg-transparent pl-3 text-sm text-foreground outline-none placeholder:text-foreground-subtle'
          />
          <div className='flex items-center justify-center text-foreground-muted'>
            <BaseCombobox.Trigger
              aria-label='Open'
              className='flex h-9 w-9 cursor-pointer items-center justify-center border-0 bg-transparent p-0 outline-none hover:text-foreground'>
              <ChevronIcon />
            </BaseCombobox.Trigger>
          </div>
        </BaseCombobox.InputGroup>

        <BaseCombobox.Portal>
          <BaseCombobox.Positioner sideOffset={6} className='outline-none'>
            <BaseCombobox.Popup
              className='min-w-[260px] w-[var(--anchor-width)] rounded-[8px] border border-border-strong bg-background-elevated p-1 shadow-popover outline-none transition-[transform,opacity] duration-[120ms] data-[starting-style]:scale-95 data-[starting-style]:opacity-0 data-[ending-style]:scale-95 data-[ending-style]:opacity-0'
              style={{ transformOrigin: 'var(--transform-origin)' }}>
              <BaseCombobox.Empty className='px-2.5 py-6 text-center text-sm text-foreground-subtle'>
                {emptyText}
              </BaseCombobox.Empty>
              <BaseCombobox.List
                className='m-0 list-none overflow-y-auto p-0 outline-none'
                style={{ maxHeight: 'min(320px, var(--available-height))' }}>
                {(item: ComboboxOption) => (
                  <BaseCombobox.Item
                    key={item.value}
                    value={item.value}
                    disabled={item.disabled}
                    className='grid cursor-default select-none grid-cols-[16px_1fr] items-center gap-2 whitespace-nowrap rounded-sm px-2.5 py-[7px] text-sm text-foreground-muted outline-none data-[disabled]:cursor-not-allowed data-[disabled]:opacity-40 data-[highlighted]:bg-surface-hover data-[highlighted]:text-foreground'>
                    <BaseCombobox.ItemIndicator className='flex text-accent'>
                      <CheckIcon />
                    </BaseCombobox.ItemIndicator>
                    <span>{item.label}</span>
                  </BaseCombobox.Item>
                )}
              </BaseCombobox.List>
            </BaseCombobox.Popup>
          </BaseCombobox.Positioner>
        </BaseCombobox.Portal>
      </BaseCombobox.Root>
    </div>
  )
}
