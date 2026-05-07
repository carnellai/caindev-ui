import { cn } from '../lib/cn';
import type { CSSProperties, KeyboardEvent, ReactNode } from 'react';
export type Column<T> = {
  key: string;
  header: string;
  width?: string;
  align?: 'left' | 'center' | 'right';
  render?: (row: T) => ReactNode;
};

export type TableProps<T extends Record<string, unknown>> = {
  columns: Column<T>[];
  rows: T[];
  keyField?: string;
  onRowClick?: (row: T) => void;
  emptyMessage?: string;
  className?: string;
  style?: CSSProperties;
  tableClassName?: string;
  tableStyle?: CSSProperties;
};

export function Table<T extends Record<string, unknown>>({
  columns,
  rows,
  keyField = 'id',
  onRowClick,
  emptyMessage = 'No data',
  className,
  style,
  tableClassName,
  tableStyle,
}: TableProps<T>) {
  const handleRowKeyDown = (event: KeyboardEvent<HTMLTableRowElement>, row: T) => {
    if (!onRowClick) return;
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onRowClick(row);
    }
  };

  const renderCell = (row: T, col: Column<T>) => {
    if (col.render) return col.render(row);

    const value = String(row[col.key] ?? '');
    const shouldTruncate = value.length <= 56;
    const shouldClamp = value.length > 56 && value.length <= 200;

    return (
      <span
        className={cn(
          'cd-table-cell-text block max-w-[min(20rem,60vw)] overflow-hidden',
          shouldTruncate ? 'truncate whitespace-nowrap' : 'whitespace-normal break-words',
          shouldClamp ? '[display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2]' : undefined,
        )}
        title={value || undefined}
      >
        {value}
      </span>
    );
  };

  return (
    <div
      className={cn('w-full overflow-x-auto rounded-md border border-border-strong bg-background-elevated shadow-card', className)}
      style={style}
    >
      <table
        className={cn('cd-table w-full border-collapse text-sm leading-[1.5] text-foreground', tableClassName)}
        style={tableStyle}
      >
        <thead>
          <tr className="border-b border-border bg-background-subtle">
            {columns.map((col) => (
              <th
                key={col.key}
                className="px-[16px] py-[10px] text-[0.6875rem] font-semibold uppercase tracking-[0.06em] text-foreground-subtle"
                style={{
                  textAlign: col.align ?? 'left',
                  width: col.width,
                }}
              >
                <span className="cd-table-header-text block truncate whitespace-nowrap">
                  {col.header}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="p-[32px] text-center text-sm text-foreground-subtle"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            rows.map((row, i) => (
              <tr
                key={String(row[keyField] ?? i)}
                tabIndex={onRowClick ? 0 : undefined}
                aria-label={onRowClick ? `Open row ${String(row[keyField] ?? i + 1)}` : undefined}
                onClick={() => onRowClick?.(row)}
                onKeyDown={(event) => handleRowKeyDown(event, row)}
                className={cn(
                  'bg-background-elevated outline-none transition-[background,outline-color] duration-100',
                  onRowClick ? 'cursor-pointer hover:bg-background-subtle focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-[-2px]' : 'cursor-default',
                  i < rows.length - 1 ? 'border-b border-border' : undefined,
                ) || undefined}
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className="cd-table-cell max-w-[18rem] overflow-hidden px-[16px] py-[12px] align-middle text-foreground-muted"
                    style={{
                      textAlign: col.align ?? 'left',
                    }}
                  >
                    {renderCell(row, col)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
