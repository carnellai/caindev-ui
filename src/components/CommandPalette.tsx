import { Dialog as BaseDialog } from '@base-ui/react/dialog';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { KeyboardEvent as ReactKeyboardEvent, ReactElement, ReactNode } from 'react';
import { cn } from '../lib/cn';

export type CommandItem = {
  id: string;
  label: string;
  description?: string;
  icon?: ReactNode;
  /** Optional section label used to group filtered results. */
  group?: string;
  /** Extra searchable terms that are not displayed. */
  keywords?: string[];
  /** Runs when the item is clicked or selected with Enter. */
  onSelect: () => void;
};

export type CommandPaletteProps = {
  /** Command items are filtered by label, description, and keywords. */
  items: CommandItem[];
  /** Controlled open state. */
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  placeholder?: string;
  emptyText?: string;
  /** Element rendered as the Base UI dialog trigger. */
  trigger?: ReactElement;
};

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <circle cx="7" cy="7" r="4.5" />
      <path d="M10.5 10.5L14 14" />
    </svg>
  );
}

function normalize(str: string) {
  return str.toLowerCase().replace(/[-_\s]+/g, ' ').trim();
}

function matchesQuery(item: CommandItem, query: string): boolean {
  if (!query) return true;
  const q = normalize(query);
  return (
    normalize(item.label).includes(q) ||
    (item.description ? normalize(item.description).includes(q) : false) ||
    (item.keywords ? item.keywords.some((k) => normalize(k).includes(q)) : false)
  );
}

export function CommandPalette({
  items,
  open,
  defaultOpen,
  onOpenChange,
  placeholder = 'Search...',
  emptyText = 'No results found.',
  trigger,
}: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(
    () => items.filter((item) => matchesQuery(item, query)),
    [items, query],
  );

  // Group items
  const grouped = useMemo(() => {
    const groups: Record<string, CommandItem[]> = {};
    for (const item of filtered) {
      const g = item.group ?? '';
      if (!groups[g]) groups[g] = [];
      groups[g].push(item);
    }
    return groups;
  }, [filtered]);

  const flatFiltered = filtered;

  // Reset on open
  function handleOpenChange(nextOpen: boolean) {
    if (nextOpen) {
      setQuery('');
      setActiveIndex(0);
    }
    onOpenChange?.(nextOpen);
  }

  // Clamp activeIndex when filtered changes
  useEffect(() => {
    setActiveIndex((i) => Math.min(i, Math.max(0, flatFiltered.length - 1)));
  }, [flatFiltered.length]);

  function handleKeyDown(e: ReactKeyboardEvent) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, flatFiltered.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      flatFiltered[activeIndex]?.onSelect();
    }
  }

  // Scroll active item into view
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const active = list.querySelector('[data-active="true"]') as HTMLElement | null;
    active?.scrollIntoView({ block: 'nearest' });
  }, [activeIndex]);

  return (
    <BaseDialog.Root
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={handleOpenChange}
    >
      {trigger && <BaseDialog.Trigger render={trigger} />}

      <BaseDialog.Portal>
        <BaseDialog.Backdrop className="fixed inset-0 min-h-dvh bg-overlay-backdrop backdrop-blur-[4px] transition-opacity duration-150 data-[starting-style]:opacity-0 data-[ending-style]:opacity-0 supports-[-webkit-touch-callout:none]:absolute" />
        <BaseDialog.Popup
          className="fixed left-1/2 top-[20vh] w-[560px] max-w-[calc(100vw-2rem)] -translate-x-1/2 rounded-lg border border-border-strong bg-background-elevated shadow-dialog outline-none transition-[transform,opacity] duration-150 data-[starting-style]:scale-95 data-[starting-style]:opacity-0 data-[ending-style]:scale-95 data-[ending-style]:opacity-0"
          onKeyDown={handleKeyDown}
        >
          <BaseDialog.Title className="sr-only">Command palette</BaseDialog.Title>

          {/* Search input */}
          <div className="flex items-center gap-2.5 border-b border-border px-4 py-3">
            <span className="shrink-0 text-foreground-subtle">
              <SearchIcon />
            </span>
            <input
              ref={inputRef}
              autoFocus
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setActiveIndex(0);
              }}
              placeholder={placeholder}
              className="flex-1 border-0 bg-transparent text-sm text-foreground outline-none placeholder:text-foreground-subtle"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="flex h-5 w-5 shrink-0 cursor-pointer items-center justify-center rounded border-0 bg-transparent p-0 text-foreground-subtle outline-none hover:text-foreground"
                aria-label="Clear search"
              >
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                  <path d="M2 2l6 6M8 2l-6 6" />
                </svg>
              </button>
            )}
          </div>

          {/* Results */}
          <div
            ref={listRef}
            role="listbox"
            aria-label="Commands"
            className="max-h-[360px] overflow-y-auto overscroll-contain p-2"
          >
            {flatFiltered.length === 0 ? (
              <div className="px-3 py-8 text-center text-sm text-foreground-subtle">
                {emptyText}
              </div>
            ) : (
              Object.entries(grouped).map(([group, groupItems]) => (
                <div key={group} className="mb-1 last:mb-0">
                  {group && (
                    <div className="mb-1 px-2.5 pt-2 text-[0.6875rem] font-semibold uppercase tracking-[0.08em] text-foreground-subtle">
                      {group}
                    </div>
                  )}
                  {groupItems.map((item) => {
                    const globalIndex = flatFiltered.indexOf(item);
                    const isActive = globalIndex === activeIndex;
                    return (
                      <div
                        key={item.id}
                        role="option"
                        aria-selected={isActive}
                        data-active={isActive}
                        onMouseEnter={() => setActiveIndex(globalIndex)}
                        onClick={() => item.onSelect()}
                        className={cn(
                          'flex cursor-default select-none items-center gap-3 rounded-sm px-2.5 py-2 text-sm outline-none transition-[background,color] duration-[60ms]',
                          isActive
                            ? 'bg-surface-hover text-foreground'
                            : 'text-foreground-muted',
                        )}
                      >
                        {item.icon && (
                          <span className="flex h-5 w-5 shrink-0 items-center justify-center text-foreground-subtle">
                            {item.icon}
                          </span>
                        )}
                        <div className="flex flex-1 flex-col gap-0.5 min-w-0">
                          <span className="truncate font-medium leading-none">{item.label}</span>
                          {item.description && (
                            <span className="truncate text-xs text-foreground-subtle">
                              {item.description}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center gap-3 border-t border-border px-4 py-2">
            <span className="flex items-center gap-1 text-[0.6875rem] text-foreground-subtle">
              <kbd className="flex h-4 min-w-[16px] items-center justify-center rounded border border-border-strong px-1 font-mono text-[0.625rem] text-foreground-subtle">↑↓</kbd>
              navigate
            </span>
            <span className="flex items-center gap-1 text-[0.6875rem] text-foreground-subtle">
              <kbd className="flex h-4 min-w-[16px] items-center justify-center rounded border border-border-strong px-1 font-mono text-[0.625rem] text-foreground-subtle">↵</kbd>
              select
            </span>
            <span className="flex items-center gap-1 text-[0.6875rem] text-foreground-subtle">
              <kbd className="flex h-4 min-w-[16px] items-center justify-center rounded border border-border-strong px-1 font-mono text-[0.625rem] text-foreground-subtle">esc</kbd>
              close
            </span>
          </div>
        </BaseDialog.Popup>
      </BaseDialog.Portal>
    </BaseDialog.Root>
  );
}

export function useCommandPalette() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function handleKeyDown(e: globalThis.KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return { open, setOpen };
}
