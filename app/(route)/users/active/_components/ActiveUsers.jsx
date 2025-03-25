"use client";
import React, { useState, useEffect, useMemo, useRef } from "react";
import UserUpdateDialog from "@/app/_components/UserDetailDilaog&Modal/UserUpdateDialog"; // Import the new component
import {
  FaEllipsisH,
  FaUserEdit,
  FaSort,
  FaShieldAlt,
  FaKey,
  FaFileExport,
  FaFilter,
  FaInfoCircle,
  FaSpinner,
  FaSortAlphaDownAlt,
  FaSortAlphaDown,
} from "react-icons/fa";
import NewTableComponent from "@/app/_HOC/Table/NewTableComponent";
import { MdDelete, MdEventNote, MdManageAccounts } from "react-icons/md";
import { IoIosClose, IoMdPersonAdd, IoMdRefresh } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteUserAsync,
  fetchUsers,
  setFilterCriteria,
  setSelectedGroupUsers,
  setSelectedUseruniquely,
  storeDeletedUser,
} from "@/lib/Feature/UserSlice";
import UserDetailDialog from "@/app/_components/UserDetailDilaog&Modal/UserDetailDilaog";
import { useRouter } from "next/navigation";
import NewHeader from "@/app/_HOC/NewHeader/NewHeader";
import { HiUserAdd } from "react-icons/hi";
import { GrNotes } from "react-icons/gr";
import { FaUserFriends } from "react-icons/fa";
import { FiRefreshCcw } from "react-icons/fi";
import { BsThreeDots } from "react-icons/bs";
import Link from "next/link";
import FilterModal from "@/app/_components/UserDetailDilaog&Modal/FilterModal";
import * as XLSX from "xlsx";
import { clearSelectedUser } from "@/lib/Feature/UserSlice";
import { MFAModal } from "@/app/_components/MfaSetttingDialog/MFAmodal";
import Dialog from "@/app/_components/ManageGroupModal/Dialog";
import Loader from "@/app/_components/Loader/Loader";
import PageHeader from "@/app/_components/PageHeader/PageHeader";
import { useNotify } from "@/lib/utils";
import { RiImportFill } from "react-icons/ri";
import ImportUsersDialog from "./ImportUsersDialog/ImportUsersDialog";

const Modal = ({ user }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  return (
    <div className="absolute bg-white dark:bg-neutral-950 border dark:border-neutral-800 rounded-lg shadow-md p-2 z-10 w-[240px]">
      <div className="w-full flex justify-end items-center text-2xl">
        <IoIosClose className="text-neutral-500" />
      </div>
      <ul>
        <li
          className="cursor-pointer hover:bg-gray-100 dark:hover:bg-neutral-700 text-neutral-500 p-2 rounded-md flex items-center gap-2"
          onClick={() => {
            dispatch(setSelectedUseruniquely(user));
            router.push("/users");
          }}
        >
          <MdEventNote className="text-lg" />
          <h1>Manage useraname and password</h1>
        </li>
        <li className="cursor-pointer hover:bg-gray-100 dark:hover:bg-neutral-700 text-neutral-500 p-2 rounded-md flex items-center gap-2">
          <MdManageAccounts className="text-lg" />
          <h1>Manage Groups</h1>
        </li>
        {/* <li
          className="cursor-pointer hover:bg-gray-100 dark:hover:bg-neutral-700 text-neutral-500 p-2 rounded-md flex items-center gap-2"
          onClick={() => {
            dispatch(deleteUserAsync(user.id));

            dispatch(storeDeletedUser(user));

          }}
        >
          <MdDelete className="text-lg" />
          <h1>Delete User</h1>
        </li> */}
        <li
          className="cursor-pointer hover:bg-gray-100 dark:hover:bg-neutral-700 text-neutral-500 p-2 rounded-md flex items-center gap-2"
          onClick={() => {
            dispatch(setSelectedUseruniquely(user));
            router.push("/users");
          }}
        >
          <FaInfoCircle className="text-lg" />
          <h1>View Details</h1>
        </li>
      </ul>
    </div>
  );
};

const TableRoute = () => {
  const tableColumns = [
    { label: "Display Name", key: "fullName", width: "200px" },
    { label: "Email", key: "email", width: "250px" },
    { label: "Address", key: "address", width: "300px" },
    { label: "City", key: "city", width: "150px" },
    { label: "Contact", key: "contact", width: "150px" },
  ];

  const [isModalOpen, setIsModalOpen] = useState(null);
  console.log("isModalOpen:", isModalOpen);

  const toggleModal = (userId) => {
    setIsModalOpen((prev) => (prev === userId ? null : userId));
  };
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [clickedUser, setClickedUser] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "" });
  const [currentPage, setCurrentPage] = useState(1);
  // const rowsPerPage = 5; // Limit the rows per page to 5
  const [isSelectable, setIsSelectable] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [isGroupSelection, setIsGroupSelection] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [filterCriteria, setFilterCriteria] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [isMFAModalOpen, setIsMFAModalOpen] = useState(false);
  const users = useSelector((state) => state.user.users);
  const dispatch = useDispatch();
  const handleOpenFilterModal = () => setIsFilterModalOpen(true);
  const handleCloseFilterModal = () => setIsFilterModalOpen(false);
  const handleApplyFilter = (criteria) => setFilterCriteria(criteria);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false); // Declare state for the modal
  const [selectedUser, setSelectedUser] = useState(null); // State for the selected user
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false); // Loading state while updating
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [activeUsers, setActiveUsers] = useState([]);
  const [isUpdatePasswordDialogOpen, setIsUpdatePasswordDialogOpen] =
    useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const notify = useNotify();
  const [isImportUsersModelOpen, setIsImportUsersModelOpen] = useState(false);

  const handleRowClick = (user) => {
    setClickedUser(user); // Set the clicked user for the modal
    setShowInfoModal(false);
    setIsUpdateModalOpen(true); // Open the modal
  };

  // Handle icon click to open/close the 3-dot menu
  const handleIconClick = (rowIndex) => {
    if (isModalOpen === rowIndex) {
      // If the same row's menu is open, close it
      setIsModalOpen(null);
      setShowInfoModal(false);
    } else {
      // If the different row is clicked, open its menu
      setIsModalOpen(rowIndex);
    }
  };
  const handlePasswordUpdateModalOpen = (user) => {
    setNewPassword(""); // Clear previous password when opening the modal
    setSelectedUser(user);
    setIsUpdatePasswordDialogOpen(true);
  };

  // Generate a random 8-digit password
  const generateRandomPassword = () => {
    const password = Math.random().toString(36).slice(-8); // Generate an 8-digit random password
    setNewPassword(password);
  };

  // This function is a placeholder for your password encryption logic
  const encryptPassword = async (password) => {
    // Implement encryption logic here (if needed)
    const encryptedPassword = password; // Placeholder, replace with real encryption logic
    return encryptedPassword;
  };

  // Open the modal to update passwords for active users
  const handlePasswordModalOpen = () => {
    const activeUsersList = users.filter((user) => user.status === "active");
    setActiveUsers(activeUsersList);
    setIsPasswordModalOpen(true);
  };

  // Handle password update action
  const handlePasswordUpdate = async (userId, newPassword) => {
    try {
      setIsUpdatingPassword(true); // Set loading state to true
      const encryptedPassword = await encryptPassword(newPassword); // Encrypt the password (if required)

      const response = await fetch("/api/Users/updatePassword", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId, // The user's ID
          newPassword: encryptedPassword, // The encrypted new password
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsUpdatingPassword(false); // Set loading state to false on error
        setIsUpdatePasswordDialogOpen(false);
        setIsPasswordModalOpen(false); // Close the modal after updating password
        notify.success("Password updated successfully!");
      } else {
        notify.error(data.message || "Error updating password!");
      }
    } catch (error) {
      setIsUpdatingPassword(false); // Set loading state to false on error
      console.error("Error updating password:", error);
      setIsUpdatingPassword(false); // Set loading state to false on error
      notify.error("Error updating password!");
    } finally {
      setIsUpdatingPassword(false); // End loading state
    }
  };

  const handleOpenUpdateModal = (user) => {
    setSelectedUser(user); // Set the selected user
    setShowInfoModal(false);
    setIsUpdateModalOpen(true); // Open the update modal
  };

  //save user details update user all details functionalities
  const handleSaveUserDetails = (updatedUser) => {
    console.log("Updated User Details:", updatedUser);
    // Dispatch updated user details to the Redux store or backend
    setIsUpdateModalOpen(false); // Close the update modal
    setIsUpdatingPassword(false); // Set loading state to false on error
  };

  const router = useRouter();

  useEffect(() => {
    setIsLoading(true); // Set loading to true when fetching starts
    dispatch(fetchUsers()).finally(() => {
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

  const sortedUsers = useMemo(() => {
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

  const sortedFilteredUsers = useMemo(() => {
    return sortedUsers.filter(
      (user) =>
        user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (!filterCriteria.city || user.city === filterCriteria.city) &&
        (!filterCriteria.address || user.address === filterCriteria.address) &&
        (!filterCriteria.contact || user.contact === filterCriteria.contact) &&
        (!filterCriteria.email || user.email === filterCriteria.email)
    );
  }, [sortedUsers, searchTerm, filterCriteria]);

  // Pagination Logic
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const paginatedUsers = sortedFilteredUsers.slice(
    indexOfFirstRow,
    indexOfLastRow
  );

  const handleCheckboxChange = (user) => {
    setSelectedUsers((prevSelected) => {
      // Check if the user is already selected
      const isSelected = prevSelected.some(
        (selectedUser) => selectedUser._id === user._id
      );

      if (isSelected) {
        // Remove the user if already selected
        return prevSelected.filter(
          (selectedUser) => selectedUser._id !== user._id
        );
      } else {
        // Add the user to selected list
        return [...prevSelected, user];
      }
    });
  };

  const handleSelectAll = () => {
    const allSelected = paginatedUsers.every((user) =>
      selectedUsers.some((selectedUser) => selectedUser._id === user._id)
    );

    if (allSelected) {
      // Deselect all users on the current page
      setSelectedUsers((prevSelected) =>
        prevSelected.filter(
          (selectedUser) =>
            !paginatedUsers.some((user) => user._id === selectedUser._id)
        )
      );
    } else {
      // Select all users on the current page
      setSelectedUsers((prevSelected) => [
        ...prevSelected,
        ...paginatedUsers.filter(
          (user) =>
            !prevSelected.some((selectedUser) => selectedUser._id === user._id)
        ),
      ]);
    }
  };

  const handleRowsPerPageChange = (e) => {
    setRowsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to first page when rows per page changes
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
      onClick: () => setIsMFAModalOpen(true),
    },
    // Add other header items here
    {
      icon: <MdDelete />,
      label: "Delete User",
    },
    {
      icon: <IoMdRefresh />,
      label: "Refresh",
      onClick: () => {
        setIsLoading(true); // Set loading to true when fetching starts
        dispatch(fetchUsers()).finally(() => {
          setIsLoading(false); // Set loading to false after fetch is complete
        });
      },
    },
    {
      icon: <FaKey />,
      label: "Password",
      onClick: () => handlePasswordModalOpen(true),
    },
    {
      icon: <FaFileExport />,
      label: "Export Users",
      onClick: () => {
        exportToExcel(
          users.map((user) => ({
            "Display Name": user.fullName,
            Email: user.email,
            Address: user.address,
            City: user.city,
            Contact: user.contact,
          }))
        );
      },
    },
    {
      icon: <RiImportFill />,
      label: "Import Users",
      onClick: () => {
        setIsImportUsersModelOpen(true);
        notify.warning(
          "File should have complete user information like name, email, address, city and contact"
        );
      },
    },
  ];

  //export as a excel
  const exportToExcel = (data, filename = "Users_Data.xlsx") => {
    const worksheet = XLSX.utils.json_to_sheet(data);

    // Add custom styles (this requires additional tools like Excel templates if needed).
    worksheet["!cols"] = [
      { wch: 20 }, // Column width for Display Name
      { wch: 25 }, // Column width for Email
      { wch: 30 }, // Column width for Address
      { wch: 15 }, // Column width for City
      { wch: 15 }, // Column width for Contact
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Users");

    // Add a header row for clarity
    XLSX.utils.sheet_add_aoa(
      worksheet,
      [["Display Name", "Email", "Address", "City", "Contact"]],
      { origin: "A1" }
    );

    XLSX.writeFile(workbook, filename);
  };
  const modalRef = useRef(null);

  //modal for the three dots modal

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setIsModalOpen(null); // Close modal
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleCancel = () => {
    // Reset the selected users state

    setSelectedUsers([]);
    setIsGroupSelection(false); // Assuming you're using local state for isSelectable

    // Redirect the user
  };

  // Inside your TableRoute component

  const handleManageGroupsClick = (user) => {
    if (!user || !user._id) {
      console.error("Invalid user or user ID");
      return;
    }
    console.log("User ID passed to dialog:", user._Id); // Check userId here
    setSelectedUserId(user._id); // Set the userId for the dialog
    setIsDialogOpen(true); // Open the dialog
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setSelectedUserId(null); // Reset the user ID when dialog is closed
  };

  return (
    <div className="overflow-hidden">
      <NewHeader>
        {/* <h1 className="text-2xl font-semibold mb-4">Active Users</h1> */}
        <PageHeader
          title={"Active Users"}
          description={
            "View and manage all currently active users in your system. Keep track of their status, roles, and recent activities to ensure smooth operations. Stay updated with user engagement and make informed decisions effortlessly."
          }
        />

        <div className="flex flex-col rounded-lg border shadow-md dark:border-neutral-500 p-2 gap-4">
          {/* Main container with improved flex-col layout on mobile, flex-row on larger screens */}
          <div className="flex flex-col lg:flex-row justify-between gap-4">
            {/* Left side - Action buttons with proper wrapping */}
            <div className="flex flex-wrap gap-2 overflow-visible">
              {headerItems.map((item, i) => (
                <div
                  key={i}
                  className="flex-none"
                  onClick={() => {
                    if (item.onClick) {
                      // item.onClick();
                    } else if (item.link) {
                      router.push(item.link);
                    } else if (item.label === "Delete User") {
                      setIsSelectable(!isSelectable);
                      setIsGroupSelection(false);
                    } else if (item.label === "Group") {
                      setIsGroupSelection(!isGroupSelection);
                      setIsSelectable(false);
                    } else if (item.label === "Refresh") {
                      setIsLoading(true); // Set loading to true when fetching starts
                      dispatch(fetchUsers()).finally(() => {
                        setIsLoading(false); // Set loading to false after fetch is complete
                      });
                    }
                  }}
                >
                  {item.link ? (
                    <Link
                      href={item.link}
                      className="flex items-center gap-2 group border dark:border-neutral-700 rounded p-2 hover:bg-blue-500 dark:hover:bg-blue-500 transition-colors"
                    >
                      <span className="text-lg text-blue-500 group-hover:text-white">
                        {item.icon}
                      </span>
                      <span className="text-sm whitespace-nowrap group-hover:text-white">
                        {item.label}
                      </span>
                    </Link>
                  ) : (
                    <div
                      onClick={item?.onClick}
                      className="flex items-center gap-2 group border dark:border-neutral-700 rounded p-2 cursor-pointer hover:bg-blue-500 dark:hover:bg-blue-500 transition-colors"
                    >
                      <span className="text-lg text-blue-500 group-hover:text-white">
                        {item.icon}
                      </span>
                      <span className="text-sm whitespace-nowrap group-hover:text-white">
                        {item.label}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-3 w-full lg:w-auto min-w-0 dark:shadow-neutral-700 rounded-lg">
            <div className="relative flex-grow min-w-0">
              <input
                type="text"
                placeholder="Search users list"
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                value={searchTerm}
                className="w-full px-2 py-1.5 border dark:border-neutral-700 border-gray-300 rounded placeholder:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={handleOpenFilterModal}
              className="flex items-center text-blue-600 text-sm gap-2 whitespace-nowrap cursor-pointer group hover:bg-blue-500 hover:text-white dark:hover:text-white dark:hover:bg-blue-500 transition-all border dark:border-neutral-700 rounded px-3 py-2 flex-none"
            >
              <FaFilter className="group-hover:text-wrap" />
              <span className="group-hover:text-wrap">Filter</span>
            </button>
          </div>
        </div>
      </NewHeader>

      {isSelectable && (
        <div className="px-10 w-full flex items-center justify-end gap-2 mt-4">
          <button
            className="px-3 py-1 rounded-md border"
            onClick={() => {
              setIsSelectable(false);
              setSelectedUsers([]); // Clear selection when canceling
            }}
          >
            Cancel
          </button>
          <button
            className="bg-blue-600 hover:bg-blue-500 transition-all px-3 py-1 rounded-md text-white"
            onClick={async () => {
              if (selectedUsers.length === 0) {
                notify.warning("Please select users to delete.");
              } else {
                // Set loading state before deletion (optional)
                setIsLoading(true); // Optionally show a loading state during the deletion process
                // Loop through selected users and delete them
                for (const user of selectedUsers) {
                  await dispatch(deleteUserAsync(user.id)); // Await deletion of user
                  dispatch(storeDeletedUser(user)); // Store the deleted user
                }

                // Clear selection after deletion
                setSelectedUsers([]);
                notify.success("User deleted successfully");
                setIsSelectable(false); // Exit selection mode

                // After all deletions are done, refresh the users list
                dispatch(fetchUsers());

                // Navigate to the active users page
                router.push("/users/active");
                dispatch(fetchUsers());
                // Set loading state to false after deletion and fetch are done
                setIsLoading(false);
              }
            }}
          >
            {isLoading ? "Deleting..." : "Delete"}
          </button>
        </div>
      )}

      {isGroupSelection && (
        <div className="px-10 w-full flex items-center justify-end gap-2 my-4">
          <button
            type="button" // Prevent the form from submitting
            className="px-3 py-1 rounded-md border"
            onClick={handleCancel} // Use onClick instead of onSubmit
          >
            Cancel
          </button>
          <button
            className="bg-blue-600 hover:bg-blue-500 transition-all px-3 py-1 rounded-md text-white"
            onClick={() => {
              if (selectedUsers.length < 2) {
                notify.warning("Please select multiple users.");
              } else {
                router.push("/group");
                dispatch(setSelectedGroupUsers(selectedUsers));
              }
            }}
          >
            Group
          </button>
        </div>
      )}

      <div className="relative shadow-md rounded-lg ">
        <NewTableComponent
          tableColumns={[
            isSelectable || isGroupSelection ? (
              <th className="flex items-center justify-between w-[50px]">
                <input
                  type="checkbox"
                  className="scale-125"
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
                style={{ width: col.width }} // Apply consistent width
                className="flex items-center justify-between cursor-pointer w-full "
                onClick={() => handleSort(col.key)}
              >
                <span>{col.label}</span>
                {sortConfig.direction !== "ascending" &&
                sortConfig.key === col.key ? (
                  <FaSortAlphaDownAlt
                    className={`mx-4 ${
                      sortConfig.key !== col.key
                        ? "text-neutral-500"
                        : "text-blue-600"
                    }`}
                  />
                ) : (
                  <FaSortAlphaDown
                    className={`mx-4 ${
                      sortConfig.key !== col.key
                        ? "text-neutral-500"
                        : "text-blue-600"
                    }`}
                  />
                )}
              </div>
            )),
          ]}
          buttons={
            <>
              <button
                className="flex items-center gap-2 px-2 py-1 border border-blue-600 rounded group bg-blue-200 hover:bg-blue-500 hover:text-white transition-all dark:bg-neutral-800 dark:hover:bg-blue-500"
                onClick={() => {
                  router.push("/users");
                }}
              >
                <IoMdPersonAdd className="text-blue-500 group-hover:text-white" />
                <span className="text-sm">Add User</span>
              </button>
              {isLoading && (
                <div className="flex justify-center items-center ">
                  <FaSpinner className="animate-spin text-blue-500" size={20} />
                </div>
              )}
            </>
          }
          rowsPerPage={rowsPerPage}
          totalRows={sortedFilteredUsers.length}
          currentPage={currentPage}
          onPageChange={(page) => setCurrentPage(page)}
          handleRowsPerPageChange={handleRowsPerPageChange}
        >
          {paginatedUsers.map((user, rowIndex) => (
            // Assume we already have state variables like `showInfoModal`, `clickedUser`, `isUpdateModalOpen`, etc.

            <tr
              key={user.id}
              className="odd:bg-gray-100 even:bg-white dark:odd:bg-neutral-800 dark:even:bg-neutral-900 cursor-pointer hover:bg-gray-300 dark:hover:bg-neutral-600 hover:text-blue-700 transition-all duration-200 h-[50px]"
            >
              {isSelectable || isGroupSelection ? (
                <td>
                  <input
                    type="checkbox"
                    className="mx-2 scale-125"
                    checked={selectedUsers.some(
                      (selectedUser) => selectedUser._id === user._id
                    )}
                    onChange={(e) => {
                      e.stopPropagation(); // Prevent triggering row click
                      handleCheckboxChange(user);
                    }}
                  />
                </td>
              ) : null}
              <td className="p-3 text-gray-700 dark:text-neutral-400 w-[200px]">
                <div className="flex items-center justify-between relative">
                  <span
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent triggering row click
                      // If the User Info Modal is not already open for this user, open it
                      if (clickedUser?._id !== user._id || !showInfoModal) {
                        setShowInfoModal(true); // Open the User Info Modal
                        setClickedUser(user); // Set the clicked user as the one whose details we want to show
                      }
                    }}
                    className="hover:text-blue-600 cursor-pointer"
                  >
                    {user.fullName}
                  </span>
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowInfoModal(false); // Close the User Info Modal when interacting with the 3-dot menu
                      handleIconClick(rowIndex); // Toggle the 3-dot menu
                    }}
                    className="cursor-pointer relative"
                  >
                    <FaEllipsisH className="rotate-90 text-blue-600" />
                    {isModalOpen === rowIndex && (
                      <div
                        ref={(ref) => (modalRef.current = ref)} // For detecting clicks outside
                        className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-neutral-950 border border-gray-300 dark:border-neutral-800 rounded-lg shadow-lg z-50"
                      >
                        <ul className="flex flex-col gap-2 p-2">
                          <li
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowInfoModal(false); // Ensure Info Modal is closed before opening the Update Modal
                              handleOpenUpdateModal(user); // Open the User Update Modal
                              setIsModalOpen(null); // Close the 3-dot menu
                              setShowInfoModal(false); // Close the User Info Modal before opening another modal
                            }}
                            className="cursor-pointer flex items-center gap-2 text-gray-700 dark:text-neutral-300 hover:bg-gray-100 dark:hover:bg-neutral-700 p-2 rounded-md"
                          >
                            <MdEventNote className="text-lg text-gray-500 dark:text-blue-500" />
                            <span>Manage username & password</span>
                          </li>
                          <li
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowInfoModal(false); // Close the User Info Modal
                              handleManageGroupsClick(user); // Navigate to Manage Groups
                            }}
                            className="cursor-pointer flex items-center gap-2 text-gray-700 dark:text-neutral-300 hover:bg-gray-100 dark:hover:bg-neutral-700 p-2 rounded-md"
                          >
                            <MdManageAccounts className="text-lg text-gray-500 dark:text-blue-500" />
                            <span>Manage Groups</span>
                          </li>
                          <li
                            onClick={(e) => {
                              e.stopPropagation();
                              setIsUpdateModalOpen(false); // Ensure Update Modal is closed
                              setClickedUser(user);
                              setShowInfoModal(true); // Show the User Info Modal
                              setIsModalOpen(null); // Close the 3-dot menu
                            }}
                            className="cursor-pointer flex items-center gap-2 text-gray-700 dark:text-neutral-300 hover:bg-gray-100 dark:hover:bg-neutral-700 p-2 rounded-md"
                          >
                            <FaInfoCircle className="text-lg dark:text-blue-500 text-gray-500" />
                            <span>View Details</span>
                          </li>
                        </ul>
                      </div>
                    )}
                  </span>
                </div>
              </td>
              <td className="p-3 text-gray-700 dark:text-neutral-400 w-[250px]">
                {user.email}
              </td>
              <td
                className="p-3 text-gray-700 dark:text-neutral-400 max-w-[300px] truncate"
                title={user.address}
              >
                {user.address}
              </td>
              <td className="p-3 text-gray-700 dark:text-neutral-400 w-[200px]">
                {user.city}
              </td>
              <td className="p-3 text-gray-700 dark:text-neutral-400 w-[200px]">
                {user.contact}
              </td>
            </tr>
          ))}
          <MFAModal
            isOpen={isMFAModalOpen}
            onClose={() => setIsMFAModalOpen(false)}
          />

          {/* User Details Modal */}
          {showInfoModal && (
            <UserDetailDialog
              user={clickedUser} // Pass the selected user to the dialog
              onClose={() => setShowInfoModal(false)} // Close handler
            />
          )}

          {isPasswordModalOpen && (
            <div className="fixed inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50 overflow-auto scrollbar-hidden">
              <div className="bg-white dark:bg-neutral-900 rounded-lg w-full md:w-[80%] lg:w-[70%] xl:w-[60%] 2xl:w-[50%] h-[80vh] p-6 overflow-y-auto relative scrollbar-hidden">
                {/* Modal Header */}
                <div className="flex justify-between items-center mb-4 border-b border-gray-200 dark:border-neutral-800 pb-4">
                  <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
                    Manage User Passwords
                  </h2>
                  <button
                    onClick={() => setIsPasswordModalOpen(false)}
                    className="text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white focus:outline-none"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                {/* Search Bar */}
                <div className="mb-4">
                  <input
                    type="text"
                    placeholder="Search active users..."
                    onChange={(e) => setSearchTerm(e.target.value)}
                    value={searchTerm}
                    className="w-full p-3 border border-gray-300 dark:border-neutral-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 dark:bg-neutral-800 dark:text-white"
                  />
                </div>

                {/* User List */}
                <div className="max-h-[60vh] overflow-y-auto scrollbar-hidden">
                  {activeUsers.length > 0 ? (
                    activeUsers
                      .filter((user) =>
                        user.fullName
                          .toLowerCase()
                          .includes(searchTerm.toLowerCase())
                      ) // Filter users by search term
                      .map((user) => (
                        <div
                          key={user._id}
                          className="flex justify-between items-center p-4 mb-2 bg-gray-50 dark:bg-neutral-800 rounded-lg shadow-md hover:bg-gray-100 dark:hover:bg-neutral-700 transition-all duration-200"
                        >
                          <div className="flex items-center space-x-4">
                            <span className="text-lg font-semibold text-gray-700 dark:text-white">
                              {user.fullName}
                            </span>
                          </div>
                          <button
                            onClick={() => handlePasswordUpdateModalOpen(user)}
                            className="text-blue-500 hover:text-blue-700 transition-all duration-200"
                          >
                            Update Password
                          </button>
                        </div>
                      ))
                  ) : (
                    <p className="text-center text-gray-500 dark:text-neutral-400">
                      No active users found
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
          {/* Update password modal */}
          {isUpdatePasswordDialogOpen && (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
              <div className="bg-white dark:bg-neutral-900 dark:text-white rounded-lg p-6 w-96">
                <h3 className="text-xl font-semibold">
                  Update Password for {selectedUser?.fullName}
                </h3>

                {/* Password input */}
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="mt-4 w-full p-2 border rounded-lg bg-gray-200 dark:bg-gray-700 dark:border-gray-600"
                  placeholder="New Password"
                />

                {/* Generate password button */}
                <button
                  onClick={generateRandomPassword}
                  className="mt-2 w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 dark:bg-blue-700 dark:hover:bg-blue-600"
                >
                  Generate 8-Digit Password
                </button>

                {/* Update password button */}
                <button
                  onClick={() =>
                    handlePasswordUpdate(selectedUser._id, newPassword)
                  }
                  className={`mt-2 w-full py-2 text-white rounded-lg ${
                    newPassword
                      ? "bg-blue-600 hover:bg-blue-500"
                      : "bg-gray-400 cursor-not-allowed"
                  }`}
                  disabled={!newPassword || isUpdatingPassword} // Disable button if newPassword is empty or updating
                >
                  {isUpdatingPassword ? "Updating..." : "Update Password"}
                </button>

                {/* Cancel button */}
                <button
                  onClick={() => setIsUpdatePasswordDialogOpen(false)}
                  className="mt-2 w-full py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-500"
                >
                  Cancel
                </button>
                {isUpdatingPassword && <Loader />}
              </div>
            </div>
          )}

          {/* Update User Modal */}
          {isUpdateModalOpen && (
            <UserUpdateDialog
              user={selectedUser}
              onClose={() => setIsUpdateModalOpen(false)}
              onSave={handleSaveUserDetails}
            />
          )}
        </NewTableComponent>

        <Dialog
          isOpen={isDialogOpen}
          onClose={closeDialog}
          userId={selectedUserId}
        />
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

        <ImportUsersDialog
          isOpen={isImportUsersModelOpen}
          onClose={() => {
            setIsImportUsersModelOpen(false);
          }}
          onSuccess={() => {
            dispatch(fetchUsers());
          }}
        />

        {isLoading && <Loader />}
      </div>
    </div>
  );
};

export default TableRoute;
