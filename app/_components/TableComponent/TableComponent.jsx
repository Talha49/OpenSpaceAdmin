// components/Table.js
import React from 'react';
import { FaSort, FaEllipsisH, FaChevronRight, FaChevronLeft } from 'react-icons/fa';

const Table = ({ 
  data, 
  columns, 
  onSort, 
  onRowClick, 
  onActionClick,
  deleteMode,
  selectedItems,
  onCheckboxChange,
  onSelectAll,
  currentPage,
  totalPages,
  onPageChange,
  mode
}) => {

  return (
    <div className=" border rounded-lg shadow-lg ">
    <div className="overflow-x-auto">
  <table className="table-auto min-w-full text-xs md:text-sm border-collapse">
    <thead className="sticky top-0 bg-gray-200 z-10">
      <tr>
        {mode && (
          <th className="py-3 px-2 md:px-4 ">
            <input
              type="checkbox"
              onChange={onSelectAll}
              checked={selectedItems.length === data.length}
            />
          </th>
        )}
        {columns.map((column) => (
          <th key={column.key} className="py-3 px-2 md:px-4 text-left font-semibold bg-gray-300">
            <div className="flex items-center justify-between gap-x-2">
              <span>{column.label}</span>
              {column.sortable && (
                <FaSort className="w-4 h-4 cursor-pointer" onClick={() => onSort(column.key)} />
              )}
            </div>
          </th>
        ))}
      </tr>
    </thead>
    <tbody>
      {data?.length === 0 ? (
        <tr>
          <td colSpan={columns.length + (mode ? 1 : 0)} className="text-center py-4">
            No data for users
          </td>
        </tr>
      ) : (
        data?.map((item) => (
          <tr key={item.id} className="hover:bg-blue-50 even:bg-slate-100">
            {mode && (
              <td className="py-3 px-2 md:px-4">
                <input
                  type="checkbox"
                  checked={selectedItems.includes(item.id)}
                  onChange={() => onCheckboxChange(item.id)}
                />
              </td>
            )}
            {columns.map((column) => (
              <td key={`${item.id}-${column.key}`} className="py-3 px-2 md:px-4">
                {column.key === 'fullName' ? (
                  <div className="flex justify-between items-center">
                    <span className="cursor-pointer" onClick={() => onRowClick(item)}>
                      {item[column.key]}
                    </span>
                    {onActionClick && (
                      <button 
                        onClick={(e) => onActionClick(e, item)} 
                        className="text-blue-600 hover:text-blue-800 rotate-90"
                      >
                        <FaEllipsisH />
                      </button>
                    )}
                  </div>
                ) : (
                  <span className="cursor-pointer" onClick={() => onRowClick(item)}>
                    {item[column.key]}
                  </span>
                )}
              </td>
            ))}
          </tr>
        ))
      )}
    </tbody>
  </table>
</div>
   




      <div className="flex justify-end items-center p-4">
        <button 
          className="px-3 py-1 border rounded-md mr-2"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <FaChevronLeft />
        </button>
        <span className="mx-2 text-sm">{currentPage} / {totalPages}</span>
        <button 
          className="px-3 py-1 border rounded-md ml-2"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <FaChevronRight />
        </button>
      </div>
    </div>
  );
};

export default Table;
