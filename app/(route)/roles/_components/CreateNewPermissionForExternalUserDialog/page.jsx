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
import { fetchUsers } from "@/lib/Feature/UserSlice";
import { fetchGroups } from "@/lib/Feature/GroupSlice";
import { useNotify } from "@/lib/utils";
import { useSession } from "next-auth/react";

const CreateNewPermissionForExternalUserDialog = ({
  onClose,
  handleOpenPermissionSettingsDialog,
  handleOpenGrantRoleDialog,
}) => {
  const dispatch = useDispatch();
  const notify = useNotify();

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

  const [isNoSelectedPermission, setIsNoSelectedPermission] = useState(false);
  const { users } = useSelector((state) => state.user);
  const { groups } = useSelector((state) => state.group);

  useEffect(() => {
    if (
      [
        "menuPermissions",
        "formPermissions",
        "reportPermissions",
        "workflowPermissions",
      ].some((key) => permissions[key].length === 0)
    ) {
      setIsNoSelectedPermission(true);
    } else {
      setIsNoSelectedPermission(false);
    }
  }, [permissions]);

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
    dispatch(fetchUsers());
    dispatch(fetchGroups());
  }, [dispatch]);

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
  const { data: session } = useSession();

  const createdBy = session?.user?.userData.fullName;

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
      notify.success("Role created successfully!");
    } catch (error) {
      // Handle any errors that occurred during the role creation
      console.error("Error creating role:", error);
      // Show error alert
      notify.error("Error creating role. Please try again.");
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
      notify.success("Role updated successfully!");
      onClose();
      localStorage.removeItem("permissions");
      dispatch(resetRole());
      dispatch(setRoleEditing(null));
      dispatch(setRoleEditing(false));
    } catch (error) {
      console.error("Error updating role:", error);
      notify.error("Error updating role. Please try again.");
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

  function capitalizeFirstLetter(input) {
    if (typeof input !== "string" || input.length === 0) {
      return input; // Return the input unchanged if it's not a valid string
    }
    return input.charAt(0).toUpperCase() + input.slice(1);
  }

  // console.log("permissions =>", permissions);

  return (
    <PermissionDialog onClose={onClose}>
      <h1 className="text-2xl font-semibold my-4 dark:text-neutral-300">
        Permission Role Details
      </h1>

      {/* Display the alert */}
      <div className="shadow-md w-full px-4 py-2 border dark:border-neutral-800 rounded">
        <h1 className="text-lg font-semibold dark:text-neutral-300">
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
        <h1 className="text-lg font-semibold dark:text-neutral-300">
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
          <div className="border dark:border-neutral-700 p-4 rounded-lg shadow-md mb-2 dark:text-neutral-300">
            <h1 className="font-semibold">Selected Permissions</h1>
            <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-2 ">
              {/* Menu Permissions */}
              <div className="max-h-[300px] overflow-y-auto custom-scrollbar border dark:border-neutral-700 rounded-lg p-2 bg-neutral-100 dark:bg-neutral-900">
                <h1 className="font-semibold">Menu Permissions</h1>
                {Object.keys(permissions.menuPermissions).length === 0 ? (
                  <p className="text-sm">No permissions selected</p>
                ) : (
                  Object.keys(permissions.menuPermissions).map((menuKey, i) => {
                    const includedMenus = permissions.menuPermissions[
                      menuKey
                    ].filter((menu) => menu.included);
                    return (
                      <div key={i}>
                        <p className="font-medium">{menuKey}:</p>
                        {includedMenus.length > 0 ? (
                          <ul className="ml-6 list-disc">
                            {includedMenus.map((menu, j) => (
                              <li key={j}>{menu.name}</li>
                            ))}
                          </ul>
                        ) : (
                          <p className="ml-6 text-sm text-gray-500">
                            No included menus
                          </p>
                        )}
                      </div>
                    );
                  })
                )}
              </div>

              {/* Form Permissions */}
              <div className="max-h-[300px] overflow-y-auto custom-scrollbar border dark:border-neutral-700 rounded-lg p-2 bg-neutral-100 dark:bg-neutral-900">
                <h1 className="font-semibold">Form Permissions</h1>
                {Object.values(permissions.formPermissions).length === 0 ? (
                  <p className="text-sm">No form permissions selected</p>
                ) : (
                  Object.values(permissions.formPermissions).map((form, i) => {
                    const visibleTabs = Object.values(form?.tabs || {}).filter(
                      (tab) => tab?.view
                    );
                    return (
                      <div key={i}>
                        <p className="font-medium">{form.name}</p>
                        {visibleTabs.length > 0 ? (
                          <ul className="ml-6 list-disc">
                            {visibleTabs.map((tab, j) => (
                              <li key={j}>{tab.name}</li>
                            ))}
                          </ul>
                        ) : (
                          <p className="ml-6 text-sm text-gray-500">
                            No visible tabs
                          </p>
                        )}
                      </div>
                    );
                  })
                )}
              </div>

              {/* Report Permissions */}
              <div className="max-h-[300px] overflow-y-auto custom-scrollbar border dark:border-neutral-700 rounded-lg p-2 bg-neutral-100 dark:bg-neutral-900">
                <h1 className="font-semibold">Report Permissions</h1>
                {permissions.reportPermissions.length === 0 ? (
                  <p className="text-sm">No report permissions selected</p>
                ) : (
                  permissions.reportPermissions
                    .filter((report) => report.included)
                    .map((report, i) => {
                      const includedSubReports =
                        report?.subReports?.filter(
                          (subreport) => subreport.included
                        ) || [];
                      return (
                        <div key={i} className="mb-4">
                          {/* Report Name */}
                          <p className="font-medium">{report.name}</p>

                          {/* Sub-Reports */}
                          {includedSubReports.length > 0 ? (
                            <ul className="ml-6 list-disc">
                              {includedSubReports.map((subreport, j) => (
                                <li key={j} className="mb-2">
                                  {/* Sub-Report Name */}
                                  <p>{subreport?.name}</p>

                                  {/* Sub-Report Permissions */}
                                  <div className="flex items-center gap-2 ml-6">
                                    {subreport.view && (
                                      <span className="bg-blue-600 text-white px-2 py-1 text-xs rounded">
                                        View
                                      </span>
                                    )}
                                    {subreport.expport && (
                                      <span className="bg-blue-600 text-white px-2 py-1 text-xs rounded">
                                        Export
                                      </span>
                                    )}
                                    {subreport.generate && (
                                      <span className="bg-blue-600 text-white px-2 py-1 text-xs rounded">
                                        Generate
                                      </span>
                                    )}
                                  </div>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="ml-6 text-sm text-gray-500">
                              No sub-reports included
                            </p>
                          )}
                        </div>
                      );
                    })
                )}
              </div>

              {/* Workflow Permissions */}
              <div className="max-h-[300px] overflow-y-auto custom-scrollbar border dark:border-neutral-700 rounded-lg p-2 bg-neutral-100 dark:bg-neutral-900">
                <h1 className="font-semibold">Workflow Permissions</h1>
                {permissions.workflowPermissions.length === 0 ? (
                  <p className="text-sm">No workflow permissions available</p>
                ) : (
                  <ul className="list-disc ml-4">
                    {permissions.workflowPermissions.map((diagram, i) => (
                      <li key={i} className="text-sm mb-2">
                        {/* Diagram Name */}
                        <p className="font-medium">{diagram.name}</p>

                        {/* Diagram Permissions */}
                        <div className="flex items-center gap-2 ml-6">
                          {diagram.view && (
                            <span className="bg-blue-600 text-white px-2 py-1 text-xs rounded">
                              View
                            </span>
                          )}
                          {diagram.create && (
                            <span className="bg-blue-600 text-white px-2 py-1 text-xs rounded">
                              Create
                            </span>
                          )}
                          {diagram.edit && (
                            <span className="bg-blue-600 text-white px-2 py-1 text-xs rounded">
                              Edit
                            </span>
                          )}
                          {diagram.delete && (
                            <span className="bg-blue-600 text-white px-2 py-1 text-xs rounded">
                              Delete
                            </span>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="shadow-md w-full px-4 py-1 my-2 border dark:border-neutral-800 rounded">
        <h1 className="text-lg font-semibold dark:text-neutral-300">
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
          <div className="grid md:grid-cols-2 grid-cols-1 gap-2 dark:text-neutral-300">
            <div className="border dark:border-neutral-700 p-4 rounded-lg shadow-md mb-2 bg-neutral-100 dark:bg-neutral-900">
              <h1 className="font-semibold">Selected Indivisual Users</h1>
              <div>
                {selectedUsersForRole.length === 0 && (
                  <p className="text-sm">No indivisual user selected</p>
                )}
                <div>
                  {users
                    .filter((item) => selectedUsersForRole.includes(item._id))
                    .map((user, i) => (
                      <div key={i} className="flex items-center gap-1">
                        <li className="list-disc ml-6">{user?.fullName}</li>
                      </div>
                    ))}
                </div>
              </div>
            </div>
            <div className="border dark:border-neutral-700 p-4 rounded-lg shadow-md mb-2 bg-neutral-100 dark:bg-neutral-900">
              <h1 className="font-semibold">Selected Group</h1>
              {selectedGroupsForRole.length === 0 && (
                <p className="text-sm">No group selected</p>
              )}
              <div>
                {groups
                  .filter((item) => selectedGroupsForRole.includes(item._id))
                  .map((group, i) => (
                    <div key={i} className="flex items-center gap-1">
                      <li className="list-disc ml-6">{group?.groupName}</li>
                    </div>
                  ))}
              </div>
            </div>
          </div>
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
