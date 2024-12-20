"use client";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import PermissionDialog from "../PermissionDialog/page";
import {
  createRole,
  resetRole,
  resetSelectedUsersAndGroups,
  setRoleDetails,
  setRoleEditing,
  updateRole,
} from "@/lib/Feature/RoleSlice";
import { useToast } from "@/lib/toastContext";
import Alert from "@/app/_components/Alert/Alert";

const CreateNewPermissionForExternalUserDialog = ({
  onClose,
  handleOpenPermissionSettingsDialog,
  handleOpenGrantRoleDialog,
}) => {
  const dispatch = useDispatch();

  // Get the current role data from the Redux store
  const {
    name,
    description,
    permissions,
    selectedUsersForRole,
    selectedGroupsForRole,
    loading,
    error,
    editing,
    editingRole,
  } = useSelector((state) => state.role);
  const [alert, setAlert] = useState(null);
  const [updateChangesOccured, setUpdateChangesOccured] = useState(false);
  const previousState = useRef({
    name,
    description,
    permissions,
    selectedUsersForRole,
    selectedGroupsForRole,
  });

  const deepEqual = (obj1, obj2) => {
    if (obj1 === obj2) return true;

    if (
      obj1 === null ||
      obj2 === null ||
      typeof obj1 !== "object" ||
      typeof obj2 !== "object"
    ) {
      return false;
    }

    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    if (keys1.length !== keys2.length) return false;

    for (const key of keys1) {
      if (!keys2.includes(key) || !deepEqual(obj1[key], obj2[key])) {
        return false;
      }
    }

    return true;
  };

  useEffect(() => {
    const currentState = {
      name,
      description,
      permissions,
      selectedUsersForRole,
      selectedGroupsForRole,
    };

    if (!deepEqual(previousState.current, currentState)) {
      setUpdateChangesOccured(true); // Changes occurred
    } else {
      setUpdateChangesOccured(false); // No changes occurred
    }
  }, [
    name,
    description,
    permissions,
    selectedUsersForRole,
    selectedGroupsForRole,
  ]);

  const createdBy = "Abdul Samad";

  const handleCreateRole = async () => {
    try {
      // Dispatch the action to create the role
      await dispatch(
        createRole({
          name,
          description,
          menuPermissions: permissions.menuPermissions,
          formPermissions: permissions.formPermissions,
          reportPermissions: permissions.reportPermissions,
          workflowPermissions: permissions.workflowPermissions,
          allotedUsers: selectedUsersForRole,
          allotedGroups: selectedGroupsForRole,
          createdBy,
        })
      ).unwrap(); // .unwrap() is used to catch errors in the thunk

      // If role creation is successful
      onClose();
      localStorage.removeItem("permissions");
      // Show success alert
      setAlert({ message: "Role created successfully!", type: "success" });
      setTimeout(() => setAlert(null), 3000); // Hide alert after 3 seconds
    } catch (error) {
      // Handle any errors that occurred during the role creation
      console.error("Error creating role:", error);
      // Show error alert
      setAlert({
        message: "Error creating role. Please try again.",
        type: "error",
      });
      setTimeout(() => setAlert(null), 3000); // Hide alert after 3 seconds
    }
  };

  const handleUpdateRole = async (role) => {
    try {
      await dispatch(
        updateRole({
          name,
          description,
          permissions,
          allotedUsers: selectedUsersForRole,
          allotedGroups: selectedGroupsForRole,
          id: role._id,
        })
      );
      onClose();
      localStorage.removeItem("permissions");
      dispatch(resetRole());
      dispatch(setRoleEditing(null));
      dispatch(setRoleEditing(false));
    } catch (error) {
      console.error("Error updating role:", error);
    }
  };

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
      {alert && (
        <Alert
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert(null)}
        />
      )}{" "}
      {/* Display the alert */}
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
      <div className="flex justify-end mt-2 gap-2 ">
        <button
          className="px-4 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-all"
          onClick={() => {
            onClose();
            dispatch(resetRole());
            dispatch(resetSelectedUsersAndGroups());
            localStorage.removeItem("permissions");
            dispatch(setRoleEditing(false));
          }}
        >
          Cancel
        </button>
        {editing ? (
          <button
            className="px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-all disabled:bg-neutral-400 disabled:cursor-not-allowed"
            disabled={
              name === "" || description === "" || !updateChangesOccured
            }
            onClick={() => {
              handleUpdateRole(editingRole);
            }}
          >
            {loading ? "Updating..." : "Update"}
          </button>
        ) : (
          <button
            className="px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-all disabled:bg-neutral-400 disabled:cursor-not-allowed"
            disabled={name === "" || description === ""}
            title={
              (name === "" || description === "" || loading) &&
              "Please Specify Role Name and Description"
            }
            onClick={handleCreateRole}
          >
            {loading ? "Creating..." : "Create"}
          </button>
        )}
      </div>
    </PermissionDialog>
  );
};

export default CreateNewPermissionForExternalUserDialog;
