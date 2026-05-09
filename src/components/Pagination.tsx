import type { CSSProperties, PointerEvent } from 'react';
import { cn } from '../lib/cn';

export type PaginationProps = {
  /** Current 1-based page. */
  page: number
  /** Total number of pages available. */
  totalPages: number
  /** Called with the next 1-based page when a page control is pressed. */
  onPageChange: (page: number) => void
  /** Number of neighbor pages to show on each side of the current page. */
  siblings?: number
  className?: string
  style?: CSSProperties
}

function ChevronLeftIcon() {
  return (
    <svg
      width='14'
      height='14'
      viewBox='0 0 14 14'
      fill='none'
      stroke='currentColor'
      strokeWidth='1.5'
      strokeLinecap='round'>
      <path d='M9 2L4 7l5 5' />
    </svg>
  )
}

function ChevronRightIcon() {
  return (
    <svg
      width='14'
      height='14'
      viewBox='0 0 14 14'
      fill='none'
      stroke='currentColor'
      strokeWidth='1.5'
      strokeLinecap='round'>
      <path d='M5 2l5 5-5 5' />
    </svg>
  )
}

function getPages(
  page: number,
  totalPages: number,
  siblings: number,
): (number | '...')[] {
  const delta = siblings + 2
  const range: number[] = []

  for (
    let i = Math.max(2, page - siblings);
    i <= Math.min(totalPages - 1, page + siblings);
    i++
  ) {
    range.push(i)
  }

  const left = range[0] > 2 ? '...' : null
  const right = range[range.length - 1] < totalPages - 1 ? '...' : null

  const pages: (number | '...')[] = [1]
  if (left) pages.push('...')
  pages.push(...range)
  if (right) pages.push('...')
  if (totalPages > 1) pages.push(totalPages)

  return pages
}

function clampPage(page: number, totalPages: number) {
  return Math.min(Math.max(page, 1), totalPages)
}

export function Pagination({
  page,
  totalPages,
  onPageChange,
  siblings = 1,
  className,
  style,
}: PaginationProps) {
  const boundedTotalPages = Math.max(1, totalPages)
  const currentPage = clampPage(page, boundedTotalPages)
  const pages = getPages(currentPage, boundedTotalPages, siblings)
  const preserveFocusWithoutScroll = (event: PointerEvent<HTMLButtonElement>) => {
    const button = event.currentTarget;
    if (document.activeElement !== button) {
      event.preventDefault();
      button.focus({ preventScroll: true });
    }
  };
  const goToPage = (nextPage: number) => {
    onPageChange(clampPage(nextPage, boundedTotalPages))
  }

  const itemBase =
    'flex h-[30px] min-w-[30px] cursor-pointer select-none items-center justify-center rounded-sm border px-2 text-xs font-medium outline-none transition-[background,border-color,color] duration-[80ms] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-not-allowed disabled:opacity-40'

  return (
    <nav
      aria-label='Pagination'
      className={cn('flex items-center gap-1', className)}
      style={style}>
      <button
        type='button'
        onPointerDown={preserveFocusWithoutScroll}
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage <= 1}
        aria-label='Previous page'
        className={cn(
          itemBase,
          'border-border-strong bg-surface-control text-foreground-muted hover:bg-surface-hover hover:text-foreground',
        )}>
        <ChevronLeftIcon />
      </button>

      {pages.map((p, i) =>
        p === '...' ? (
          <span
            key={`ellipsis-${i}`}
            className='flex h-[30px] w-[25px] items-end justify-center pb-1 text-xs text-foreground-subtle'>
            ···
          </span>
        ) : (
          <button
            type='button'
            key={p}
            onPointerDown={preserveFocusWithoutScroll}
            onClick={() => goToPage(p)}
            aria-label={`Page ${p}`}
            aria-current={p === currentPage ? 'page' : undefined}
            className={cn(
              itemBase,
              p === currentPage
                ? 'border-accent bg-accent text-accent-foreground'
                : 'border-border-strong bg-surface-control text-foreground-muted hover:bg-surface-hover hover:text-foreground',
            )}>
            {p}
          </button>
        ),
      )}

      <button
        type='button'
        onPointerDown={preserveFocusWithoutScroll}
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage >= boundedTotalPages}
        aria-label='Next page'
        className={cn(
          itemBase,
          'border-border-strong bg-surface-control text-foreground-muted hover:bg-surface-hover hover:text-foreground',
        )}>
        <ChevronRightIcon />
      </button>
    </nav>
  )
}
