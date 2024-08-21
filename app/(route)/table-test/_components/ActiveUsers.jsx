"use client";
import React, { useState, useEffect } from "react";
import {
  FaEllipsisH,
  FaUserEdit,
  FaSort,
  FaShieldAlt,
  FaKey,
  FaFileExport,
  FaFilter,
} from "react-icons/fa";
import NewTableComponent from "@/app/_HOC/Table/NewTableComponent";
import { MdDelete, MdEventNote, MdManageAccounts } from "react-icons/md";
import { IoIosClose, IoMdRefresh } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteUserAsync,
  fetchUsers,
  setFilterCriteria,
  setSearchTerm,
  setSelectedGroupUsers,
  setSelectedUseruniquely,
  storeDeletedUser,
} from "@/lib/Feature/UserSlice";
import UserDetailDialog from "@/app/_components/UserDetailDilaog/UserDetailDilaog";
import { useRouter } from "next/navigation";
import NewHeader from "@/app/_HOC/NewHeader/NewHeader";
import { HiUserAdd } from "react-icons/hi";
import { GrNotes } from "react-icons/gr";
import { FaUserFriends } from "react-icons/fa";
import { FiRefreshCcw } from "react-icons/fi";
import { BsThreeDots } from "react-icons/bs";
import Link from "next/link";
import FilterModal from "@/app/_components/FilterModal";

const Modal = ({ user }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  return (
    <div className="absolute bg-white border rounded-lg shadow-md p-2 z-10 w-[240px]">
      <div className="w-full flex justify-end items-center text-2xl">
        <IoIosClose />
      </div>
      <ul>
        <li className="cursor-pointer hover:bg-gray-100 p-2 rounded-md flex items-center gap-2">
          <MdEventNote className="text-lg" />
          <h1>Manage Product Licences</h1>
        </li>
        <li className="cursor-pointer hover:bg-gray-100 p-2 rounded-md flex items-center gap-2">
          <MdManageAccounts className="text-lg" />
          <h1>Manage Groups</h1>
        </li>
        <li
          className="cursor-pointer hover:bg-gray-100 p-2 rounded-md flex items-center gap-2"
          onClick={() => {
            dispatch(deleteUserAsync(user.id));
            dispatch(storeDeletedUser(user));
          }}
        >
          <MdDelete className="text-lg" />
          <h1>Delete User</h1>
        </li>
        <li
          className="cursor-pointer hover:bg-gray-100 p-2 rounded-md flex items-center gap-2"
          onClick={() => {
            dispatch(setSelectedUseruniquely(user));
            router.push("/users");
          }}
        >
          <FaUserEdit className="text-lg" />
          <h1>Manage User</h1>
        </li>
      </ul>
    </div>
  );
};

const TableRoute = () => {
  const tableColumns = [
    { label: "Display Name", key: "fullName" },
    { label: "Email", key: "email" },
    { label: "Address", key: "address" },
    { label: "City", key: "city" },
    { label: "Contact", key: "contact" },
  ];
  const [isModalOpen, setIsModalOpen] = useState(null);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [clickedUser, setClickedUser] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5; // Limit the rows per page to 5
  const [isSelectable, setIsSelectable] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [isGroupSelection, setIsGroupSelection] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  const users = useSelector((state) => state.user.users);
  const dispatch = useDispatch();
  const searchTerm = useSelector((state) => state.user.searchTerm);
  const filterCriteria = useSelector((state) => state.user.filterCriteria);

  const handleOpenFilterModal = () => setIsFilterModalOpen(true);
  const handleCloseFilterModal = () => setIsFilterModalOpen(false);
  const handleApplyFilter = (criteria) => dispatch(setFilterCriteria(criteria));

  const router = useRouter();

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleIconClick = (rowIndex) => {
    setIsModalOpen(isModalOpen === rowIndex ? null : rowIndex);
  };

  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const sortedUsers = React.useMemo(() => {
    if (sortConfig.key) {
      return [...users].sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }
    return users;
  }, [users, sortConfig]);

  const sortedFilteredUsers = React.useMemo(() => {
    return sortedUsers.filter((user) =>
      user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filterCriteria.city === "" || user.city === filterCriteria.city)
    );
  }, [sortedUsers, searchTerm, filterCriteria]);

  // Pagination Logic
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const paginatedUsers = sortedFilteredUsers.slice(indexOfFirstRow, indexOfLastRow);

  const handleCheckboxChange = (user) => {
    setSelectedUsers((prevSelected) =>
      prevSelected.find((selectedUser) => selectedUser.id === user.id)
        ? prevSelected.filter((selectedUser) => selectedUser.id !== user.id)
        : [...prevSelected, user]
    );
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === paginatedUsers.length) {
      // If all users are selected, clear the selection
      setSelectedUsers([]);
    } else {
      // Otherwise, select all users on the current page
      setSelectedUsers(paginatedUsers);
    }
  };

  const headerItems = [
    {
      icon: <HiUserAdd />,
      label: "Add user",
      link: "/users",
    },
    {
      icon: <FaUserFriends />,
      label: "Group",
    },
    {
      icon: <FaShieldAlt />,
      label: "Multifactor authentication",
    },
    {
      icon: <MdDelete />,
      label: "Delete User",
    },
    {
      icon: <IoMdRefresh />,
      label: "Refresh",
    },
    {
      icon: <FaKey />,
      label: "Password",
    },
    {
      icon: <FaFileExport />,
      label: "Export Users",
    },
  ];

  return (
    <>
      <NewHeader>
        <div className="flex flex-col px-4">
          <div className="mb-4 flex flex-col gap-4">
            <h1 className="text-xl font-semibold tracking-wider">Talha.ae</h1>
            <h2 className="text-lg font-semibold tracking-wider">Active Users</h2>
          </div>
          <div className="flex flex-col sm:flex-row sm:gap-0 gap-6 sm:items-center justify-between border-t-2 pt-2">
            <div className="flex items-center sm:gap-x-6 gap-x-4 text-[8px]">
              {headerItems.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-1 cursor-pointer hover:text-blue-500 transition-all group relative"
                  onClick={() => {
                    if (item.label === "Delete User") {
                      setIsSelectable(!isSelectable);
                      setIsGroupSelection(false);
                    } else if (item.label === "Group") {
                      setIsGroupSelection(!isGroupSelection);
                      setIsSelectable(false);
                    }
                  }}
                >
                  {item.link ? (
                    <Link href={item.link} className="flex items-center gap-1">
                      <span className="text-sm text-blue-400">{item.icon}</span>
                      <p className="hidden lg:inline">{item.label}</p>
                    </Link>
                  ) : (
                    <div className="flex items-center gap-1">
                      <span className="text-sm text-blue-400 ">{item.icon}</span>
                      <p className="hidden lg:inline">{item.label}</p>
                    </div>
                  )}
                  <div className="absolute left-1/2 transform -translate-x-/2 mb-8 hidden group-hover:block bg-gray-700 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                    {item.label}
                  </div>
                </div>
              ))}
              <BsThreeDots />
            </div>

            <div className="flex items-center gap-4 w-[250px] mr-6">
              <span onClick={handleOpenFilterModal} className="flex items-center text-sm gap-1">
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

      {isSelectable && (
        <div className="px-10 w-full flex items-center justify-end gap-2">
          <button
            className="px-3 py-2 rounded-lg border"
            onClick={() => {
              setIsSelectable(false);
              setSelectedUsers([]); // Clear selection when canceling
            }}
          >
            Cancel
          </button>
          <button
            className="bg-red-500 px-3 py-2 rounded-lg"
            onClick={() => {
              if (selectedUsers.length === 0) {
                alert("Please select users to delete.");
              } else {
                selectedUsers.forEach((user) => {
                  dispatch(deleteUserAsync(user.id)); // Dispatch delete action for selected users
                  dispatch(storeDeletedUser(user));
                  setSelectedUsers([]); // Clear selection after deletion
                  setIsSelectable(false); // Exit selection mode
                });
              }
            }}
          >
            Delete
          </button>
        </div>
      )}

      {isGroupSelection && (
        <div className="px-10 w-full flex items-center justify-end gap-2">
          <button
            className="px-3 py-2 rounded-lg bg-blue-500"
            onClick={() => {
              if (selectedUsers.length < 2) {
                alert("Please select multiple users.");
              } else {
                router.push('/group');
                dispatch(setSelectedGroupUsers(selectedUsers));
              }
            }}
          >
            Group
          </button>
        </div>
      )}

      <div className="m-2 relative shadow-md rounded-lg">
        <NewTableComponent
          tableColumns={[
            isSelectable || isGroupSelection ? (
              <th className={`flex items-center justify-between `}>
                <input
                  type="checkbox"
                  checked={
                    paginatedUsers.length > 0 &&
                    selectedUsers.length === paginatedUsers.length
                  }
                  onChange={handleSelectAll}
                />
              </th>
            ) : null,
            ...tableColumns.map((col) => (
              <div
                key={col.key}
                className="flex items-center justify-between cursor-pointer w-full "
                onClick={() => handleSort(col.key)}
              >
                <span>{col.label}</span>
                <FaSort className="ml-1" />
              </div>
            )),
          ]}
          rowsPerPage={rowsPerPage}
          totalRows={sortedFilteredUsers.length}
          currentPage={currentPage}
          onPageChange={(page) => setCurrentPage(page)}
        >
          {paginatedUsers.map((user) => (
            <tr
              key={user.id}
              className="border-b hover:bg-blue-50 cursor-pointer relative even:bg-gray-100"
              onClick={() => {
                setClickedUser(user);
                setShowInfoModal(true);
              }}
            >
              {isSelectable || isGroupSelection ? (
                <td>
                  <input
                    type="checkbox"
                    className="mx-2"
                    checked={selectedUsers.some(
                      (selectedUser) => selectedUser.id === user.id
                    )}
                    onChange={(e) => {
                      e.stopPropagation(); // Prevent triggering row click
                      handleCheckboxChange(user);
                    }}
                  />
                </td>
              ) : null}
              <td className="p-3 text-gray-700">
                <div className="flex items-center justify-between ">
                  <span className="hover:text-blue-600">{user.fullName}</span>
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                      handleIconClick(user.id);
                    }}
                    className="cursor-pointer relative"
                  >
                    <FaEllipsisH className="rotate-90 text-blue-600" />
                    {isModalOpen === user.id && (
                      <div className="absolute top-0 left-4">
                        <Modal user={user} />
                      </div>
                    )}
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
        <UserDetailDialog
          onClose={() => setShowInfoModal(false)}
          user={clickedUser}
        />
        {isFilterModalOpen && (
          <FilterModal
            onClose={handleCloseFilterModal}
            onApplyFilter={handleApplyFilter}
          />
        )}
      </div>
    </>
  );
};

export default TableRoute;