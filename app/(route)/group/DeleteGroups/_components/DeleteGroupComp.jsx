"use client";
import DeleteGroupDetailDialog from "@/app/_components/DeleteGroupDetailDialog/DeleteGroupDetailDialog";
import GroupDetailDialog from "@/app/_components/GroupDetailDialog/GroupDetailDialog";
import GenericFilterModal from "@/app/_components/UserDetailDilaog&Modal/GerenicFilterModal";
import GetDeleteFilterModal from "@/app/_components/UserDetailDilaog&Modal/GetDeleteFilterModal";
import NewHeader from "@/app/_HOC/NewHeader/NewHeader";
import NewTableComponent from "@/app/_HOC/Table/NewTableComponent";
import { fetchDeletedGroups } from "@/lib/Feature/GroupSlice";
import React, { useState, useEffect, useMemo } from "react";
import { FaFileExport, FaUserFriends, FaSort, FaFilter, FaSpinner } from "react-icons/fa";
import { IoMdRefresh } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";

const headerItems = [
  {
    icon: <IoMdRefresh />,
    label: "Refresh",
    onClick:()=>
    {
      fetchDeletedGroups();
    },
  },
  {
    icon: <FaFileExport />,
    label: "Export Groups",
  },
];

const DeleteGroupComponent = () => {
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [deletedGroups, setDeletedGroups] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isOpen, setIsOpen] = useState(false);
  const [clickedGroup, setClickedGroup] = useState(null);
  const [filterCriteria, setFilterCriteria] = useState({ groupType: "" });
    const [isLoading, setIsLoading] = useState(true);  // Loading state
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

  // Handle items per page change
  const handleRowsPerPageChange = (e) => {
    setRowsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to first page when rows per page changes
  };
  useEffect(() => {
    const fetchDeletedGroups = async () => {
      setIsLoading(true); // Set loading to true when fetching starts
      try {
        const response = await fetch('/api/Groups/getDeletedGroups'); // Assuming this is your API endpoint
        const data = await response.json();
        console.log('Fetched Deleted Groups:', data); // Log the data to check

        if (data && Array.isArray(data)) {
          setDeletedGroups(data);
        } else {
          console.error('No valid data returned');
        }
      } catch (error) {
        console.error('Error fetching deleted groups:', error);
      }
      setIsLoading(false); // Set loading to false after fetch is complete
    };

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
            aValue = a.groupOwrnerID && a.groupOwrnerID[0]?.fullName
              ? a.groupOwrnerID[0]?.fullName.toLowerCase()
              : "";
            bValue = b.groupOwrnerID && b.groupOwrnerID[0]?.fullName
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
        <div className="flex flex-col px-4">
          <div className="mb-4 flex flex-col gap-4">
            <h1 className="text-xl font-semibold tracking-wider dark:text-neutral-500">Talha.ae</h1>
            <h2 className="text-lg font-semibold tracking-wider dark:text-neutral-500">
              Deleted Groups
            </h2>
          </div>

          <div className="flex flex-col sm:flex-row sm:gap-0 gap-6 sm:items-center justify-between border-t-2 dark:border-neutral-500 pt-2">
            <div className="flex items-center sm:gap-x-6 gap-x-4 text-[8px]">
              {headerItems.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-1 cursor-pointer hover:text-blue-500 transition-all"
                >
                  <span className="text-lg">{item.icon}</span>
                  <p>{item.label}</p>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-4 w-[250px] mr-6">
              <span
                className="flex items-center text-sm gap-1 cursor-pointer"
                onClick={handleOpenFilterModal}
              >
                <FaFilter />
                <p>Filter</p>
              </span>
              <input
                type="text"
                placeholder="Search groups list"
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                value={searchTerm}
                className="w-full p-1 border border-gray-300 rounded placeholder:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </NewHeader>

      <div className="pl-4 pr-2">
      {isLoading && (
        <div className="flex justify-center items-center ">
          <FaSpinner className="animate-spin text-blue-500" size={20} />
        </div>
      )}
        <NewTableComponent
          tableColumns={tableColumns.map((col) => (
            <div
              key={col.key}
              style={{ width: col.width }} // Apply consistent width
              className="flex items-center justify-between cursor-pointer w-full"
            >
              <span>{col.label}</span>
              <FaSort className="ml-1" onClick={() => handleSort(col.key)} />
            </div>
            
          ))}
          
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
               <td className="p-3 text-gray-700 dark:text-neutral-400 w-[250]">{group?.groupName}</td>
              <td className="p-3 text-gray-700 dark:text-neutral-400 w-[300]">
                {group?.groupOwrnerID?.map((owner) => owner.fullName).join(", ")}
              </td>
              <td className="p-3 text-gray-700 dark:text-neutral-400 w-[200]">{group?.groupType}</td>
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
      </div>
    </div>
  );
};

export default DeleteGroupComponent;
