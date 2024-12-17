"use client";
import React, { useEffect, useState } from "react";
import PermissionDialog from "../PermissionDialog/page";
import Image from "next/image";
import { IoMdArrowBack } from "react-icons/io";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { fetchUsers } from "@/lib/Feature/UserSlice";
import { fetchGroups } from "@/lib/Feature/GroupSlice";

const GrantRoleDialog = ({ onClose }) => {
  const { users } = useSelector((state) => state.user);
  const { groups } = useSelector((state) => state.group);
  const dispatch = useDispatch();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedGroups, setSelectedGroups] = useState([]);
  const [isOpenUserDropdown, setIsOpenUserDropdown] = useState(false);
  const [isOpenGroupDropdown, setIsOpenGroupDropdown] = useState(false);

  console.log("Selected users =>", selectedUsers);
  console.log("Selected groups =>", selectedGroups);

  // Capitalize the first letter of each word in the string
  function capitalizeFirstLetter(str) {
    return str.replace(/\b\w/g, function (char) {
      return char.toUpperCase();
    });
  }

  // Handle the change of checkbox by user._id
  const handleUserSelection = (userId) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  // Handle the change of checkbox by group._id
  const handleGroupSelection = (groupId) => {
    setSelectedGroups((prev) =>
      prev.includes(groupId)
        ? prev.filter((id) => id !== groupId)
        : [...prev, groupId]
    );
  };

  useEffect(() => {
    dispatch(fetchUsers());
    dispatch(fetchGroups());
  }, [dispatch]);

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
            1. Define whome you want to grant this role permission to.
          </h1>
          <div className="flex gap-3 my-4">
            <div className="px-10">
              <Image
                src="/images/output-onlinegiftools.gif"
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
                  {selectedUsers.length === 0
                    ? "Select users"
                    : `${selectedUsers.length} user(s) selected`}
                </button>

                {isOpenUserDropdown && (
                  <div className="absolute z-10 w-[350px] max-h-60 overflow-y-auto custom-scrollbar mt-1 bg-white dark:bg-neutral-800 border dark:border-neutral-900 rounded-lg">
                    {users.map((user) => (
                      <div
                        key={user._id} // Use user._id as the key
                        className="flex items-center gap-3 px-2 py-1 cursor-pointer hover:bg-blue-100 dark:hover:bg-neutral-900"
                      >
                        <input
                          type="checkbox"
                          id={`user-${user._id}`} // Use user._id for the checkbox ID
                          checked={selectedUsers.includes(user._id)} // Check if user._id is in selectedUsers
                          onChange={() => handleUserSelection(user._id)} // Pass user._id to the handler
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
              <Image src="/images/group-no-bg.gif" width={100} height={100} />
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
                  {selectedGroups.length === 0
                    ? "Select groups"
                    : `${selectedGroups.length} group(s) selected`}
                </button>

                {isOpenGroupDropdown && (
                  <div className="absolute z-10 w-[350px] max-h-60 overflow-y-auto custom-scrollbar mt-1 bg-white dark:bg-neutral-800 border dark:border-neutral-900 rounded-lg">
                    {groups.map((group) => (
                      <div
                        key={group._id} // Use group._id as the key
                        className="flex items-center gap-3 px-2 py-1 cursor-pointer hover:bg-blue-100 dark:hover:bg-neutral-900"
                      >
                        <input
                          type="checkbox"
                          id={`group-${group._id}`} // Use group._id for the checkbox ID
                          checked={selectedGroups.includes(group._id)} // Check if group._id is in selectedGroups
                          onChange={() => handleGroupSelection(group._id)} // Pass group._id to the handler
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
    </PermissionDialog>
  );
};

export default GrantRoleDialog;
