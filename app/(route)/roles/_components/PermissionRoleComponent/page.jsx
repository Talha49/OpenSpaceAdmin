"use client";
import NewTableComponent from "@/app/_HOC/Table/NewTableComponent";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { CiMenuFries, CiSearch } from "react-icons/ci";
import {
  IoIosAddCircleOutline,
  IoIosArrowForward,
  IoMdClose,
} from "react-icons/io";
import { LuChevronFirst, LuChevronLast, LuLoader } from "react-icons/lu";
import {
  MdDeleteOutline,
  MdNavigateBefore,
  MdNavigateNext,
} from "react-icons/md";
import { userPermissions } from "../UserPermissions";
import { administratorPermissions } from "../AdministratorPermissions";
import PermissionDialog from "../PermissionDialog/page";
import PermissionSettingsDialog from "../PermissionSettingsDialogComponent/page";
import GrantRoleDialog from "../GrantRoleDialog/page";
import CreateNewPermissionForExternalUserDialog from "../CreateNewPermissionForExternalUserDialog/page";
import CreateNewDialog from "../CreateNewDialog/page";
import { useDispatch } from "react-redux";
import {
  deleteRole,
  fetchAllRoles,
  setEditingRoleId,
  setRoleDetails,
  setRoleEditing,
  setSelectedGroupsForRole,
  setSelectedUsersForRole,
  setStatePermissions,
} from "@/lib/Feature/RoleSlice";
import { useSelector } from "react-redux";
import Loader from "@/app/_components/Loader/Loader";
import RoleDetailDialog from "@/app/_components/RoleDetails Dialog/RoleDetailDialog";
import { RxReload } from "react-icons/rx";
import ConfirmationDialog from "@/app/_components/ConfirmationDialog/ConfirmationDialog";

const PermissionRolesComponent = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenPermissionSettingsDialog, setIsOpenPermissionSettingsDialog] =
    useState(false);

  const [isOpenGrantRoleDialog, setIsOpenGrantRoleDialog] = useState(false);
  const [isOpenCreateNewDialog, setIsOpenCreateNewDialog] = useState(false);

  const [isUserPermissionsOpen, setIsUserPermissionsOpen] = useState(false);
  const [isAdminPermissionsOpen, setIsAdminPermissionsOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedPermission, setSelectedPermission] = useState(null);

  // State for pagination, search, and items per page
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const dispatch = useDispatch();

  const { roles, loading, selectedUsersForRole, selectedGroupsForRole } =
    useSelector((state) => state.role);
  const [isOpenRoleDetails, setIsOpenRoleDetails] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [isOpenConfirmationDialog, setIsOpenConfirmationDialog] =
    useState(false);
  const [selectedRoleForDelete, setSelectedRoleForDelete] = useState(null);

  useEffect(() => {
    dispatch(fetchAllRoles());
  }, [dispatch]);

  function getDateAndTime(timestamp) {
    // Create a new Date object from the timestamp
    const dateObj = new Date(timestamp);

    // Extract the date in the format YYYY-MM-DD
    const date = dateObj.toISOString().split("T")[0];

    // Extract the time in the format HH:MM:SS
    const time = dateObj.toISOString().split("T")[1].split(".")[0];

    return { date, time };
  }

  // Get filtered data based on the search term
  const filteredRoles = roles?.filter((role) =>
    role.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle page change
  const handlePageChange = (newPage) => {
    if (
      newPage >= 1 &&
      newPage <= Math.ceil(filteredRoles.length / rowsPerPage)
    ) {
      setCurrentPage(newPage);
    }
  };

  // Handle search change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page on new search
  };

  // Handle items per page change
  const handleRowsPerPageChange = (e) => {
    setRowsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to first page when rows per page changes
  };

  // Get current page data
  const startRow = (currentPage - 1) * rowsPerPage;
  const paginatedRoles = filteredRoles.slice(startRow, startRow + rowsPerPage);

  return (
    <div className="pl-4 pr-2 py-2 dark:bg-neutral-950">
      {loading && <Loader />}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
        <p className="text-sm sm:text-base dark:text-neutral-500">
          Back to{" "}
          <Link
            href="/"
            className="text-blue-500 font-semibold hover:underline transition-all"
          >
            Admin Center
          </Link>
        </p>
        <div className="flex items-center gap-4 flex-wrap">
          <Link
            href="/"
            className="text-blue-500 font-semibold hover:underline transition-all text-sm sm:text-base"
          >
            Customer Community
          </Link>
          <Link
            href="/"
            className="text-blue-500 font-semibold hover:underline transition-all text-sm sm:text-base"
          >
            Admin Resources
          </Link>
          <Link
            href="/"
            className="text-blue-500 font-semibold hover:underline transition-all text-sm sm:text-base"
          >
            Handout Builder
          </Link>
        </div>
      </div>
      <h1 className="text-2xl sm:text-3xl font-semibold my-2 dark:text-neutral-500">
        Permission Role List
      </h1>
      <p className="text-sm sm:text-base dark:text-neutral-700">
        Different users should have different access to the information in the
        application. A role controls the access rights a user (or a group) has
        in the application or employee data. Each role has its own set of access
        permissions that you define. You can also limit exactly what a group can
        access.
      </p>
      <div className="flex items-center gap-2 border border-blue-500 shadow-md bg-slate-50 dark:bg-neutral-800 w-full sm:w-fit px-2 py-1 rounded-lg mt-6">
        <input
          type="search"
          name="search"
          id="search"
          placeholder="Type role name..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="focus:outline-none bg-transparent  w-full sm:w-auto"
        />
        <CiSearch />
      </div>
      <div className="overflow-x-auto custom-scrollbar w-full">
        <div className="bg-white dark:bg-neutral-900 min-w-max">
          <NewTableComponent
            tableColumns={[
              "ID",
              "Permission Role",
              "Description",
              "Created By",
              "Last Modified",
              "Action",
            ]}
            buttons={
              <>
                <p
                  className="flex items-center gap-1 hover:bg-blue-200 dark:hover:bg-neutral-800 p-1 rounded cursor-pointer text-sm transition-all"
                  onClick={() => {
                    setIsOpen(true);
                    localStorage.removeItem("permissions");
                  }}
                >
                  <IoIosAddCircleOutline className="text-xl text-blue-600" />
                  <span>Create New Role</span>
                </p>
                <p
                  className="flex items-center gap-1 hover:bg-blue-200 dark:hover:bg-neutral-800 p-1 rounded cursor-pointer text-sm transition-all"
                  onClick={() => {
                    dispatch(fetchAllRoles());
                  }}
                >
                  <RxReload className="text-lg text-blue-600" />
                  <span>Refresh</span>
                </p>
              </>
            }
            currentPage={currentPage}
            onPageChange={handlePageChange}
            rowsPerPage={rowsPerPage}
            totalRows={filteredRoles.length}
            handleRowsPerPageChange={handleRowsPerPageChange}
          >
            {paginatedRoles?.map((role, index) => (
              <tr
                key={role.id}
                className="border-t dark:border-neutral-700 bg-gray-100 dark:bg-neutral-800 hover:bg-neutral-300 transition-all"
              >
                <td className="p-2 min-w-[60px]">{index + 1}</td>
                <td
                  className="p-2 text-blue-500 cursor-pointer hover:font-bold transition-all min-w-[200px]"
                  onClick={() => {
                    setIsOpenRoleDetails(true);
                    setSelectedRole(role);
                  }}
                >
                  {role?.name}
                </td>
                <td className="p-2 w-[450px] min-w-[300px]">
                  <p className="line-clamp-1">{role?.description}</p>
                </td>
                <td className="p-2 min-w-[150px]">{role?.created?.by}</td>
                <td className="p-2 min-w-[150px]">
                  {getDateAndTime(role.updatedAt).date}
                </td>
                <td className="p-2 min-w-[100px] flex gap-2">
                  <button
                    className="text-blue-500 hover:underline hover:font-semibold transition-all"
                    onClick={() => {
                      dispatch(setEditingRoleId(role));
                      dispatch(setRoleEditing(true));
                      setIsOpen(true);
                      dispatch(
                        setRoleDetails({
                          name: role?.name,
                          description: role?.description,
                        })
                      );
                      dispatch(setStatePermissions(role?.permissions));
                      dispatch(
                        setSelectedUsersForRole(
                          role?.allotedUsers?.map((user) => user._id)
                        )
                      );
                      dispatch(
                        setSelectedGroupsForRole(
                          role?.allotedGroups?.map((group) => group._id)
                        )
                      );
                      localStorage.setItem(
                        "permissions",
                        JSON.stringify(role.permissions)
                      );
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="text-red-500 hover:underline hover:font-semibold transition-all"
                    onClick={() => {
                      setIsOpenConfirmationDialog(true);
                      setSelectedRoleForDelete(role);
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {filteredRoles && filteredRoles.length === 0 && (
              <tr className="col-span-full border-t dark:border-neutral-700 bg-gray-100 dark:bg-neutral-800 hover:bg-neutral-300 transition-all">
                <td colSpan="7" className="text-center py-4">
                  No records found
                </td>
              </tr>
            )}
          </NewTableComponent>
        </div>
      </div>

      {/* </div> */}
      <>
        {isOpenCreateNewDialog && (
          <CreateNewDialog
            onClose={() => {
              setIsOpenCreateNewDialog(false);
              setSelectedRole(null);
            }}
          ></CreateNewDialog>
        )}
      </>
      <>
        {isOpen && (
          <CreateNewPermissionForExternalUserDialog
            onClose={() => {
              setIsOpen(false);
            }}
            handleOpenPermissionSettingsDialog={() => {
              setIsOpenPermissionSettingsDialog(true);
            }}
            handleOpenGrantRoleDialog={() => {
              setIsOpenGrantRoleDialog(true);
            }}
          ></CreateNewPermissionForExternalUserDialog>
        )}
      </>
      <>
        {isOpenPermissionSettingsDialog && (
          <PermissionSettingsDialog
            onClose={() => {
              setIsOpenPermissionSettingsDialog(false);
            }}
          ></PermissionSettingsDialog>
        )}
      </>
      {isOpenGrantRoleDialog && (
        <GrantRoleDialog
          onClose={() => {
            setIsOpenGrantRoleDialog(false);
          }}
        ></GrantRoleDialog>
      )}

      <RoleDetailDialog
        isOpen={isOpenRoleDetails && selectedRole}
        onClose={() => {
          setIsOpenRoleDetails(false);
          setSelectedRole(null);
        }}
        role={selectedRole}
      >
        Role Details
      </RoleDetailDialog>

      <ConfirmationDialog
        isOpen={isOpenConfirmationDialog}
        onClose={() => {
          setIsOpenConfirmationDialog(false);
          setTimeout(() => {
            setSelectedRoleForDelete(null);
          }, 100);
        }}
        title={`Are you sure you want to delete this ${selectedRoleForDelete?.name}?`}
        subtitle={`This action will permanently delete ${selectedRoleForDelete?.name}.`}
        actionButtons={
          <>
            <button
              className="flex items-center gap-1 py-2 px-4 rounded-lg text-sm text-white bg-red-600 hover:bg-red-500 transition-all"
              onClick={() => {
                dispatch(deleteRole(selectedRoleForDelete?._id));
                setIsOpenConfirmationDialog(false);
              }}
            >
              <MdDeleteOutline className="text-base" />
              Confirm Delete
            </button>
          </>
        }
      />
    </div>
  );
};

export default PermissionRolesComponent;
