"use client";
import React, { useEffect, useState, useMemo } from "react";
import { createAsyncThunk } from '@reduxjs/toolkit';

import { useDispatch, useSelector } from "react-redux";
import { IoMdRefresh } from "react-icons/io";
import {
  FaEllipsisH,
  FaFileExport,
  FaFilter,
  FaSort,
  FaUserFriends,
} from "react-icons/fa";
import NewHeader from "@/app/_HOC/NewHeader/NewHeader";
import NewTableComponent from "@/app/_HOC/Table/NewTableComponent";
import { fetchDeletedUsers } from "@/lib/Feature/UserSlice";
import DeleteFilterModal from "@/app/_components/UserDetailDilaog&Modal/DeleteFilterModal";
import * as XLSX from "xlsx";

const DeletedUsers = () => {
  const dispatch = useDispatch();

  const [deletedUsers, setDeletedUsers] = useState([]); // State to store deleted users
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });
  
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCriteria, setFilterCriteria] = useState({});
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const status = useSelector((state) => state.user.status); // Fetch status (idle, loading, succeeded, etc.)
  const handleOpenFilterModal = () => setIsFilterModalOpen(true);
  const handleCloseFilterModal = () => setIsFilterModalOpen(false);
  const handleApplyFilter = (criteria) => {
    setFilterCriteria(criteria);
    setCurrentPage(1); // Reset to first page when filter is applied
    handleCloseFilterModal();
  };
  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchDeletedUsers())
        .unwrap()
        .then((data) => {
          console.log("🎉 Successfully fetched deleted users:", data);
          setDeletedUsers(data); // Update the state with fetched data
        })
        .catch((error) => {
          console.error("❌ Error fetching deleted users:", error.message);
        });
    }
  }, [dispatch, status]);

  
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
        dispatch(fetchDeletedUsers())
          .unwrap()
          .then((data) => {
            console.log("🎉 Successfully refreshed deleted users:", data);
            setDeletedUsers(data); // Update the deleted users state
          })
          .catch((error) => {
            console.error("❌ Error refreshing deleted users:", error.message);
          });
      },
    },
    {
      icon: <FaFileExport />,
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

  const exportDeletedUsersToExcel = (data, filename = "Deleted_Users_Report.xlsx") => {
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
    <div className="min-h-screen py-4">
      <NewHeader>
        <div className="flex flex-col px-4">
          <div className="mb-4 flex flex-col gap-4">
            <h1 className="text-xl font-semibold tracking-wider dark:text-neutral-500">Talha.ae</h1>
            <h2 className="text-lg font-semibold tracking-wider dark:text-neutral-500">
              Delete Users
            </h2>
          </div>

          <div className="flex flex-col sm:flex-row sm:gap-0 gap-6 sm:items-center justify-between border-t-2 dark:border-neutral-600 pt-2">
            <div className="flex items-center sm:gap-x-6 gap-x-4 text-[8px]">
              {headerItems.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-1 cursor-pointer hover:text-blue-500 transition-all"
                  onClick={item.onClick || undefined} // Execute onClick if available
                >
                  <span className="text-lg">{item.icon}</span>
                  <p>{item.label}</p>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-4 w-[250px] mr-6">
              <span
                className="flex items-center text-sm gap-1 cursor-pointer hover:text-blue-500"
                onClick={handleOpenFilterModal}
              >
                <FaFilter />
                <p>Filter</p>
              </span>
              <input
                type="text"
                placeholder="Search users list"
                onChange={(e) => setSearchTerm(e.target.value)}
                value={searchTerm}
                className="w-full p-1 border border-gray-300 rounded placeholder:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </NewHeader>
      <div className="pl-4 pr-2">
      <NewTableComponent
        tableColumns={tableColumns.map((col) => (
          <div
            key={col.key}
            className="flex items-center justify-between cursor-pointer w-full"
            onClick={() => handleSort(col.key)}
          >
            <span>{col.label}</span>
            <FaSort className="ml-1" />
          </div>
        ))}
        rowsPerPage={rowsPerPage}
        totalRows={filteredAndSortedUsers.length}
        currentPage={currentPage}
        onPageChange={(page) => setCurrentPage(page)}
        handleRowsPerPageChange={handleRowsPerPageChange}
      >
        {paginatedDeletedUsers.map((user) => (
          <tr
            key={user.id}
            className="border-b dark:border-neutral-700 cursor-pointer relative bg-gray-100 dark:bg-neutral-800 hover:bg-gray-200"
          >
            <td className="p-3 text-gray-700 dark:text-neutral-400">
              <div className="flex items-center justify-between ">
                <span className="hover:text-blue-600">{user.fullName}</span>
              </div>
            </td>
            <td className="p-3 text-gray-700 dark:text-neutral-400">{user.email}</td>
            <td className="p-3 text-gray-700 dark:text-neutral-400">{user.address}</td>
            <td className="p-3 text-gray-700 dark:text-neutral-400">{user.city}</td>
            <td className="p-3 text-gray-700 dark:text-neutral-400">{user.contact}</td>
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
    </div>
  );
};

export default DeletedUsers;
