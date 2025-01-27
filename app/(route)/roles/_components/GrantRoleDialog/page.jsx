"use client";
import React, { useEffect, useState } from "react";
import PermissionDialog from "../PermissionDialog/page";
import Image from "next/image";
import { IoIosSearch, IoMdArrowBack } from "react-icons/io";
import { useSelector, useDispatch } from "react-redux";
import { fetchUsers } from "@/lib/Feature/UserSlice";
import { fetchGroups } from "@/lib/Feature/GroupSlice";
import {
  setSelectedGroupsForRole,
  setSelectedUsersForRole,
} from "@/lib/Feature/RoleSlice";

const GrantRoleDialog = ({ onClose }) => {
  const { users } = useSelector((state) => state.user);
  const { groups } = useSelector((state) => state.group);
  const { selectedUsersForRole, selectedGroupsForRole } = useSelector(
    (state) => state.role
  );
  const [initialUsers, setInitialUsers] = useState([]);
  const [initialGroups, setInitialGroups] = useState([]);
  const dispatch = useDispatch();

  console.log("selectedUsersForRole", selectedUsersForRole);

  const [isOpenUserDropdown, setIsOpenUserDropdown] = useState(false);
  const [isOpenGroupDropdown, setIsOpenGroupDropdown] = useState(false);
  const [userSearch, setUserSearch] = useState(""); // State for user search query
  const [groupSearch, setGroupSearch] = useState(""); // State for group search query

  useEffect(() => {
    dispatch(fetchUsers());
    dispatch(fetchGroups());
  }, [dispatch]);

  useEffect(() => {
    setInitialUsers([...selectedUsersForRole]);
    setInitialGroups([...selectedGroupsForRole]);
  }, []);

  // Capitalize the first letter of each word in the string
  function capitalizeFirstLetter(str) {
    return str.replace(/\b\w/g, function (char) {
      return char.toUpperCase();
    });
  }

  // Handle the change of checkbox by user._id
  const handleUserSelection = (userId) => {
    const updatedUsers = selectedUsersForRole.includes(userId)
      ? selectedUsersForRole.filter((id) => id !== userId)
      : [...selectedUsersForRole, userId];
    dispatch(setSelectedUsersForRole(updatedUsers)); // Directly update Redux state
  };

  // Handle the change of checkbox by group._id
  const handleGroupSelection = (groupId) => {
    const updatedGroups = selectedGroupsForRole.includes(groupId)
      ? selectedGroupsForRole.filter((id) => id !== groupId)
      : [...selectedGroupsForRole, groupId];
    dispatch(setSelectedGroupsForRole(updatedGroups)); // Directly update Redux state
  };

  // Filter users based on search query
  const filteredUsers = users.filter((user) =>
    user.fullName.toLowerCase().includes(userSearch.toLowerCase())
  );

  console.log("filteredUsers", filteredUsers);

  // Filter groups based on search query
  const filteredGroups = groups.filter((group) =>
    group.groupName.toLowerCase().includes(groupSearch.toLowerCase())
  );

  // Handle Cancel button click
  const handleCancel = () => {
    // Clear selected users and groups
    dispatch(setSelectedUsersForRole(initialUsers));
    dispatch(setSelectedGroupsForRole(initialGroups));
    // Close the dialog
    onClose();
  };

  // Handle Done button click
  const handleDone = () => {
    // Validate if at least one user or group is selected
    // if (selectedUsersForRole.length === 0 && selectedGroupsForRole.length === 0) {
    //   alert("Please select at least one user or group before proceeding.");
    //   return;
    // }

    // Close all dropdowns
    setIsOpenUserDropdown(false);
    setIsOpenGroupDropdown(false);

    // You can add additional logic here to save the selections or perform other actions
    // For example, you might want to make an API call to update permissions

    // Close the dialog
    onClose();
  };

  return (
    <PermissionDialog onClose={onClose}>
      <div
        className="flex items-center gap-2 absolute top-3 left-3 text-blue-500 cursor-pointer"
        onClick={onClose}
      >
        <span className="flex items-center justify-center bg-blue-100 dark:bg-neutral-800 w-8 h-8 rounded-full hover:bg-blue-200 dark:hover:bg-neutral-700 transition-all">
          <IoMdArrowBack />
        </span>
        <span className="text-sm">Permission Role Details</span>
      </div>
      <div className="text-center bg-gray-200 dark:bg-neutral-800 rounded border dark:border-neutral-700 dark:text-neutral-500 mt-10">
        <h1 className="text-lg font-semibold p-2">Grant This Role To...</h1>
      </div>
      <div className="my-2">
        <div className=" border dark:border-neutral-700 shadow-md rounded-lg p-2 mb-3">
          <h1 className="font-bold dark:text-neutral-500">
            1. Define whom you want to grant this role permission to.
          </h1>
          <div className="flex gap-3 my-4">
            <div className="px-10">
              <Image
                src="/images/output-onlinegiftools.gif"
                alt="img"
                width={100}
                height={100}
              />
            </div>
            <div className="flex flex-col">
              <label>Target Users</label>
              <div className="relative">
                <button
                  onClick={() => {
                    setIsOpenUserDropdown(!isOpenUserDropdown);
                  }}
                  className="w-[350px] px-2 py-1 mt-1 outline focus:outline-2 outline-blue-500 rounded-lg text-left"
                >
                  {selectedUsersForRole?.length === 0
                    ? "Select users"
                    : `${selectedUsersForRole?.length} user(s) selected`}
                </button>

                {isOpenUserDropdown && (
                  <div className="absolute z-10 w-[350px] max-h-60 overflow-y-auto custom-scrollbar mt-1 bg-white dark:bg-neutral-800 border dark:border-neutral-900 rounded-lg">
                    <span className="flex items-center w-full border px-2 py-1 mb-1 rounded-t-lg sticky top-0 z-10 bg-white dark:bg-neutral-800">
                      <input
                        type="search"
                        placeholder="Start typing user name"
                        className="w-full focus:outline-none placeholder:text-sm text-sm"
                        value={userSearch}
                        onChange={(e) => setUserSearch(e.target.value)}
                      />
                      <IoIosSearch />
                    </span>
                    {filteredUsers.map((user) => (
                      <div
                        key={user._id}
                        className="flex items-center gap-3 py-1 cursor-pointer hover:bg-blue-100 dark:hover:bg-neutral-900 rounded px-1"
                      >
                        <input
                          type="checkbox"
                          id={`user-${user._id}`}
                          checked={selectedUsersForRole?.includes(user._id)}
                          onChange={() => handleUserSelection(user._id)}
                          className="custom-circle-checkbox"
                        />
                        <label htmlFor={`user-${user._id}`} className="text-sm">
                          {capitalizeFirstLetter(user.fullName)}
                        </label>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="border dark:border-neutral-700 rounded-lg shadow-md p-2">
          <h1 className="font-bold dark:text-neutral-500">
            2. Define group you want to grant this role permission to.
          </h1>
          <div className="flex gap-3 my-4">
            <div className="px-10">
              <Image
                src="/images/group-no-bg.gif"
                alt="img"
                width={100}
                height={100}
              />
            </div>
            <div className="flex flex-col">
              <label>Target Groups</label>
              <div className="relative">
                <button
                  onClick={() => {
                    setIsOpenGroupDropdown(!isOpenGroupDropdown);
                  }}
                  className="w-[350px] px-2 py-1 mt-1 outline focus:outline-2 outline-blue-500 rounded-lg text-left"
                >
                  {selectedGroupsForRole?.length === 0
                    ? "Select groups"
                    : `${selectedGroupsForRole?.length} group(s) selected`}
                </button>

                {isOpenGroupDropdown && (
                  <div className="absolute z-10 w-[350px] max-h-60 overflow-y-auto custom-scrollbar mt-1 bg-white dark:bg-neutral-800 border dark:border-neutral-900 rounded-lg">
                    <span className="flex items-center w-full border px-2 py-1 mb-1 rounded-t-lg sticky top-0 z-10 bg-white dark:bg-neutral-800">
                      <input
                        type="search"
                        placeholder="Start typing group name"
                        className="w-full focus:outline-none placeholder:text-sm text-sm"
                        value={groupSearch}
                        onChange={(e) => setGroupSearch(e.target.value)}
                      />
                      <IoIosSearch />
                    </span>
                    {filteredGroups.map((group) => (
                      <div
                        key={group._id}
                        className="flex items-center gap-3 px-2 py-1 cursor-pointer hover:bg-blue-100 dark:hover:bg-neutral-900"
                      >
                        <input
                          type="checkbox"
                          id={`group-${group._id}`}
                          checked={selectedGroupsForRole.includes(group._id)}
                          onChange={() => handleGroupSelection(group._id)}
                          className="custom-circle-checkbox"
                        />
                        <label
                          htmlFor={`group-${group._id}`}
                          className="text-sm"
                        >
                          {capitalizeFirstLetter(group.groupName)}
                        </label>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-end gap-2 w-full mt-4 px-4">
        <button
          onClick={handleCancel}
          className="bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-600 transition-all px-2 py-1 min-w-20 rounded-lg"
        >
          Cancel
        </button>
        <button
          onClick={handleDone}
          className="bg-blue-500 hover:bg-blue-600 text-white transition-all px-2 py-1 min-w-20 rounded-lg"
        >
          Done
        </button>
      </div>
    </PermissionDialog>
  );
};

export default GrantRoleDialog;
