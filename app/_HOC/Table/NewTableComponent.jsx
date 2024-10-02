import React from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { IoIosAddCircleOutline } from "react-icons/io";
import { MdNavigateBefore, MdNavigateNext } from "react-icons/md";
import { LuChevronFirst, LuChevronLast } from "react-icons/lu";

const NewTableComponent = ({
  children,
  tableColumns,
  rowsPerPage,
  totalRows,
  currentPage,
  onPageChange,
  handleRowsPerPageChange,
  setIsOpen,
  buttons,
}) => {
  const totalPages = Math.ceil(totalRows / rowsPerPage);

  // Filter out null or undefined elements in tableColumns
  const filteredColumns = tableColumns?.filter(
    (column) => column !== null && column !== undefined
  );

  return (
    <div className="bg-blue-100 mt-4 rounded p-2 my-2">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-1">
        <div className="flex flex-col sm:flex-row md:items-center gap-4">
          {buttons}
        </div>
        <div className="flex flex-col sm:flex-row md:items-center gap-2">
          <div className="flex items-center gap-2 p-1 rounded">
            <p className="text-sm">Items per page</p>
            <select
              value={rowsPerPage}
              onChange={handleRowsPerPageChange}
              className="bg-transparent border rounded border-blue-500 p-1"
            >
              <option value="10">10</option>
              <option value="30">30</option>
              <option value="50">50</option>
            </select>
          </div>
          <div className="flex items-center gap-1">
            <LuChevronFirst
              onClick={() => onPageChange(1)}
              className="cursor-pointer"
            />
            <MdNavigateBefore
              onClick={() => onPageChange(currentPage - 1)}
              className="cursor-pointer text-lg"
            />
            <p className="text-sm">
              Page <span className="p-1">{currentPage}</span> of{" "}
              <span className="p-1">{totalPages}</span>
            </p>
            <MdNavigateNext
              onClick={() => onPageChange(currentPage + 1)}
              className="cursor-pointer text-lg"
            />
            <LuChevronLast
              onClick={() => onPageChange(totalPages)}
              className="cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Table Wrapper for Horizontal Scrolling */}
      <div className="overflow-x-auto">
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
          <tbody>{children}</tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-end items-center px-4 pt-4 gap-4">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 bg-blue-200 border border-blue-400 rounded disabled:opacity-50"
        >
          <FaChevronLeft />
        </button>
        <div>
          {currentPage} / {totalPages}
        </div>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 bg-blue-200 border border-blue-400 rounded disabled:opacity-50"
        >
          <FaChevronRight />
        </button>
      </div>
    </div>
  );
};

export default NewTableComponent;
