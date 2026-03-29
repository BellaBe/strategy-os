import type { ReactNode } from 'react';

interface Column<T> {
  key: string;
  header: string;
  render: (row: T) => ReactNode;
  align?: 'left' | 'center' | 'right';
}

interface Props<T> {
  columns: Column<T>[];
  data: T[];
  caption?: string;
  compact?: boolean;
}

export function DataTable<T>({ columns, data, caption, compact }: Props<T>) {
  if (data.length === 0) {
    return <p className="text-muted">No data available.</p>;
  }

  return (
    <div className="table-wrapper">
      <table className={`data-table ${compact ? 'data-table--compact' : ''}`}>
        {caption && <caption className="sr-only">{caption}</caption>}
        <thead>
          <tr>
            {columns.map(col => (
              <th key={col.key} style={{ textAlign: col.align ?? 'left' }}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i}>
              {columns.map(col => (
                <td key={col.key} style={{ textAlign: col.align ?? 'left' }}>
                  {col.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
