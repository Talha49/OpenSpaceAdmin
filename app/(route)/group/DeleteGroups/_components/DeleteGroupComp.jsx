"use client";
import DeleteGroupDetailDialog from "@/app/_components/DeleteGroupDetailDialog/DeleteGroupDetailDialog";
import GroupDetailDialog from "@/app/_components/GroupDetailDialog/GroupDetailDialog";
import Loader from "@/app/_components/Loader/Loader";
import PageHeader from "@/app/_components/PageHeader/PageHeader";
import GenericFilterModal from "@/app/_components/UserDetailDilaog&Modal/GerenicFilterModal";
import GetDeleteFilterModal from "@/app/_components/UserDetailDilaog&Modal/GetDeleteFilterModal";
import NewHeader from "@/app/_HOC/NewHeader/NewHeader";
import NewTableComponent from "@/app/_HOC/Table/NewTableComponent";
import { fetchDeletedGroups } from "@/lib/Feature/GroupSlice";
import Link from "next/link";
import React, { useState, useEffect, useMemo } from "react";
import { CiExport } from "react-icons/ci";
import {
  FaFileExport,
  FaUserFriends,
  FaSort,
  FaFilter,
  FaSpinner,
  FaSortAlphaDown,
  FaSortAlphaDownAlt,
} from "react-icons/fa";
import { IoMdRefresh } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import * as XLSX from "xlsx"; // Import the xlsx library

const DeleteGroupComponent = () => {
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [deletedGroups, setDeletedGroups] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isOpen, setIsOpen] = useState(false);
  const [clickedGroup, setClickedGroup] = useState(null);
  const [filterCriteria, setFilterCriteria] = useState({ groupType: "" });
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const handleOpenFilterModal = () => setIsFilterModalOpen(true);
  const handleCloseFilterModal = () => setIsFilterModalOpen(false);
  const handleApplyFilter = (criteria) => {
    setFilterCriteria(criteria);
    setCurrentPage(1);
    handleCloseFilterModal();
  };

  const handleExportExcel = () => {
    console.log("Preparing to export...");
    console.log(deletedGroups); // Check if data is available

    const exportData = deletedGroups.map((group) => ({
      "Group Name": group.groupName,
      Owner: group.groupOwrnerID?.map((owner) => owner.fullName).join(", "),
      Type: group.groupType,
      Members: group.groupTargetID?.length || 0,
    }));

    console.log("Export Data:", exportData); // Log the mapped export data

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Deleted Groups");

    // Check if workbook creation is successful
    console.log("Workbook created:", wb);

    XLSX.writeFile(wb, "deleted_groups.xlsx");
  };

  const headerItems = [
    {
      icon: <IoMdRefresh className="" />,
      label: "Refresh",
      onClick: () => {
        fetchDeletedGroups();
      },
    },
    {
      icon: <CiExport className="" />,
      label: "Export Groups",
      onClick: handleExportExcel, // Add export functionality here
    },
  ];
  // Handle items per page change
  const handleRowsPerPageChange = (e) => {
    setRowsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to first page when rows per page changes
  };

  const fetchDeletedGroups = async () => {
    setIsLoading(true); // Set loading to true when fetching starts
    try {
      const response = await fetch("/api/Groups/getDeletedGroups"); // Assuming this is your API endpoint
      const data = await response.json();
      console.log("Fetched Deleted Groups:", data); // Log the data to check

      if (data && Array.isArray(data)) {
        setDeletedGroups(data);
      } else {
        console.error("No valid data returned");
      }
    } catch (error) {
      console.error("Error fetching deleted groups:", error);
    }
    setIsLoading(false); // Set loading to false after fetch is complete
  };
  useEffect(() => {
    fetchDeletedGroups();
  }, []);

  console.log("Deleted Groups:", deletedGroups);

  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const filteredAndSortedGroups = useMemo(() => {
    let result = Array.isArray(deletedGroups) ? [...deletedGroups] : [];

    // Apply search filter
    result = result.filter((group) =>
      group.groupName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Apply type filter
    if (filterCriteria.groupType) {
      result = result.filter(
        (group) => group.groupType === filterCriteria.groupType
      );
    }

    // Apply sorting
    if (sortConfig.key !== null) {
      result.sort((a, b) => {
        let aValue, bValue;

        switch (sortConfig.key) {
          case "fullName":
            // Ensure 'groupName' exists before trying to access it
            aValue = a.groupName ? a.groupName.toLowerCase() : "";
            bValue = b.groupName ? b.groupName.toLowerCase() : "";
            break;
          case "owner":
            // Ensure 'owners' array exists and has at least one owner
            aValue =
              a.groupOwrnerID && a.groupOwrnerID[0]?.fullName
                ? a.groupOwrnerID[0]?.fullName.toLowerCase()
                : "";
            bValue =
              b.groupOwrnerID && b.groupOwrnerID[0]?.fullName
                ? b.groupOwrnerID[0]?.fullName.toLowerCase()
                : "";
            break;
          case "type":
            // Ensure 'groupType' exists before trying to access it
            aValue = a.groupType ? a.groupType.toLowerCase() : "";
            bValue = b.groupType ? b.groupType.toLowerCase() : "";
            break;
          case "members":
            // Ensure 'groupTargetID' exists and has a length
            aValue = a.groupTargetID ? a.groupTargetID.length : 0;
            bValue = b.groupTargetID ? b.groupTargetID.length : 0;
            break;
          default:
            aValue = a[sortConfig.key] || "";
            bValue = b[sortConfig.key] || "";
        }

        if (aValue < bValue) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }

    return result;
  }, [deletedGroups, searchTerm, filterCriteria, sortConfig]);

  // Pagination Logic
  const paginatedGroups = filteredAndSortedGroups.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const tableColumns = [
    { label: "Group Name", key: "fullName", width: "250px" },
    { label: "Owner", key: "owner", width: "300px" },
    { label: "Type", key: "type", width: "200px" },
    { label: "Members", key: "members", width: "200px" },
  ];

  return (
    <div>
      <NewHeader>
        <div className="flex flex-col">
          <PageHeader
            title={"Deleted Groups"}
            description={
              "Review and manage all groups that have been deleted from the system. Track deletion dates, reasons, and restore options if needed. Maintain proper records and ensure data integrity effortlessly."
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
              style={{ width: col.width }} // Apply consistent width
              className="flex items-center justify-between cursor-pointer w-full"
              onClick={() => handleSort(col.key)}
            >
              <span>{col.label}</span>
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
          totalRows={filteredAndSortedGroups.length}
          currentPage={currentPage}
          onPageChange={(page) => setCurrentPage(page)}
          handleRowsPerPageChange={handleRowsPerPageChange}
        >
          {paginatedGroups.map((group) => (
            <tr
              key={group.id}
              className="odd:bg-gray-100 even:bg-white dark:odd:bg-neutral-800 dark:even:bg-neutral-900 cursor-pointer hover:bg-gray-300 dark:hover:bg-neutral-600 hover:text-blue-700 transition-all duration-200 "
              onClick={() => {
                setIsOpen(true);
                setClickedGroup(group);
              }}
            >
              <td className="p-3 text-gray-700 dark:text-neutral-400 w-[250]">
                {group?.groupName}
              </td>
              <td className="p-3 text-gray-700 dark:text-neutral-400 w-[300]">
                {group?.groupOwrnerID
                  ?.map((owner) => owner.fullName)
                  .join(", ")}
              </td>
              <td className="p-3 text-gray-700 dark:text-neutral-400 w-[200]">
                {group?.groupType}
              </td>
              <td className="p-3 text-gray-700 dark:text-neutral-400 w-[200]">
                {group?.groupTargetID?.length || 0}
              </td>
            </tr>
          ))}
        </NewTableComponent>
        <DeleteGroupDetailDialog
          isOpen={isOpen}
          onClose={() => {
            setIsOpen(false);
          }}
          group={clickedGroup}
        />

        {isFilterModalOpen && (
          <GetDeleteFilterModal
            onClose={handleCloseFilterModal}
            onApplyFilter={handleApplyFilter}
          />
        )}

        {/* {
          isFilterModalOpen && (
            <GenericFilterModal
            onClose={handleCloseFilterModal}
            onApplyFilter={handleApplyFilter}
            filterType='GroupType'
            apiEndpoint='/api/Groups/getDeletedGroups'
            dataKey='groupType'           
            
            />
          )
        } */}
        {isLoading && <Loader />}
      </div>
    </div>
  );
};

export default DeleteGroupComponent;
