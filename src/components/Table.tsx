import { cn } from '../lib/cn';
import type { CSSProperties, HTMLAttributes, MouseEvent, ReactNode, TableHTMLAttributes } from 'react';
export type Column<T> = {
  /** Row field key used as the cell value when `render` is not provided. */
  key: string;
  header: string;
  width?: string;
  align?: 'left' | 'center' | 'right';
  /**
   * Custom cell renderer. When omitted the cell displays `String(row[key])`.
   * Default rendering applies automatic truncation and clamping based on
   * content length (single-line truncation ≤ 56 chars, 2-line clamp ≤ 200
   * chars, no clamping beyond that). Provide `render` to take full control of
   * cell content — the returned node is rendered without any truncation wrapper.
   */
  render?: (row: T) => ReactNode;
};

export type TableProps<T extends Record<string, unknown>> = HTMLAttributes<HTMLDivElement> & {
  columns: Column<T>[];
  rows: T[];
  keyField?: string;
  onRowClick?: (row: T) => void;
  emptyMessage?: string;
  className?: string;
  style?: CSSProperties;
  tableClassName?: string;
  tableStyle?: CSSProperties;
  tableProps?: TableHTMLAttributes<HTMLTableElement>;
  caption?: ReactNode;
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
  tableProps,
  caption,
  ...props
}: TableProps<T>) {
  const isInteractive = onRowClick !== undefined;
  const { className: nativeTableClassName, style: nativeTableStyle, ...nativeTableProps } = tableProps ?? {};
  const handleRowActionClick = (event: MouseEvent<HTMLButtonElement>, row: T) => {
    event.stopPropagation();
    onRowClick?.(row);
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
      {...props}
      className={cn('w-full overflow-x-auto rounded-md border border-border-strong bg-background-elevated shadow-card', className)}
      style={style}
    >
      <table
        {...nativeTableProps}
        className={cn('cd-table w-full border-collapse text-sm leading-[1.5] text-foreground', tableClassName, nativeTableClassName)}
        style={{ ...tableStyle, ...nativeTableStyle }}
      >
        {caption ? (
          <caption className="px-[16px] py-[10px] text-left text-xs text-foreground-subtle">
            {caption}
          </caption>
        ) : null}
        <thead>
          <tr className="border-b border-border bg-background-subtle">
            {columns.map((col) => (
              <th
                key={col.key}
                scope="col"
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
                onClick={() => onRowClick?.(row)}
                className={cn(
                  'bg-background-elevated outline-none transition-[background,outline-color] duration-100',
                  isInteractive ? 'cursor-pointer hover:bg-background-subtle' : 'cursor-default',
                  i < rows.length - 1 ? 'border-b border-border' : undefined,
                ) || undefined}
              >
                {columns.map((col, colIndex) => (
                  <td
                    key={col.key}
                    className="cd-table-cell max-w-[18rem] overflow-hidden px-[16px] py-[12px] align-middle text-foreground-muted"
                    style={{
                      textAlign: col.align ?? 'left',
                    }}
                  >
                    {isInteractive && colIndex === 0 ? (
                      <button
                        type="button"
                        onClick={(event) => handleRowActionClick(event, row)}
                        className="block w-full cursor-pointer border-0 bg-transparent p-0 text-left font-[inherit] text-inherit outline-none focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
                      >
                        {renderCell(row, col)}
                      </button>
                    ) : (
                      renderCell(row, col)
                    )}
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
