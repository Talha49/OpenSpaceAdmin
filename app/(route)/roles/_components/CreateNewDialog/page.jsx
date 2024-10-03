import React, { useState } from "react";
import { FaCheck } from "react-icons/fa"; // Import the check icon from react-icons
import PermissionDialog from "../PermissionDialog/page";
import { IoIosArrowForward } from "react-icons/io";
import { userPermissions } from "../UserPermissions";
import { administratorPermissions } from "../AdministratorPermissions";
import { CiMenuFries, CiSearch } from "react-icons/ci";

const CreateNewDialog = ({ onClose }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [roleName, setRoleName] = useState("");
  const [roleDescription, setRoleDescription] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isUserPermissionsOpen, setIsUserPermissionsOpen] = useState(false);
  const [isAdminPermissionsOpen, setIsAdminPermissionsOpen] = useState(false);
  const [selectedPermission, setSelectedPermission] = useState(null);
  const [selectedPermissionsList, setSelectedPermissionsList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [errors, setErrors] = useState({}); // State for form errors

  // Function to handle next button click
  const handleNext = () => {
    if (activeStep === 0) {
      // Basic Information Form Validation
      const newErrors = {};
      if (!roleName) {
        newErrors.roleName = "Role Name is required.";
      }
      if (!roleDescription) {
        newErrors.roleDescription = "Role Description is required.";
      }
      setErrors(newErrors);

      // Stop the flow if there are validation errors
      if (Object.keys(newErrors).length > 0) {
        return;
      }
    }
    if (activeStep < 2) {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  // Function to handle previous button click
  const handlePrevious = () => {
    if (activeStep > 0) {
      setActiveStep((prevStep) => prevStep - 1);
    }
  };

  // Function to handle permission checkbox change
  const handlePermissionChange = (permission) => {
    setSelectedPermissionsList(
      (prevPermissions) =>
        prevPermissions.includes(permission)
          ? prevPermissions.filter((perm) => perm !== permission) // Remove permission
          : [...prevPermissions, permission] // Add permission
    );
  };

  // Step content and labels
  const stepContent = [
    {
      label: "Basic Information",
      description: (
        <form>
          <div className="my-2">
            <label className="block text-sm" htmlFor="roleName">
              Role Name
            </label>
            <input
              type="text"
              id="roleName"
              placeholder="Enter Role Name"
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
              className="border border-blue-500 focus:outline-blue-500 shadow-md rounded w-full p-2"
              required
            />
            {errors.roleName && (
              <p className="text-red-500 text-xs">{errors.roleName}</p>
            )}
          </div>
          <div>
            <label className="block text-sm" htmlFor="roleDescription">
              Role Description
            </label>
            <textarea
              id="roleDescription"
              placeholder="Enter Role Description"
              value={roleDescription}
              onChange={(e) => setRoleDescription(e.target.value)}
              className="border border-blue-500 focus:outline-blue-500 shadow-md rounded w-full p-2"
              rows="4"
              required
            />
            {errors.roleDescription && (
              <p className="text-red-500 text-xs">{errors.roleDescription}</p>
            )}
          </div>
        </form>
      ),
    },
    {
      label: "Add Permissions",
      description: (
        <>
          <div className="flex items-center gap-2">
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
            <div className="flex items-center gap-2 border border-blue-500 shadow-md bg-slate-50 w-full sm:w-fit px-2 py-1 rounded-lg my-2">
              <input
                type="search"
                name="search"
                id="search"
                placeholder="Search Permissions..."
                className="focus:outline-none bg-transparent w-[500px] sm:w-auto"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                }}
              />
              <CiSearch />
            </div>
          </div>

          <div className="flex gap-2">
            <div
              className={`w-[350px] h-[400px] py-2 overflow-y-auto bg-gray-100 lg:static absolute z-50 ${
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
                  {Object.entries(userPermissions)
                    .filter(([category]) =>
                      category.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                    .map(
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
                  {Object.entries(administratorPermissions)
                    .filter(([category]) =>
                      category.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                    .map(
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
            <div className="w-full rounded border-gray-300 p-4">
              {selectedPermission ? (
                <>
                  <h1 className="text-base font-semibold">
                    {selectedPermission.title}{" "}
                    <span className="text-blue-500">
                      {"-> "}
                      {selectedPermission.category}
                    </span>
                  </h1>
                  <div className="overflow-x-auto mt-2">
                    {/* Map through selected permissions and display them as checkboxes */}
                    {selectedPermission.permissions.map((permission, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 my-1 p-2 border-b hover:bg-gray-100"
                      >
                        <input
                          type="checkbox"
                          id={`permission-${index}`}
                          value={permission}
                          checked={selectedPermissionsList.includes(permission)}
                          onChange={() => handlePermissionChange(permission)}
                          className="cursor-pointer"
                        />
                        <label
                          htmlFor={`permission-${index}`}
                          className="text-sm"
                        >
                          {permission.toLowerCase()}
                        </label>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                "Please select the permissions from the left side."
              )}
            </div>
          </div>
        </>
      ),
    },
    {
      label: "Preview",
      description: (
        <div>
          <h1 className="font-semibold mt-4 text-blue-600">
            Basic Information:
          </h1>

          <div className="border border-blue-300 px-2 rounded-lg bg-blue-50 shadow-md">
            <p className="mt-2">
              <h1 className="font-semibold">Role Name:</h1> {roleName}
            </p>
            <p>
              <h1 className="font-semibold">Role Description:</h1>{" "}
              {roleDescription}
            </p>
          </div>
          <h1 className="font-semibold mt-2 text-blue-600">
            Selected Permissions:
          </h1>

          <div className="border border-blue-300 p-2 rounded-lg bg-blue-50 shadow-md">
            <ul className="flex items-center flex-wrap gap-2 ">
              {selectedPermissionsList.length > 0 ? (
                selectedPermissionsList.map((permission, index) => (
                  <li
                    key={index}
                    className="px-4 py-1 bg-blue-100 border border-blue-300 text-blue-600 rounded"
                  >
                    {permission.toLowerCase()}
                  </li>
                ))
              ) : (
                <li>No permissions selected.</li>
              )}
            </ul>
          </div>
        </div>
      ),
    },
  ];

  return (
    <PermissionDialog onClose={onClose}>
      <h1 className="text-2xl font-semibold my-4">Create Role</h1>
      <div className="w-full bg-white shadow-md border rounded flex items-center justify-between gap-1 p-2">
        {stepContent.map((step, index) => (
          <React.Fragment key={index}>
            <div className="flex items-center gap-2">
              <span
                className={`flex items-center justify-center 
                ${
                  activeStep === index
                    ? "bg-blue-500 text-white"
                    : activeStep > index
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200"
                } 
                rounded-full 
                h-8 min-w-8`} // Fixed height and width for the steps
              >
                {activeStep > index ? (
                  <FaCheck className="text-white" /> // Tick icon for completed steps
                ) : (
                  index + 1
                )}
              </span>
              <p
                className={`text-xs ${
                  activeStep === index || activeStep > index
                    ? "text-blue-500"
                    : "text-gray-600"
                }`}
              >
                {step.label}
              </p>
            </div>
            {index < 2 && (
              <div
                className={`w-full h-[2px] ${
                  activeStep > index ? "bg-blue-500" : "bg-gray-200"
                }`}
              ></div>
            )}
          </React.Fragment>
        ))}
      </div>
      <div className="flex justify-between mt-4">
        <button
          onClick={handlePrevious}
          disabled={activeStep === 0}
          className={`px-4 py-1 bg-blue-100 text-blue-600 rounded border border-blue-500 ${
            activeStep === 0 ? "cursor-not-allowed" : "hover:bg-blue-200"
          }`}
        >
          Previous
        </button>
        <button
          onClick={handleNext}
          disabled={activeStep === 2}
          className={`px-4 py-1 bg-blue-500 text-white rounded ${
            activeStep === 2 ? "cursor-not-allowed" : "hover:bg-blue-600"
          }`}
        >
          Next
        </button>
      </div>
      <div className="mt-4">
        <h2 className="text-lg font-semibold">
          {stepContent[activeStep].label}
        </h2>
        <div>
          {activeStep === 0
            ? stepContent[activeStep].description
            : stepContent[activeStep].description}
        </div>
      </div>
    </PermissionDialog>
  );
};

export default CreateNewDialog;
