
import React from 'react';

export interface Column<T> {
  header: string;
  accessorKey?: keyof T;
  render?: (row: T) => React.ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  className?: string;
  emptyMessage?: string;
}

const DataTable = <T extends { id: string | number }>({ 
  columns, 
  data, 
  className = '', 
  emptyMessage = 'No records found' 
}: DataTableProps<T>) => {
  return (
    <div className={`bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden ${className}`}>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-900/50 border-b border-gray-700 text-gray-400 text-xs uppercase">
            <tr>
              {columns.map((col, index) => (
                <th key={index} className={`px-6 py-4 font-bold whitespace-nowrap ${col.className || ''}`}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {data.length > 0 ? (
              data.map((row) => (
                <tr key={row.id} className="hover:bg-gray-700/30 transition-colors text-sm text-gray-300">
                  {columns.map((col, index) => (
                    <td key={index} className="px-6 py-4">
                      {col.render
                        ? col.render(row)
                        : col.accessorKey
                        ? (row[col.accessorKey] as React.ReactNode)
                        : null}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="px-6 py-12 text-center text-gray-500 italic">
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;
