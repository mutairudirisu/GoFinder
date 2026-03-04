"use client";

import React from 'react';

// Type definitions
type ColumnAlign = 'left' | 'center' | 'right';

interface Column<T = any> {
  key: string;
  header: string;
  render?: (value: any, row: T, index: number) => React.ReactNode;
  width?: string;
  align?: ColumnAlign;
}

interface TableProps<T = any> {
  columns: Column<T>[];
  data: T[];
  variant?: 'default' | 'striped';
  hoverable?: boolean;
  loading?: boolean;
  emptyMessage?: string;
  className?: string;
}

export default function Table<T extends Record<string, any>>({
  columns,
  data,
  variant = 'default',
  hoverable = true,
  loading = false,
  emptyMessage = 'No data available',
  className = '',
}: TableProps<T>) {
  // Alignment classes
  const getAlignmentClass = (align: ColumnAlign = 'left'): string => {
    switch (align) {
      case 'center':
        return 'text-center';
      case 'right':
        return 'text-right';
      default:
        return 'text-left';
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className={`w-full rounded-xl border border-neutral-border overflow-hidden ${className}`}>
        <div className="flex flex-col items-center justify-center py-16">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-sm text-neutral-dark">Loading data...</p>
        </div>
      </div>
    );
  }

  // Empty state
  if (data.length === 0) {
    return (
      <div className={`w-full rounded-xl border border-neutral-border overflow-hidden ${className}`}>
        <div className="flex items-center justify-center py-16">
          <p className="text-sm text-neutral-dark">{emptyMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full rounded-xl border border-neutral-border overflow-hidden ${className}`}>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-neutral-border">
          {/* Header */}
          <thead className="bg-neutral-light">
            <tr className="border-b border-neutral-border">
              {columns.map((column, index) => (
                <th
                  key={`${column.key}-${index}`}
                  className={`
                    px-6 py-4
                    font-heading text-sm font-semibold
                    text-neutral-dark
                    ${getAlignmentClass(column.align)}
                    ${column.width || ''}
                  `}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>

          {/* Body */}
          <tbody className="bg-white divide-y divide-neutral-border">
            {data.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className={`
                  ${variant === 'striped' && rowIndex % 2 === 1 ? 'bg-neutral-light/30' : ''}
                  ${hoverable ? 'hover:bg-primary-light/10 transition-colors duration-200' : ''}
                `}
              >
                {columns.map((column, colIndex) => {
                  const value = row[column.key];
                  const content = column.render
                    ? column.render(value, row, rowIndex)
                    : value;

                  return (
                    <td
                      key={`${column.key}-${colIndex}`}
                      className={`
                        px-6 py-4
                        font-sans text-sm
                        text-neutral-dark
                        ${getAlignmentClass(column.align)}
                        ${column.width || ''}
                      `}
                    >
                      {content}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
