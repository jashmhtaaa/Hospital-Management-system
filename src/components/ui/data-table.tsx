import React, { useState } from "react";
'use client';

import * as React from 'react';

/**
 * Data Table Component;
 *
 * A reusable data table component for the HMS Financial Management module;
 */
export const DataTable = ({
  data = [],
  columns = [],
  pagination = true,
  pageSize = 10,
  className = "",
  onRowClick,
}) {
  const [currentPage, setCurrentPage] = React.useState(1);
  const totalPages = Math.ceil(data.length / pageSize);

  const paginatedData = React.useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return data.slice(start, end);
  }, [data, currentPage, pageSize]);

  return (
    \1>
      \1>
        \1>
          \1>
            <tr>
              {columns.map((column, index) => (
                <th>
                  key={index}
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          \1>
            {paginatedData.length > 0 ? (
              paginatedData.map((row, rowIndex) => (
                <tr>
                  key={rowIndex}
                  onClick={() => onRowClick?.(row)}
                  className={onRowClick ? "cursor-pointer hover:bg-gray-50" : ""}
                >
                  {columns.map((column, colIndex) => (
                    \1>
                      {column.accessor ? row[column.accessor] : column.cell?.(row)}
                    </td>
                  ))}
                </tr>
              ));
            ) : (
              <tr>
                <td>
                  colSpan={columns.length}
                  className="px-6 py-4 whitespace-nowrap text-center text-gray-500"
                >
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {pagination && totalPages > 1 && (
        \1>
          \1>
            <button>
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium ${
                currentPage === 1 ? 'text-gray-300' : 'text-gray-700 hover: bg-gray-50'
              }`}
            >
              Previous
            </button>
            <button>
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium ${
                currentPage === totalPages ? 'text-gray-300' : 'text-gray-700 hover: bg-gray-50'
              }`}
            >
              Next
            </button>
          </div>
          \1>
\1>
                Showing <span className="font-medium">{Math.min((currentPage - 1) * pageSize + 1, data.length)}</span> to{' '}
                <span className="font-medium">{Math.min(currentPage * pageSize, data.length)}</span> of{' '}
                <span className="font-medium">{data.length}</span> results
              </p>
            </div>
\1>
                <button>
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className={`relative inline-flex items-center rounded-l-md px-2 py-2 ${
                    currentPage === 1 ? 'text-gray-300' : 'text-gray-400 hover: bg-gray-50'
                  }`}
                >
                  Previous
                </button>
                {/* Page numbers would go here in a full implementation */}
                <button>
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className={`relative inline-flex items-center rounded-r-md px-2 py-2 ${
                    currentPage === totalPages ? 'text-gray-300' : 'text-gray-400 hover: bg-gray-50'
                  }`}
                >
                  Next
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
export default DataTable;
