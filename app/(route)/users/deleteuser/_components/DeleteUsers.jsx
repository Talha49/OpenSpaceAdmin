// pages/deletedUsers.js
"use client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import Table from "@/app/_components/TableComponent/TableComponent";
import {
  fetchDeletedUsers,
  selectDeletedUsersTotalPages,
  selectPaginatedDeletedUsers,
  setDeletedUsersCurrentPage,
  setSearchTerm,
} from "@/lib/Feature/UserSlice";
import {
  FaEllipsisH,
  FaFileExport,
  FaFilter,
  FaSort,
  FaUserFriends,
} from "react-icons/fa";
import { IoMdRefresh } from "react-icons/io";
import NewHeader from "@/app/_HOC/NewHeader/NewHeader";
import NewTableComponent from "@/app/_HOC/Table/NewTableComponent";

const DeletedUsers = () => {
  const dispatch = useDispatch();
  const searchTerm = useSelector((state) => state.user.searchTerm);
  const [deletedUsers, setDeletedUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10; // Limit the rows per page to 10

  const getDeletedUsers = async () => {
    const res = await dispatch(fetchDeletedUsers());
    setDeletedUsers(res.payload);
  };

  useEffect(() => {
    getDeletedUsers();
  }, [dispatch]);


  // Pagination Logic
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const paginatedDeletedUsers = deletedUsers.slice(
    indexOfFirstRow,
    indexOfLastRow
  );

  const headerItems = [
    {
      icon: <IoMdRefresh />,
      label: "Refresh",
    },
    {
      icon: <FaFileExport />,
      label: "Export Delete Users",
    },
  ];

  const tableColumns = [
    { label: "Display Name" },
    { label: "Email" },
    { label: "Address" },
    { label: "City" },
    { label: "Contact" },
  ];

  return (
    <div className="min-h-screen py-4">
      <NewHeader>
        <div className="flex flex-col px-4">
          <div className="mb-4 flex flex-col gap-4">
            <h1 className="text-xl font-semibold tracking-wider">Talha.ae</h1>
            <h2 className="text-lg font-semibold tracking-wider">
              Delete Users
            </h2>
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
                onChange={(e) => {
                  dispatch(setSearchTerm(e.target.value));
                }}
                value={searchTerm}
                className="w-full p-1 border border-gray-300 rounded placeholder:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </NewHeader>
      <NewTableComponent
        tableColumns={["Display Name", "Email", "Address", "City", "Contact"]}
        rowsPerPage={rowsPerPage}
        totalRows={deletedUsers.length}
        currentPage={currentPage}
        onPageChange={(page) => setCurrentPage(page)}
      >
        {paginatedDeletedUsers.filter((user) => (
          user.fullName.toLowerCase().includes(searchTerm.toLowerCase())
        )).map((user) => (
          <tr
            key={user.id}
            className="border-b hover:bg-blue-50 cursor-pointer relative even:bg-gray-100"
          >
            <td className="p-3 text-gray-700">
              <div className="flex items-center justify-between ">
                <span className="hover:text-blue-600">{user.fullName}</span>
                <span className="cursor-pointer relative">
                  <FaEllipsisH className="rotate-90 text-blue-600" />
                </span>
              </div>
            </td>
            <td className="p-3 text-gray-700">{user.email}</td>
            <td className="p-3 text-gray-700">{user.address}</td>
            <td className="p-3 text-gray-700">{user.city}</td>
            <td className="p-3 text-gray-700">{user.contact}</td>
          </tr>
        ))}
      </NewTableComponent>
    </div>
  );
};

export default DeletedUsers;
