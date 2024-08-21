// pages/deletedUsers.js
"use client";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import Table from "@/app/_components/TableComponent/TableComponent";
import {
  fetchDeletedUsers,
  selectDeletedUsersTotalPages,
  selectPaginatedDeletedUsers,
  setDeletedUsersCurrentPage,
  setSearchTerm,
} from "@/lib/Feature/UserSlice";
import { FaFileExport, FaFilter, FaUserFriends } from "react-icons/fa";
import { IoMdRefresh } from "react-icons/io";
import NewHeader from "@/app/_HOC/NewHeader/NewHeader";

const DeletedUsers = () => {
  const dispatch = useDispatch();
  const deletedUsers = useSelector(selectPaginatedDeletedUsers);
  const totalPages = useSelector(selectDeletedUsersTotalPages);
  const searchTerm = useSelector((state) => state.user.searchTerm);
  const currentPage = useSelector(
    (state) => state.user.deletedUsersCurrentPage
  );

  useEffect(() => {
    dispatch(fetchDeletedUsers());
  }, [dispatch]);

  const handlePageChange = (page) => {
    dispatch(setDeletedUsersCurrentPage(page));
  };

  const columns = [
    { key: "fullName", label: "Name" },
    { key: "email", label: "Email" },
    { key: "address", label: "Address" },
    { key: "city", label: "City" },
    { key: "contact", label: "Contact" },
  ];
    
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
   return (
    <div className="min-h-screen py-4">
      <NewHeader>
        <div className="flex flex-col px-4">
        <div className="mb-4 flex flex-col gap-4">
          <h1 className="text-xl font-semibold tracking-wider">Talha.ae</h1>
            <h2 className="text-lg font-semibold tracking-wider">Delete Users</h2>

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
      <Table
        data={deletedUsers}
        columns={columns}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default DeletedUsers;
