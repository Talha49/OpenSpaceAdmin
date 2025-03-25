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
import { useNotify } from "@/lib/utils";
import GroupDetailsPanel from "@/app/(route)/group/ActiveGroups/_components/SideBarModel/SideBarModel";
import Image from "next/image";
import Loader from "../Loader/Loader";
const GroupDetailDialog = ({ group = {}, isOpen, onClose }) => {
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
  const [showOwnersRow, setShowOwnersRow] = useState(false);
  const [showMembersRow, setShowMembersRow] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

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
  const notify = useNotify();

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
      setIsSaving(true);
      const response = await axios.put(`/api/Groups/updateGroupDetail`, {
        groupId: group._id,
        groupName,
        groupDescription,
        groupOwrnerID: selectedOwners,
        groupTargetID: selectedMembers,
      });
      if (response.status === 200) {
        notify.success("Group updated successfully!");
        setIsEditOpen(false);
        onClose();
        setShowMembersRow(false);
        setShowOwnersRow(false);
        setSelectedOwners(group?.groupOwrnerID.map((owner) => owner._id) || []);
        setSelectedMembers(
          group?.groupTargetID.map((member) => member._id) || []
        );
      }
      dispatch(fetchGroups());
      router.push("/group/ActiveGroups");
    } catch (error) {
      console.error("Error updating group:", error);
      notify.error("Error updating group.");
    } finally {
      setIsSaving(false);
    }
  };

  const cancelChanges = () => {
    setIsEditOpen(false);
    onClose();
    setShowMembersRow(false);
    setShowOwnersRow(false);
    setSelectedOwners(group?.groupOwrnerID.map((owner) => owner._id) || []);
    setSelectedMembers(group?.groupTargetID.map((member) => member._id) || []);
  };

  return (
    <div>
      {/* Main Group Details Modal */}

      <GroupDetailsPanel
        isOpen={isOpen}
        onClose={onClose}
        group={group}
        handleEditButtonClick={handleEditButtonClick}
      />

      {/* Edit Group Modal with Background Blur */}
      {/* Edit Group Modal with Background Blur */}
      {isEditOpen && (
        <div className="fixed top-0 left-0 h-screen bg-black/40 w-full flex justify-center items-center z-50">
          {/* Modal Container */}
          <div className="bg-white dark:bg-neutral-900 p-8 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-auto shadow-xl transition-all duration-500 ease-in-out">
            {/* Modal Header */}
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-semibold text-neutral-900 dark:text-white">
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
              <label className="block text-lg font-medium text-neutral-700 dark:text-white">
                Group Name
              </label>
              <input
                type="text"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                className="w-full mt-2 p-4 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-800 dark:text-white dark:border-neutral-700"
              />
            </div>

            {/* Group Description */}
            <div className="mb-6">
              <label className="block text-lg font-medium text-neutral-700 dark:text-white">
                Group Description
              </label>
              <textarea
                value={groupDescription}
                onChange={(e) => setGroupDescription(e.target.value)}
                className="w-full mt-2 p-4 border border-neutral-300 rounded-lg h-40 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-800 dark:text-white dark:border-neutral-700"
              />
            </div>

            {/* Owners Section */}
            <div className="flex justify-between items-center mb-6">
              <div className="flex flex-col items-start">
                <label className="text-lg font-medium text-neutral-700 dark:text-white">
                  Owners
                </label>
                <button
                  onClick={openOwnerDialog}
                  className="mt-2 hover:underline text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-500"
                >
                  Manage Owners
                </button>
                <button
                  onClick={() => setShowOwnersRow(!showOwnersRow)}
                  className="mt-1 text-sm text-neutral-500 dark:text-neutral-300 hover:underline cursor-pointer"
                >
                  {selectedOwners.length} owner
                  {selectedOwners.length !== 1 ? "s" : ""}
                </button>
                {showOwnersRow && (
                  <div className="flex items-center gap-3 flex-wrap mt-4">
                    {users
                      .filter((user) => selectedOwners.includes(user?._id))
                      .map((user) => (
                        <span
                          key={user?._id}
                          className="flex items-center gap-2 py-2 pl-2 pr-4 rounded-full bg-blue-600/10 border border-blue-600"
                        >
                          <Image
                            src={user?.image || "/images/avatar.png"}
                            width={30}
                            height={30}
                            className="rounded-full"
                          />
                          <span>{user?.fullName}</span>
                        </span>
                      ))}
                  </div>
                )}
              </div>
            </div>

            {/* Members Section */}
            <div className="flex justify-between items-center mb-6">
              <div className="flex flex-col items-start">
                <label className="text-lg font-medium text-neutral-700 dark:text-white">
                  Members
                </label>
                <button
                  onClick={openMemberDialog}
                  className="mt-2 hover:underline text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-500"
                >
                  Manage Members
                </button>
                <button
                  onClick={() => setShowMembersRow(!showMembersRow)}
                  className="mt-1 cursor-pointer hover:underline text-sm text-neutral-500 dark:text-neutral-300"
                >
                  {selectedMembers.length} member
                  {selectedMembers.length !== 1 ? "s" : ""}
                </button>
                {showMembersRow && (
                  <div className="flex items-center gap-3 flex-wrap mt-4">
                    {users
                      .filter((user) => selectedMembers.includes(user?._id))
                      .map((user) => (
                        <span
                          key={user?._id}
                          className="flex items-center gap-2 py-2 pl-2 pr-4 rounded-full bg-blue-600/10 border border-blue-600"
                        >
                          <Image
                            src={user?.image || "/images/avatar.png"}
                            width={30}
                            height={30}
                            className="rounded-full"
                          />
                          <span>{user?.fullName}</span>
                        </span>
                      ))}
                  </div>
                )}
              </div>
            </div>

            {/* Modal Action Buttons */}
            <div className="flex justify-end gap-6">
              <button
                onClick={cancelChanges}
                className="bg-neutral-600 text-white px-6 py-2 rounded-lg hover:bg-neutral-500 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={saveChanges}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-500 transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Owner Dialog */}
      {isOwnerDialogOpen && (
        <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50">
          <div className="bg-white dark:bg-neutral-900 p-8 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-auto shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-neutral-900 dark:text-white">
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
            <div className="mb-6  dark:bg-neutral-600 flex items-center bg-neutral-100 p-3 rounded-lg">
              <AiOutlineSearch className="w-5 h-5 text-neutral-600 dark:text-neutral-300" />
              <input
                type="text"
                placeholder="Search owners..."
                className="w-full ml-2 p-3 border-none bg-transparent dark:bg-neutral-600 focus:outline-none text-neutral-700 dark:text-white"
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
                    className="flex items-center gap-4 p-4 mb-4 bg-neutral-50 rounded-lg shadow-md hover:bg-blue-50 dark:bg-neutral-800 dark:text-white dark:hover:bg-blue-600"
                  >
                    <input
                      type="checkbox"
                      checked={selectedOwners.includes(user._id)}
                      onChange={() => handleUserSelect(user._id, "owner")}
                      className="h-5 w-5 text-blue-500"
                    />
                    <div className="flex items-center gap-2">
                      <Image
                        src={user?.image || "/images/avatar.png"}
                        width={30}
                        height={30}
                        className="rounded-full"
                      />
                      <span className="text-sm font-medium">
                        {user.fullName}
                      </span>
                    </div>
                  </div>
                ))}
            </div>

            <div className="mt-6 flex justify-end gap-6">
              <button
                onClick={closeOwnerDialog}
                className="bg-blue-600 hover:bg-blue-500 transition-all text-white px-6 py-2 rounded-lg"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Member Dialog */}
      {isMemberDialogOpen && (
        <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50">
          <div className="bg-white dark:bg-neutral-900 p-8 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-auto shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-neutral-900 dark:text-white">
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
            <div className=" dark:bg-neutral-600 mb-6 flex items-center bg-neutral-100 p-3 rounded-lg">
              <AiOutlineSearch className="w-5 h-5 text-neutral-600 dark:text-neutral-300" />
              <input
                type="text"
                placeholder="Search members..."
                className="w-full ml-2 p-3 border-none  dark:bg-neutral-600 bg-transparent focus:outline-none text-neutral-700 dark:text-white"
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
                    className="flex items-center gap-4 p-4 mb-4 bg-neutral-50 rounded-lg shadow-md hover:bg-blue-50 dark:bg-neutral-800 dark:text-white dark:hover:bg-blue-600"
                  >
                    <input
                      type="checkbox"
                      checked={selectedMembers.includes(user._id)}
                      onChange={() => handleUserSelect(user._id, "member")}
                      className="h-5 w-5 text-blue-500"
                    />
                    <div className="flex items-center gap-2">
                      <Image
                        src={user?.image || "/images/avatar.png"}
                        width={30}
                        height={30}
                        className="rounded-full"
                      />
                      <span className="text-sm font-medium">
                        {user.fullName}
                      </span>
                    </div>
                  </div>
                ))}
            </div>

            <div className="mt-6 flex justify-end gap-6">
              <button
                onClick={closeMemberDialog}
                className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
      {isSaving && <Loader />}
    </div>
  );
};

export default GroupDetailDialog;
