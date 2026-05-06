export type PaginationProps = {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
  siblings?: number
  showEdges?: boolean
  className?: string
  style?: React.CSSProperties
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

export function Pagination({
  page,
  totalPages,
  onPageChange,
  siblings = 1,
  className,
  style,
}: PaginationProps) {
  const pages = getPages(page, totalPages, siblings)

  const itemBase =
    'flex h-[30px] min-w-[30px] cursor-pointer select-none items-center justify-center rounded-[6px] border px-2 text-xs font-medium outline-none transition-[background,border-color,color] duration-[80ms] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-not-allowed disabled:opacity-40'

  return (
    <nav
      aria-label='Pagination'
      className={['flex items-center gap-1', className]
        .filter(Boolean)
        .join(' ')}
      style={style}>
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        aria-label='Previous page'
        className={[
          itemBase,
          'border-border-strong bg-surface-control text-foreground-muted hover:bg-surface-hover hover:text-foreground',
        ].join(' ')}>
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
            key={p}
            onClick={() => onPageChange(p)}
            aria-label={`Page ${p}`}
            aria-current={p === page ? 'page' : undefined}
            className={[
              itemBase,
              p === page
                ? 'border-accent bg-accent text-accent-foreground'
                : 'border-border-strong bg-surface-control text-foreground-muted hover:bg-surface-hover hover:text-foreground',
            ].join(' ')}>
            {p}
          </button>
        ),
      )}

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        aria-label='Next page'
        className={[
          itemBase,
          'border-border-strong bg-surface-control text-foreground-muted hover:bg-surface-hover hover:text-foreground',
        ].join(' ')}>
        <ChevronRightIcon />
      </button>
    </nav>
  )
}
