"use client";
import NewHeader from "@/app/_HOC/NewHeader/NewHeader";
import NewTableComponent from "@/app/_HOC/Table/NewTableComponent";
import { fetchGroups } from "@/lib/Feature/GroupSlice";
import React, { useState, useEffect } from "react";
import { FaFileExport, FaUserFriends, FaSort } from "react-icons/fa";
import { IoMdRefresh } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";

const headerItems = [
  {
    icon: <FaUserFriends />,
    label: "Add Group",
  },
  {
    icon: <MdDelete />,
    label: "Delete Group",
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

  useEffect(() => {
    dispatch(fetchGroups());
  }, [dispatch]);

  const groups = useSelector((state) => state.group.groups);

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedGroups(groups.map((group) => group.id));
    } else {
      setSelectedGroups([]);
    }
  };

  const handleSort = (key) => {
    // Implement sorting logic based on key
  };

  // Pagination Logic
  const paginatedGroups = groups.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const tableColumns = [
    { label: "Group Name", key: "groupName" },
    // { label: "Group Owners", key: "groupOwners" },
    { label: "Type", key: "type" },
    { label: "groupMembers", key: "groupMembers" },
  ];

  return (
    <div>
      <NewHeader>
        <div className="flex items-center gap-4 text-[11px]">
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
      </NewHeader>
      <div>
        <NewTableComponent
          tableColumns={[
            'Group Name', 'Owner', 'Type', 'Members'
          ]} // Filters out any `null` or `undefined` columns
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
                key={groups.id}
                className="border-b hover:bg-blue-50 cursor-pointer relative even:bg-gray-100"
              >
                <td className="p-3 text-gray-700">{group.basics.name}</td>
                <td className="p-3 text-gray-700">{group.owners[0].fullName}</td>
                <td className="p-3 text-gray-700">{group.groupType}</td>
                <td className="p-3 text-gray-700">{groups.length}</td>
              </tr>
            ))}
        </NewTableComponent>
      </div>
    </div>
  );
};

export default ActiveGroup;
