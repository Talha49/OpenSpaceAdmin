import React from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const NewTableComponent = ({
  children,
  tableColumns,
  rowsPerPage,
  totalRows,
  currentPage,
  onPageChange,
}) => {
  const totalPages = Math.ceil(totalRows / rowsPerPage);

  // Filter out null or undefined elements in tableColumns
  const filteredColumns = tableColumns?.filter((column) => column !== null && column !== undefined);

  return (
    <div>
      <table className="table-auto min-w-full text-xs md:text-sm border-collapse border">
        <thead className="sticky top-0 bg-gray-200 z-0">
          <tr className="text-left">
            {filteredColumns?.map((column, index) => (
              <th key={index} className="py-3 px-2">
                <div className="flex items-center justify-between gap-4">
                  {column}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}
     
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="flex justify-end items-center p-4 gap-4">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          <FaChevronLeft />
        </button>
        <div>
          {currentPage} / {totalPages}
        </div>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          <FaChevronRight />
        </button>
      </div>
    </div>
  );
};

export default NewTableComponent;
