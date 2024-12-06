
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
  const [isLoading, setIsLoading] = useState(true);  // Loading state
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false); // Loading state while updating
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [activeUsers, setActiveUsers] = useState([]);
  const [isUpdatePasswordDialogOpen, setIsUpdatePasswordDialogOpen] = useState(false);
const [newPassword, setNewPassword] = useState('');
const [isDialogOpen, setIsDialogOpen] = useState(false);
const [selectedUserId, setSelectedUserId] = useState(null);
const [userDetails, setUserDetails] = useState(null);




const handlePasswordUpdateModalOpen = (user) => {
  setNewPassword(''); // Clear previous password when opening the modal
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
  const activeUsersList = users.filter(user => user.status === 'active');
  setActiveUsers(activeUsersList);
  setIsPasswordModalOpen(true);
};

// Handle password update action
const handlePasswordUpdate = async (userId, newPassword) => {
  try {
    setIsUpdatingPassword(true); // Set loading state to true
    const encryptedPassword = await encryptPassword(newPassword); // Encrypt the password (if required)
    
    const response = await fetch('/api/Users/updatePassword', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,  // The user's ID
        newPassword: encryptedPassword,  // The encrypted new password
      }),
    });

    const data = await response.json();

    if (response.ok) {
      setIsUpdatingPassword(false); // Set loading state to false on error
      setIsUpdatePasswordDialogOpen(false);
      setIsPasswordModalOpen(false); // Close the modal after updating password
    } else {
      alert(data.message || "Error updating password!");
    }
  } catch (error) {
    setIsUpdatingPassword(false); // Set loading state to false on error
    console.error("Error updating password:", error);
    setIsUpdatingPassword(false); // Set loading state to false on error
    alert("Error updating password!");
  }
};


  const handleOpenUpdateModal = (user) => {
    setSelectedUser(user); // Set the selected user
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
    dispatch(fetchUsers())
      .finally(() => {
        setIsLoading(false); // Set loading to false after fetch is complete
      });
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
    { icon: <FaShieldAlt />, label: "Multifactor authentication", onClick: () => setIsMFAModalOpen(true) },
    // Add other header items here
    {
      icon: <MdDelete />,
      label: "Delete User",

    },
    {
      icon: <IoMdRefresh />,
      label: "Refresh",
      onClick: () => {
        dispatch(fetchUsers());
      },
    },
    {
      icon: <FaKey />,
      label: "Password",
      onClick: () =>  handlePasswordModalOpen(true)
    },
    {
      icon: <FaFileExport />,
      label: "Export Users",
      onClick: () => {
        exportToExcel(users.map((user) => ({
          "Display Name": user.fullName,
          Email: user.email,
          Address: user.address,
          City: user.city,
          Contact: user.contact,
        })));
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
    XLSX.utils.sheet_add_aoa(worksheet, [["Display Name", "Email", "Address", "City", "Contact"]], { origin: "A1" });

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
      console.error('Invalid user or user ID');
      return;
    }
    console.log('User ID passed to dialog:', user._Id); // Check userId here
    setSelectedUserId(user._id); // Set the userId for the dialog
    setIsDialogOpen(true); // Open the dialog
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setSelectedUserId(null); // Reset the user ID when dialog is closed
  };


  return (
    <div className="">
      <NewHeader>
        <div className="flex flex-col px-6 ">
          <div className="mb-4 flex flex-col gap-4">
            <h1 className="text-xl font-semibold tracking-wider text-neutral-500">Talha.ae</h1>
            <h2 className="text-lg font-semibold tracking-wider text-neutral-500">
              Active Users
            </h2>
          </div>
          <div className="flex flex-col sm:flex-row sm:gap-0 gap-6 sm:items-center justify-between border-t-2 dark:border-neutral-500 pt-2">
            <div className="flex items-center sm:gap-x-6 gap-x-4 text-[9px]">
              {headerItems.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-1 cursor-pointer hover:text-blue-500 transition-all group relative"
                  onClick={() => {
                    if (item.onClick) {
                      item.onClick(); // Trigger the API call for Refresh
                    } else if (item.link) {
                      router.push(item.link); // Navigate to the link if provided
                    } else if (item.label === "Delete User") {
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
                      <p className="hidden lg:inline text-xs">{item.label}</p>
                    </Link>
                  ) : (
                    <div className="flex items-center gap-1">
                      <span className="text-sm text-blue-400">{item.icon}</span>
                      <p className="hidden lg:inline text-xs">{item.label}</p>
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
              <span
                onClick={handleOpenFilterModal}
                className="flex items-center text-sm gap-1"
              >
                <FaFilter />
                <p>Filter</p>
              </span>
              <input
                type="text"
                placeholder="Search users list"
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
            onClick={async () => {
              if (selectedUsers.length === 0) {
                alert("Please select users to delete.");
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
                setIsSelectable(false); // Exit selection mode

                // After all deletions are done, refresh the users list
                await dispatch(fetchUsers());

                // Navigate to the active users page
                router.push("/users/active");

                // Set loading state to false after deletion and fetch are done
                setIsLoading(false);
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
                router.push("/group");
                dispatch(setSelectedGroupUsers(selectedUsers));
              }
            }}
          >
            Group
          </button>
          <button type="button" // Prevent the form from submitting
            className="px-3 rounded-lg ml-1 py-2 bg-gray-400 text-white  hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            onClick={handleCancel} // Use onClick instead of onSubmit
          >

            Cancel
          </button>
        </div>
      )}

      <div className="pl-4 pr-2 relative shadow-md rounded-lg ">
        <NewTableComponent
          tableColumns={[
            isSelectable || isGroupSelection ? (

              <th className="flex items-center justify-between w-[50px]">
                <input
                  type="checkbox"
                  className="custom-circle-checkbox"
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
                <FaSort className="ml-1" />
              </div>
            )),
          ]}
          buttons={
            <>
              <button
                className="flex items-center gap-2 px-2 py-1 rounded hover:bg-blue-200 dark:hover:bg-neutral-800"
                onClick={() => {
                  router.push("/users");
                }}
              >
                <IoMdPersonAdd className="text-blue-500" />
                <span className="text-sm">Add User</span>
                {/* Loader above the table */}
                {isLoading && (
                  <div className="flex justify-center items-center ">
                    <FaSpinner className="animate-spin text-blue-500" size={20} />
                  </div>
                )}
              </button>
            </>
          }
          rowsPerPage={rowsPerPage}
          totalRows={sortedFilteredUsers.length}
          currentPage={currentPage}
          onPageChange={(page) => setCurrentPage(page)}
          handleRowsPerPageChange={handleRowsPerPageChange}

        >
          {paginatedUsers.map((user, rowIndex) => (
            <tr
              key={user.id}
              className="odd:bg-gray-100 even:bg-white dark:odd:bg-neutral-800 dark:even:bg-neutral-900 cursor-pointer hover:bg-gray-300 dark:hover:bg-neutral-600 hover:text-blue-700 transition-all duration-200 h-[50px]"
            >
              {isSelectable || isGroupSelection ? (
                <td>
                  <input
                    type="checkbox"

                    className="mx-2 custom-circle-checkbox"
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
                  <span className="hover:text-blue-600">{user.fullName}</span>
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                      handleIconClick(rowIndex, user);
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
                              handleOpenUpdateModal(user);
                              setIsModalOpen(null); // Close the modal after selection
                            }}
                            className="cursor-pointer flex items-center gap-2 text-gray-700 hover:bg-gray-100 dark:hover:bg-neutral-700 p-2 rounded-md"
                          >
                            <MdEventNote className="text-lg text-gray-500" />
                            <span>Manage username & password</span>
                          </li>
                          <li
                            onClick={(e) => {
                              e.stopPropagation();
                              console.log("Manage Groups clicked"); // Placeholder for your action
                              handleManageGroupsClick(user);  // Navigate to Manage Groups
                            }}
                            className="cursor-pointer flex items-center gap-2 text-gray-700 hover:bg-gray-100 dark:hover:bg-neutral-700 p-2 rounded-md"
                          >
                            <MdManageAccounts className="text-lg text-gray-500" />
                            <span>Manage Groups</span>
                          </li>
                          <li
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowInfoModal(false);
                              setTimeout(() => {
                                setClickedUser(user);
                                setShowInfoModal(true);
                              }, 0);
                              setIsModalOpen(null);
                            }}
                            className="cursor-pointer flex items-center gap-2 text-gray-700 hover:bg-gray-100 dark:hover:bg-neutral-700 p-2 rounded-md"
                          >
                            <FaInfoCircle className="text-lg text-gray-500" />
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
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">Manage User Passwords</h2>
        <button
          onClick={() => setIsPasswordModalOpen(false)}
          className="text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white focus:outline-none"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
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
            .filter(user => user.fullName.toLowerCase().includes(searchTerm.toLowerCase())) // Filter users by search term
            .map((user) => (
              <div key={user._id} className="flex justify-between items-center p-4 mb-2 bg-gray-50 dark:bg-neutral-800 rounded-lg shadow-md hover:bg-gray-100 dark:hover:bg-neutral-700 transition-all duration-200">
                <div className="flex items-center space-x-4">
                  <span className="text-lg font-semibold text-gray-700 dark:text-white">{user.fullName}</span>
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
          <p className="text-center text-gray-500 dark:text-neutral-400">No active users found</p>
        )}
      </div>

    
    </div>
  </div>
)}
 {/* Update password modal */}
 {isUpdatePasswordDialogOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-xl font-semibold">Update Password for {selectedUser?.fullName}</h3>
            
            {/* Password input with type 'password' to mask it */}
            <input
              type="password" // Use 'password' type for masking input
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="mt-4 w-full p-2 border rounded-lg"
              placeholder="New Password"
            />
            
            {/* Generate password button */}
            <button
              onClick={generateRandomPassword}
              className="mt-2 w-full py-2 bg-blue-500 text-white rounded-lg"
            >
              Generate 8-Digit Password
            </button>

            {/* Update password button */}
            <button
              onClick={() => handlePasswordUpdate(selectedUser._id, newPassword)}
              className="mt-2 w-full py-2 bg-green-500 text-white rounded-lg"
              disabled={isUpdatingPassword} // Disable button while updating
            >
              {isUpdatingPassword ? 'Updating...' : 'Update Password'}
            </button>

            {/* Cancel button */}
            <button
              onClick={() => setIsUpdatePasswordDialogOpen(false)}
              className="mt-2 w-full py-2 bg-gray-500 text-white rounded-lg"
            >
              Cancel
            </button>
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
      </div>
    </div>

  );
};

export default TableRoute;
