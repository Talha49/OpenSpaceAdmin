"use client";
import React, { useEffect, useState, useMemo } from "react";
import { createAsyncThunk } from "@reduxjs/toolkit";

import { useDispatch, useSelector } from "react-redux";
import { IoMdRefresh } from "react-icons/io";
import {
  FaEllipsisH,
  FaFileExport,
  FaFilter,
  FaSort,
  FaSortAlphaDown,
  FaSortAlphaDownAlt,
  FaSortDown,
  FaSortUp,
  FaSpinner,
  FaUserFriends,
} from "react-icons/fa";
import NewHeader from "@/app/_HOC/NewHeader/NewHeader";
import NewTableComponent from "@/app/_HOC/Table/NewTableComponent";
import { fetchDeletedUsers } from "@/lib/Feature/UserSlice";
import DeleteFilterModal from "@/app/_components/UserDetailDilaog&Modal/DeleteFilterModal";
import * as XLSX from "xlsx";
import UserStatusUpdateModal from "@/app/_components/UserDetailDilaog&Modal/UserStatusUpdateModal";
import { CiExport } from "react-icons/ci";
import Loader from "@/app/_components/Loader/Loader";
import Link from "next/link";
import PageHeader from "@/app/_components/PageHeader/PageHeader";

const DeletedUsers = () => {
  const dispatch = useDispatch();

  const [selectedUser, setSelectedUser] = useState(null); // Store selected user
  const [deletedUsers, setDeletedUsers] = useState([]); // State to store deleted users
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [filterCriteria, setFilterCriteria] = useState({});
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const status = useSelector((state) => state.user.status); // Fetch status (idle, loading, succeeded, etc.)
  const handleOpenFilterModal = () => setIsFilterModalOpen(true);
  const handleCloseFilterModal = () => setIsFilterModalOpen(false);
  const handleApplyFilter = (criteria) => {
    setFilterCriteria(criteria);
    setCurrentPage(1); // Reset to first page when filter is applied
    handleCloseFilterModal();
  };
  // Fetch deleted users on component mount
  useEffect(() => {
    setIsLoading(true); // Set loading to true when fetching starts

    dispatch(fetchDeletedUsers())
      .unwrap()
      .then((data) => {
        console.log("🎉 Successfully fetched deleted users:", data);
        setDeletedUsers(data); // Update state with fetched data
      })
      .catch((error) => {
        console.error("❌ Error fetching deleted users:", error.message);
      })
      .finally(() => {
        setIsLoading(false); // Ensure loading is set to false after fetch is complete
      });
  }, [dispatch]); // Only depend on dispatch

  console.log(isLoading);

  const handleOpenUpdateUserModal = (user) => {
    setSelectedUser(user); // Set the selected user
  };

  const handleCloseUpdateUserModal = () => {
    setSelectedUser(null); // Close modal when done
  };

  const handleRowsPerPageChange = (e) => {
    setRowsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to first page when rows per page changes
  };

  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const filteredAndSortedUsers = useMemo(() => {
    let result = [...deletedUsers];

    // Apply search term filter
    if (searchTerm) {
      result = result.filter((user) =>
        user.fullName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply filter criteria
    if (Object.keys(filterCriteria).length > 0) {
      result = result.filter(
        (user) =>
          (!filterCriteria.city || user.city === filterCriteria.city) &&
          (!filterCriteria.address ||
            user.address === filterCriteria.address) &&
          (!filterCriteria.contact ||
            user.contact === filterCriteria.contact) &&
          (!filterCriteria.email || user.email === filterCriteria.email)
      );
    }

    // Apply sorting
    if (sortConfig.key !== null) {
      result.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }

    return result;
  }, [deletedUsers, searchTerm, filterCriteria, sortConfig]);

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const paginatedDeletedUsers = filteredAndSortedUsers.slice(
    indexOfFirstRow,
    indexOfLastRow
  );

  const headerItems = [
    {
      icon: <IoMdRefresh />,
      label: "Refresh",
      onClick: () => {
        setIsLoading(true); // Set loading to true when fetching starts

        dispatch(fetchDeletedUsers())
          .unwrap()
          .then((data) => {
            console.log("🎉 Successfully fetched deleted users:", data);
            setDeletedUsers(data); // Update state with fetched data
          })
          .catch((error) => {
            console.error("❌ Error fetching deleted users:", error.message);
          })
          .finally(() => {
            setIsLoading(false); // Ensure loading is set to false after fetch is complete
          });
      },
    },
    {
      icon: <CiExport />,
      label: "Export Delete Users",
      onClick: () => {
        exportDeletedUsersToExcel(
          deletedUsers.map((user) => ({
            fullName: user.fullName,
            email: user.email,
            address: user.address,
            city: user.city,
            contact: user.contact,
          }))
        );
      },
    },
  ];

  const tableColumns = [
    { label: "Display Name", key: "fullName" },
    { label: "Email", key: "email" },
    { label: "Address", key: "address" },
    { label: "City", key: "city" },
    { label: "Contact", key: "contact" },
  ];

  const exportDeletedUsersToExcel = (
    data,
    filename = "Deleted_Users_Report.xlsx"
  ) => {
    // Define headers and custom styles
    const headers = [
      ["Deleted Users Report"], // Title
      ["Generated on:", new Date().toLocaleString()], // Subtitle with timestamp
      [], // Empty row for spacing
      ["Display Name", "Email", "Address", "City", "Contact"], // Table Headers
    ];

    const worksheetData = headers.concat(
      data.map((user) => [
        user.fullName,
        user.email,
        user.address,
        user.city,
        user.contact,
      ])
    );

    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

    // Apply column widths for better readability
    worksheet["!cols"] = [
      { wch: 25 }, // Display Name
      { wch: 30 }, // Email
      { wch: 40 }, // Address
      { wch: 20 }, // City
      { wch: 15 }, // Contact
    ];

    // Add styling to headers
    const headerStyle = {
      font: { bold: true, sz: 14, color: { rgb: "FFFFFF" } },
      fill: { fgColor: { rgb: "4F81BD" } },
      alignment: { horizontal: "center", vertical: "center" },
    };

    // Apply styles to header cells
    ["A1", "A2", "A4", "B4", "C4", "D4", "E4"].forEach((cell) => {
      if (worksheet[cell]) worksheet[cell].s = headerStyle;
    });

    // Create a workbook and append the worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Deleted Users");

    // Save the workbook
    XLSX.writeFile(workbook, filename);
  };

  return (
    <div className="min-h-screen">
      <NewHeader>
        <div className="flex flex-col ">
          <PageHeader
            title={"Deleted Users"}
            description={
              "Review and manage all users who have been deleted from the system. Track removal dates and restore options if needed. Ensure proper record-keeping and maintain data integrity effortlessly."
            }
          />

          <div className="flex flex-col rounded-lg border shadow-md dark:border-neutral-500 p-2 gap-4">
            {/* Main container with improved flex-col layout on mobile, flex-row on larger screens */}
            <div className="flex flex-col lg:flex-row justify-between gap-4">
              {/* Left side - Action buttons with proper wrapping */}
              <div className="flex flex-wrap gap-2 overflow-visible">
                {headerItems.map((item, i) => (
                  <div key={i} className="flex-none">
                    <div
                      onClick={item?.onClick}
                      className="flex items-center gap-2 group border dark:border-neutral-700 rounded p-2 cursor-pointer hover:bg-blue-500 dark:hover:bg-blue-500 transition-colors"
                    >
                      <span className="text-lg text-blue-500 group-hover:text-white">
                        {item.icon}
                      </span>
                      <span className="text-sm whitespace-nowrap group-hover:text-white">
                        {item.label}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-3 w-full lg:w-auto min-w-0 dark:shadow-neutral-700 rounded-lg">
              <div className="relative flex-grow min-w-0">
                <input
                  type="text"
                  placeholder="Search users list"
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  value={searchTerm}
                  className="w-full p-2 border dark:border-neutral-700 border-gray-300 rounded placeholder:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                onClick={handleOpenFilterModal}
                className="flex items-center text-blue-600 text-sm gap-2 whitespace-nowrap cursor-pointer group hover:bg-blue-500 hover:text-white dark:hover:text-white dark:hover:bg-blue-500 transition-all border dark:border-neutral-700 rounded px-3 py-2 flex-none"
              >
                <FaFilter className="group-hover:text-wrap" />
                <span className="group-hover:text-wrap">Filter</span>
              </button>
            </div>
          </div>
        </div>
      </NewHeader>
      <div className="">
        <NewTableComponent
          tableColumns={tableColumns.map((col) => (
            <div
              key={col.key}
              className="flex items-center justify-between cursor-pointer w-full"
              onClick={() => handleSort(col.key)}
            >
              <span>{col.label}</span>
              {/* <FaSort className="ml-1" /> */}
              {sortConfig.direction !== "ascending" &&
              sortConfig.key === col.key ? (
                <FaSortAlphaDownAlt
                  className={`mx-4 ${
                    sortConfig.key !== col.key
                      ? "text-neutral-500"
                      : "text-blue-600"
                  }`}
                />
              ) : (
                <FaSortAlphaDown
                  className={`mx-4 ${
                    sortConfig.key !== col.key
                      ? "text-neutral-500"
                      : "text-blue-600"
                  }`}
                />
              )}
            </div>
          ))}
          buttons={
            <button>
              {isLoading && (
                <div className="flex justify-center items-center ">
                  <FaSpinner className="animate-spin text-blue-500" size={20} />
                </div>
              )}
            </button>
          }
          rowsPerPage={rowsPerPage}
          totalRows={filteredAndSortedUsers.length}
          currentPage={currentPage}
          onPageChange={(page) => setCurrentPage(page)}
          handleRowsPerPageChange={handleRowsPerPageChange}
        >
          {paginatedDeletedUsers.map((user) => (
            <tr
              key={user.id}
              onClick={() => handleOpenUpdateUserModal(user)} // Open modal on click
              className="odd:bg-gray-100 even:bg-white dark:odd:bg-neutral-800 dark:even:bg-neutral-900 cursor-pointer hover:bg-gray-300 dark:hover:bg-neutral-600 hover:text-blue-700 transition-all duration-200 "
            >
              <td className="p-3 text-gray-700 dark:text-neutral-400">
                <div className="flex items-center justify-between ">
                  <span className="hover:text-blue-600">{user.fullName}</span>
                </div>
              </td>
              <td className="p-3 text-gray-700 dark:text-neutral-400">
                {user.email}
              </td>
              <td className="p-3 text-gray-700 dark:text-neutral-400">
                {user.address}
              </td>
              <td className="p-3 text-gray-700 dark:text-neutral-400">
                {user.city}
              </td>
              <td className="p-3 text-gray-700 dark:text-neutral-400">
                {user.contact}
              </td>
            </tr>
          ))}
        </NewTableComponent>
      </div>
      {isFilterModalOpen && (
        <DeleteFilterModal
          onClose={handleCloseFilterModal}
          onApplyFilter={handleApplyFilter}
          initialFilterCriteria={filterCriteria}
        />
      )}
      {selectedUser && (
        <UserStatusUpdateModal
          user={selectedUser}
          onClose={handleCloseUpdateUserModal}
        />
      )}
      {isLoading && <Loader />}
    </div>
  );
};

export default DeletedUsers;
