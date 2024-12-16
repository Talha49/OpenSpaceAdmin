import React, { useState } from "react";
import { FaUserPlus, FaTrashAlt, FaSave } from "react-icons/fa";

const GroupManagementModal = ({ group, onClose }) => {
  const [groupName, setGroupName] = useState(group?.groupName || "");
  const [description, setDescription] = useState(group?.description || "");
  const [owners, setOwners] = useState(group?.groupOwrnerID || []);
  const [members, setMembers] = useState(group?.groupTargetID || []);
  const [newOwner, setNewOwner] = useState("");
  const [newMember, setNewMember] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);

    // Simulate saving the group (replace with actual API call or Redux dispatch)
    setTimeout(() => {
      console.log("Group Updated:", {
        groupName,
        description,
        owners,
        members,
      });
      setIsSaving(false);
      onClose(); // Close the modal after saving
    }, 1000);
  };

  const handleAddOwner = () => {
    if (newOwner && !owners.includes(newOwner)) {
      setOwners([...owners, newOwner]);
      setNewOwner("");
    }
  };

  const handleRemoveOwner = (owner) => {
    setOwners(owners.filter((item) => item !== owner));
  };

  const handleAddMember = () => {
    if (newMember && !members.includes(newMember)) {
      setMembers([...members, newMember]);
      setNewMember("");
    }
  };

  const handleRemoveMember = (member) => {
    setMembers(members.filter((item) => item !== member));
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-lg">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Manage Group</h2>
          <button
            className="text-gray-500 hover:text-gray-700"
            onClick={onClose}
          >
            &times;
          </button>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-semibold">Group Name</label>
          <input
            type="text"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            className="w-full p-2 mt-2 border border-gray-300 rounded"
          />
        </div>

        <div className="mt-4">
          <label className="block text-sm font-semibold">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 mt-2 border border-gray-300 rounded"
            rows="4"
          />
        </div>

        {/* Owners Section */}
        <div className="mt-6">
          <label className="block text-sm font-semibold">Group Owners</label>
          <div className="mt-2">
            {owners.length > 0 ? (
              <ul>
                {owners.map((owner, index) => (
                  <li key={index} className="flex justify-between items-center">
                    <span>{owner}</span>
                    <button
                      className="text-red-500 hover:text-red-700"
                      onClick={() => handleRemoveOwner(owner)}
                    >
                      <FaTrashAlt />
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No owners added.</p>
            )}
            <div className="flex items-center mt-4">
              <input
                type="text"
                placeholder="Add new owner"
                value={newOwner}
                onChange={(e) => setNewOwner(e.target.value)}
                className="p-2 border border-gray-300 rounded"
              />
              <button
                className="ml-2 text-blue-500 hover:text-blue-700"
                onClick={handleAddOwner}
              >
                <FaUserPlus />
              </button>
            </div>
          </div>
        </div>

        {/* Members Section */}
        <div className="mt-6">
          <label className="block text-sm font-semibold">Group Members</label>
          <div className="mt-2">
            {members.length > 0 ? (
              <ul>
                {members.map((member, index) => (
                  <li key={index} className="flex justify-between items-center">
                    <span>{member}</span>
                    <button
                      className="text-red-500 hover:text-red-700"
                      onClick={() => handleRemoveMember(member)}
                    >
                      <FaTrashAlt />
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No members added.</p>
            )}
            <div className="flex items-center mt-4">
              <input
                type="text"
                placeholder="Add new member"
                value={newMember}
                onChange={(e) => setNewMember(e.target.value)}
                className="p-2 border border-gray-300 rounded"
              />
              <button
                className="ml-2 text-blue-500 hover:text-blue-700"
                onClick={handleAddMember}
              >
                <FaUserPlus />
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-4">
          <button
            className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : <><FaSave className="mr-2" /> Save</>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GroupManagementModal;
