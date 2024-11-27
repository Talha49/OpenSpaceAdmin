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

const DeleteGroupDetailDialog = ({ group = {}, isOpen, onClose }) => {
    const [showDetail, setShowDetail] = useState(false);
    const [showMembers, setShowMembers] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [groupName, setGroupName] = useState(group?.groupName || "");
    const [groupDescription, setGroupDescription] = useState(group?.groupDescription || "");
    const [selectedOwners, setSelectedOwners] = useState(group?.groupOwrnerID.map(owner => owner._id) || []);
    const [selectedMembers, setSelectedMembers] = useState(group?.groupTargetID.map(member => member._id) || []);
    const [status, setStatus] = useState(group?.status || "active");  // New state for group status

    const users = useSelector((state) => state.user.users);
    const dispatch = useDispatch();
    const router = useRouter();

    useEffect(() => {
        if (group) {
            setGroupName(group.groupName || "");
            setGroupDescription(group.groupDescription || "");
            setSelectedOwners(group.groupOwrnerID?.map(owner => owner._id) || []);
            setSelectedMembers(group.groupTargetID?.map(member => member._id) || []);
            setStatus(group.status || "active");  // Initialize status
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
                status,  // Include the updated status in the request
            });
            if (response.status === 200) {
                
                alert("Group updated successfully!");
                setIsEditOpen(false);
                onClose();
            }
            dispatch(fetchDeletedGroups());
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
                className="fixed top-[4rem] right-0 h-screen z-50"
            >
                <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-xl w-full max-w-md h-full overflow-y-auto fixed top-0 right-0 flex flex-col">
                    <div className="flex justify-between items-center p-4 border-b">
                        <h2 className="text-lg font-semibold dark:text-neutral-500">
                           Deleted Group Details
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
                        <div className="flex items-center justify-between">
                            <h1 className="text-2xl font-semibold dark:text-neutral-500">{group?.groupName}</h1>
                            <span className="text-sm bg-blue-500 px-3 py-1 rounded-full text-white">
                                {group?.groupType}
                            </span>
                        </div>

                        {/* Group Status */}
                        <div className="my-5">
                            <h1 className="text-xl font-semibold dark:text-neutral-500">Status</h1>
                            <span className="text-neutral-500 dark:text-neutral-300">{group?.status}</span>
                        </div>

                        {/* Description Section */}
                        <div className="my-5">
                            <h1
                                className={`flex items-center justify-between text-xl bg-gray-300 dark:bg-neutral-800 py-2 px-4 ${showDetail ? "rounded-t-lg" : "rounded-lg"
                                    } border dark:border-neutral-600 cursor-pointer`}
                                onClick={() => setShowDetail(!showDetail)}
                            >
                                Description
                                <span>
                                    <IoIosArrowDown className={`${showDetail && "rotate-180"} transition-all`} />
                                </span>
                            </h1>
                            {showDetail && (
                                <p className="text-neutral-500 p-2 bg-gray-100 dark:bg-neutral-800 rounded-b-lg">
                                    {group?.groupDescription}
                                </p>
                            )}
                        </div>
                        {/* Owners Section */}
                        <div className="bg-gray-300 dark:bg-neutral-800 p-2 rounded-lg my-5 text-white">
                            <div className="flex items-center gap-2">
                                <span className="px-2 py-1 rounded-full bg-gray-500 dark:bg-neutral-900">Owners</span>
                            </div>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {group?.groupOwrnerID.map(owner => (
                                    <div
                                        key={owner._id}
                                        className="px-3 py-1 rounded-full bg-blue-500 dark:bg-neutral-700 text-sm text-center"
                                    >
                                        {owner.fullName}
                                    </div>
                                ))}
                            </div>
                        </div>
                        {/* Members Section */}
                        <div className="my-5">
                            <h1
                                className={`flex items-center justify-between text-xl bg-gray-300 dark:bg-neutral-800 py-2 px-4 ${showMembers ? "rounded-t-lg" : "rounded-lg"
                                    } border dark:border-neutral-600 cursor-pointer`}
                                onClick={() => setShowMembers(!showMembers)}
                            >
                                Members
                                <span>
                                    <IoIosArrowDown className={`${showMembers && "rotate-180"} transition-all`} />
                                </span>
                            </h1>
                            {showMembers && (
                                <div className="text-neutral-500 p-2 bg-gray-100 dark:bg-neutral-800 rounded-b-lg">
                                    {group?.groupTargetID.map((member) => (
                                        <div key={member._id} className="p-2 border dark:border-neutral-700 my-1 rounded-lg">
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
            {isEditOpen && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-60 backdrop-blur-lg flex justify-center items-center z-50">
                    {/* Modal Container */}
                    <div className="bg-white dark:bg-neutral-900 p-8 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-auto shadow-xl transition-all duration-500 ease-in-out">
                        {/* Modal Header */}
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Edit Group Details</h2>
                            <button onClick={cancelChanges} className="text-neutral-500 hover:text-neutral-700">
                                <FaTimes className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Group Name */}
                        <div className="mb-6">
                            <label className="block text-lg font-medium text-gray-700 dark:text-white">Group Name</label>
                            <input
                                type="text"
                                value={groupName}
                                onChange={(e) => setGroupName(e.target.value)}
                                className="w-full mt-2 p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-800 dark:text-white dark:border-neutral-700"
                            />
                        </div>

                        {/* Group Description */}
                        <div className="mb-6">
                            <label className="block text-lg font-medium text-gray-700 dark:text-white">Group Description</label>
                            <textarea
                                value={groupDescription}
                                onChange={(e) => setGroupDescription(e.target.value)}
                                className="w-full mt-2 p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-800 dark:text-white dark:border-neutral-700"
                            ></textarea>
                        </div>

                        {/* Group Status */}
                        <div className="mb-6">
                            <label className="block text-lg font-medium text-gray-700 dark:text-white">Status</label>
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
                            <button onClick={cancelChanges} className="px-6 py-2 text-lg bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400">
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
