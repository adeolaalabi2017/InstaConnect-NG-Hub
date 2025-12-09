import React from 'react';
import { ArrowUpDown, Check, X, Search } from 'lucide-react';

interface Column<T> {
  key: keyof T | string;
  header: string;
  render?: (row: T) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  onApprove?: (row: T) => void;
  onReject?: (row: T) => void;
  searchPlaceholder?: string;
}

const DataTable = <T extends { id: string | number }>({
  columns,
  data,
  onApprove,
  onReject,
  searchPlaceholder = "Search..."
}: DataTableProps<T>) => {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden glass-card">
      {/* Header Actions (Optional Search could go here) */}

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-400">
          <thead className="text-xs uppercase bg-gray-800 text-gray-400">
            <tr>
              {columns.map((col, index) => (
                <th key={index} className="px-6 py-4 font-medium">
                  <div className="flex items-center gap-2">
                    {col.header}
                    <ArrowUpDown size={14} className="text-gray-600" />
                  </div>
                </th>
              ))}
              {(onApprove || onReject) && (
                <th className="px-6 py-4 text-right">Actions</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {data.map((row) => (
              <tr key={row.id} className="hover:bg-gray-800/50 transition-colors">
                {columns.map((col, index) => (
                  <td key={index} className="px-6 py-4 whitespace-nowrap text-white">
                    {col.render ? col.render(row) : (row[col.key as keyof T] as React.ReactNode)}
                  </td>
                ))}
                {(onApprove || onReject) && (
                  <td className="px-6 py-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-2">
                      {onApprove && (
                        <button
                          onClick={() => onApprove(row)}
                          className="p-2 bg-green-500/10 text-green-500 rounded-lg hover:bg-green-500/20 transition-colors"
                          title="Approve"
                        >
                          <Check size={16} />
                        </button>
                      )}
                      {onReject && (
                        <button
                          onClick={() => onReject(row)}
                          className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 transition-colors"
                          title="Reject"
                        >
                          <X size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
            {data.length === 0 && (
              <tr>
                <td colSpan={columns.length + (onApprove || onReject ? 1 : 0)} className="px-6 py-8 text-center text-gray-500">
                  No records found.
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
