"use client";
import NewTableComponent from "@/app/_HOC/Table/NewTableComponent";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { CiMenuFries, CiSearch } from "react-icons/ci";
import { IoIosAddCircleOutline, IoIosArrowForward } from "react-icons/io";
import { LuChevronFirst, LuChevronLast } from "react-icons/lu";
import { MdNavigateBefore, MdNavigateNext } from "react-icons/md";
import { userPermissions } from "../UserPermissions";
import { administratorPermissions } from "../AdministratorPermissions";
import PermissionDialog from "../PermissionDialog/page";
import PermissionSettingsDialog from "../PermissionSettingsDialogComponent/page";
import GrantRoleDialog from "../GrantRoleDialog/page";
import CreateNewPermissionForExternalUserDialog from "../CreateNewPermissionForExternalUserDialog/page";
import CreateNewDialog from "../CreateNewDialog/page";
import { useDispatch } from "react-redux";
import { fetchAllRoles } from "@/lib/Feature/CreateRole";
import { useSelector } from "react-redux";

// Function to generate mock role data
const generateRoles = () => {
  let roles = [];
  for (let i = 1; i <= 50; i++) {
    roles.push({
      id: i,
      permissionRole: `Role ${i}`,
      userType: i % 2 === 0 ? "Admin" : "User",
      description: `Description for Role ${i}`,
      status: i % 2 === 0 ? "Active" : "Inactive",
      rbpOnly: i % 3 === 0,
      createdFrom: `System ${i % 5}`,
      lastModified: `Date ${i}`,
    });
  }
  return roles;
};

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
  const [rolesData, setRolesData] = useState(generateRoles());

  const dispatch = useDispatch();

  const { roles } = useSelector((state) => state.role);

  useEffect(() => {
    dispatch(fetchAllRoles());
  }, [roles, dispatch]);

  console.log("Roles =>", roles);

  // Get filtered data based on the search term
  const filteredRoles = rolesData.filter((role) =>
    role.permissionRole.toLowerCase().includes(searchTerm.toLowerCase())
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
      <div className="flex flex-col md:flex-row md:items-center justify-between w-full gap-2">
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
      <div className="overflow-x-auto">
        <div className="bg-white dark:bg-neutral-900 min-w-[1000px]">
          <NewTableComponent
            tableColumns={[
              "ID",
              "Permission Role",
              "User Type",
              "Description",
              "Status",
              "RBP-Only",
              "Created From",
              "Last Modified",
              "Action",
            ]}
            buttons={
              <>
                {/* <p
                  className="flex items-center gap-1 hover:bg-blue-200 dark:hover:bg-neutral-800 p-1 rounded cursor-pointer text-sm transition-all"
                  onClick={() => {
                    setIsOpenCreateNewDialog(true);
                  }}
                >
                  <IoIosAddCircleOutline className="text-xl text-blue-600" />
                  <span>Create New</span>
                </p> */}
                <p
                  className="flex items-center gap-1 hover:bg-blue-200 dark:hover:bg-neutral-800 p-1 rounded cursor-pointer text-sm transition-all"
                  onClick={() => {
                    setIsOpen(true);
                  }}
                >
                  <IoIosAddCircleOutline className="text-xl text-blue-600" />
                  <span>Create New Role</span>
                </p>
              </>
            }
            currentPage={currentPage}
            onPageChange={handlePageChange}
            rowsPerPage={rowsPerPage}
            totalRows={filteredRoles.length}
            handleRowsPerPageChange={handleRowsPerPageChange}
          >
            {paginatedRoles.map((role) => (
              <tr
                key={role.id}
                className="border-t dark:border-neutral-700 bg-gray-100 dark:bg-neutral-800"
              >
                <td className="p-2">{role.id}</td>
                <td className="p-2 text-blue-500">{role.permissionRole}</td>
                <td className="p-2">{role.userType}</td>
                <td className="p-2">{role.description}</td>
                <td className="p-2">{role.status}</td>
                <td className="p-2">
                  <input
                    type="checkbox"
                    checked={role.rbpOnly}
                    readOnly
                    className="cursor-pointer"
                  />
                </td>
                <td className="p-2">{role.createdFrom}</td>
                <td className="p-2">{role.lastModified}</td>
                <td className="p-2">
                  <button className="text-blue-500 hover:underline">
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </NewTableComponent>
        </div>
      </div>
      {/* </div> */}
      <>
        {isOpenCreateNewDialog && (
          <CreateNewDialog
            onClose={() => {
              setIsOpenCreateNewDialog(false);
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
    </div>
  );
};

export default PermissionRolesComponent;
