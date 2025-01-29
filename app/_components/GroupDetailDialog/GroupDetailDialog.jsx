"use client";

import React, { useState, useEffect } from "react";
import { Transition } from "@headlessui/react";
import { FaPen, FaTimes } from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";
import { useSelector, useDispatch } from "react-redux";
import { AiOutlineSearch } from "react-icons/ai";
import { fetchUsers } from "@/lib/Feature/UserSlice";
import { fetchGroups } from "@/lib/Feature/GroupSlice";
import axios from "axios";
import { useRouter } from "next/navigation";
const GroupDetailDialog = ({ group = {}, isOpen, onClose }) => {
  const [showDetail, setShowDetail] = useState(false);
  const [showMembers, setShowMembers] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [groupName, setGroupName] = useState(group?.groupName || "");
  const [groupDescription, setGroupDescription] = useState(
    group?.groupDescription || ""
  );
  const [selectedOwners, setSelectedOwners] = useState(
    group?.groupOwrnerID.map((owner) => owner._id) || []
  );
  const [selectedMembers, setSelectedMembers] = useState(
    group?.groupTargetID.map((member) => member._id) || []
  );
  // State for opening the owner/member dialogs
  const [isOwnerDialogOpen, setOwnerDialogOpen] = useState(false);
  const [isMemberDialogOpen, setMemberDialogOpen] = useState(false);
  const groups = useSelector((state) => state.group.groups); // Assuming you have a groups array in the Redux state
  // Search state for owner and member dialogs
  const [ownerSearch, setOwnerSearch] = useState("");
  const [memberSearch, setMemberSearch] = useState("");
  const router = useRouter();

  // Toggle the owner/member dialogs
  const openOwnerDialog = () => setOwnerDialogOpen(true);
  const closeOwnerDialog = () => setOwnerDialogOpen(false);

  const openMemberDialog = () => setMemberDialogOpen(true);
  const closeMemberDialog = () => setMemberDialogOpen(false);
  useEffect(() => {
    if (group) {
      setGroupName(group.groupName || "");
      setGroupDescription(group.groupDescription || "");
      setSelectedOwners(group.groupOwrnerID?.map((owner) => owner._id) || []);
      setSelectedMembers(
        group.groupTargetID?.map((member) => member._id) || []
      );
    }
  }, [group]); // This will run whenever 'group' prop changes

  const users = useSelector((state) => state.user.users);
  const dispatch = useDispatch();

  useEffect(() => {
    if (users.length === 0) {
      dispatch(fetchUsers());
    }
  }, [dispatch, users.length]);

  const handleEditButtonClick = () => {
    setIsEditOpen(true);
  };

  const handleUserSelect = (userId, type) => {
    if (type === "owner") {
      setSelectedOwners((prev) => {
        if (prev.includes(userId)) {
          return prev.filter((id) => id !== userId);
        } else {
          return [...prev, userId];
        }
      });
    } else if (type === "member") {
      setSelectedMembers((prev) => {
        if (prev.includes(userId)) {
          return prev.filter((id) => id !== userId);
        } else {
          return [...prev, userId];
        }
      });
    }
  };

  const saveChanges = async () => {
    try {
      const response = await axios.put(`/api/Groups/updateGroupDetail`, {
        groupId: group._id,
        groupName,
        groupDescription,
        groupOwrnerID: selectedOwners,
        groupTargetID: selectedMembers,
      });
      if (response.status === 200) {
        alert("Group updated successfully!");
        setIsEditOpen(false);
        onClose();
      }
      dispatch(fetchGroups());
      router.push("/group/ActiveGroups");
    } catch (error) {
      console.error("Error updating group:", error);
      alert("Error updating group.");
    }
  };

  const cancelChanges = () => {
    setIsEditOpen(false);
    onClose();
  };

  return (
    <div>
      {/* Main Group Details Modal */}
      <Transition
        show={isOpen}
        enter="transition-transform duration-300 ease-in-out"
        enterFrom="translate-x-full"
        enterTo="translate-x-0"
        leave="transition-transform duration-300 ease-in-out"
        leaveFrom="translate-x-0"
        leaveTo="translate-x-full"
        // className="fixed top-[4rem] right-0 h-screen z-50 "
      >
        <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-xl w-full max-w-md h-screen overflow-y-auto fixed top-0 right-0 z-50 flex flex-col">
          <div className="flex justify-between items-center p-4 border-b sticky top-0 bg-white dark:bg-neutral-900">
            <h2 className="text-lg font-semibold dark:text-neutral-500 overflow-y-auto">
              Group Details
              <button
                onClick={handleEditButtonClick}
                className="ml-2 border border-gray-100 text-blue-500 hover:text-blue-700 p-2 rounded-full"
              >
                <FaPen className="w-3 h-3" />
              </button>
            </h2>
            <button
              onClick={() => {
                onClose();
                setShowDetail(false);
                setShowMembers(false);
              }}
              className="text-neutral-500 hover:text-neutral-700"
            >
              <FaTimes className="w-5 h-5" />
            </button>
          </div>

          <div className="p-4">
            <div className="flex flex-col gap-2 items-center justify-between">
              <h1 className="text-2xl font-semibold dark:text-neutral-500">
                {group?.groupName}
              </h1>

              <span className="text-sm bg-blue-500 px-3 py-1 rounded-full text-white">
                {group?.groupType}
              </span>
            </div>

            {/* Owners Section */}
            <div className="bg-gray-300 dark:bg-neutral-800 p-2 rounded-lg my-5 text-white">
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 rounded-full bg-gray-500 dark:bg-neutral-900">
                  Owners
                </span>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {group?.groupOwrnerID.map((owner) => (
                  <div
                    key={owner._id}
                    className="px-3 py-1 rounded-full bg-blue-500 dark:bg-neutral-700 text-sm text-center"
                  >
                    {owner.fullName}
                  </div>
                ))}
              </div>
            </div>

            {/* Description Section */}
            <div className="my-5">
              <h1
                className={`flex items-center justify-between text-xl bg-gray-300 dark:bg-neutral-800 py-2 px-4 ${
                  showDetail ? "rounded-t-lg" : "rounded-lg"
                } border dark:border-neutral-600 cursor-pointer`}
                onClick={() => setShowDetail(!showDetail)}
              >
                Description
                <span>
                  <IoIosArrowDown
                    className={`${showDetail && "rotate-180"} transition-all`}
                  />
                </span>
              </h1>
              {showDetail && (
                <p className="text-neutral-500 p-2 bg-gray-100 dark:bg-neutral-800 rounded-b-lg">
                  {group?.groupDescription}
                </p>
              )}
            </div>

            {/* Members Section */}
            <div className="my-5">
              <h1
                className={`flex items-center justify-between text-xl bg-gray-300 dark:bg-neutral-800 py-2 px-4 ${
                  showMembers ? "rounded-t-lg" : "rounded-lg"
                } border dark:border-neutral-600 cursor-pointer`}
                onClick={() => setShowMembers(!showMembers)}
              >
                Members
                <span>
                  <IoIosArrowDown
                    className={`${showMembers && "rotate-180"} transition-all`}
                  />
                </span>
              </h1>
              {showMembers && (
                <div className="text-neutral-500 p-2 bg-gray-100 dark:bg-neutral-800 rounded-b-lg">
                  {group?.groupTargetID.map((member) => (
                    <div
                      key={member._id}
                      className="p-2 border dark:border-neutral-700 my-1 rounded-lg"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <p>{member.fullName}</p>
                        <p>{member.email}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </Transition>

      {/* Edit Group Modal with Background Blur */}
      {/* Edit Group Modal with Background Blur */}
      {isEditOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-60 backdrop-blur-lg flex justify-center items-center z-50">
          {/* Modal Container */}
          <div className="bg-white dark:bg-neutral-900 p-8 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-auto shadow-xl transition-all duration-500 ease-in-out">
            {/* Modal Header */}
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Edit Group Details
              </h2>
              <button
                onClick={cancelChanges}
                className="text-neutral-500 hover:text-neutral-700"
              >
                <FaTimes className="w-6 h-6" />
              </button>
            </div>

            {/* Group Name */}
            <div className="mb-6">
              <label className="block text-lg font-medium text-gray-700 dark:text-white">
                Group Name
              </label>
              <input
                type="text"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                className="w-full mt-2 p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-800 dark:text-white dark:border-neutral-700"
              />
            </div>

            {/* Group Description */}
            <div className="mb-6">
              <label className="block text-lg font-medium text-gray-700 dark:text-white">
                Group Description
              </label>
              <textarea
                value={groupDescription}
                onChange={(e) => setGroupDescription(e.target.value)}
                className="w-full mt-2 p-4 border border-gray-300 rounded-lg h-40 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-800 dark:text-white dark:border-neutral-700"
              />
            </div>

            {/* Owners Section */}
            <div className="flex justify-between items-center mb-6">
              <div className="flex flex-col">
                <label className="text-lg font-medium text-gray-700 dark:text-white">
                  Owners
                </label>
                <button
                  onClick={openOwnerDialog}
                  className="mt-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-500"
                >
                  Manage Owners
                </button>
                <span className="mt-1 text-sm text-gray-500 dark:text-gray-300">
                  {selectedOwners.length} owner
                  {selectedOwners.length !== 1 ? "s" : ""}
                </span>
              </div>
            </div>

            {/* Members Section */}
            <div className="flex justify-between items-center mb-6">
              <div className="flex flex-col">
                <label className="text-lg font-medium text-gray-700 dark:text-white">
                  Members
                </label>
                <button
                  onClick={openMemberDialog}
                  className="mt-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-500"
                >
                  Manage Members
                </button>
                <span className="mt-1 text-sm text-gray-500 dark:text-gray-300">
                  {selectedMembers.length} member
                  {selectedMembers.length !== 1 ? "s" : ""}
                </span>
              </div>
            </div>

            {/* Modal Action Buttons */}
            <div className="flex justify-end gap-6">
              <button
                onClick={saveChanges}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Save Changes
              </button>
              <button
                onClick={cancelChanges}
                className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Owner Dialog */}
      {isOwnerDialogOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-60 backdrop-blur-lg flex justify-center items-center z-50">
          <div className="bg-white dark:bg-neutral-900 p-8 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-auto shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Manage Owners
              </h3>
              <button
                onClick={closeOwnerDialog}
                className="text-neutral-500 hover:text-neutral-700"
              >
                <FaTimes className="w-6 h-6" />
              </button>
            </div>

            {/* Owner Search */}
            <div className="mb-6  dark:bg-gray-600 flex items-center bg-gray-100 p-3 rounded-lg">
              <AiOutlineSearch className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              <input
                type="text"
                placeholder="Search owners..."
                className="w-full ml-2 p-3 border-none bg-transparent dark:bg-gray-600 focus:outline-none text-gray-700 dark:text-white"
                onChange={(e) => setOwnerSearch(e.target.value)}
              />
            </div>

            {/* Owner List */}
            <div className="max-h-60 overflow-y-auto">
              {users
                .filter((user) =>
                  user.fullName
                    .toLowerCase()
                    .includes(ownerSearch.toLowerCase())
                )
                .map((user) => (
                  <div
                    key={user._id}
                    className="flex items-center gap-4 p-4 mb-4 bg-gray-50 rounded-lg shadow-md hover:bg-blue-50 dark:bg-neutral-800 dark:text-white dark:hover:bg-blue-600"
                  >
                    <input
                      type="checkbox"
                      checked={selectedOwners.includes(user._id)}
                      onChange={() => handleUserSelect(user._id, "owner")}
                      className="h-5 w-5 text-blue-500"
                    />
                    <span className="text-sm font-medium">{user.fullName}</span>
                  </div>
                ))}
            </div>

            <div className="mt-6 flex justify-end gap-6">
              <button
                onClick={closeOwnerDialog}
                className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Member Dialog */}
      {isMemberDialogOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-60 backdrop-blur-lg flex justify-center items-center z-50">
          <div className="bg-white dark:bg-neutral-900 p-8 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-auto shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Manage Members
              </h3>
              <button
                onClick={closeMemberDialog}
                className="text-neutral-500 hover:text-neutral-700"
              >
                <FaTimes className="w-6 h-6" />
              </button>
            </div>

            {/* Member Search */}
            <div className=" dark:bg-gray-600 mb-6 flex items-center bg-gray-100 p-3 rounded-lg">
              <AiOutlineSearch className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              <input
                type="text"
                placeholder="Search members..."
                className="w-full ml-2 p-3 border-none  dark:bg-gray-600 bg-transparent focus:outline-none text-gray-700 dark:text-white"
                onChange={(e) => setMemberSearch(e.target.value)}
              />
            </div>

            {/* Member List */}
            <div className="max-h-60 overflow-y-auto">
              {users
                .filter((user) =>
                  user.fullName
                    .toLowerCase()
                    .includes(memberSearch.toLowerCase())
                )
                .map((user) => (
                  <div
                    key={user._id}
                    className="flex items-center gap-4 p-4 mb-4 bg-gray-50 rounded-lg shadow-md hover:bg-blue-50 dark:bg-neutral-800 dark:text-white dark:hover:bg-blue-600"
                  >
                    <input
                      type="checkbox"
                      checked={selectedMembers.includes(user._id)}
                      onChange={() => handleUserSelect(user._id, "member")}
                      className="h-5 w-5 text-blue-500"
                    />
                    <span className="text-sm font-medium">{user.fullName}</span>
                  </div>
                ))}
            </div>

            <div className="mt-6 flex justify-end gap-6">
              <button
                onClick={closeMemberDialog}
                className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupDetailDialog;
