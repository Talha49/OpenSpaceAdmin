import React, { useState } from "react";
import { IoIosArrowForward } from "react-icons/io";
import { CiMenuFries } from "react-icons/ci";
import { userPermissions } from "../UserPermissions";
import { administratorPermissions } from "../AdministratorPermissions";
import PermissionDialog from "../PermissionDialog/page";
import NewTableComponent from "@/app/_HOC/Table/NewTableComponent";

const CustomPermissionComponent = ({ permission }) => {
  return (
    <div className="p-2 bg-blue-200 rounded-lg">
      <div className="flex items-center gap-2">
        {permission.toLowerCase()} <input type="checkbox" name="" id="" />
      </div>
    </div>
  );
};

const PermissionSettingsDialog = ({ onClose }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isUserPermissionsOpen, setIsUserPermissionsOpen] = useState(false);
  const [isAdminPermissionsOpen, setIsAdminPermissionsOpen] = useState(false);
  const [selectedPermission, setSelectedPermission] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handlePageChange = (newPage) => {
    if (
      newPage >= 1 &&
      newPage <=
        Math.ceil((selectedPermission?.permissions?.length || 0) / rowsPerPage)
    ) {
      setCurrentPage(newPage);
    }
  };

  const handleRowsPerPageChange = (e) => {
    setRowsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to first page when rows per page changes
  };

  // Get current page data
  const startRow = (currentPage - 1) * rowsPerPage;
  const paginatedPermissions =
    selectedPermission?.permissions?.slice(startRow, startRow + rowsPerPage) ||
    [];

  const renderPermissions = () => {
    if (selectedPermission?.renderAsTable) {
      // Render the table for permissions
      return (
        <NewTableComponent
          tableColumns={["Permissions", "View", "Create", "Update", "Delete"]}
          currentPage={currentPage}
          onPageChange={handlePageChange}
          rowsPerPage={rowsPerPage}
          totalRows={selectedPermission?.permissions?.length || 0}
          handleRowsPerPageChange={handleRowsPerPageChange}
        >
          {paginatedPermissions.map((permission, index) => (
            <tr key={index} className="border-t bg-gray-100 hover:bg-gray-200">
              <td className="p-2">{permission.toLowerCase()}</td>
              <td className="p-2">
                <input
                  type="checkbox"
                  checked={false}
                  className="cursor-pointer"
                />
              </td>
              <td className="p-2">
                <input
                  type="checkbox"
                  checked={false}
                  className="cursor-pointer"
                />
              </td>
              <td className="p-2">
                <input
                  type="checkbox"
                  checked={false}
                  className="cursor-pointer"
                />
              </td>
              <td className="p-2">
                <input
                  type="checkbox"
                  checked={false}
                  className="cursor-pointer"
                />
              </td>
            </tr>
          ))}
        </NewTableComponent>
      );
    } else {
      // Render custom components for the permissions
      return (
        <div className="h-[270px] overflow-y-auto bg-gray-100 rounded p-2">
          <div className="flex items-center gap-4 flex-wrap">
            {selectedPermission?.permissions?.map((permission, index) => (
              <CustomPermissionComponent key={index} permission={permission} />
            ))}
          </div>
        </div>
      );
    }
  };

  return (
    <PermissionDialog
      onClose={onClose}
      classes={"max-w-[1000px] min-h-[450px] max-h-[450px]"}
    >
      <div
        className="flex items-center gap-2 absolute top-3 left-3 text-blue-500 cursor-pointer"
        onClick={onClose}
      >
        <span className="flex items-center justify-center bg-blue-100 w-8 h-8 rounded-full hover:bg-blue-200 transition-all">
          {"<-"}
        </span>
        <span className="text-sm">Permission Role Details</span>
      </div>

      <div className="text-center mt-2">
        <h1 className="text-xl font-semibold">Permission Settings</h1>
        <p>
          Specify what permissions users in this role should have. Access period
          can be defined at the granting rule level.
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
          className={`w-[350px] h-[300px] py-2 overflow-y-auto bg-gray-100 lg:static absolute z-50 ${
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
                ([category, { renderAsTable, permissions }], index) => (
                  <div
                    key={index}
                    onClick={() => {
                      setSelectedPermission({
                        title: "User Permissions",
                        category: category,
                        renderAsTable: renderAsTable,
                        permissions: permissions,
                      });
                    }}
                  >
                    <h3
                      className={`ml-5 mr-1 text-sm p-1 hover:bg-blue-100 rounded cursor-pointer ${
                        selectedPermission?.category === category &&
                        selectedPermission.title === "User Permissions" &&
                        "text-blue-500"
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
              isAdminPermissionsOpen && "text-blue-500 bg-blue-200 rounded"
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
                ([category, { renderAsTable, permissions }], index) => (
                  <div
                    key={index}
                    onClick={() => {
                      setSelectedPermission({
                        title: "Administrator Permissions",
                        category: category,
                        renderAsTable: renderAsTable,
                        permissions: permissions,
                      });
                    }}
                  >
                    <h3
                      className={`ml-5 mr-1 text-sm p-1 hover:bg-blue-100 rounded cursor-pointer ${
                        selectedPermission?.category === category &&
                        selectedPermission.title ===
                          "Administrator Permissions" &&
                        "text-blue-500"
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
        <div className=" w-full rounded border-gray-300">
          {selectedPermission ? (
            <>
              <h1 className="text-base font-semibold">
                {selectedPermission.title}{" "}
                <span className="text-blue-500">
                  {"-> "}
                  {selectedPermission.category}
                </span>
              </h1>
              <div className="overflow-x-auto">
                <div className="min-w-[600px]">{renderPermissions()}</div>
              </div>
            </>
          ) : (
            "Please select the permissions from the left side."
          )}
        </div>
      </div>
    </PermissionDialog>
  );
};

export default PermissionSettingsDialog;
