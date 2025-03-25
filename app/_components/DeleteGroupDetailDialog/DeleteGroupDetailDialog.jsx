"use client";

import React, { useState, useEffect } from "react";
import { Transition } from "@headlessui/react";
import { FaPen, FaTimes } from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";
import { useSelector, useDispatch } from "react-redux";
import { AiOutlineSearch } from "react-icons/ai";
import { fetchUsers } from "@/lib/Feature/UserSlice";
import { fetchDeletedGroups, fetchGroups } from "@/lib/Feature/GroupSlice";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useNotify } from "@/lib/utils";
import GroupDetailsPanel from "@/app/(route)/group/ActiveGroups/_components/SideBarModel/SideBarModel";

const DeleteGroupDetailDialog = ({ group = {}, isOpen, onClose }) => {
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
  const [status, setStatus] = useState(group?.status || "active"); // New state for group status

  const users = useSelector((state) => state.user.users);
  const dispatch = useDispatch();
  const router = useRouter();
  const notify = useNotify();

  useEffect(() => {
    if (group) {
      setGroupName(group.groupName || "");
      setGroupDescription(group.groupDescription || "");
      setSelectedOwners(group.groupOwrnerID?.map((owner) => owner._id) || []);
      setSelectedMembers(
        group.groupTargetID?.map((member) => member._id) || []
      );
      setStatus(group.status || "active"); // Initialize status
    }
  }, [group]);

  const handleEditButtonClick = () => {
    setIsEditOpen(true);
  };

  const saveChanges = async () => {
    try {
      const response = await axios.put(`/api/Groups/deleteGroupStatusUpdate`, {
        groupId: group._id,
        groupName,
        groupDescription,
        groupOwrnerID: selectedOwners,
        groupTargetID: selectedMembers,
        status, // Include the updated status in the request
      });
      if (response.status === 200) {
        notify.success("Group updated successfully!");
        setIsEditOpen(false);
        onClose();
      }
      dispatch(fetchDeletedGroups());
      router.push("/group/ActiveGroups");
    } catch (error) {
      console.error("Error updating group:", error);
      notify.error("Error updating group.");
    }
  };

  const cancelChanges = () => {
    setIsEditOpen(false);
    onClose();
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
                className="w-full mt-2 p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-800 dark:text-white dark:border-neutral-700"
              ></textarea>
            </div>

            {/* Group Status */}
            <div className="mb-6">
              <label className="block text-lg font-medium text-gray-700 dark:text-white">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full mt-2 p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-800 dark:text-white dark:border-neutral-700"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            {/* Save Button */}
            <div className="flex justify-end gap-4">
              <button
                onClick={cancelChanges}
                className="px-6 py-2 text-lg bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={saveChanges}
                className="px-6 py-2 text-lg bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeleteGroupDetailDialog;
