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
import React, { useEffect, useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { deleteUser, setSelectedUseruniquely } from "@/lib/Feature/UserSlice";
import { MdOutlineEventNote } from "react-icons/md";
import { useRouter } from "next/navigation";
import UserDetailDialog from "@/app/_components/UserDetailDilaog/UserDetailDilaog";
import Table from "@/app/_components/TableComponent/TableComponent";
import FilterModal from "@/app/_components/FilterModal";
import Link from "next/link";

const ITEMS_PER_PAGE = 5;

const ActiveUserComp = () => {
  const [users, setUsers] = useState([]);
  const [searchItem, setSearchItem] = useState("");
  const [sortOrder, setSortOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });
  const [selectedUser, setSelectedUser] = useState(null);
  const [dialogUser, setDialogUser] = useState(null);
  const [deleteMode, setDeleteMode] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [filterCriteria, setFilterCriteria] = useState({});

  const handleOpenFilterModal = () => {
    setIsFilterModalOpen(true);
  };

  const handleCloseFilterModal = () => {
    setIsFilterModalOpen(false);
  };

  const handleApplyFilter = (criteria) => {
    setFilterCriteria(criteria);
  };

  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("/api/getUser");
        if (response.ok) {
          const data = await response.json();
          setUsers(data);
        } else {
          console.error("Failed To Fetch Data");
        }
      } catch (error) {
        console.error("An error occurred while fetching users", error);
      }
    };
    fetchUser();
  }, []);

  // const filterUser = users.filter((user) =>
  //   user.fullName.toLowerCase().includes(searchItem.toLowerCase())
  // );

  const filterUser = users
    .filter((user) =>
      user.fullName.toLowerCase().includes(searchItem.toLowerCase())
    )
    .filter((user) => {
      return (
        (!filterCriteria.address || user.address === filterCriteria.address) &&
        (!filterCriteria.city || user.city === filterCriteria.city) &&
        (!filterCriteria.contact || user.contact === filterCriteria.contact) &&
        (!filterCriteria.email || user.email === filterCriteria.email)
      );
    });

  const totalPages = Math.ceil(filterUser.length / ITEMS_PER_PAGE);
  const currentData = filterUser.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSort = () => {
    let sortedUser;
    if (sortOrder) {
      sortedUser = [...filterUser].sort((a, b) => {
        const firstLetterA = a.fullName.charAt(0).toUpperCase();
        const firstLetterB = b.fullName.charAt(0).toUpperCase();
        return firstLetterA.localeCompare(firstLetterB);
      });
    } else {
      sortedUser = [...filterUser].sort((a, b) => {
        const firstLetterA = a.fullName.charAt(0).toUpperCase();
        const firstLetterB = b.fullName.charAt(0).toUpperCase();
        return firstLetterB.localeCompare(firstLetterA);
      });
    }
    setUsers(sortedUser);
    setSortOrder(!sortOrder);
  };

  // const handleSort = () => {
  //   let sortedUser;
  //   if (sortOrder === "asc") {
  //     sortedUser = [...users].sort((a, b) => b.fullName.localeCompare(a.fullName));
  //     setSortOrder("desc");
  //   } else {
  //     sortedUser = [...users].sort((a, b) => a.fullName.localeCompare(b.fullName));
  //     setSortOrder("asc");
  //   }
  //   setUsers(sortedUser);
  // };
  // const handleSort = () => {
  //   let sortedUser;
  //   if (sortOrder) {
  //     sortedUser = [...users].sort((a, b) => {
  //       const firstLetterA = a.fullName.charAt(0).toUpperCase();
  //       const firstLetterB = b.fullName.charAt(0).toUpperCase();
  //       return firstLetterA.localeCompare(firstLetterB);
  //     });
  //   } else {
  //     sortedUser = [...users].sort((a, b) => {
  //       const firstLetterA = a.fullName.charAt(0).toUpperCase();
  //       const firstLetterB = b.fullName.charAt(0).toUpperCase();
  //       return firstLetterB.localeCompare(firstLetterA);
  //     });
  //   }
  //   setUsers(sortedUser);
  //   setSortOrder(!sortOrder);
  // };

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
        // Delete user from active users
        const deleteResponse = await fetch("/api/deleteUser", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: selectedUser.id }),
        });

        if (deleteResponse.ok) {
          // Store deleted user
          const storeResponse = await fetch("/api/storeDeletedUser", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ users: [selectedUser] }),
          });

          if (storeResponse.ok) {
            dispatch(deleteUser(selectedUser.id));
            setUsers(users.filter((user) => user.id !== selectedUser.id));
            setShowModal(false);
          } else {
            console.error("Failed to store deleted user");
          }
        } else {
          console.error("Failed to delete user");
        }
      } catch (error) {
        console.error("An error occurred while deleting user", error);
      }
    }
  };

  const handleEdit = () => {
    dispatch(setSelectedUseruniquely(selectedUser));
    router.push("/users");
  };

  const handleUserClick = (user) => {
    setDialogUser(user);
  };

  const closeDialog = () => {
    setDialogUser(null);
  };

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
      setSelectedUsers(filterUser.map((user) => user.id));
    } else {
      setSelectedUsers([]);
    }
  };

  const handleBulkDelete = async () => {
    try {
      // Delete users from active users
      const deleteResponse = await fetch("/api/deleteUser", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ids: selectedUsers }),
      });

      if (deleteResponse.ok) {
        // Store deleted users
        const usersToStore = users.filter((user) =>
          selectedUsers.includes(user.id)
        );
        const storeResponse = await fetch("/api/storeDeletedUser", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ users: usersToStore }),
        });

        if (storeResponse.ok) {
          selectedUsers.forEach((id) => dispatch(deleteUser(id)));
          setUsers(users.filter((user) => !selectedUsers.includes(user.id)));
          setSelectedUsers([]);
          setDeleteMode(false);
        } else {
          console.error("Failed to store deleted users");
        }
      } else {
        console.error("Failed to delete users");
      }
    } catch (error) {
      console.error("An error occurred while deleting users", error);
    }
  };

  const handleSearchChange = (e) => {
    setSearchItem(e.target.value);
    setCurrentPage(1);
  };

  const handleRefresh = () => {
    window.location.reload();
  };
  const buttons = [
    { icon: <FaUserPlus />, text: "Add a user", link: "/users" },
    { icon: <FaFileAlt />, text: "User templates" },
    { icon: <FaUserFriends />, text: "Add multiple users" },
    { icon: <FaShieldAlt />, text: "Multi-factor authentication" },
    { icon: <FaTrash />, text: "Delete a user", onClick: toggleDeleteMode },
    { icon: <FaSyncAlt />, text: "Refresh", onClick: handleRefresh },
    { icon: <FaKey />, text: "Reset password" },
    { icon: <FaFileExport />, text: "Export users" },
    { icon: <FaEllipsisH />, text: "" },
  ];

  const columns = [
    { key: "fullName", label: "Display Name", sortable: true },
    { key: "email", label: "Email", sortable: true },
    { key: "address", label: "Address", sortable: true },
    { key: "city", label: "City", sortable: true },
    { key: "contact", label: "Contact", sortable: true },
  ];

  return (
    <div className=" min-h-screen py-4">
      <div className="bg-white p-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-lg font-semibold">peritus.ae</h1>
          <button className="text-gray-600 hover:text-gray-800 flex items-center gap-2 text-sm">
            Dark mode <BsMoon className="w-5 h-5 text-sm" />
          </button>
        </div>

        <h1 className="font-semibold text-xl mb-4">Active Users</h1>

        <div className="flex  items-center justify-between border-t-2 pt-4">
          <div className="flex items-center gap-3">
            {buttons.map((btn, index) => (
              <div
                key={index}
                className="relative flex items-center gap-1 group"
              >
                {btn.link ? (
                  <Link
                    href={btn.link}
                    className="flex items-center hover:text-blue-600"
                  >
                    <btn.icon.type
                      className="w-4 h-4 text-blue-500"
                      {...btn.icon.props}
                    />
                    <span className="hidden lg:inline text-[10px]">
                      {btn.text}
                    </span>
                  </Link>
                ) : (
                  <button
                    className="flex items-center hover:text-blue-600"
                    onClick={btn.onClick}
                  >
                    <btn.icon.type
                      className="w-4 h-4 text-blue-500"
                      {...btn.icon.props}
                    />
                    <span className="hidden lg:inline text-[10px]">
                      {btn.text}
                    </span>
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

          <div className="flex  items-center gap-2">
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
                value={searchItem}
                className="w-full pl-12 pr-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* <div className="mt-4">
        <div className="overflow-x-auto border rounded-lg shadow-lg" ref={tableRef}>
          {filterUser.length > 0 ? (
            <table className="w-full text-xs md:text-sm table-auto">
              <thead>
                <tr className="bg-gray-200 ">
                  {deleteMode && (
                    <th className="py-2 px-3">
                      <input
                        type="checkbox"
                        onChange={handleSelectAll}
                        checked={selectedUsers.length === filterUser.length}
                      />
                    </th>
                  )}
                  <th className="py-2 px-3 text-left font-semibold flex gap-x-4">
                    Display Name
                    <FaSort className="w-5 h-5" onClick={handleSort} />
                  </th>
                  <th className="py-2 px-3 text-left font-bold">Email</th>
                  <th className="py-2 px-3 text-left font-bold">Address</th>
                  <th className="py-2 px-3 text-left font-bold">City</th>
                  <th className="py-2 px-3 text-left font-bold">Contact</th>
                </tr> 
              </thead>
              <tbody>
                {filterUser.map((user) => (
                  <tr key={user.id} className="even:bg-gray-100 hover:bg-blue-100">
                    {deleteMode && (
                      <td className="py-2 px-3">
                        <input
                          type="checkbox"
                          checked={selectedUsers.includes(user.id)}
                          onChange={() => handleCheckboxChange(user.id)}
                        />
                      </td>
                    )}
                    <td className="py-2 px-3 flex justify-between items-center">
                      <span onClick={() => handleUserClick(user)}>{user.fullName}</span>
                      <button onClick={(e) => handleEllipsisClick(e, user)} className="text-blue-600 hover:text-blue-800 rotate-90">
                        <FaEllipsisH />
                      </button>
                    </td>
                    <td className="py-2 px-3 text-gray-700 truncate">{user.email}</td>
                    <td className="py-2 px-3 text-gray-700 truncate">{user.address}</td>
                    <td className="py-2 px-3 text-gray-700 truncate">{user.city}</td>
                    <td className="py-2 px-3 text-gray-700 cursor-pointer hover:underline" >
                      {user.contact}
                    </td>

                    <td>
                      {showModal === user.id && selectedUser && (
                        <div className="absolute z-50 bg-white w-[40vh] rounded-lg p-4 shadow-lg" style={{ top: modalPosition.top, left: modalPosition.left }}>
                          <div className="flex justify-end mb-4">
                            <button className="text-gray-500 hover:text-gray-800" onClick={() => setShowModal(false)}>
                              <FaTimes className="w-5 h-5" />
                            </button>
                          </div>
                          <div className="flex flex-col items-start gap-4 text-xs">
                            <button className="flex items-center gap-3 w-full hover:bg-gray-300 p-1">
                              <MdOutlineEventNote  className="w-5 h-5" />
                              Manage product licenses
                            </button>
                            <button className="flex items-center gap-3 w-full hover:bg-gray-300 p-1">
                              <FaTrashAlt className="w-5 h-5" />
                              Manage groups
                            </button>
                            <button onClick={handleDelete} className="flex items-center gap-3 w-full hover:bg-gray-300 p-1">
                              <FaTrashAlt className="w-5 h-5" />
                              Delete user
                            </button>
                            <button onClick={handleEdit} className="flex items-center gap-3 w-full hover:bg-gray-300 p-1">
                              <FaUserEdit className="w-5 h-5" />
                              Manage user
                            </button>
                          </div>
                        </div>
                      )}
                      </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="py-4 text-center text-gray-600">No results found</div>
          )}
        </div>
      </div> */}
      <div className="mt-4">
        <Table
          data={currentData}
          columns={columns}
          onSort={handleSort}
          onRowClick={handleUserClick}
          onActionClick={handleEllipsisClick}
          deleteMode={deleteMode}
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
