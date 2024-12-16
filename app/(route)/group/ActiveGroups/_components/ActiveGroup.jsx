// "use client";
// import GroupDetailDialog from "@/app/_components/GroupDetailDialog/GroupDetailDialog";
// import GroupFilterModal from "@/app/_components/UserDetailDilaog&Modal/GroupFilterModal";
// import NewHeader from "@/app/_HOC/NewHeader/NewHeader";
// import NewTableComponent from "@/app/_HOC/Table/NewTableComponent";
// import { deleteGroups, fetchGroups } from "@/lib/Feature/GroupSlice";
// import React, { useState, useEffect, useMemo } from "react";
// import { FaFileExport, FaUserFriends, FaSort, FaFilter } from "react-icons/fa";
// import { IoMdRefresh } from "react-icons/io";
// import { useDispatch, useSelector } from "react-redux";

// const headerItems = [
//   {
//     icon: <FaUserFriends />,
//     label: "Add Group",
//   },
//   {
//     icon: <IoMdRefresh />,
//     label: "Refresh",
//   },
//   {
//     icon: <FaFileExport />,
//     label: "Export Groups",
//   },
// ];

// const ActiveGroup = () => {
//   const dispatch = useDispatch();
//   const [currentPage, setCurrentPage] = useState(1);
//   const [rowsPerPage, setRowsPerPage] = useState(5);
//   const [isOpen, setIsOpen] = useState(false);
//   const [clickedGroup, setClickedGroup] = useState(null);
//   const [filterCriteria, setFilterCriteria] = useState({ groupType: "" });
//   const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
//   const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
//   const [searchTerm , setSearchTerm] = useState('')
//   const groups = useSelector((state) => state.group.groups);

//   const handleOpenFilterModal = () => setIsFilterModalOpen(true);
//   const handleCloseFilterModal = () => setIsFilterModalOpen(false);
//   const handleApplyFilter = (criteria) => {
//     setFilterCriteria(criteria);
//     setCurrentPage(1);
//     handleCloseFilterModal();
//   };

//   useEffect(() => {
//     dispatch(fetchGroups());
//   }, [dispatch]);

//   useEffect(() => {
//     if (groups?.length) {
//       groups.forEach((group) => {
//         if (group.members.length === 0) {
//           dispatch(deleteGroups(group.id));
//         }
//       });
//     }
//   }, [groups, dispatch]);

//   const handleSort = (key) => {
//     let direction = 'ascending';
//     if (sortConfig.key === key && sortConfig.direction === 'ascending') {
//       direction = 'descending';
//     }
//     setSortConfig({ key, direction });
//   };

//   const filteredAndSortedGroups = useMemo(() => {
//     let result = [...groups];

//     // Apply search filter
//     result = result.filter((group) =>
//       group.basics.name.toLowerCase().includes(searchTerm.toLowerCase())
//     );

//     // Apply type filter
//     if (filterCriteria.groupType) {
//       result = result.filter(group => group.groupType === filterCriteria.groupType);
//     }

//     // Apply sorting
//     if (sortConfig.key !== null) {
//       result.sort((a, b) => {
//         let aValue, bValue;
//         switch (sortConfig.key) {
//           case 'fullName':
//             aValue = a.basics.name.toLowerCase();
//             bValue = b.basics.name.toLowerCase();
//             break;
//           case 'owner':
//             aValue = a.owners[0]?.fullName.toLowerCase();
//             bValue = b.owners[0]?.fullName.toLowerCase();
//             break;
//           case 'type':
//             aValue = a.groupType.toLowerCase();
//             bValue = b.groupType.toLowerCase();
//             break;
//           case 'members':
//             aValue = a.members.length;
//             bValue = b.members.length;
//             break;
//           default:
//             aValue = a[sortConfig.key];
//             bValue = b[sortConfig.key];
//         }

//         if (aValue < bValue) {
//           return sortConfig.direction === 'ascending' ? -1 : 1;
//         }
//         if (aValue > bValue) {
//           return sortConfig.direction === 'ascending' ? 1 : -1;
//         }
//         return 0;
//       });
//     }

//     return result;
//   }, [groups, searchTerm, filterCriteria, sortConfig]);

//   // Pagination Logic
//   const paginatedGroups = filteredAndSortedGroups.slice(
//     (currentPage - 1) * rowsPerPage,
//     currentPage * rowsPerPage
//   );

//   const tableColumns = [
//     { label: "Group Name", key: "fullName" },
//     { label: "Owner", key: "owner" },
//     { label: "Type", key: "type" },
//     { label: "Members", key: "members" },
//   ];

//   return (
//     <div>
//      <NewHeader>
//         <div className="flex flex-col px-4">
//           <div className="mb-4 flex flex-col gap-4">
//             <h1 className="text-xl font-semibold tracking-wider">Talha.ae</h1>
//             <h2 className="text-lg font-semibold tracking-wider">Active Groups</h2>
//           </div>

//           <div className="flex flex-col sm:flex-row sm:gap-0 gap-6 sm:items-center justify-between border-t-2 pt-2">
//             <div className="flex items-center sm:gap-x-6 gap-x-4 text-[8px]">
//               {headerItems.map((item, i) => (
//                 <div
//                   key={i}
//                   className="flex items-center gap-1 cursor-pointer hover:text-blue-500 transition-all"
//                 >
//                   <span className="text-lg">{item.icon}</span>
//                   <p>{item.label}</p>
//                 </div>
//               ))}
//             </div>
//             <div className="flex items-center gap-4 w-[250px] mr-6">
//               <span className="flex items-center text-sm gap-1 cursor-pointer" onClick={handleOpenFilterModal}>
//                 <FaFilter />
//                 <p>Filter</p>
//               </span>
//               <input
//                 type="text"
//                 placeholder="Search users list"
//                 onChange={(e) => {
//                   setSearchTerm(e.target.value);
//                   setCurrentPage(1)
//                 }}
//                 value={searchTerm}
//                 className="w-full p-1 border border-gray-300 rounded placeholder:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />
//             </div>
//           </div>
//         </div>
//       </NewHeader>
//       <div>
//         <NewTableComponent
//           tableColumns={tableColumns.map((col) => (
//             <div
//               key={col.key}
//               className="flex items-center justify-between cursor-pointer w-full"

//             >
//               <span>{col.label}</span>
//               <FaSort className="ml-1"   onClick={() => handleSort(col.key)} />
//             </div>
//           ))}
//           rowsPerPage={rowsPerPage}
//           totalRows={filteredAndSortedGroups.length}
//           currentPage={currentPage}
//           onPageChange={(page) => setCurrentPage(page)}
//         >
//           {paginatedGroups.map((group) => (
//             <tr
//               key={group.id}
//               className="border-b hover:bg-blue-50 cursor-pointer relative even:bg-gray-100"
//               onClick={() => {
//                 setIsOpen(true);
//                 setClickedGroup(group);
//               }}
//             >
//               <td className="p-3 text-gray-700">{group?.basics.name}</td>
//               <td className="p-3 text-gray-700">
//                 {group?.owners[0]?.fullName}
//               </td>
//               <td className="p-3 text-gray-700">{group?.groupType}</td>
//               <td className="p-3 text-gray-700">{group?.members.length}</td>
//             </tr>
//           ))}
//         </NewTableComponent>
//         <GroupDetailDialog
//           isOpen={isOpen}
//           onClose={() => {
//             setIsOpen(false);
//           }}
//           group={clickedGroup}
//         />

//         {isFilterModalOpen && (
//           <GroupFilterModal
//             onClose={handleCloseFilterModal}
//             onApplyFilter={handleApplyFilter}
//           />
//         )}
//       </div>
//     </div>
//   );
// };

// export default ActiveGroup;

"use client";
import GroupDetailDialog from "@/app/_components/GroupDetailDialog/GroupDetailDialog";
import GenericFilterModal from "@/app/_components/UserDetailDilaog&Modal/GerenicFilterModal";
import GroupFilterModal from "@/app/_components/UserDetailDilaog&Modal/GroupFilterModal";
import NewHeader from "@/app/_HOC/NewHeader/NewHeader";
import NewTableComponent from "@/app/_HOC/Table/NewTableComponent";
import {
  deleteGroups,
  fetchGroups,
  storeDeletedGroups,
} from "@/lib/Feature/GroupSlice";
import { useRouter } from "next/navigation";
import React, { useState, useEffect, useMemo } from "react";
import {
  FaFileExport,
  FaUserFriends,
  FaSort,
  FaFilter,
  FaUsers,
  FaSpinner,
} from "react-icons/fa";
import { IoMdRefresh } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import * as XLSX from "xlsx"; // Import the xlsx library

const ActiveGroup = () => {
  const router = useRouter()
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isOpen, setIsOpen] = useState(false);
  const [clickedGroup, setClickedGroup] = useState(null);
  const [filterCriteria, setFilterCriteria] = useState({ groupType: "" });
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [isSelectable, setIsSelectable] = useState(false);
  const [selectedGroups, setSelectedGroups] = useState([]);
  const groups = useSelector((state) => state.group.groups);
  const [optionsGroup, setOptionsGroup] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false); // Track the deletion state
  const [isLoading, setIsLoading] = useState(true);  // Loading state
  const handleOpenFilterModal = () => setIsFilterModalOpen(true);
  const handleCloseFilterModal = () => setIsFilterModalOpen(false);
  const handleApplyFilter = (criteria) => {
    setFilterCriteria(criteria);
    setCurrentPage(1);
    handleCloseFilterModal();
  };

//handle export in xlx on icon click export 
const handleExportExcel = () => {
  // Convert groups data to an array of objects that are compatible with Excel format
  const exportData = groups.map((group) => ({
    "Group Name": group.groupName,
    "Owner": group.groupOwrnerID?.map((owner) => owner.fullName).join(", "),
    "Type": group.groupType,
    "Members": group.groupTargetID?.length || 0,
  }));

  // Create a new workbook and add the exportData as a worksheet
  const ws = XLSX.utils.json_to_sheet(exportData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Groups");

  // Export the workbook to an Excel file
  XLSX.writeFile(wb, "groups.xlsx");
};




  // Handle items per page change
  const handleRowsPerPageChange = (e) => {
    setRowsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to first page when rows per page changes
  };

  useEffect(() => {
    setIsLoading(true); // Set loading to true when fetching starts
    dispatch(fetchGroups()).then(() => {
      console.log("Groups fetched:", groups); // Log the groups from Redux
    })
      .finally(() => {
        setIsLoading(false); // Set loading to false after fetch is complete
      });
  }, [dispatch]);

  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const filteredAndSortedGroups = useMemo(() => {
    let result = [...groups];

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
  }, [groups, searchTerm, filterCriteria, sortConfig]);

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
  const handleCheckboxChange = (group) => {
    setSelectedGroups((prevSelected) => {
      const isSelected = prevSelected.some((selectedGroup) => selectedGroup._id === group._id);
      if (isSelected) {
        return prevSelected.filter((selectedGroup) => selectedGroup._id !== group._id);
      } else {
        return [...prevSelected, group];
      }
    });
  };

  const handleSelectAll = () => {
    const allSelected = paginatedGroups.every((group) =>
      selectedGroups.some((selectedGroup) => selectedGroup._id === group._id)
    );

    if (allSelected) {
      setSelectedGroups((prevSelected) =>
        prevSelected.filter(
          (selectedGroup) => !paginatedGroups.some((group) => group._id === selectedGroup._id)
        )
      );
    } else {
      setSelectedGroups((prevSelected) => [
        ...prevSelected,
        ...paginatedGroups.filter(
          (group) => !prevSelected.some((selectedGroup) => selectedGroup._id === group._id)
        ),
      ]);
    }
  };

  const handleDeleteGroups = async () => {
    setIsDeleting(true);  // Set to true when deletion starts
    if (selectedGroups.length === 0) {
      alert("Please select groups to delete.");
    } else {
      const groupIds = selectedGroups.map((group) => group._id); // Use _id instead of id

      // Log the groupIds to ensure they are correct
      console.log("Deleting groups with IDs:", groupIds);

      try {
        // Dispatch the deleteGroups action with the selected group IDs
        const actionResult = await dispatch(deleteGroups(groupIds));
        const { error } = actionResult;

        if (error) {
          throw new Error('Failed to delete groups');
        }

        alert('Groups Deleted successfully.');

        // Optionally, update the UI or state after successful deletion
        dispatch(fetchGroups());
        setSelectedGroups([]); // Clear selected groups
        setIsSelectable(false); // Disable selection mode
      } catch (error) {
        console.error('Failed to delete groups:', error);
        alert('Failed to delete groups');
      }
      finally {
        setIsDeleting(false); // Set back to false after the operation is complete
      }
    }

  };


  const headerItems = [
    {
      icon: <FaUserFriends />,
      label: "Add Group",
      onClick: () => {
        router.push("/group");
      },
    },
    {
      icon: <IoMdRefresh />,
      label: "Refresh",
      onClick: () => {
        dispatch(fetchGroups());
      },
    },
    {
      icon: <FaFileExport />,
      label: "Export Groups",
      onClick: handleExportExcel, // Add export functionality here
    },
    {
      icon: <FaFileExport />,
      label: "Delete Groups",
      onClick: () => {
        setIsSelectable(!isSelectable);
      },
    },
  ];

  useEffect(() => {
    dispatch(fetchGroups()).then(() => {
      console.log("Groups fetched:", groups); // Log the groups from Redux
    });
  }, [dispatch]);
  console.log("Selected Groups:", selectedGroups);




  return (
    <div>
      <NewHeader>
        <div className="flex flex-col px-4">
          <div className="mb-4 flex flex-col gap-4">
            <h1 className="text-xl font-semibold tracking-wider text-neutral-500">Talha.ae</h1>
            <h2 className="text-lg font-semibold tracking-wider text-neutral-500  ">
              Active Groups
            </h2>
          </div>

          <div className="flex flex-col sm:flex-row sm:gap-0 gap-6 sm:items-center justify-between border-t-2 dark:border-neutral-700 pt-2">
            <div className="flex items-center sm:gap-x-6 gap-x-4 text-[8px]">
              {headerItems.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-1 cursor-pointer hover:text-blue-500 transition-all"
                  onClick={item.onClick}
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

      {isSelectable && groups.length > 0 && (
        <div className="px-10 w-full flex items-center justify-end gap-2 mb-4">
          <button
            className="px-3 py-2 rounded-lg border"
            onClick={() => {
              setIsSelectable(false);
              setSelectedGroups([]);
            }}
          >
            Cancel
          </button>

          <button
            className="bg-red-500 px-3 py-2 rounded-lg text-white"
            onClick={handleDeleteGroups}
            disabled={isDeleting}  // Disable the button while deleting
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      )}

      <div className="pl-4 pr-2">
        <NewTableComponent
          tableColumns={[
            isSelectable ? (
              <th className="flex items-center justify-between">
                <input
                  type="checkbox"
                  className="custom-circle-checkbox"
                  checked={paginatedGroups.every((group) =>
                    selectedGroups.some((selectedGroup) => selectedGroup._id === group._id)
                  )}
                  onChange={handleSelectAll}
                />


              </th>
            ) : null,
            ...tableColumns.map((col) => (
              <div
                key={col.key}
                style={{ width: col.width }} // Apply consistent width
                className="flex items-center justify-between cursor-pointer w-full"
              >
                <span>{col.label}</span>
                <FaSort className="ml-1" onClick={() => handleSort(col.key)} />
              </div>
            )),
          ]}
          buttons={
            <>
              <button
                className="flex items-center gap-2 px-2 py-1 rounded hover:bg-blue-200 dark:hover:bg-neutral-800"
                onClick={() => {
                  router.push("/group");
                }}
              >
                <FaUsers className="text-blue-500" />
                <span className="text-sm">Create New Group</span>
              </button>
              {/* Loader above the table */}
              {isLoading && (
                <div className="flex justify-center items-center ">
                  <FaSpinner className="animate-spin text-blue-500" size={20} />
                </div>
              )}
            </>
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
                if (!isSelectable) {
                  setIsOpen(true);
                  setClickedGroup(group);
                }
              }}
            >
              {isSelectable && (
                <td>
                  <input
                    type="checkbox"
                    className="custom-circle-checkbox mx-2"
                    checked={selectedGroups.some((selectedGroup) => selectedGroup._id === group._id)} // Use the correct property for checking
                    onChange={(e) => {
                      e.stopPropagation(); // Prevent row click event
                      handleCheckboxChange(group); // Ensure group is passed correctly
                    }}
                  />
                </td>

              )}
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
        <GroupDetailDialog
          isOpen={isOpen}
          onClose={() => {
            setIsOpen(false);
          }}
          group={clickedGroup}
        />

        {isFilterModalOpen && (
          <GroupFilterModal
            onClose={handleCloseFilterModal}
            onApplyFilter={handleApplyFilter}
          />
        )}
      </div>
    </div>
  );
};

export default ActiveGroup;
