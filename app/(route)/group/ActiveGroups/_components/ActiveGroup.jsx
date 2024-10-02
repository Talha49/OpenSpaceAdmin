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
} from "react-icons/fa";
import { IoMdRefresh } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";

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
    dispatch(fetchGroups());
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
      group.basics.name.toLowerCase().includes(searchTerm.toLowerCase())
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
            aValue = a.basics.name.toLowerCase();
            bValue = b.basics.name.toLowerCase();
            break;
          case "owner":
            aValue = a.owners[0]?.fullName.toLowerCase();
            bValue = b.owners[0]?.fullName.toLowerCase();
            break;
          case "type":
            aValue = a.groupType.toLowerCase();
            bValue = b.groupType.toLowerCase();
            break;
          case "members":
            aValue = a.members.length;
            bValue = b.members.length;
            break;
          default:
            aValue = a[sortConfig.key];
            bValue = b[sortConfig.key];
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
    { label: "Group Name", key: "fullName" },
    { label: "Owner", key: "owner" },
    { label: "Type", key: "type" },
    { label: "Members", key: "members" },
  ];

  const handleCheckboxChange = (group) => {
    setSelectedGroups((prevSelected) =>
      prevSelected.find((selectedGroup) => selectedGroup.id === group.id)
        ? prevSelected.filter((selectedGroup) => selectedGroup.id !== group.id)
        : [...prevSelected, group]
    );
  };

  const handleSelectAll = () => {
    if (selectedGroups.length === paginatedGroups.length) {
      setSelectedGroups([]);
    } else {
      setSelectedGroups(paginatedGroups);
    }
  };

  const handleDeleteGroups = async () => {
    if (selectedGroups.length === 0) {
      alert("Please select groups to delete.");
    } else {
      const groupIds = selectedGroups.map((group) => group.id);
      try {
        // First, delete the groups
        await dispatch(deleteGroups(groupIds)).unwrap();

        // Then, store the deleted groups
        await dispatch(storeDeletedGroups(selectedGroups)).unwrap();

        setSelectedGroups([]);
        setIsSelectable(false);
        alert("Groups deleted and stored successfully.");
      } catch (error) {
        console.error("Failed to delete or store groups:", error);
      }
    }
  };

  const headerItems = [
    {
      icon: <FaUserFriends />,
      label: "Add Group",
    },
    {
      icon: <IoMdRefresh />,
      label: "Refresh",
    },
    {
      icon: <FaFileExport />,
      label: "Export Groups",
    },
    {
      icon: <FaFileExport />,
      label: "Delete Groups",
      onClick: () => {
        setIsSelectable(!isSelectable);
      },
    },
  ];

  return (
    <div>
      <NewHeader>
        <div className="flex flex-col px-4">
          <div className="mb-4 flex flex-col gap-4">
            <h1 className="text-xl font-semibold tracking-wider">Talha.ae</h1>
            <h2 className="text-lg font-semibold tracking-wider">
              Active Groups
            </h2>
          </div>

          <div className="flex flex-col sm:flex-row sm:gap-0 gap-6 sm:items-center justify-between border-t-2 pt-2">
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
          >
            Delete
          </button>
        </div>
      )}

      <div>
        <NewTableComponent
          tableColumns={[
            isSelectable ? (
              <th className="flex items-center justify-between">
                <input
                  type="checkbox"
                  checked={
                    paginatedGroups.length > 0 &&
                    selectedGroups.length === paginatedGroups.length
                  }
                  onChange={handleSelectAll}
                />
              </th>
            ) : null,
            ...tableColumns.map((col) => (
              <div
                key={col.key}
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
                className="flex items-center gap-2 px-2 py-1 rounded hover:bg-blue-200"
                onClick={() => {
                  router.push("/group");
                }}
              >
                <FaUsers className="text-blue-500" />
                <span className="text-sm">Create New Group</span>
              </button>
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
              className="border-b cursor-pointer relative bg-gray-100 hover:bg-gray-200"
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
                    className="mx-2"
                    checked={selectedGroups.some(
                      (selectedGroup) => selectedGroup.id === group.id
                    )}
                    onChange={(e) => {
                      e.stopPropagation();
                      handleCheckboxChange(group);
                    }}
                  />
                </td>
              )}
              <td className="p-3 text-gray-700">{group?.basics.name}</td>
              <td className="p-3 text-gray-700">
                {group?.owners[0]?.fullName}
              </td>
              <td className="p-3 text-gray-700">{group?.groupType}</td>
              <td className="p-3 text-gray-700">{group?.members.length}</td>
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
