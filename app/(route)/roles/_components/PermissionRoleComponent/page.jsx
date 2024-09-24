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
          <PermissionDialog
            onClose={() => {
              setIsOpen(false);
            }}
          >
            <h1 className="text-2xl font-semibold my-4">
              Permission Role Details
            </h1>
            <div className="shadow-md w-full px-4 py-2 border rounded">
              <h1 className="text-lg font-semibold">1. Name & Description</h1>
              <form className="flex flex-col gap-4 mt-2">
                <div className="flex flex-col gap-1">
                  <label htmlFor="roleName" className="font-medium">
                    Role Name
                  </label>
                  <input
                    id="roleName"
                    type="text"
                    placeholder="Enter role name"
                    className="p-2 w-full sm:w-[350px] border rounded-lg focus:outline-2 outline-blue-500"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label htmlFor="roleDescription" className="font-medium">
                    Description
                  </label>
                  <textarea
                    id="roleDescription"
                    rows={4}
                    placeholder="Enter role description"
                    className="p-2 w-full sm:w-[350px] border rounded-lg focus:outline-2 outline-blue-500"
                  />
                </div>
              </form>
            </div>
            <div className="shadow-md w-full px-4 py-1 my-2 border rounded">
              <h1 className="text-lg font-semibold">2. Permission Settings</h1>
              <div className="">
                {" "}
                <p>Specify what permissions user in this role should have</p>
                <button
                  className="bg-blue-500 hover:bg-blue-600 text-white transition-all px-2 py-1 my-2 rounded"
                  onClick={() => {
                    setIsOpenPermissionSettingsDialog(true);
                  }}
                >
                  Permissions...
                </button>
              </div>{" "}
            </div>
            <div className="shadow-md w-full px-4 py-1 my-2 border rounded">
              <h1 className="text-lg font-semibold">
                3. Grant This Role To...
              </h1>
              <div className="">
                {" "}
                <p>
                  Select the group where you want to grant this role. You may
                  have a group of users.
                </p>
                <button className="bg-blue-500 hover:bg-blue-600 text-white transition-all px-2 py-1 my-2 rounded">
                  Add...
                </button>
              </div>{" "}
            </div>
          </PermissionDialog>
        )}
      </>
      <>
        {isOpenPermissionSettingsDialog && (
          <PermissionDialog
            onClose={() => {
              setIsOpenPermissionSettingsDialog(false);
            }}
            classes={"max-w-[1000px] min-h-[450px] max-h-[450px]"}
          >
            <div
              className="flex items-center gap-2 absolute top-3 left-3 text-blue-500 cursor-pointer"
              onClick={() => {
                setIsOpenPermissionSettingsDialog(false);
              }}
            >
              <span className="flex items-center justify-center bg-blue-100 w-8 h-8 rounded-full hover:bg-blue-200 transition-all">
                {"<-"}
              </span>
              <span className="text-sm">Permission Role Details</span>
            </div>

            <div className="text-center mt-2">
              <h1 className="text-xl font-semibold">Permission Settings</h1>
              <p>
                Specify what permissions users in this role should have. Access
                period can be defined at the granting rule level.
              </p>
              <p className="text-blue-500">Select permissions on the left</p>
            </div>

            <div
              className="flex items-center gap-2 w-fit my-1 text-blue-500 cursor-pointer"
              onClick={() => {
                setIsSidebarOpen(!isSidebarOpen);
              }}
            >
              <span className="flex items-center justify-center bg-blue-100 w-8 h-8 rounded-lg hover:bg-blue-200 transition-all">
                <CiMenuFries />
              </span>
            </div>

            <div className="flex gap-2">
              <div
                className={`w-[350px] h-[300px] py-2 overflow-y-auto bg-gray-100 md:static absolute ${
                  !isSidebarOpen && "hidden"
                }`}
              >
                <div
                  className={`flex gap-2 items-center font-bold cursor-pointer py-1 ${
                    isUserPermissionsOpen && "text-blue-500 bg-blue-200 rounded"
                  }`}
                  onClick={() => {
                    setIsUserPermissionsOpen(!isUserPermissionsOpen);
                  }}
                >
                  <IoIosArrowForward
                    className={`${
                      isUserPermissionsOpen && "rotate-90"
                    } transition-all`}
                  />
                  User Permissions
                </div>
                {isUserPermissionsOpen && (
                  <>
                    {Object.entries(userPermissions).map(
                      ([category, permissions], index) => (
                        <div
                          key={index}
                          onClick={() => {
                            setSelectedPermission({
                              title: "User Permissions",
                              category: category,
                              permissions: permissions,
                            });
                          }}
                        >
                          <h3
                            className={`ml-5 mr-1 text-sm p-1 hover:bg-blue-100 rounded cursor-pointer ${
                              selectedPermission?.category === category &&
                              selectedPermission.title === "User Permissions" &&
                              " text-blue-500"
                            }`}
                          >
                            {category}
                          </h3>
                        </div>
                      )
                    )}
                  </>
                )}
                <div
                  className={`flex gap-2 items-center font-bold cursor-pointer py-1 ${
                    isAdminPermissionsOpen &&
                    "text-blue-500 bg-blue-200 rounded"
                  }`}
                  onClick={() => {
                    setIsAdminPermissionsOpen(!isAdminPermissionsOpen);
                  }}
                >
                  <IoIosArrowForward
                    className={`${
                      isAdminPermissionsOpen && "rotate-90"
                    } transition-all`}
                  />
                  Administrator Permissions
                </div>
                {isAdminPermissionsOpen && (
                  <>
                    {Object.entries(administratorPermissions).map(
                      ([category, permissions], index) => (
                        <div
                          key={index}
                          onClick={() => {
                            setSelectedPermission({
                              title: "Administrator Permissions",
                              category: category,
                              permissions: permissions,
                            });
                          }}
                        >
                          <h3
                            className={`ml-5 mr-1 text-sm p-1 hover:bg-blue-100 rounded cursor-pointer ${
                              selectedPermission?.category === category &&
                              selectedPermission.title ===
                                "Administrator Permissions" &&
                              " text-blue-500"
                            }`}
                          >
                            {category}
                          </h3>
                        </div>
                      )
                    )}
                  </>
                )}
              </div>
              <div className="h-[300px] w-full rounded border-gray-300">
                {selectedPermission ? (
                  <>
                    <h1 className="text-xl font-semibold ">
                      {selectedPermission.title}{" "}
                      <span className="text-blue-500">
                        {" "}
                        {"-> "}
                        {selectedPermission.category}
                      </span>
                    </h1>
                    {selectedPermission.permissions.map((permission, index) => (
                      <div key={index}>{permission.toLowerCase()}</div>
                    ))}
                  </>
                ) : (
                  "Please select the permissions from the left side."
                )}
              </div>
            </div>
          </PermissionDialog>
        )}
      </>
    </div>
  );
};

export default PermissionRolesComponent;
