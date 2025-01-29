"use client";

import React, { useEffect, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { IoIosAddCircleOutline } from "react-icons/io";
import { MdNavigateBefore, MdNavigateNext } from "react-icons/md";
import { LuChevronFirst, LuChevronLast } from "react-icons/lu";
import { useSelector } from "react-redux";

const NewTableComponent = ({
  children,
  tableColumns,
  rowsPerPage = 10,
  totalRows = 0,
  currentPage = 1,
  onPageChange,
  handleRowsPerPageChange,
  setIsOpen,
  buttons,
}) => {
  const totalPages = Math.max(1, Math.ceil(totalRows / rowsPerPage));

  // Filter out null or undefined elements in tableColumns
  const filteredColumns = tableColumns?.filter(
    (column) => column !== null && column !== undefined
  );

  // Clamp onPageChange to prevent invalid transitions
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      onPageChange(newPage);
    }
  };

  function useScreenWidth() {
    const [screenWidth, setScreenWidth] = useState(window.innerWidth);

    useEffect(() => {
      const handleResize = () => {
        setScreenWidth(window.innerWidth);
      };

      window.addEventListener("resize", handleResize);

      // Clean up the event listener on component unmount
      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }, []);

    return screenWidth;
  }

  const screenWidth = useScreenWidth();
  const { locked } = useSelector((state) => state.lock);

  return (
    <div
      className="bg-blue-100 dark:bg-neutral-700 mt-4 rounded p-2 my-2"
      style={{ maxWidth: `${locked ? screenWidth - 305 : screenWidth - 75}px` }}
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-1">
        <div className="flex flex-col sm:flex-row md:items-center gap-4">
          {buttons}
        </div>
        <div className="flex flex-col sm:flex-row md:items-center gap-2 dark:text-neutral-200">
          <div className="flex items-center gap-2 p-1 rounded">
            <p className="text-sm">Items per page</p>
            <select
              value={rowsPerPage}
              onChange={handleRowsPerPageChange}
              className="bg-transparent dark:bg-neutral-800 border rounded border-blue-500 dark:border-none p-1"
            >
              <option value="10">10</option>
              <option value="30">30</option>
              <option value="50">50</option>
            </select>
          </div>
          <div className="flex items-center gap-1">
            <LuChevronFirst
              onClick={() => handlePageChange(1)}
              className={`cursor-pointer ${
                currentPage === 1 ? "opacity-50 pointer-events-none" : ""
              }`}
            />
            <MdNavigateBefore
              onClick={() => handlePageChange(currentPage - 1)}
              className={`cursor-pointer text-lg ${
                currentPage === 1 ? "opacity-50 pointer-events-none" : ""
              }`}
            />
            <p className="text-sm">
              Page <span className="p-1">{currentPage}</span> of{" "}
              <span className="p-1">{totalPages}</span>
            </p>
            <MdNavigateNext
              onClick={() => handlePageChange(currentPage + 1)}
              className={`cursor-pointer text-lg ${
                currentPage === totalPages || totalPages === 0
                  ? "opacity-50 pointer-events-none"
                  : ""
              }`}
            />
            <LuChevronLast
              onClick={() => handlePageChange(totalPages)}
              className={`cursor-pointer ${
                currentPage === totalPages || totalPages === 0
                  ? "opacity-50 pointer-events-none"
                  : ""
              }`}
            />
          </div>
        </div>
      </div>

      {/* Table Wrapper for Horizontal Scrolling */}
      <div className="overflow-x-auto">
        <table className="table-auto min-w-full text-xs md:text-sm border-collapse border dark:border-neutral-800">
          <thead className="sticky top-0 bg-neutral-200 dark:bg-neutral-800">
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
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 bg-blue-200 dark:bg-neutral-800 border dark:border-none border-blue-400 rounded disabled:opacity-50"
        >
          <FaChevronLeft />
        </button>
        <div>
          {currentPage} / {totalPages}
        </div>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages || totalPages === 0}
          className="px-3 py-1 bg-blue-200 dark:bg-neutral-800 border dark:border-none border-blue-400 rounded disabled:opacity-50"
        >
          <FaChevronRight />
        </button>
      </div>
    </div>
  );
};

export default NewTableComponent;
