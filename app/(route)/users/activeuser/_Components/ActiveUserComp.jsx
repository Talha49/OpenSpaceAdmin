"use client";
import {
  FaUserPlus,
  FaFileAlt,
  FaUserFriends,
  FaShieldAlt,
  FaTrash,
  FaSyncAlt,
  FaKey,
  FaFileExport,
  FaFilter,
  FaSearch,
  FaEllipsisH,
  FaSort,
  FaTimes,
  FaTrashAlt,
  FaUserEdit,
} from "react-icons/fa";
import { BsMoon } from "react-icons/bs";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { 
  fetchUsers, 
  deleteUserAsync, 
  storeDeletedUser, 
  setSelectedUseruniquely, 
  setSearchTerm,
  setSortOrder,
  setFilterCriteria,
  setCurrentPage,
  selectPaginatedUsers,
  selectTotalPages,
} from "@/lib/Feature/UserSlice";
import { MdOutlineEventNote } from "react-icons/md";
import { useRouter } from "next/navigation";

import Link from "next/link";
import Table from "@/app/_components/TableComponent/TableComponent";
import UserDetailDialog from "@/app/_components/UserDetailDilaog&Modal/UserDetailDilaog";
import FilterModal from "@/app/_components/UserDetailDilaog&Modal/FilterModal";
import Header from "@/app/_HOC/Header/Header";

const ActiveUserComp = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const users = useSelector(selectPaginatedUsers);
  const totalPages = useSelector(selectTotalPages);
  const currentPage = useSelector(state => state.user.currentPage);
  const searchTerm = useSelector(state => state.user.searchTerm);
  const sortOrder = useSelector(state => state.user.sortOrder);

  const [showModal, setShowModal] = useState(false);
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });
  const [selectedUser, setSelectedUser] = useState(null);
  const [dialogUser, setDialogUser] = useState(null);
  const [deleteMode, setDeleteMode] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleOpenFilterModal = () => setIsFilterModalOpen(true);
  const handleCloseFilterModal = () => setIsFilterModalOpen(false);
  const handleApplyFilter = (criteria) => dispatch(setFilterCriteria(criteria));

  const handleSort = () => dispatch(setSortOrder(!sortOrder));

  const handleEllipsisClick = (event, user) => {
    event.stopPropagation();
    const rect = event.currentTarget.getBoundingClientRect();
    setModalPosition({
      top: rect.bottom + window.scrollY,
      left: rect.left + window.scrollX,
    });
    setShowModal(user.id);
    setSelectedUser(user);
  };

  const handleDelete = async () => {
    if (selectedUser) {
      try {
        await dispatch(deleteUserAsync(selectedUser.id)).unwrap();
        await dispatch(storeDeletedUser(selectedUser)).unwrap();
        setShowModal(false);
      } catch (error) {
        console.error("Failed to delete user", error);
      }
    }
  };

  const handleEdit = () => {
    dispatch(setSelectedUseruniquely(selectedUser));
    router.push("/users");
  };
  
  const handleUserClick = (user) => setDialogUser(user);
  const closeDialog = () => setDialogUser(null);

  const toggleDeleteMode = () => {
    setDeleteMode(!deleteMode);
    setSelectedUsers([]);
  };

  const handleCheckboxChange = (userId) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedUsers(users.map((user) => user.id));
    } else {
      setSelectedUsers([]);
    }
  };

  const handleBulkDelete = async () => {
    try {
      for (const userId of selectedUsers) {
        await dispatch(deleteUserAsync(userId)).unwrap();
        const userToStore = users.find(user => user.id === userId);
        if (userToStore) {
          await dispatch(storeDeletedUser(userToStore)).unwrap();
        }
      }
      setSelectedUsers([]);
      setDeleteMode(false);
    } catch (error) {
      console.error("An error occurred while deleting users", error);
    }
  };

  const handleSearchChange = (e) => {
    dispatch(setSearchTerm(e.target.value));
  };

  const handleRefresh = () => {
    dispatch(fetchUsers());
  };

  const handlePageChange = (page) => {
    dispatch(setCurrentPage(page));
  };

 const buttons = [
  { icon: FaUserPlus, text: "Add a user", link: "/users" },
  { icon: FaFileAlt, text: "User templates" },
  { icon: FaUserFriends, text: "Add multiple users" },
  { icon: FaShieldAlt, text: "Multi-factor authentication" },
  { icon: FaTrash, text: "Delete a user", onClick: toggleDeleteMode },
  { icon: FaSyncAlt, text: "Refresh", onClick: handleRefresh },
  { icon: FaKey, text: "Reset password" },
  { icon: FaFileExport, text: "Export users" },
  { icon: FaEllipsisH, text: "" },
];


  const columns = [
    { key: "fullName", label: "Display Name", sortable: true },
    { key: "email", label: "Email", sortable: true },
    { key: "address", label: "Address", sortable: true },
    { key: "city", label: "City", sortable: true },
    { key: "contact", label: "Contact", sortable: true },
  ];

  return (
    <div className="min-h-screen py-4">
      {/********Header */}
      {/* <div className="bg-white p-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-lg font-semibold">peritus.ae</h1>
          <button className="text-gray-600 hover:text-gray-800 flex items-center gap-2 text-sm">
            Dark mode <BsMoon className="w-5 h-5 text-sm" />
          </button>
        </div>

        <h1 className="font-semibold text-xl mb-4">Active Users</h1>

        <div className="flex items-center justify-between border-t-2 pt-4">
          <div className="flex items-center gap-3">
            {buttons.map((btn, index) => (
              <div key={index} className="relative flex items-center gap-1 group">
                {btn.link ? (
                  <Link href={btn.link} className="flex items-center hover:text-blue-600">
                    <btn.icon className="w-4 h-4 text-blue-500" {...btn.icon} />
                    <span className="hidden lg:inline text-[10px]">{btn.text}</span>
                  </Link>
                ) : (
                  <button className="flex items-center hover:text-blue-600" onClick={btn.onClick}>
                    <btn.icon className="w-4 h-4 text-blue-500" {...btn.icon} />
                    <span className="hidden lg:inline text-[10px]">{btn.text}</span>
                  </button>
                )}
                {btn.text && (
                  <div
                    className="absolute bottom-full mb-1 hidden text-xs text-white bg-gray-800 p-1 rounded-lg shadow-md group-hover:block lg:hidden"
                    style={{ whiteSpace: "nowrap", zIndex: 1000 }}
                  >
                    {btn.text}
                  </div>
                )}
              </div>
            ))}
          </div>

          {deleteMode && (
            <button
              onClick={handleBulkDelete}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Delete Selected
            </button>
          )}

          <div className="flex items-center gap-2">
            <button
              className="relative flex items-center gap-1 px-3 py-2 text-sm font-medium"
              onClick={handleOpenFilterModal}
            >
              <FaFilter className="w-4 h-4 text-blue-500" />
              <span className="hidden sm:inline">Filter</span>
            </button>
            <div className="relative flex-grow">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search users list"
                onChange={handleSearchChange}
                value={searchTerm}
                className="w-full pl-12 pr-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </div> */}
      
      <Header
        title="Talha.ae"
        subTitle="Active Users"
        buttons={buttons}
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        onFilterClick={handleOpenFilterModal}
        mode={deleteMode}
        onBulkDelete={handleBulkDelete}
        onRefresh={handleRefresh}
        isFilterModalOpen={isFilterModalOpen}
        actionMode='Delete'
      />


      <div className="mt-4">
        <Table
          data={users}
          columns={columns}
          onSort={handleSort}
          onRowClick={handleUserClick}
          onActionClick={handleEllipsisClick}
          mode={deleteMode}
          selectedItems={selectedUsers}
          onCheckboxChange={handleCheckboxChange}
          onSelectAll={handleSelectAll}


          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>

      {showModal && selectedUser && (
        <div
          className="absolute z-50 bg-white w-[40vh] rounded-lg p-4 shadow-lg"
          style={{ top: modalPosition.top, left: modalPosition.left }}
        >
          <div className="flex justify-end mb-4">
            <button
              className="text-gray-500 hover:text-gray-800"
              onClick={() => setShowModal(false)}
            >
              <FaTimes className="w-5 h-5" />
            </button>
          </div>
          <div className="flex flex-col items-start gap-4 text-xs">
            <button className="flex items-center gap-3 w-full hover:bg-gray-300 p-1">
              <MdOutlineEventNote className="w-5 h-5" />
              Manage product licenses
            </button>
            <button className="flex items-center gap-3 w-full hover:bg-gray-300 p-1">
              <FaTrashAlt className="w-5 h-5" />
              Manage groups
            </button>
            <button
              onClick={handleDelete}
              className="flex items-center gap-3 w-full hover:bg-gray-300 p-1"
            >
              <FaTrashAlt className="w-5 h-5" />
              Delete user
            </button>
            <button
              onClick={handleEdit}
              className="flex items-center gap-3 w-full hover:bg-gray-300 p-1"
            >
              <FaUserEdit className="w-5 h-5" />
              Manage user
            </button>
          </div>
        </div>
      )}

      {dialogUser && (
        <UserDetailDialog
          isOpen={!!dialogUser}
          onClose={closeDialog}
          user={dialogUser}
        />
      )}

      {isFilterModalOpen && (
        <FilterModal
          onClose={handleCloseFilterModal}
          onApplyFilter={handleApplyFilter}
        />
      )}
    </div>
  );
};

export default ActiveUserComp;