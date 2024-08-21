"use client";
import GroupDetailDialog from "@/app/_components/GroupDetailDialog/GroupDetailDialog";
import NewHeader from "@/app/_HOC/NewHeader/NewHeader";
import NewTableComponent from "@/app/_HOC/Table/NewTableComponent";
import { deleteGroups, fetchGroups } from "@/lib/Feature/GroupSlice";
import { setSearchTerm } from "@/lib/Feature/UserSlice";
import React, { useState, useEffect } from "react";
import { FaFileExport, FaUserFriends, FaSort, FaFilter } from "react-icons/fa";
import { IoMdRefresh } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";

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
];

const ActiveGroup = () => {
  const dispatch = useDispatch();
  const searchTerm = useSelector((state) => state.user.searchTerm);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [isOpen, setIsOpen] = useState(false);
  const [clickedGroup, setClickedGroup] = useState(null);

  const groups = useSelector((state) => state.group.groups);

  useEffect(() => {
    dispatch(fetchGroups());
  }, [dispatch]);

  // Check and delete empty groups after fetching
  useEffect(() => {
    if (groups?.length) {
      groups.forEach((group) => {
        if (group.members.length === 0) {
          dispatch(deleteGroups(group.id));
        }
      });
    }
  }, [groups, dispatch]);

  // Pagination Logic
  const paginatedGroups = groups.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  return (
    <div>
      <NewHeader>
        <div className="flex flex-col px-4">
        <div className="mb-4 flex flex-col gap-4">
          <h1 className="text-xl font-semibold tracking-wider">Talha.ae</h1>
            <h2 className="text-lg font-semibold tracking-wider">Active Groups</h2>

        </div>
        
        <div className="flex flex-col sm:flex-row sm:gap-0 gap-6 sm:items-center  justify-between border-t-2 pt-2">

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
    <span className="flex items-center text-sm gap-1">
      <FaFilter />
      <p>Filter</p>
    </span>
    <input
      type="text"
      placeholder="Search users list"
      onChange={(e) => { dispatch(setSearchTerm(e.target.value)); }}
      value={searchTerm}
      className="w-full p-1 border border-gray-300 rounded placeholder:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>
        </div>
        
  </div>
      </NewHeader>
      <div>
        <NewTableComponent
          tableColumns={["Group Name", "Owner", "Type", "Members"]}
          rowsPerPage={rowsPerPage}
          totalRows={groups.length}
          currentPage={currentPage}
          onPageChange={(page) => setCurrentPage(page)}
        >
          {paginatedGroups
            .filter((group) =>
              group.basics.name.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .map((group) => (
              <tr
                key={group.id}
                className="border-b hover:bg-blue-50 cursor-pointer relative even:bg-gray-100"
                onClick={() => {
                  setIsOpen(true);
                  setClickedGroup(group);
                }}
              >
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
      </div>
    </div>
  );
};

export default ActiveGroup;
