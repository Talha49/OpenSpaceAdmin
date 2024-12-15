import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import PermissionDialog from "../PermissionDialog/page";
import { setRoleDetails } from "@/lib/Feature/CreateRole";

const CreateNewPermissionForExternalUserDialog = ({
  onClose,
  handleOpenPermissionSettingsDialog,
  handleOpenGrantRoleDialog,
}) => {
  const dispatch = useDispatch();

  // Get the current role data from the Redux store
  const { name, description } = useSelector((state) => state.role);

  console.log("name: " + name);
  console.log("description: " + description);

  // Local state to manage form inputs
  const [roleName, setRoleName] = useState(name);
  const [roleDescription, setRoleDescription] = useState(description);

  // Handle input change for role name and description
  const handleNameChange = (e) => {
    const newName = e.target.value;
    setRoleName(newName);
    dispatch(setRoleDetails({ name: newName, description: roleDescription })); // Dispatch the update to Redux
  };

  const handleDescriptionChange = (e) => {
    const newDescription = e.target.value;
    setRoleDescription(newDescription);
    dispatch(setRoleDetails({ name: roleName, description: newDescription })); // Dispatch the update to Redux
  };

  return (
    <PermissionDialog onClose={onClose}>
      <h1 className="text-2xl font-semibold my-4 dark:text-neutral-500">
        Permission Role Details
      </h1>
      <div className="shadow-md w-full px-4 py-2 border dark:border-neutral-800 rounded">
        <h1 className="text-lg font-semibold dark:text-neutral-500">
          1. Name & Description
        </h1>
        <form className="flex flex-col gap-4 mt-2">
          <div className="flex flex-col gap-1">
            <label htmlFor="roleName" className="font-medium">
              Role Name
            </label>
            <input
              id="roleName"
              type="text"
              placeholder="Enter role name"
              value={roleName}
              onChange={handleNameChange} // Update role name on change
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
              value={roleDescription}
              onChange={handleDescriptionChange} // Update role description on change
              className="p-2 w-full sm:w-[350px] border rounded-lg focus:outline-2 outline-blue-500"
            />
          </div>
        </form>
      </div>
      <div className="shadow-md w-full px-4 py-1 my-2 border dark:border-neutral-800 rounded">
        <h1 className="text-lg font-semibold dark:text-neutral-500">
          2. Permission Settings
        </h1>
        <div className="dark:text-neutral-700">
          <p>Specify what permissions users in this role should have</p>
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white transition-all px-2 py-1 my-2 rounded"
            onClick={handleOpenPermissionSettingsDialog}
          >
            Permissions...
          </button>
        </div>
      </div>
      <div className="shadow-md w-full px-4 py-1 my-2 border dark:border-neutral-800 rounded">
        <h1 className="text-lg font-semibold dark:text-neutral-500">
          3. Grant This Role To...
        </h1>
        <div className="dark:text-neutral-700">
          <p>
            Select the group where you want to grant this role. You may have a
            group of users.
          </p>
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white transition-all px-2 py-1 my-2 rounded"
            onClick={handleOpenGrantRoleDialog}
          >
            Add...
          </button>
        </div>
      </div>
    </PermissionDialog>
  );
};

export default CreateNewPermissionForExternalUserDialog;
