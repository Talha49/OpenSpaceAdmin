import React, { useState } from "react";
import PermissionDialog from "../PermissionDialog/page";

const MainPermissionDialog = ({
  onClose,
  handleOpenPermissionSettingsDialog,
}) => {
  return (
    <PermissionDialog onClose={onClose}>
      <h1 className="text-2xl font-semibold my-4">Permission Role Details</h1>
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
              onChange={(e) => setRoleName(e.target.value)}
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
              onChange={(e) => setRoleDescription(e.target.value)}
              className="p-2 w-full sm:w-[350px] border rounded-lg focus:outline-2 outline-blue-500"
            />
          </div>
        </form>
      </div>
      <div className="shadow-md w-full px-4 py-1 my-2 border rounded">
        <h1 className="text-lg font-semibold">2. Permission Settings</h1>
        <div className="">
          <p>Specify what permissions users in this role should have</p>
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white transition-all px-2 py-1 my-2 rounded"
            onClick={handleOpenPermissionSettingsDialog}
          >
            Permissions...
          </button>
        </div>
      </div>
      <div className="shadow-md w-full px-4 py-1 my-2 border rounded">
        <h1 className="text-lg font-semibold">3. Grant This Role To...</h1>
        <div className="">
          <p>
            Select the group where you want to grant this role. You may have a
            group of users.
          </p>
          <button className="bg-blue-500 hover:bg-blue-600 text-white transition-all px-2 py-1 my-2 rounded">
            Add...
          </button>
        </div>
      </div>
    </PermissionDialog>
  );
};

export default MainPermissionDialog;
