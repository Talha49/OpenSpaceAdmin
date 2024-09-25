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
import MainPermissionDialog from "../PermissionMainDialogComponent/page";

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

  const [isUserPermissionsOpen, setIsUserPermissionsOpen] = useState(false);
  const [isAdminPermissionsOpen, setIsAdminPermissionsOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedPermission, setSelectedPermission] = useState(null);

  // State for pagination, search, and items per page
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [rolesData, setRolesData] = useState(generateRoles());

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
    <div className="mt-3 mr-4 sm:mr-2 md:mr-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between w-full gap-2">
        <p className="text-sm sm:text-base">
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
      <h1 className="text-2xl sm:text-3xl font-semibold my-2">
        Permission Role List
      </h1>
      <p className="text-sm sm:text-base">
        Different users should have different access to the information in the
        application. A role controls the access rights a user (or a group) has
        in the application or employee data. Each role has its own set of access
        permissions that you define. You can also limit exactly what a group can
        access.
      </p>
      <div className="flex items-center gap-2 border border-blue-500 shadow-md bg-slate-50 w-full sm:w-fit px-2 py-1 rounded-lg mt-6">
        <input
          type="search"
          name="search"
          id="search"
          placeholder="Type role name..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="focus:outline-none bg-transparent w-full sm:w-auto"
        />
        <CiSearch />
      </div>
      <div className="bg-blue-100 mt-4 rounded p-2">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-1">
          <div className="flex flex-col sm:flex-row md:items-center gap-4">
            <p className="flex items-center gap-1 hover:bg-blue-200 p-1 rounded cursor-pointer text-sm transition-all">
              <IoIosAddCircleOutline className="text-xl text-blue-600" />
              <span>Create New</span>
            </p>
            <p
              className="flex items-center gap-1 hover:bg-blue-200 p-1 rounded cursor-pointer text-sm transition-all"
              onClick={() => {
                setIsOpen(true);
              }}
            >
              <IoIosAddCircleOutline className="text-xl text-blue-600" />
              <span>Create New Role for External User</span>
            </p>
          </div>
          <div className="flex flex-col sm:flex-row md:items-center gap-2">
            <div className="flex items-center gap-2 p-1 rounded">
              <p className="text-sm">Items per page</p>
              <select
                value={rowsPerPage}
                onChange={handleRowsPerPageChange}
                className="bg-transparent border rounded border-blue-500 p-1"
              >
                <option value="10">10</option>
                <option value="30">30</option>
                <option value="50">50</option>
              </select>
            </div>
            <div className="flex items-center gap-1">
              <LuChevronFirst
                onClick={() => handlePageChange(1)}
                className="cursor-pointer"
              />
              <MdNavigateBefore
                onClick={() => handlePageChange(currentPage - 1)}
                className="cursor-pointer text-lg"
              />
              <p className="text-sm">
                Page <span className="p-1">{currentPage}</span> of{" "}
                <span className="p-1">
                  {Math.ceil(filteredRoles.length / rowsPerPage)}
                </span>
              </p>
              <MdNavigateNext
                onClick={() => handlePageChange(currentPage + 1)}
                className="cursor-pointer text-lg"
              />
              <LuChevronLast
                onClick={() =>
                  handlePageChange(
                    Math.ceil(filteredRoles.length / rowsPerPage)
                  )
                }
                className="cursor-pointer"
              />
            </div>
          </div>
        </div>
        {/* Table Wrapper for Horizontal Scrolling */}
        <div className="overflow-x-auto">
          <div className="bg-white border border-gray-300 min-w-[1000px]">
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
              currentPage={currentPage}
              onPageChange={handlePageChange}
              rowsPerPage={rowsPerPage}
              totalRows={filteredRoles.length}
            >
              {paginatedRoles.map((role) => (
                <tr key={role.id} className="border-t">
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
      </div>
      <>
        {isOpen && (
          <MainPermissionDialog
            onClose={() => {
              setIsOpen(false);
            }}
            handleOpenPermissionSettingsDialog={() => {
              setIsOpenPermissionSettingsDialog(true);
            }}
          ></MainPermissionDialog>
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
    </div>
  );
};

export default PermissionRolesComponent;
