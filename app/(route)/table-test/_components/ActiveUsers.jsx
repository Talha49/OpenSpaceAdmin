'use client'
import React, { useState, useEffect } from "react";
import {
  FaEllipsisH,
  FaUserEdit,
  FaSort,
  FaShieldAlt,
  FaKey,
  FaFileExport,
} from "react-icons/fa";
import NewTableComponent from "@/app/_HOC/Table/NewTableComponent";
import { MdDelete, MdEventNote, MdManageAccounts } from "react-icons/md";
import { IoIosClose, IoMdRefresh } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteUserAsync,
  fetchUsers,
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

  const users = useSelector((state) => state.user.users);
  const dispatch = useDispatch();
  const searchTerm = useSelector((state) => state.user.searchTerm);

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

  // Pagination Logic
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const paginatedUsers = sortedUsers.slice(indexOfFirstRow, indexOfLastRow);

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
    },
    {
      icon: <GrNotes />,
      label: "User Templates",
    },
    {
      icon: <FaUserFriends />,
      label: "Add Multiple Users",
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
        <div className="flex items-center gap-4 text-[11px]">
          {headerItems.map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-1 cursor-pointer hover:text-blue-500 transition-all"
              onClick={() => {
                if (item.label === "Delete User") {
                  setIsSelectable(!isSelectable);
                }
              }}
            >
              <span className="text-lg">{item.icon}</span>
              <p>{item.label}</p>
            </div>
          ))}
          <BsThreeDots />
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
                  dispatch(storeDeletedUser(user))
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
      <div className="m-10 relative shadow-md rounded-lg">
        <NewTableComponent
          tableColumns={[
            isSelectable ? (
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
                className="flex items-center justify-between cursor-pointer w-full"
                onClick={() => handleSort(col.key)}
              >
                <span>{col.label}</span>
                <FaSort className="ml-1" />
              </div>
            )),
          ]}
          rowsPerPage={rowsPerPage}
          totalRows={sortedUsers.length}
          currentPage={currentPage}
          onPageChange={(page) => setCurrentPage(page)}
        >
          {paginatedUsers
            .filter((user) =>
              user.fullName.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .map((user) => (
              <tr
                key={user.id}
                className="border-b hover:bg-blue-50 cursor-pointer relative even:bg-gray-100"
                onClick={() => {
                  setClickedUser(user);
                  setShowInfoModal(true);
                }}
              >
                {isSelectable && (
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
                )}
                <td
                  className="p-3 text-gray-700"
                  
                >
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
      </div>
    </>
  );
};

export default TableRoute;
